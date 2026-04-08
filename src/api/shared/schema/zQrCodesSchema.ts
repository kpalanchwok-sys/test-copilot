import { z } from "zod";

export const qrCodeSchema = z.object({
  boatId: z
    .string({ message: "Boat ID is required" })
    .min(1, "Boat ID cannot be empty"),
  // .regex(/^[0-9a-fA-F]{24}$/, "Invalid Boat ID")
});

export const qrCodeUpdateSchema = qrCodeSchema.partial();

export const qrCodeParamsSchema = z.object({
  id: z
    .string({ message: "ID is required" })
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid ID format"),
});
