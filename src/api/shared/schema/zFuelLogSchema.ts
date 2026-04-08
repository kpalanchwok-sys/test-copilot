import { z } from "zod";

export const mediaSchema = z.object({
  fileName: z.string().optional(),
  fileUrl: z.string().optional(),
  contentType: z.string().optional(),
  fileSize: z.number().optional(),
});

export const fuelLogSchema = z.object({
  boatId: z
    .string({ message: "Boat ID is required" })
    .regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid ObjectId format" }),

  date: z.coerce.date({ message: "Date is required" }),

  type: z.string({
    message: "Invalid fuel log type",
  }),

  litres: z
    .number({ message: "Litres is required" })
    .min(0, { message: "Litres cannot be negative" }),

  currentLevel: z.number().optional(),

  lastFilled: z.coerce.date().optional(),
  lastService: z.coerce.date().optional(),

  pricePerLitre: z.number().optional(),
  amount: z.number().optional(),

  fuelSupplier: z.string().optional(),
  location: z.string().optional(),

  paymentMethod: z.string().optional(),

  tank: z.string().optional(),
  capacity: z.number().optional(),

  levelBefore: z.number().optional(),
  levelAfter: z.number().optional(),

  engineHours: z.number().optional(),
  weather: z.string().optional(),
  gpsLocation: z.string().optional(),

  nextServiceDate: z.coerce.date().optional(),

  notes: z.string().optional(),

  images: z.array(mediaSchema).optional(),
  videos: z.array(mediaSchema).optional(),
  documents: z.array(mediaSchema).optional(),
});

export const fuelLogUpdateSchema = fuelLogSchema.partial();

export const fuelLogParamsSchema = z.object({
  id: z
    .string({ message: "ID is required" })
    .regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid ObjectId format" }),
});
