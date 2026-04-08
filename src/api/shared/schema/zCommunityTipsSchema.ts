import { z } from "zod";

export const commentSchema = z.object({
  _id: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid ObjectId format" })
    .optional(),
  username: z
    .string({ message: "Username is required" })
    .min(1, { message: "Username cannot be empty" }),
  text: z
    .string({ message: "Text is required" })
    .min(1, { message: "Text cannot be empty" }),
  date: z.coerce.date().optional(),
});

export const communityTipsSchema = z.object({
  subject: z
    .string({ message: "Subject is required" })
    .min(1, { message: "Subject cannot be empty" }),
  description: z.string().optional(),
  username: z
    .string({ message: "Username is required" })
    .min(1, { message: "Username cannot be empty" }),
  date: z.coerce.date().optional(),
  likeCount: z.number().int().nonnegative().optional(),
  comments: z.array(commentSchema).optional(),
  createdBy: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid ObjectId format" })
    .optional(),
});

export const communityTipsUpdateSchema = communityTipsSchema.partial();

export const communityTipsParamsSchema = z.object({
  id: z
    .string({ message: "ID is required" })
    .regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid ObjectId format" }),
});
