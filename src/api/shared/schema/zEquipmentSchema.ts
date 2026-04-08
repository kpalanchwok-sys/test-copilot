import { z } from "zod";

export const fileSchema = z.object({
  fileName: z.string().optional(),
  fileUrl: z.string().optional(),
  contentType: z.string().optional(),
  fileSize: z.number().optional(),
});

export const equipmentSchema = z.object({
  boatId: z
    .string({ message: "Boat ID is required" })
    .regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid ObjectId format" }),

  name: z
    .string({ message: "Equipment name is required" })
    .min(1, { message: "Name cannot be empty" }),

  category: z.string().optional(),
  capacity: z.string().optional(),

  manufacturer: z.string().optional(),
  model: z.string().optional(),

  locationOnBoat: z.string().optional(),

  installDate: z.coerce.date().optional(),
  lastServiced: z.coerce.date().optional(),
  serviceFrequency: z.string().optional(),

  notes: z.string().optional(),

  youTubeUrl: z.array(z.string()).optional(),

  images: z.array(fileSchema).optional(),
  videos: z.array(fileSchema).optional(),
  documents: z.array(fileSchema).optional(),

  createdBy: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid ObjectId format" })
    .optional(),
});

export const equipmentUpdateSchema = equipmentSchema.partial();

export const equipmentParamsSchema = z.object({
  id: z
    .string({ message: "ID is required" })
    .regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid ObjectId format" }),
});
