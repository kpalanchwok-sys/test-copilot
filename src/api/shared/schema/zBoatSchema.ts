import { z } from "zod";

export const fileSchema = z.object({
  fileName: z.string().min(1, "fileName is required"),
  fileUrl: z.string().url("Invalid fileUrl"),
  contentType: z.string().optional(),
  fileSize: z.number().optional(),
});

export const createBoatSchema = z.object({
  boatName: z.string().min(1, "Boat-Name is required"),
  registrationNumber: z.string().min(1, "Registration-Number is required"),
  type: z.string().optional(),
  make: z.string().optional(),
  model: z.string().optional(),
  serialNumber: z.string().optional(),
  year: z.string().optional(),

  length: z.string().optional(),
  beam: z.number().optional(),
  draft: z.number().optional(),
  airDraft: z.number().optional(),

  homeMarina: z.string().optional(),
  mooringLocation: z.string().optional(),

  status: z.enum(["Active", "Inactive", "Maintenance", "Sold"]).optional(),

  ownerName: z.string().optional(),
  contactEmail: z.string().email("Invalid email").optional(),

  images: z.array(fileSchema).optional(),
  documents: z.array(fileSchema).optional(),

  createdBy: z.string().optional(), // ObjectId as string
});

export const updateBoatSchema = createBoatSchema.partial();

export const idParamSchema = z.object({
  id: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid ObjectId format" }),
});
