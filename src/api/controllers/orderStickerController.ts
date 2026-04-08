import { Request, Response } from "express";
import { OrderSticker } from "../shared/models/orderSticker";
import {
  orderStickerParamsSchema,
  orderStickerSchema,
  orderStickerUpdateSchema,
} from "../shared/schema/zOrderStickerSchema";
import { catchAsync } from "../utils/catchAsync";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "../utils/responseHandler";

export const mapOrderStickerToResponse = (sticker: any) => ({
  id: sticker._id?.toString(),
  qrCodeId: sticker.qrCodeId,
  name: sticker.name,
  streetAddress: sticker.streetAddress || "",
  city: sticker.city || "",
  county: sticker.county || "",
  postalCode: sticker.postalCode || "",
  country: sticker.country || "",
  mobileNumber: sticker.mobileNumber,
  stickerQuantity: sticker.stickerQuantity ?? 1,
  createdAt: sticker.createdAt,
  updatedAt: sticker.updatedAt,
});

export const createOrderSticker = catchAsync(
  async (req: Request, res: Response) => {
    const data = orderStickerSchema.parse(req.body);

    // Enforce unique QR Code manually (better error message)
    const existing = await OrderSticker.findOne({ qrCodeId: data.qrCodeId });
    if (existing) {
      return sendErrorResponse({
        res,
        message: "This QR Code is already assigned",
        code: 400,
      });
    }

    const order = await OrderSticker.create(data);

    return res.status(201).json(mapOrderStickerToResponse(order));
  },
);

export const updateOrderSticker = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = orderStickerParamsSchema.parse(req.params);
    const data = orderStickerUpdateSchema.parse(req.body);

    const order = await OrderSticker.findById(id);
    if (!order) {
      return sendErrorResponse({ res, message: "Order not found", code: 404 });
    }

    // Prevent changing QR to an already used one
    if (data.qrCodeId && data.qrCodeId !== order.qrCodeId) {
      const existing = await OrderSticker.findOne({ qrCodeId: data.qrCodeId });
      if (existing) {
        return sendErrorResponse({
          res,
          message: "QR Code already in use",
          code: 400,
        });
      }
    }

    Object.assign(order, data);
    await order.save();

    return res.status(201).json(mapOrderStickerToResponse(order));
  },
);

export const getAllOrderStickers = catchAsync(
  async (req: Request, res: Response) => {
    const result = await OrderSticker.find();

    return res.status(201).json(result.map(mapOrderStickerToResponse));
  },
);

export const getSingleOrderSticker = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = orderStickerParamsSchema.parse(req.params);

    const order = await OrderSticker.findById(id);
    if (!order) {
      return sendErrorResponse({ res, message: "Order not found", code: 404 });
    }

    return res.status(201).json(mapOrderStickerToResponse(order));
  },
);

export const deleteOrderSticker = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = orderStickerParamsSchema.parse(req.params);

    const order = await OrderSticker.findByIdAndDelete(id);
    if (!order) {
      return sendErrorResponse({ res, message: "Order not found", code: 404 });
    }

    sendSuccessResponse({
      res,
      data: {},
      message: "Order deleted successfully",
    });
  },
);
