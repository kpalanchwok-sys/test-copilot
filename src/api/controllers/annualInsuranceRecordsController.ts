import { Response } from "express";
import { IRequest } from "../shared/interfaces/IRequest";
import AnnualInsuranceRecord from "../shared/models/annualInsuranceRecord";
import {
  annualInsuranceRecordsBodySchema,
  annualInsuranceRecordsIdParamsSchema,
  annualInsuranceRecordsUpdateSchema,
} from "../shared/schema/zAnnualInsuranceRecordsSchema";
import { catchAsync } from "../utils/catchAsync";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "../utils/responseHandler";
import mongoose from "mongoose";

const mapAnnualInsuranceToResponse = (record: any) => ({
  id: record._id?.toString(),
  boatId: record.boatId?.toString(),
  image: record.image,
  insurer: record.insurer,
  policyNumber: record.policyNumber,
  policyType: record.policyType,
  status: record.status,
  autoRenewal: record.autoRenewal,
  startDate: record.startDate,
  endDate: record.endDate,
  dueDate: record.dueDate,
  premiumAmount: record.premiumAmount,
  paymentDate: record.paymentDate,
  paymentMethod: record.paymentMethod,
  billingFrequency: record.billingFrequency,
  taxIncluded: record.taxIncluded,
  receipt: record.receipt,
  documents: record.documents,
  reminderDate: record.reminderDate,
  createdAt: record.createdAt,
  updatedAt: record.updatedAt,
});

export const createInsuranceRecord = catchAsync(
  async (req: IRequest, res: Response) => {
    const userId = req.user?._id?.toString();
    const result = annualInsuranceRecordsBodySchema.safeParse(req.body);

    if (!result.success) {
      throw result.error;
    }

    const validatedBody = result.data;

    const existing = await AnnualInsuranceRecord.findOne({
      policyNumber: validatedBody.policyNumber,
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Policy number already exists",
      });
    }

    const record = await AnnualInsuranceRecord.create({
      ...validatedBody,
      boatId: new mongoose.Types.ObjectId(validatedBody.boatId),
      createdBy: new mongoose.Types.ObjectId(userId),
    });

    return res.status(201).json(mapAnnualInsuranceToResponse(record));
  },
);

export const updateInsuranceRecord = catchAsync(
  async (req: IRequest, res: Response) => {
    const userId = req.user?._id?.toString();
    const { id } = annualInsuranceRecordsIdParamsSchema.parse(req.params);
    const validatedBody = annualInsuranceRecordsUpdateSchema.parse(req.body);

    const record = await AnnualInsuranceRecord.findById(id);

    if (!record) {
      return sendErrorResponse({
        res,
        message: "Insurance record not found",
        code: 404,
      });
    }

    if (validatedBody.policyNumber) {
      const existing = await AnnualInsuranceRecord.findOne({
        policyNumber: req.body.policyNumber,
        _id: { $ne: id },
      });

      if (existing) {
        return sendErrorResponse({
          res,
          message: "Another record already uses this policy number",
          code: 400,
        });
      }
    }

    if (record.createdBy?.toString() !== userId?.toString()) {
      return sendErrorResponse({
        res,
        message: "Unauthorized",
        code: 403,
      });
    }

    Object.assign(record, validatedBody);
    await record.save();

    return res.status(201).json(mapAnnualInsuranceToResponse(record));
  },
);

export const getSingleInsuranceRecord = catchAsync(
  async (req: IRequest, res: Response) => {
    const { id } = annualInsuranceRecordsIdParamsSchema.parse(req.params);

    const record = await AnnualInsuranceRecord.findById(id);
    //   .populate(
    //   "boatId",
    //   "name registrationNumber",
    // );

    if (!record) {
      return sendErrorResponse({
        res,
        message: "Insurance record not found",
        code: 404,
      });
    }
    return res.status(201).json(mapAnnualInsuranceToResponse(record));
  },
);

export const getAllInsuranceRecord = catchAsync(
  async (req: IRequest, res: Response) => {
    const userId = req.user?._id?.toString();
    const record = await AnnualInsuranceRecord.find();

    if (!record) {
      return sendErrorResponse({
        res,
        message: "Insurance record not found",
        code: 404,
      });
    }
    return res.status(200).json(record.map(mapAnnualInsuranceToResponse));
  },
);

export const deleteInsuranceRecord = catchAsync(
  async (req: IRequest, res: Response) => {
    const userId = req.user?._id?.toString();
    const { id } = annualInsuranceRecordsIdParamsSchema.parse(req.params);

    const record = await AnnualInsuranceRecord.findByIdAndDelete(id);

    if (!record) {
      return sendErrorResponse({
        res,
        message: "Insurance record not found",
        code: 404,
      });
    }

    sendSuccessResponse({
      data: {},
      res,
      message: "Insurance record deleted successfully",
    });
  },
);
