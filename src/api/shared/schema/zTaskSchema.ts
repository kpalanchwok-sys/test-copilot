import { z } from "zod";

export const taskSchema = z.object({
  title: z.string({ message: "Title is required" }).min(1),
  dueDateAndTime: z.coerce.date({ message: "Invalid date for dueDateAndTime" }),
  reminder: z.string().optional(),
  category: z.array(z.string()).optional(),
  shareTaskWithColleagues: z
    .array(z.string().email("Invalid email format"))
    .optional(),
  notes: z.string().optional(),
  categoryColor: z.string().optional(),
});

export const taskUpdateSchema = taskSchema.partial();

export const taskParamsSchema = z.object({
  taskId: z
    .string({ message: "ID is required" })
    .regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid Object-Id format" }),
});
