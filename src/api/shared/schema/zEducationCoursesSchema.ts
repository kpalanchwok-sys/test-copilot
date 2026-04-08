import { z } from "zod";

export const courseSchema = z.object({
  courseTitle: z
    .string({ message: "Course title is required" })
    .min(1, { message: "Course title cannot be empty" }),

  institute: z.string().optional(),
  dateRange: z.string().optional(),

  fee: z.number({ message: "Fee must be a number" }).nonnegative().optional(),
  rating: z.number().min(0).max(5).optional(),

  location: z.string().optional(),
  googleLocation: z.string().optional(),

  duration: z.string().optional(),
  time: z.string().optional(),

  seats: z.number().nonnegative().optional(),
  availability: z.enum(["available", "full", "upcoming"]).optional(),

  includes: z.string().optional(),
  note: z.string().optional(),
  description: z.string().optional(),

  instructorName: z.string().optional(),
  instructorDescription: z.string().optional(),

  createdBy: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid ObjectId format" })
    .optional(),
});

export const courseUpdateSchema = courseSchema.partial();

export const courseParamsSchema = z.object({
  id: z
    .string({ message: "ID is required" })
    .regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid ObjectId format" }),
});
