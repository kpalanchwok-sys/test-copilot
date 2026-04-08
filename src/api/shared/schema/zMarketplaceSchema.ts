import { z } from "zod";

export const mediaSchema = z.object({
  fileName: z.string().optional(),
  fileUrl: z.string().url("Invalid file URL").optional(),
  contentType: z.string().optional(),
  fileSize: z.number().min(0).optional(),
});

export const marketplaceSchema = z.object({
  name: z
    .string({ message: "Name is required" })
    .min(1, "Name cannot be empty"),
  location: z
    .string({ message: "Location is required" })
    .min(1, "Location cannot be empty"),
  googleLocation: z.string().optional(),
  datePosted: z.coerce.date().optional(),
  postedBy: z.string().optional(),
  amount: z
    .number({ message: "Amount is required" })
    .min(0, "Amount cannot be negative"),
  previousAmount: z.number().min(0).optional(),
  rating: z.number().min(0).max(5).optional(),
  description: z.string().optional(),
  category: z.string().optional(),
  condition: z.string().optional(),
  negotiable: z.boolean().optional(),
  premiumListing: z.boolean().optional(),
  status: z.enum(["Active", "Inactive"]).optional(),
  images: z.array(mediaSchema).optional(),
});

export const marketplaceUpdateSchema = marketplaceSchema.partial();

export const marketplaceParamsSchema = z.object({
  id: z
    .string({ message: "ID is required" })
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid ID format"),
});
