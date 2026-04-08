import { z } from "zod";

export const serviceComponentSchema = z.object({
  lastActionDate: z.coerce.date().optional(),
  nextService: z.coerce.date().optional(),
  status: z.string().optional(),
});

export const engineSchema = z.object({
  engineSide: z.string({
    message: "Engine side is required",
  }),
  // engineSide: z.enum(["Port", "Starboard"], {
  //   message: "Engine side is required",
  // }),

  model: z.string().optional(),
  serialNumber: z.string().optional(),

  installedOn: z.coerce.date().optional(),
  currentHours: z.string().min(0).optional(),

  // health: z.enum(["Good", "Warning", "Critical"]).optional(),
  health: z.string().optional(),

  lastServicedOn: z.coerce.date().optional(),
  nextServiceInHours: z.string().optional(),

  // oilStatus: z.enum(["Changed", "Due", "Overdue"]).optional(),
  oilStatus: z.string().optional(),

  components: z
    .object({
      engineOil: serviceComponentSchema.optional(),
      gearboxFluid: serviceComponentSchema.optional(),
      propeller: serviceComponentSchema.optional(),
      shaftSeals: serviceComponentSchema.optional(),
    })
    .default({}),
});

export const mechanicalSchema = z.object({
  boatId: z
    .string({ message: "Boat ID is required" })
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId format"),

  description: z.string().optional(),

  upcomingService: z
    .object({
      fullServiceDueAtHours: z.string().optional(),
      reminderAtHours: z.string().optional(),
    })
    .optional(),

  engines: z.array(engineSchema).optional(),
});

export const mechanicalUpdateSchema = mechanicalSchema.partial();

export const mechanicalParamsSchema = z.object({
  id: z
    .string({ message: "ID is required" })
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid ID format"),
});

export const upsertEngineParamsSchema = z.object({
  boatId: z
    .string({ message: "Boat ID is required" })
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId format"),
});

export const deleteEngineParamsSchema = z.object({
  id: z
    .string({ message: "Mechanical record ID is required" })
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId format"),
  engineId: z
    .string({ message: "Engine ID is required" })
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId format"),
});
