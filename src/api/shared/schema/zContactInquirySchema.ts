import { z } from "zod";

export const contactInquirySchema = z.object({
  name: z
    .string({ message: "Name is required" })
    .min(1, "Name cannot be empty"),
  email: z
    .string({ message: "Email is required" })
    .email("Invalid email address"),
  mobileNumber: z
    .string({ message: "Mobile number is required" })
    .regex(/^\d{7,15}$/, "Invalid mobile number"),
  message: z
    .string({ message: "Message is required" })
    .min(1, "Message cannot be empty"),
  preferredContactMethod: z.enum(["email", "phone", "whatsapp"]).optional(),
  status: z.enum(["new", "in_progress", "resolved"]).optional(),
  createdBy: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid user ID")
    .optional(),
});

export const contactInquiryUpdateSchema = contactInquirySchema.partial();

export const contactInquiryParamsSchema = z.object({
  id: z
    .string({ message: "ID is required" })
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid ID format"),
});
