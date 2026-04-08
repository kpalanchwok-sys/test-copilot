import { Response } from "express";
import { IRequest } from "../shared/interfaces/IRequest";
import { WaterAlert } from "../shared/models/waterwayAlert";
import {
  waterAlertParamsSchema,
  waterAlertSchema,
  waterAlertUpdateSchema,
} from "../shared/schema/zWaterAlertSchema";
import { AppError } from "../utils/AppError";
import { catchAsync } from "../utils/catchAsync";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "../utils/responseHandler";
import { uploadImageToS3 } from "../utils/s3";

const mapWaterAlertToResponse = (alert: any) => {
  const raw = {
    id: alert._id?.toString(),
    name: alert.name,
    type: alert.type,
    alertDate: alert.alertDate,
    location: alert.location,
    googleLocation: alert.googleLocation,
    reportedDate: alert.reportedDate,
    source: alert.source,
    issue: alert.issue,
    clearanceEta: alert.clearanceEta,
    statusCheck: alert.statusCheck,
    description: alert.description,
    image: alert.image || undefined,
    urgency: alert.urgency || undefined,
    maintainBy: alert.maintainBy || undefined,
    advise: alert.advise || undefined,
    impact: alert.impact || undefined,
    forecast: alert.forecast || undefined,
    suggestion: alert.suggestion || undefined,
    createdAt: alert.createdAt,
    updatedAt: alert.updatedAt,
  };

  // Remove keys with undefined values so they don't appear in JSON response
  return Object.fromEntries(
    Object.entries(raw).filter(([_, v]) => v !== undefined),
  );
};

const normalizeWaterAlertBody = (body: Record<string, any>) => ({
  ...body,
  alertDate: body.alertDate || undefined,
  reportedDate: body.reportedDate || undefined,
  clearanceEta: body.clearanceEta || undefined,
});

const validateWaterAlertDates = (data: {
  alertDate?: Date;
  reportedDate?: Date;
  clearanceEta?: Date;
}) => {
  if (
    data.reportedDate &&
    data.alertDate &&
    data.reportedDate > data.alertDate
  ) {
    return "Reported Date cannot be after alert-date";
  }

  if (
    data.clearanceEta &&
    data.alertDate &&
    data.clearanceEta < data.alertDate
  ) {
    return "Clearance ETA cannot be before alert-date";
  }

  return null;
};

export const createWaterAlert = catchAsync(
  async (req: IRequest, res: Response) => {
    const normalizedBody = normalizeWaterAlertBody(req.body);
    const result = waterAlertSchema.safeParse(normalizedBody);
    console.log("🚀 ~ result:", result);
    if (!result.success) throw result.error;

    const dateError = validateWaterAlertDates(result.data);
    if (dateError) {
      return sendErrorResponse({ res, message: dateError, code: 400 });
    }

    let imageUrl = result.data.image;

    if (req.file) {
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/jpg",
        "image/webp",
      ];

      if (!allowedTypes.includes(req.file.mimetype)) {
        throw new AppError(
          400,
          "Only JPG, JPEG, PNG, and WEBP images are allowed",
        );
      }

      const safeName = req.file.originalname.replace(/\s+/g, "-");
      const key = `water-alert/${Date.now()}-${safeName}`;

      imageUrl = await uploadImageToS3(req.file.buffer, key, req.file.mimetype);
    }

    const alert = await WaterAlert.create({
      ...result.data,
      ...(imageUrl ? { image: imageUrl } : {}),
    });

    return res.status(201).json(mapWaterAlertToResponse(alert));
  },
);

export const getWaterAlerts = catchAsync(
  async (req: IRequest, res: Response) => {
    const { page = 1, limit = 10, type, statusCheck } = req.query;

    const filter: any = {};
    if (type) filter.type = type;
    if (statusCheck) filter.statusCheck = statusCheck;

    const alerts = await WaterAlert.find(filter)
      .skip((+page - 1) * +limit)
      .limit(+limit)
      .sort({ alertDate: -1 });

    return res.status(200).json(alerts.map(mapWaterAlertToResponse));
  },
);

export const getSingleWaterAlert = catchAsync(
  async (req: IRequest, res: Response) => {
    const { id } = waterAlertParamsSchema.parse(req.params);

    const alert = await WaterAlert.findById(id);

    if (!alert) {
      return sendErrorResponse({
        res,
        message: "Water alert not found",
        code: 404,
      });
    }
    return res.status(200).json(mapWaterAlertToResponse(alert));
  },
);

export const updateWaterAlert = catchAsync(
  async (req: IRequest, res: Response) => {
    const { id } = waterAlertParamsSchema.parse(req.params);
    const normalizedBody = normalizeWaterAlertBody(req.body);
    const data = waterAlertUpdateSchema.parse(normalizedBody);

    const alert = await WaterAlert.findById(id);
    if (!alert) {
      return sendErrorResponse({ res, message: "Alert not found", code: 404 });
    }

    const alertDate = data.alertDate ?? alert.alertDate;

    if (data.reportedDate && data.reportedDate > alertDate) {
      return sendErrorResponse({
        res,
        message: "reportedDate cannot be after alertDate",
        code: 400,
      });
    }

    if (data.clearanceEta && data.clearanceEta < alertDate) {
      return sendErrorResponse({
        res,
        message: "clearanceEta cannot be before alertDate",
        code: 400,
      });
    }

    let imageUrl = data.image;

    if (req.file) {
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/jpg",
        "image/webp",
      ];

      if (!allowedTypes.includes(req.file.mimetype)) {
        throw new AppError(
          400,
          "Only JPG, JPEG, PNG, and WEBP images are allowed",
        );
      }

      const safeName = req.file.originalname.replace(/\s+/g, "-");
      const key = `water-alert/${Date.now()}-${safeName}`;

      imageUrl = await uploadImageToS3(req.file.buffer, key, req.file.mimetype);
    }

    Object.assign(alert, {
      ...data,
      ...(imageUrl ? { image: imageUrl } : {}),
    });
    await alert.save();
    return res.status(200).json(mapWaterAlertToResponse(alert));

    // sendSuccessResponse({ res, data: alert });
  },
);

export const deleteWaterAlert = catchAsync(
  async (req: IRequest, res: Response) => {
    const { id } = waterAlertParamsSchema.parse(req.params);

    const alert = await WaterAlert.findByIdAndDelete(id);

    if (!alert) {
      return sendErrorResponse({ res, message: "Alert not found", code: 404 });
    }

    sendSuccessResponse({
      res,
      data: {},
      message: "Alert deleted successfully",
    });
  },
);
