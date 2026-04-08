import { Response } from "express";
import mongoose from "mongoose";
import { IRequest } from "../shared/interfaces/IRequest";
import { IServiceRecord, ServiceRecord } from "../shared/models/serviceRecord";
import {
  serviceRecordParamsSchema,
  serviceRecordSchema,
  serviceRecordUpdateSchema,
} from "../shared/schema/zServiceRecordSchema";
import { catchAsync } from "../utils/catchAsync";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "../utils/responseHandler";

export const mapServiceRecordToResponse = (record: IServiceRecord) => ({
  id: record._id?.toString(),
  boatId: record.boatId,
  name: record.name,
  status: record.status,
  date: record.date || null,
  performedBy: record.performedBy || "",
  engineHours: record.engineHours ?? 0,
  type: record.type || "",
  notes: record.notes || "",
  documents: record.documents || [],
  createdAt: record.createdAt,
  updatedAt: record.updatedAt,
});

export const createServiceRecord = catchAsync(
  async (req: IRequest, res: Response) => {
    const userId = req.user?._id?.toString();
    const result = serviceRecordSchema.safeParse(req.body);

    if (!result.success) {
      throw result.error;
    }

    const { boatId, ...rest } = result.data;

    const record = new ServiceRecord({
      ...rest,
      boatId: new mongoose.Types.ObjectId(boatId),
    } as any);

    await record.save();

    return res.status(201).json(mapServiceRecordToResponse(record));
  },
);

export const getAllServiceRecord = catchAsync(
  async (req: IRequest, res: Response) => {
    const userId = req.user?._id?.toString();
    const result = await ServiceRecord.find();

    return res.status(200).json(result.map(mapServiceRecordToResponse));
  },
);

export const getSingleServiceRecord = catchAsync(
  async (req: IRequest, res: Response) => {
    const userId = req.user?._id?.toString();
    const { id } = serviceRecordParamsSchema.parse(req.params);

    const record = await ServiceRecord.findById(id).populate(
      "boatId",
      "boatName registrationNumber",
    );

    if (!record) {
      return sendErrorResponse({
        res,
        message: "Service record not found",
        code: 404,
      });
    }

    return res.status(200).json(mapServiceRecordToResponse(record));
  },
);

export const updateServiceRecord = catchAsync(
  async (req: IRequest, res: Response) => {
    const userId = req.user?._id?.toString();
    const { id } = serviceRecordParamsSchema.parse(req.params);
    const data = serviceRecordUpdateSchema.parse(req.body);

    const record = await ServiceRecord.findById(id);
    if (!record) {
      return sendErrorResponse({
        res,
        message: "Service record not found",
        code: 404,
      });
    }

    Object.assign(record, data);
    await record.save();

    return res.status(200).json(mapServiceRecordToResponse(record));
  },
);

export const deleteServiceRecord = catchAsync(
  async (req: IRequest, res: Response) => {
    const userId = req.user?._id?.toString();
    const { id } = serviceRecordParamsSchema.parse(req.params);

    const record = await ServiceRecord.findByIdAndDelete(id);
    if (!record) {
      return sendErrorResponse({
        res,
        message: "Service record not found",
        code: 404,
      });
    }

    sendSuccessResponse({
      res,
      data: {},
      message: "Service record deleted successfully",
    });
  },
);
