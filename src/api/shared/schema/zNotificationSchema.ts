import { z } from "zod";

export const registerPushTokenSchema = z.object({
  userId: z
    .string({ message: "User ID is required" })
    .regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid user ID format" }),
  deviceToken: z
    .string({ message: "Device token is required" })
    .min(1, { message: "Device token cannot be empty" }),
  devicePlatform: z
    .string({ message: "Device platform is required" })
    .min(1, { message: "Device platform cannot be empty" }),
});

export type RegisterPushTokenPayload = z.infer<typeof registerPushTokenSchema>;
