import z from "zod";

export const zAnnualMaintenanceRecordsSchema = z.object({
  boatId: z
    .string({ message: "Boat ID is required" })
    .regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid ObjectId format" }),

  image: z.string().url({ message: "Invalid image URL" }).optional(),

  liftedDate: z.coerce.date({ message: "Lifted date is required" }),

  location: z
    .string({ message: "Location is required" })
    .min(1, { message: "Location cannot be empty" }),

  liftServicePartner: z
    .string({ message: "Lift service partner is required" })
    .min(1, { message: "Lift service partner cannot be empty" }),

  antifoulingDate: z.coerce.date({ message: "Antifouling date is required" }),

  paintType: z
    .string({ message: "Paint type is required" })
    .min(1, { message: "Paint type cannot be empty" }),

  antifoulingServicePartner: z
    .string({ message: "Antifouling service partner is required" })
    .min(1, { message: "Antifouling service partner cannot be empty" }),

  returnDate: z.coerce.date({ message: "Return date is required" }),

  condition: z
    .string({ message: "Condition is required" })
    .min(1, { message: "Condition cannot be empty" }),

  returnServicePartner: z
    .string({ message: "Return service partner is required" })
    .min(1, { message: "Return service partner cannot be empty" }),
});

export const zAnnualMaintenanceRecordsUpdateSchema =
  zAnnualMaintenanceRecordsSchema.partial();

export const zAnnualMaintenanceRecordsParamsSchema = z.object({
  id: z
    .string({ message: "ID is required" })
    .regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid ObjectId format" }),
});
