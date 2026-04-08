import { z } from "zod";

export const boatIssueSchema = z.object({
  boatId: z
    .string({ message: "Boat ID is required" })
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid Boat ID"),
  images: z.array(z.url()).optional(),
  videos: z.array(z.url()).optional(),
  documents: z.array(z.url()).optional(),
  youtubeLinks: z.array(z.url()).optional(),
  title: z
    .string({ message: "Title is required" })
    .min(1, "Title cannot be empty"),
  description: z.string().optional(),
  priority: z.string().optional(),
  reportedBy: z.string().optional(),
  status: z.string().optional(),
  dateReported: z.coerce.date().optional(),
  resolvedAt: z.coerce.date().optional(),
});

export const boatIssueUpdateSchema = boatIssueSchema.partial();

export const boatIssueParamsSchema = z.object({
  id: z
    .string({ message: "ID is required" })
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid ID format"),
});

export const boatIdParamSchema = z.object({
  boatId: z
    .string({ message: "Boat ID is required" })
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid Boat ID"),
});
