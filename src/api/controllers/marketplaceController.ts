import { Response } from "express";
import { IRequest } from "../shared/interfaces/IRequest";
import { Marketplace } from "../shared/models/marketplace";
import {
  marketplaceParamsSchema,
  marketplaceSchema,
  marketplaceUpdateSchema,
} from "../shared/schema/zMarketplaceSchema";
import { catchAsync } from "../utils/catchAsync";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "../utils/responseHandler";

const mapMarketplaceToResponse = (marketplace: any) => ({
  id: marketplace._id?.toString(),
  name: marketplace.name,
  location: marketplace.location || marketplace.location || "",
  googleLocation: marketplace.location || "",
  datePosted: marketplace.createdAt,
  postedBy: marketplace.createdBy,
  amount: marketplace.amount || 0,
  previousAmount: marketplace.previousAmount || 0,
  rating: marketplace.rating || 0,
  description: marketplace.description,
  category: marketplace.category || "",
  condition: marketplace.condition,
  negotiable: marketplace.negotiable ?? true,
  premiumListing: marketplace.premiumListing ?? false,
  status: marketplace.status || "Active",
  images: marketplace.images,
  createdAt: marketplace.createdAt,
  updatedAt: marketplace.updatedAt,
});

export const createMarketplace = catchAsync(
  async (req: IRequest, res: Response) => {
    const userId = req.user?._id?.toString();
    const payload = marketplaceSchema.parse(req.body);
    const item = await Marketplace.create(payload);
    return res.status(201).json(mapMarketplaceToResponse(item));
  },
);

export const getAllMarketplace = catchAsync(
  async (req: IRequest, res: Response) => {
    const userId = req.user?._id?.toString();
    const result = await Marketplace.find();

    const mappedResult = result.map(mapMarketplaceToResponse);

    return res.status(200).json(mappedResult);
  },
);

export const getSingleMarketplace = catchAsync(
  async (req: IRequest, res: Response) => {
    const userId = req.user?._id?.toString();
    const { id } = marketplaceParamsSchema.parse(req.params);
    const item = await Marketplace.findById(id);
    if (!item) {
      return sendErrorResponse({ res, message: "Item not found", code: 404 });
    }

    return res.status(200).json(mapMarketplaceToResponse(item));
  },
);

export const updateMarketplace = catchAsync(
  async (req: IRequest, res: Response) => {
    const userId = req.user?._id?.toString();
    const { id } = marketplaceParamsSchema.parse(req.params);
    const payload = marketplaceUpdateSchema.partial().parse(req.body);

    const item = await Marketplace.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
    });

    if (!item) {
      return res.status(404).json({
        message: "Item not found",
      });
    }

    const response = mapMarketplaceToResponse(item);
    return res.status(200).json({
      message: "Marketplace updated successfully",
      data: response,
    });
  },
);

export const deleteMarketplace = catchAsync(
  async (req: IRequest, res: Response) => {
    const userId = req.user?._id?.toString();
    const { id } = marketplaceParamsSchema.parse(req.params);
    const item = await Marketplace.findByIdAndDelete(id);
    if (!item)
      return sendErrorResponse({ res, message: "Item not found", code: 404 });

    sendSuccessResponse({
      res,
      data: {},
      message: "Marketplace item deleted successfully",
    });
  },
);
