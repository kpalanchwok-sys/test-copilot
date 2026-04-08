import { Request, Response } from "express";
import { ServiceRequest } from "../shared/models/serviceJob";
import {
  serviceRequestParamsSchema,
  serviceRequestSchema,
  serviceRequestUpdateSchema,
} from "../shared/schema/zServiceRequestSchema";
import { catchAsync } from "../utils/catchAsync";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "../utils/responseHandler";

export const mapServiceRequestToResponse = (request: any) => ({
  id: request._id?.toString(),
  boatId: request.boatId,
  title: request.title,
  description: request.description || "",
  status: request.status || "open",
  location: request.location || "",
  category: request.category || "",
  preferredStartDate: request.preferredStartDate || null,
  preferredEndDate: request.preferredEndDate || null,
  minBudget: request.minBudget ?? 0,
  maxBudget: request.maxBudget ?? 0,
  images: (request.images || []).map((file: any) => ({
    fileName: file.fileName || "",
    fileUrl: file.fileUrl || "",
    contentType: file.contentType || "",
    fileSize: file.fileSize ?? 0,
  })),
  documents: (request.documents || []).map((file: any) => ({
    fileName: file.fileName || "",
    fileUrl: file.fileUrl || "",
    contentType: file.contentType || "",
    fileSize: file.fileSize ?? 0,
  })),
  serviceProviderId: request.serviceProviderId || null,
  createdAt: request.createdAt,
  updatedAt: request.updatedAt,
});

export const createServiceRequest = catchAsync(
  async (req: Request, res: Response) => {
    const data = serviceRequestSchema.parse(req.body);

    // Budget validation
    if (data.minBudget && data.maxBudget && data.maxBudget < data.minBudget) {
      return sendErrorResponse({
        res,
        message: "maxBudget cannot be less than minBudget",
        code: 400,
      });
    }

    // Date validation
    if (
      data.preferredStartDate &&
      data.preferredEndDate &&
      data.preferredEndDate < data.preferredStartDate
    ) {
      return sendErrorResponse({
        res,
        message: "End date cannot be before start date",
        code: 400,
      });
    }

    const request = await ServiceRequest.create(data);
    return res.status(201).json(mapServiceRequestToResponse(request));
  },
);

export const getAllServiceRequests = catchAsync(
  async (req: Request, res: Response) => {
    const result = await ServiceRequest.find();

    return res.status(200).json(result.map(mapServiceRequestToResponse));
  },
);

export const getSingleServiceRequest = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = serviceRequestParamsSchema.parse(req.params);

    const request = await ServiceRequest.findById(id)
      .populate("boatId", "boatName")
      .populate("serviceProviderId", "firstName lastName");

    if (!request) {
      return sendErrorResponse({
        res,
        message: "Request not found",
        code: 404,
      });
    }

    return res.status(201).json(mapServiceRequestToResponse(request));
  },
);

export const updateServiceRequest = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = serviceRequestParamsSchema.parse(req.params);
    const data = serviceRequestUpdateSchema.parse(req.body);

    const request = await ServiceRequest.findById(id);
    if (!request) {
      return sendErrorResponse({
        res,
        message: "Request not found",
        code: 404,
      });
    }

    // Budget validation
    if (data.minBudget && data.maxBudget && data.maxBudget < data.minBudget) {
      return sendErrorResponse({
        res,
        message: "maxBudget cannot be less than minBudget",
        code: 400,
      });
    }

    // Date validation
    if (
      data.preferredStartDate &&
      data.preferredEndDate &&
      data.preferredEndDate < data.preferredStartDate
    ) {
      return sendErrorResponse({
        res,
        message: "End date cannot be before start date",
        code: 400,
      });
    }

    Object.assign(request, data);
    await request.save();

    return res.status(201).json(mapServiceRequestToResponse(request));
  },
);

export const deleteServiceRequest = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = serviceRequestParamsSchema.parse(req.params);

    const request = await ServiceRequest.findByIdAndDelete(id);
    if (!request) {
      return sendErrorResponse({
        res,
        message: "Request not found",
        code: 404,
      });
    }

    sendSuccessResponse({
      res,
      data: {},
      message: "Service request deleted successfully",
    });
  },
);
