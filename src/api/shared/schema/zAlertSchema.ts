import z from "zod";

export const contactIdBodySchema = z.object({
  contactId: z
    .string({ message: "Contact ID is required" })
    .regex(/^[0-9a-fA-F]{24}$/, {
      message: "Invalid Object-Id format",
    }),
});
