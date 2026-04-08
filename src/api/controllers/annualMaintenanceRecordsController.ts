import { Response } from "express";
import { IRequest } from "../shared/interfaces/IRequest";
import BoatMaintenanceRecord from "../shared/models/annualMaintenanceRecord";
import Boat from "../shared/models/boat";
import {
  zAnnualMaintenanceRecordsParamsSchema,
  zAnnualMaintenanceRecordsSchema,
} from "../shared/schema/zAnnualMaintenanceRecordsSchema";
import { catchAsync } from "../utils/catchAsync";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "../utils/responseHandler";

const mapAnnualMaintenanceToResponse = (record: any) => ({
  id: record._id?.toString(),
  boatId: record.boatId?.toString(),
  image: record.image,
  liftedDate: record.liftedDate,
  location: record.location,
  liftServicePartner: record.liftServicePartner,
  antifoulingDate: record.antifoulingDate,
  paintType: record.paintType,
  antifoulingServicePartner: record.antifoulingServicePartner,
  returnDate: record.returnDate,
  condition: record.condition,
  returnServicePartner: record.returnServicePartner,
  createdAt: record.createdAt,
  updatedAt: record.updatedAt,
});

export const createMaintenanceRecord = catchAsync(
  async (req: IRequest, res: Response) => {
    const userId = req.user?._id?.toString();
    const validatedBody = zAnnualMaintenanceRecordsSchema.parse(req.body);

    const boat = await Boat.findById(validatedBody.boatId);
    if (!boat) {
      return sendErrorResponse({ res, message: "Boat not found", code: 404 });
    }

    const record = await BoatMaintenanceRecord.create(validatedBody);

    return res.status(201).json(mapAnnualMaintenanceToResponse(record));
  },
);

export const getAllMaintenanceRecord = catchAsync(
  async (req: IRequest, res: Response) => {
    const userId = req.user?._id?.toString();
    const result = await BoatMaintenanceRecord.find();

    res.json(result);
  },
);

export const updateMaintenanceRecord = catchAsync(
  async (req: IRequest, res: Response) => {
    const userId = req.user?._id?.toString();
    const { id } = zAnnualMaintenanceRecordsParamsSchema.parse(req.params);
    const validatedBody = zAnnualMaintenanceRecordsSchema.parse(req.body);

    const record = await BoatMaintenanceRecord.findById(id);

    if (!record) {
      return sendErrorResponse({
        res,
        message: "Maintenance record not found",
        code: 404,
      });
    }

    Object.assign(record, validatedBody);
    await record.save();

    return res.status(200).json(mapAnnualMaintenanceToResponse(record));
  },
);

export const getSingleMaintenanceRecord = catchAsync(
  async (req: IRequest, res: Response) => {
    const userId = req.user?._id?.toString();
    const { id } = zAnnualMaintenanceRecordsParamsSchema.parse(req.params);

    const record = await BoatMaintenanceRecord.findById(id);
    //   .populate(
    //   "boatId",
    //   "name registrationNumber",
    // );

    if (!record) {
      return sendErrorResponse({
        res,
        message: "Maintenance record not found",
        code: 404,
      });
    }

    return res.status(201).json(mapAnnualMaintenanceToResponse(record));
  },
);

export const deleteMaintenanceRecord = catchAsync(
  async (req: IRequest, res: Response) => {
    const userId = req.user?._id?.toString();
    const { id } = zAnnualMaintenanceRecordsParamsSchema.parse(req.params);

    const record = await BoatMaintenanceRecord.findByIdAndDelete(id);

    if (!record) {
      return sendErrorResponse({
        res,
        message: "Maintenance record not found",
        code: 404,
      });
    }

    sendSuccessResponse({
      data: {},
      res,
      message: "Maintenance record deleted successfully",
    });
  },
);
