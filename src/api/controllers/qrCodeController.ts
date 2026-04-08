import { Request, Response } from "express";
import QrCodes from "../shared/models/qrCode";
import {
  qrCodeParamsSchema,
  qrCodeSchema,
  qrCodeUpdateSchema,
} from "../shared/schema/zQrCodesSchema";
import { catchAsync } from "../utils/catchAsync";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "../utils/responseHandler";

export const mapQRCodeToResponse = (qrCode: any) => ({
  id: qrCode._id?.toString(),
  boatId: qrCode.boatId,
  createdAt: qrCode.createdAt,
  updatedAt: qrCode.updatedAt,
});

export const createQrCode = catchAsync(async (req: Request, res: Response) => {
  const data = qrCodeSchema.parse(req.body);

  // Ensure one QR per boat
  const existing = await QrCodes.findOne({ boatId: data.boatId });
  if (existing) {
    return sendErrorResponse({
      res,
      message: "QR code already exists for this boat",
      code: 400,
    });
  }

  const qr = await QrCodes.create(data);

  sendSuccessResponse({ res, data: qr });
  return res.status(201).json(mapQRCodeToResponse(qr));
});

export const getQrCode = catchAsync(async (req: Request, res: Response) => {
  const { id } = qrCodeParamsSchema.parse(req.params);

  const qr = await QrCodes.findById(id);

  if (!qr) {
    return sendErrorResponse({
      res,
      message: "QR code not found",
      code: 404,
    });
  }

  sendSuccessResponse({ res, data: qr });
});

export const getQrByBoatId = catchAsync(async (req: Request, res: Response) => {
  const { boatId } = req.params;

  if (!boatId) {
    return sendErrorResponse({
      res,
      message: "boatId is required",
      code: 400,
    });
  }

  const qr = await QrCodes.findOne({ boatId });

  if (!qr) {
    return sendErrorResponse({
      res,
      message: "QR code not found for this boat",
      code: 404,
    });
  }

  sendSuccessResponse({ res, data: qr });
});

export const updateQrCode = catchAsync(async (req: Request, res: Response) => {
  const { id } = qrCodeParamsSchema.parse(req.params);
  const data = qrCodeUpdateSchema.parse(req.body);

  const qr = await QrCodes.findById(id);
  if (!qr) {
    return sendErrorResponse({
      res,
      message: "QR code not found",
      code: 404,
    });
  }

  if (data.boatId) {
    const existing = await QrCodes.findOne({
      boatId: data.boatId,
      _id: { $ne: id },
    });

    if (existing) {
      return sendErrorResponse({
        res,
        message: "Another QR already uses this boatId",
        code: 400,
      });
    }
  }

  Object.assign(qr, data);
  await qr.save();

  sendSuccessResponse({ res, data: qr });
});

export const deleteQrCode = catchAsync(async (req: Request, res: Response) => {
  const { id } = qrCodeParamsSchema.parse(req.params);

  const qr = await QrCodes.findByIdAndDelete(id);

  if (!qr) {
    return sendErrorResponse({
      res,
      message: "QR code not found",
      code: 404,
    });
  }

  sendSuccessResponse({
    res,
    data: {},
    message: "QR code deleted successfully",
  });
});
