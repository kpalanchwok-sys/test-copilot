import { z } from "zod";

export const reviewSchema = z.object({
  username: z
    .string({ message: "Username is required" })
    .min(1, "Username cannot be empty"),
  rating: z
    .number()
    .min(1, "Rating must be at least 1")
    .max(5, "Rating cannot exceed 5"),
  comment: z.string().optional(),
  date: z.coerce.date().optional(),
});

export const marinaSchema = z.object({
  name: z
    .string({ message: "Name is required" })
    .min(1, "Name cannot be empty"),
  location: z
    .string({ message: "Location is required" })
    .min(1, "Location cannot be empty"),
  googleLocation: z.string().optional(),
  distance: z.number().optional(),
  mooringSpaceCount: z.number().optional(),
  fuelAvailable: z.boolean().optional(),
  shower: z.boolean().optional(),
  portableWater: z.boolean().optional(),
  openingHours: z.string().optional(),
  contact: z.string().optional(),
  website: z.string().optional(),
  userRating: z.number().min(0).max(5).optional(),
  description: z.string().optional(),
  reviews: z.array(reviewSchema).optional(),
});

export const marinaUpdateSchema = marinaSchema.partial();

export const marinaParamsSchema = z.object({
  id: z
    .string({ message: "ID is required" })
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid ID format"),
});
