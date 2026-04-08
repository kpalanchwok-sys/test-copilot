import { z } from "zod";

export const reviewSchema = z.object({
  id: z.string({ message: "Review ID is required" }).min(1),
  username: z.string({ message: "Username is required" }).min(1),
  rating: z.number().min(0).max(5),
  comment: z.string().optional(),
  date: z.coerce.date().optional(),
});

export const siteDetailSchema = z.object({
  name: z.string({ message: "Name is required" }).min(1),
  location: z.string({ message: "Location is required" }).min(1),
  googleLocation: z.string().optional(),
  category: z.string().optional(),
  distance: z.number().min(0).optional(),
  openingHours: z.string().optional(),
  fees: z.number().min(0).optional(),
  userRating: z.number().min(0).max(5).optional(),
  contact: z.string().optional(),
  description: z.string().optional(),
  reviews: z.array(reviewSchema).optional(),
});

export const siteDetailUpdateSchema = siteDetailSchema.partial();

export const siteDetailParamsSchema = z.object({
  id: z
    .string({ message: "ID is required" })
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid ID format"),
});

export const addReviewSchema = z.object({
  username: z
    .string({ message: "Username is required" })
    .min(1, "Username cannot be empty"),

  rating: z
    .number({ message: "Rating is required" })
    .min(0, "Rating must be at least 0")
    .max(5, "Rating cannot exceed 5"),

  comment: z.string().optional().default(""),
});
