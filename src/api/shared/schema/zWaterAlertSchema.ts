import { z } from "zod";

const validDate = (field: string) =>
  z.coerce.date().refine((date) => !isNaN(date.getTime()), {
    message: `${field} must be a valid date`,
  });

const optionalString = z.string().optional();

const baseFields = {
  name: z.string().min(1, "Name cannot be empty").optional(),
  googleLocation: optionalString,
  image: optionalString,
};

const lockClosureSchema = z.object({
  ...baseFields,
  type: z.literal("Lock-Closure"),
  alertDate: validDate("Alert date"),
  closed: optionalString,
  urgency: z.string().min(1, "Urgency is required"),
  location: z.string().min(1, "Location is required"),
  maintainBy: z.string().min(1, "maintainBy is required"),
  suggestion: z.string().min(1, "Suggestion is required"),
  reason: z.string().min(1, "Reason is required"),
  description: z.string().min(1, "Description is required"),
});

const weatherWarningSchema = z.object({
  ...baseFields,
  type: z.literal("Weather-Warning"),
  alertDate: validDate("Alert date"),
  issued: z.string().min(1, "Issued is required"),
  urgency: z.string().min(1, "Urgency is required"),
  location: z.string().min(1, "Location is required"),
  maintainBy: z.string().min(1, "maintainBy is required"),
  source: z.string().min(1, "Source is required"),
  forecast: z.string().min(1, "Forecast is required"),
  impact: z.string().min(1, "Impact is required"),
  advise: z.string().min(1, "Advise is required"),
  description: z.string().min(1, "Description is required"),
});

const navigationWarningSchema = z.object({
  ...baseFields,
  type: z.literal("Navigation-Warning"),
  alertDate: validDate("Alert date"),
  issued: z.string().min(1, "Issued is required"),
  location: z.string().min(1, "Location is required"),
  reportedDate: validDate("Reported date"),
  source: z.string().min(1, "Source is required"),
  clearanceEta: validDate("Clearance ETA"),
  statusCheck: z.string().min(1, "statusCheck is required"),
  description: z.string().min(1, "Description is required"),
});

export const waterAlertSchema = z.discriminatedUnion("type", [
  lockClosureSchema,
  weatherWarningSchema,
  navigationWarningSchema,
]);

export const waterAlertUpdateSchema = z
  .object({
    name: optionalString,
    type: z
      .enum(["Lock-Closure", "Weather-Warning", "Navigation-Warning"])
      .optional(),
    alertDate: validDate("Alert date").optional(),
    closed: optionalString,
    issued: optionalString,
    urgency: optionalString,
    location: optionalString,
    googleLocation: optionalString,
    maintainBy: optionalString,
    suggestion: optionalString,
    reason: optionalString,
    source: optionalString,
    forecast: optionalString,
    impact: optionalString,
    advise: optionalString,
    reportedDate: validDate("Reported date").optional(),
    clearanceEta: validDate("Clearance ETA").optional(),
    statusCheck: optionalString,
    description: optionalString,
    image: optionalString,
  })
  .superRefine((data, ctx) => {
    if (!data.type) {
      return;
    }

    const requiredByType: Record<string, string[]> = {
      "Lock-Closure": [
        "alertDate",
        "closed",
        "urgency",
        "location",
        "maintainBy",
        "suggestion",
        "reason",
        "description",
      ],
      "Weather-Warning": [
        "alertDate",
        "issued",
        "urgency",
        "location",
        "maintainBy",
        "source",
        "forecast",
        "impact",
        "advise",
        "description",
      ],
      "Navigation-Warning": [
        "alertDate",
        "issued",
        "location",
        "reportedDate",
        "source",
        "clearanceEta",
        "statusCheck",
        "description",
      ],
    };

    for (const field of requiredByType[data.type]) {
      if (data[field as keyof typeof data] === undefined) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: [field],
          message: `${field} is required for ${data.type}`,
        });
      }
    }
  });

export const waterAlertParamsSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ID format"),
});
