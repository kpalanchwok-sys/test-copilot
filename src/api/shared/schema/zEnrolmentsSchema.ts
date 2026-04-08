import { z } from "zod";

export const enrolmentSchema = z.object({
  courseId: z
    .string({ message: "Course ID is required" })
    .regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid ObjectId format" }),
});

export const enrolmentUpdateSchema = enrolmentSchema.partial();

export const enrolmentParamsSchema = z.object({
  id: z
    .string({ message: "ID is required" })
    .regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid ObjectId format" }),
});
