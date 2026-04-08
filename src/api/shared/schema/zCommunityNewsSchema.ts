import { z } from "zod";

export const communityNewsSchema = z.object({
  subject: z
    .string({ message: "Subject is required" })
    .min(1, { message: "Subject cannot be empty" }),
  description: z.string().optional(),

  createdBy: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid ObjectId format" })
    .optional(),
});

export const communityNewsUpdateSchema = communityNewsSchema.partial();

export const communityNewsParamsSchema = z.object({
  id: z
    .string({ message: "ID is required" })
    .regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid ObjectId format" }),
});
