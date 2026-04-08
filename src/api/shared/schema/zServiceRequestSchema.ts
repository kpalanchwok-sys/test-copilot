import { z } from "zod";

export const mediaSchema = z.object({
  fileName: z.string().optional(),
  fileUrl: z.string().url("Invalid file URL").optional(),
  contentType: z.string().optional(),
  fileSize: z.number().min(0).optional(),
});

export const serviceRequestSchema = z.object({
  boatId: z
    .string({ message: "Boat ID is required" })
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid Boat ID"),

  title: z
    .string({ message: "Title is required" })
    .min(1, "Title cannot be empty"),

  description: z.string().optional(),

  status: z
    .enum(["open", "in_progress", "assigned", "completed", "cancelled"])
    .optional(),

  location: z.string().optional(),

  category: z
    .enum(["repair", "cleaning", "inspection", "installation", "other"])
    .optional(),

  preferredStartDate: z.coerce.date().optional(),
  preferredEndDate: z.coerce.date().optional(),

  minBudget: z.number().min(0).optional(),
  maxBudget: z.number().min(0).optional(),

  images: z.array(mediaSchema).optional(),
  documents: z.array(mediaSchema).optional(),

  serviceProviderId: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid Service Provider ID")
    .optional(),
});

export const serviceRequestUpdateSchema = serviceRequestSchema.partial();

export const serviceRequestParamsSchema = z.object({
  id: z
    .string({ message: "ID is required" })
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid ID format"),
});
