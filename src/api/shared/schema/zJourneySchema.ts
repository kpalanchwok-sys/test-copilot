import { z } from "zod";

export const mediaSchema = z.object({
  fileName: z.string().optional(),
  fileUrl: z.string().url().optional(),
  contentType: z.string().optional(),
  fileSize: z.number().optional(),
  status: z.string().optional(),
});

export const boatTripSchema = z.object({
  boatId: z
    .string({ message: "Boat ID is required" })
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid Boat ID"),
  startType: z.string().optional(),
  tripName: z.string().optional(),
  startDate: z.coerce.date({ message: "Start date is required" }),
  endDate: z.coerce.date().optional(),
  baseBerth: z.string().optional(),
  autoEnd: z.boolean().optional(),
  note: z.string().optional(),
  crewEmails: z.array(z.string().email()).optional(),
  waypoints: z.array(z.string()).optional(),
  images: z.array(mediaSchema).optional(),
  videos: z.array(mediaSchema).optional(),
  youTubeUrl: z.array(z.string().url()).optional(),
  status: z.string().optional(),
});

export const boatTripUpdateSchema = boatTripSchema.partial();

export const boatTripParamsSchema = z.object({
  id: z
    .string({ message: "ID is required" })
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid ID format"),
});
