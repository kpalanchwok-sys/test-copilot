import z from "zod";

export const appVersionSchema = z.object({
  platform: z.enum(["Android", "iOS"], {
    message: "Platform must be either 'Android' or 'iOS'",
  }),

  version: z
    .string({ message: "Version is required" })
    .min(1, { message: "Version cannot be empty" }),

  forceUpdate: z.boolean({ message: "Force update flag is required" }),

  changeLogs: z
    .array(z.string({ message: "Each changelog must be a string" }))
    .optional()
    .default([]),

  isActive: z.boolean({ message: "Active flag is required" }),
});

// export const appVersionUpdateSchema = appVersionSchema.partial();

export const appVersionParamsSchema = z.object({
  id: z
    .string({ message: "ID is required" })
    .regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid ObjectId format" }),
});
