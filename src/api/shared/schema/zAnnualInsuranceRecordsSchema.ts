import z from "zod";

export const annualInsuranceRecordsBodySchema = z.object({
  
  boatId: z
    .string({ message: "Boat ID is required" })
    .regex(/^[0-9a-fA-F]{24}$/, {
      message: "Invalid ObjectId format",
    }),

  image: z.string().url({ message: "Invalid image URL" }).optional(),

  insurer: z
    .string({ message: "Insurer is required" })
    .min(1, { message: "Insurer cannot be empty" }),

  policyNumber: z
    .string({ message: "Policy number is required" })
    .min(1, { message: "Policy number cannot be empty" }),

  policyType: z
    .string({ message: "Policy type is required" })
    .min(1, { message: "Policy type cannot be empty" }),

  status: z
    .string({ message: "Status is required" })
    .min(1, { message: "Status cannot be empty" }),

  autoRenewal: z.boolean({
    message: "Auto renewal flag is required",
  }),

  startDate: z.coerce.date({
    message: "Start date is required",
  }),

  endDate: z.coerce.date({
    message: "End date is required",
  }),

  dueDate: z.coerce.date({
    message: "Due date is required",
  }),

  premiumAmount: z
    .number({ message: "Premium amount is required" })
    .nonnegative({ message: "Premium amount must be positive" }),

  paymentDate: z.coerce.date().optional(),

  paymentMethod: z.string().optional(),

  billingFrequency: z.string().optional(),

  taxIncluded: z.boolean({
    message: "Tax included flag is required",
  }),

  receipt: z.string({ message: "Receipt is required" }).optional(),

  documents: z
    .array(z.string().url({ message: "Invalid document URL" }))
    .default([]),

  reminderDate: z.coerce.date().optional(),
});

export const annualInsuranceRecordsUpdateSchema = annualInsuranceRecordsBodySchema.partial();

export const annualInsuranceRecordsIdParamsSchema = z.object({
  id: z.string({ message: "ID is required" }).regex(/^[0-9a-fA-F]{24}$/, {
    message: "Invalid Object-Id format",
  }),
});
