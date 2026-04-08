import { z } from "zod";

export const userDeviceSchema = z.object({
  userId: z
    .string({ message: "User ID is required" })
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid User ID"),

  deviceId: z
    .string({ message: "Device ID is required" })
    .min(1, "Device ID cannot be empty"),

  appVersion: z.string({ message: "App version is required" }).min(1),

  platform: z.enum(["ios", "android", "web"], {
    message: "Platform must be ios, android, or web",
  }),

  osVersion: z.string().optional(),
  deviceModel: z.string().optional(),
});

export const userDeviceUpdateSchema = userDeviceSchema.partial();

export const userDeviceParamsSchema = z.object({
  id: z
    .string({ message: "ID is required" })
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid ID format"),
});
