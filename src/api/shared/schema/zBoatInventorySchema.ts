import mongoose from "mongoose";
import { z } from "zod";

export const fileSchema = z.object({
  fileName: z.string().min(1, "fileName is required"),
  fileUrl: z.string().url().optional().or(z.literal("")),
  contentType: z.string().optional().or(z.literal("")),
  fileSize: z.number().nonnegative().optional(),
});
export const objectIdSchema = z
  .string()
  .refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "Invalid ObjectId",
  });

export const boatInventoryCreateSchema = z.object({
  boatId: objectIdSchema,

  name: z.string().min(1, "Name is required"),
  category: z.string().optional(),

  quantity: z.number().int().min(1).default(1),

  status: z.string().optional(),
  availability: z.string().optional(),

  notes: z.string().optional(),

  purchasedDate: z.coerce.date().optional(),
  warrantyExpires: z.coerce.date().optional(),

  images: z.array(fileSchema).optional().default([]),
  videos: z.array(fileSchema).optional().default([]),
  documents: z.array(fileSchema).optional().default([]),

  createdBy: objectIdSchema.optional(),
});

export const boatInventoryUpdateSchema = boatInventoryCreateSchema.partial();

export const boatInventoryParamsSchema = z.object({
  id: z
    .string({ message: "ID is required" })
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid ID format"),
});
