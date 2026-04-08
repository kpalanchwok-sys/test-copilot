import { z } from "zod";

export const orderStickerSchema = z.object({
  qrCodeId: z
    .string({ message: "QR Code ID is required" })
    .min(1, "QR Code ID cannot be empty"),

  name: z
    .string({ message: "Name is required" })
    .min(1, "Name cannot be empty"),

  streetAddress: z.string().optional(),
  city: z.string().optional(),
  county: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().optional(),

  mobileNumber: z
    .string({ message: "Mobile number is required" })
    .min(7, "Invalid mobile number"),

  stickerQuantity: z
    .number()
    .int()
    .min(1, "Sticker quantity must be at least 1")
    .optional(),
});

export const orderStickerUpdateSchema = orderStickerSchema.partial();

export const orderStickerParamsSchema = z.object({
  id: z
    .string({ message: "ID is required" })
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid ID format"),
});
