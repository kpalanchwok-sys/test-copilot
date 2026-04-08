import { z } from "zod";

export const addressSchema = z.object({
  lineOne: z.string({ message: "Address lineOne is required" }).min(1),
  lineTwo: z.string().optional(),
  lineThree: z.string().optional(),
  city: z.string({ message: "City is required" }).min(1),
  postCode: z.string().optional(),
  county: z.string().optional(),
  country: z.string().optional(),
});

export const userManagementSchema = z.object({
  groups: z.array(z.string()).optional(),

  email: z
    .string({ message: "Email is required" })
    .email("Invalid email format"),

  firstName: z.string({ message: "First name is required" }).min(1),

  lastName: z.string({ message: "Last name is required" }).min(1),

  contactNumber: z.string().optional(),

  dateOfBirth: z.coerce.date().optional(),

  organisationId: z
    .string({ message: "Organisation ID is required" })
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid Organisation ID"),

  status: z.enum(["Active", "Inactive"]).optional(),

  address: addressSchema,

  governingBody: z.string().optional(),
});

export const userManagementUpdateSchema = userManagementSchema.partial();

export const userManagementParamsSchema = z.object({
  id: z
    .string({ message: "ID is required" })
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid ID format"),
});
