import { Response } from "express";
import { IRequest } from "../shared/interfaces/IRequest";
import BoatInventory from "../shared/models/boatInventory";
import {
  boatInventoryCreateSchema,
  boatInventoryParamsSchema,
} from "../shared/schema/zBoatInventorySchema";
import { catchAsync } from "../utils/catchAsync";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "../utils/responseHandler";

export const mapBoatInventoryToResponse = (item: any) => ({
  id: item._id?.toString(),

  boatId: item.boatId?.toString(),

  name: item.name,
  category: item.category || "",
  quantity: item.quantity,

  status: item.status || "",
  availability: item.availability || "",

  notes: item.notes || "",

  purchasedDate: item.purchasedDate ? item.purchasedDate.toISOString() : null,

  warrantyExpires: item.warrantyExpires
    ? item.warrantyExpires.toISOString()
    : null,

  images: item.images || [],
  videos: item.videos || [],
  documents: item.documents || [],

  createdBy: item.createdBy?.toString() || null,

  createdAt: item.createdAt?.toISOString(),
  updatedAt: item.updatedAt?.toISOString(),
});

export const createBoatInventory = catchAsync(
  async (req: IRequest, res: Response) => {
    const userId = req.user?._id?.toString();
    const data = boatInventoryCreateSchema.parse(req.body);

    const item = await BoatInventory.create(data);

    return res.status(201).json(mapBoatInventoryToResponse(item));
  },
);

export const updateBoatInventory = catchAsync(
  async (req: IRequest, res: Response) => {
    const userId = req.user?._id?.toString();
    const { id } = boatInventoryParamsSchema.parse(req.params);
    const result = boatInventoryCreateSchema.safeParse(req.body);
    if (!result.success) {
      throw result.error;
    }
    const item = await BoatInventory.findById(id);

    if (!item) {
      return sendErrorResponse({
        res,
        message: "Inventory item not found",
        code: 404,
      });
    }

    Object.assign(item, req.body);
    await item.save();

    return res.status(201).json(mapBoatInventoryToResponse(item));
  },
);

export const getAllBoatInventorys = catchAsync(
  async (req: IRequest, res: Response) => {
    const userId = req.user?._id?.toString();
    const result = await BoatInventory.find();

    return res.status(201).json(result.map(mapBoatInventoryToResponse));
  },
);

export const getSingleBoatInventory = catchAsync(
  async (req: IRequest, res: Response) => {
    const userId = req.user?._id?.toString();
    const { id } = req.params;

    const item = await BoatInventory.findById(id);

    if (!item) {
      return sendErrorResponse({
        res,
        message: "Inventory item not found",
        code: 404,
      });
    }

    return res.status(201).json(mapBoatInventoryToResponse(item));
  },
);

export const deleteBoatInventory = catchAsync(
  async (req: IRequest, res: Response) => {
    const userId = req.user?._id?.toString();
    const { id } = req.params;

    const item = await BoatInventory.findByIdAndDelete(id);

    if (!item) {
      return sendErrorResponse({
        res,
        message: "Inventory item not found",
        code: 404,
      });
    }

    sendSuccessResponse({
      data: {},
      res,
      message: "Inventory item deleted successfully",
    });
  },
);
