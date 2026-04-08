import { Request, Response } from "express";
import mongoose from "mongoose";
import { IRequest } from "../shared/interfaces/IRequest";
import Boat from "../shared/models/boat";
import {
  createBoatSchema,
  idParamSchema,
  updateBoatSchema,
} from "../shared/schema/zBoatSchema";
import { catchAsync } from "../utils/catchAsync";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "../utils/responseHandler";

const formatBoatResponse = (boat: any) => ({
  id: boat.id,
  boatName: boat.boatName,
  registrationNumber: boat.registrationNumber,
  type: boat.type || "",
  make: boat.make || "",
  model: boat.model || "",
  serialNumber: boat.serialNumber || "",
  year: boat.year || 0,
  length: boat.length || 0,
  beam: boat.beam || 0,
  draft: boat.draft || 0,
  airDraft: boat.airDraft || 0,
  homeMarina: boat.homeMarina || "",
  mooringLocation: boat.mooringLocation || "",
  status: boat.status || "",
  ownerName: boat.ownerName || "",
  contactEmail: boat.contactEmail || "",
  images: boat.images || "",
  documents: boat.documents || "",
});

export const createBoat = catchAsync(async (req: IRequest, res: Response) => {
  const userId = req.user?._id?.toString();

  const result = createBoatSchema.safeParse(req.body);
  if (!result.success) {
    throw result.error;
  }

  const { registrationNumber } = result.data;

  const existing = await Boat.findOne({ registrationNumber });
  if (existing) {
    return sendErrorResponse({
      res,
      message: "Boat already exists with this registration number",
      code: 400,
    });
  }

  const boat = await Boat.create({ ...result.data, createdBy: userId });
  return res.status(200).json(formatBoatResponse(boat));
});

export const updateBoat = catchAsync(async (req: IRequest, res: Response) => {
  const userId = req.user?._id?.toString();

  const result = updateBoatSchema.safeParse(req.body);
  if (!result.success) {
    throw result.error;
  }

  const { id } = idParamSchema.parse(req.params);
  const boat = await Boat.findById(id);
  if (!boat) {
    return sendErrorResponse({ res, message: "Boat not found", code: 404 });
  }

  // Only the creator can update the boat
  if (boat.createdBy?.toString() !== userId) {
    return sendErrorResponse({
      res,
      message: "You are not authorized to update this boat",
      code: 403,
    });
  }

  if (result.data.registrationNumber) {
    const existing = await Boat.findOne({
      registrationNumber: result.data.registrationNumber,
      _id: { $ne: id },
    });
    if (existing) {
      return sendErrorResponse({
        res,
        message: "Another boat already uses this registration number",
        code: 400,
      });
    }
  }

  Object.assign(boat, result.data);
  await boat.save();

  return res.status(200).json(formatBoatResponse(boat));
});

export const getSingleBoat = catchAsync(
  async (req: IRequest, res: Response) => {
    const userId = req.user?._id?.toString();

    const { id } = idParamSchema.parse(req.params);

    const boat = await Boat.findById(id);
    if (!boat) {
      return sendErrorResponse({
        res,
        message: "Boat not found",
        code: 404,
      });
    }

    if (boat.createdBy?.toString() !== userId) {
      return sendErrorResponse({
        res,
        message: "You are not authorized to view this boat",
        code: 403,
      });
    }

    return res.status(200).json(formatBoatResponse(boat));
  },
);

export const getAllBoats = catchAsync(async (req: IRequest, res: Response) => {
  const userId = req.user?._id?.toString();

  const { type, status, search } = req.query;
  const query: any = { createdBy: userId };

  if (type) query.type = type;
  if (status) query.status = status;

  if (search) {
    query.$or = [
      { boatName: { $regex: search, $options: "i" } },
      { registrationNumber: { $regex: search, $options: "i" } },
    ];
  }

  const boats = await Boat.find(query);

  res.json(boats);
});

export const deleteBoat = catchAsync(async (req: IRequest, res: Response) => {
  const userId = req.user?._id?.toString();

  const { id } = idParamSchema.parse(req.params);
  const boat = await Boat.findById(id);

  if (!boat) {
    return sendErrorResponse({
      res,
      message: "Boat not found",
      code: 404,
    });
  }

  if (boat.createdBy?.toString() !== userId) {
    return sendErrorResponse({
      res,
      message: "You are not authorized to delete this boat",
      code: 403,
    });
  }

  await Boat.findByIdAndDelete(id);
  return sendSuccessResponse({
    data: {},
    res,
    message: "Boat deleted successfully",
  });
});

export const deleteBoatFiles = catchAsync(
  async (req: Request, res: Response) => {
    const { boatId } = req.params;
    const { imageIds = [], documentIds = [] } = req.body;

    if (imageIds.length === 0 && documentIds.length === 0) {
      return res.status(400).json({ message: "No file ids provided" });
    }

    const updateQuery: any = {};

    if (imageIds.length > 0) {
      updateQuery.$pull = {
        ...updateQuery.$pull,
        images: {
          _id: {
            $in: imageIds.map((id: string) => new mongoose.Types.ObjectId(id)),
          },
        },
      };
    }

    if (documentIds.length > 0) {
      updateQuery.$pull = {
        ...updateQuery.$pull,
        documents: {
          _id: {
            $in: documentIds.map(
              (id: string) => new mongoose.Types.ObjectId(id),
            ),
          },
        },
      };
    }

    const boat = await Boat.findByIdAndUpdate(boatId, updateQuery, {
      new: true,
    });

    if (!boat) {
      return res.status(404).json({ message: "Boat not found" });
    }

    res.json({ message: "Files deleted successfully" });
  },
);
