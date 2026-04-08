import { z } from "zod";

export const serviceRecordSchema = z.object({
  boatId: z.string().regex(/^[0-9a-fA-F]{24}$/),
  name: z
    .string({ message: "Service name is required" })
    .min(1, "Service name cannot be empty"),

  status: z.enum(["scheduled", "in_progress", "completed", "cancelled"]),
  date: z.coerce.date().optional(),

  performedBy: z.string().optional(),

  engineHours: z.number().min(0).optional(),

  type: z
    .enum(["engine", "hull", "electrical", "general", "inspection"])
    .optional(),

  notes: z.string().optional(),

  documents: z.array(z.string().url("Invalid document URL")).optional(),
});

export const serviceRecordUpdateSchema = serviceRecordSchema.partial();

export const serviceRecordParamsSchema = z.object({
  id: z
    .string({ message: "ID is required" })
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid ID format"),
});
