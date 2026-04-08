import z from "zod";

export const userDeviceSchema = z.object({
  userId: z
    .string({ message: "User ID is required" })
    .regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid ObjectId format" }),

  deviceId: z
    .string({ message: "Device ID is required" })
    .min(1, { message: "Device ID cannot be empty" }),

  appVersion: z.string().optional(),

  platform: z.enum(["Android", "iOS", "Web"], {
    message: "Platform must be 'Android', 'iOS', or 'Web'",
  }),

  osVersion: z.string().optional(),

  deviceModel: z.string().optional(),

  isActive: z.boolean({ message: "Active flag is required" }),

  lastLoginAt: z.coerce.date().optional(),
});

export const userDeviceUpdateSchema = userDeviceSchema.partial();

export const userDeviceParamsSchema = z.object({
  id: z
    .string({ message: "ID is required" })
    .regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid ObjectId format" }),
});


export const saveExpoPushTokenSchema = z.object({
  deviceId: z
    .string({ message: "Device ID is required" })
    .min(1, { message: "Device ID cannot be empty" }),
  pushNotificationDeviceId: z
    .string({ message: "Expo push token is required" })
    .regex(/^(ExponentPushToken|ExpoPushToken)\[[^\]]+\]$/, {
      message: "Invalid Expo push token format",
    }),
});
