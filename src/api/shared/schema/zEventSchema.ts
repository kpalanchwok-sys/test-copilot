import { z } from "zod";

export const categorySchema = z.object({
  name: z
    .string({ message: "Category name is required" })
    .min(1, { message: "Cannot be empty" }),
  description: z.string().optional(),
  fee: z.number().nonnegative().optional(),
});
const validateEventTimeline = (
  data: {
    openingDate?: Date;
    eventDate?: Date;
    closingDate?: Date;
  },
  ctx: z.RefinementCtx,
) => {
  const now = new Date();

  const addIssue = (
    field: "openingDate" | "eventDate" | "closingDate",
    message: string,
  ) => {
    ctx.addIssue({
      code: "custom",
      path: [field],
      message,
    });
  };

  if (data.openingDate && data.openingDate.getTime() <= now.getTime()) {
    addIssue(
      "openingDate",
      "Opening date/time must be greater than current date/time",
    );
  }

  if (data.eventDate && data.eventDate.getTime() <= now.getTime()) {
    addIssue(
      "eventDate",
      "Event date/time must be greater than current date/time",
    );
  }

  if (data.closingDate && data.closingDate.getTime() <= now.getTime()) {
    addIssue(
      "closingDate",
      "Closing date/time must be greater than current date/time",
    );
  }

  if (
    data.openingDate &&
    data.eventDate &&
    data.eventDate.getTime() < data.openingDate.getTime()
  ) {
    addIssue("eventDate", "Event date/time cannot be before opening date/time");
  }

  if (
    data.openingDate &&
    data.closingDate &&
    data.closingDate.getTime() < data.openingDate.getTime()
  ) {
    addIssue(
      "closingDate",
      "Closing date/time cannot be before opening date/time",
    );
  }

  if (
    data.eventDate &&
    data.closingDate &&
    data.eventDate.getTime() > data.closingDate.getTime()
  ) {
    addIssue("eventDate", "Event date/time cannot be after closing date/time");
    addIssue(
      "closingDate",
      "Closing date/time cannot be before event date/time",
    );
  }
};

const eventBaseSchema = z.object({
  OrganizationId: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid Object-Id format" })
    .optional(),

  name: z
    .string({ message: "Event name is required" })
    .min(1, { message: "Cannot be empty" }),

  categories: z.array(categorySchema).optional(),

  description: z.string().optional(),
  eventManager: z.string().optional(),

  location: z.string({ message: "Location is required" }).min(1),
  googleLocation: z.string().optional(),

  openingDate: z.coerce.date({
    message: "Invalid date for opening date",
  }),
  closingDate: z.coerce.date({
    message: "Invalid date for closing date",
  }),
  eventDate: z.coerce.date({
    message: "Invalid date for event date",
  }),

  entryLimit: z.preprocess(
    (value) => (value === "" || value == null ? undefined : Number(value)),
    z.number().min(0).optional(),
  ),

  image: z.string().optional(),

  status: z.string().optional(),

  isPublic: z.preprocess((value) => {
    if (value === "" || value == null) return undefined;
    if (typeof value === "boolean") return value;
    if (typeof value === "string") {
      const normalized = value.trim().toLowerCase();
      if (["true", "1", "yes", "on"].includes(normalized)) return true;
      if (["false", "0", "no", "off"].includes(normalized)) return false;
    }
    return value;
  }, z.boolean().optional()),

  createdBy: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid Object-Id format" })
    .optional(),
});

export const eventSchema = eventBaseSchema.superRefine(validateEventTimeline);

export const eventUpdateSchema = eventBaseSchema
  .partial()
  .superRefine(validateEventTimeline);

export const eventParamsSchema = z.object({
  id: z
    .string({ message: "ID is required" })
    .regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid Object-Id format" }),
});
