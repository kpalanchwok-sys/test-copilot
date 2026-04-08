import { z } from "zod";

export const fileSchema = z.object({
  fileName: z.string().min(1, "fileName is required"),
  fileUrl: z.string().url("Invalid fileUrl"),
  contentType: z.string().optional(),
  fileSize: z.number().optional(),
  status: z.string(),
});

export const commentSchema = z.object({
  text: z.string({ message: "Text is required" }).min(1),
  commenter: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid Object-Id format" }),
});

export const objectIdSchema = z
  .string()
  .min(1, "Boat ID is required")
  .regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid Object-Id format" });

export const boatProjectSchema = z.object({
  boatId: objectIdSchema,
  projectName: z.string({ message: "Project name is required" }).min(1),
  category: z.array(z.string()).min(1, "At least one category is required"),
  type: z.string().optional(),
  notes: z.string().optional(),
  startDate: z.coerce.date().optional(),
  comments: z.array(commentSchema).optional(),
  images: z.array(fileSchema).optional(),
});

export const boatProjectUpdateSchema = boatProjectSchema.partial();

export const boatProjectParamsSchema = z.object({
  projectId: z
    .string({ message: "ID is required" })
    .regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid Object-Id format" }),
});

export const commentParamsSchema = z.object({
  projectId: z
    .string({ message: "Project ID is required" })
    .regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid Object-Id format" }),
  commentId: z
    .string({ message: "Comment ID is required" })
    .regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid Object-Id format" }),
});
