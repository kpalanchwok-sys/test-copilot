import { z } from "zod";

export const emergencyContactSchema = z.object({
  name: z
    .string({ message: "Name is required" })
    .min(1, { message: "Name cannot be empty" }),

  relationship: z
    .string({ message: "Relationship is required" })
    .min(1, { message: "Relationship cannot be empty" }),

  mobileNumber: z
    .string({ message: "Mobile number is required" })
    .min(1, { message: "Mobile number cannot be empty" }),
});

export const contactUpdateSchema = emergencyContactSchema.partial();

export const contactParamsSchema = z.object({
  id: z
    .string({ message: "ID is required" })
    .regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid ObjectId format" }),
});
