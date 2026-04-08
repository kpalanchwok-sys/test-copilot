import { z } from "zod";

export const mediaSchema = z.object({
  fileName: z.string({ message: "File name is required" }).min(1),
  fileUrl: z.string({ message: "File URL is required" }).url("Invalid URL"),
  contentType: z.string().optional(),
  fileSize: z.number().min(0).optional(),
});

export const surveySchema = z.object({
  boatId: z
    .string({ message: "Boat ID is required" })
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid Boat ID"),

  name: z
    .string({ message: "Survey name is required" })
    .min(1, "Survey name cannot be empty"),

  dueDate: z.coerce.date({ message: "Due date is required" }),

  lastDate: z.coerce.date().optional(),

  interval: z.string().optional(),

  surveyor: z.string().optional(),

  reminderDate: z.coerce.date().optional(),

  location: z.string().optional(),

  notes: z.string().optional(),

  links: z.array(z.string().url("Invalid link")).optional(),

  images: z.array(mediaSchema).optional(),
  videos: z.array(mediaSchema).optional(),
  documents: z.array(mediaSchema).optional(),
});

export const surveyUpdateSchema = surveySchema.partial();

export const surveyParamsSchema = z.object({
  id: z
    .string({ message: "ID is required" })
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid ID format"),
});
