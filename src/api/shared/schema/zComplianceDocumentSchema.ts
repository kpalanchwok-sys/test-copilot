import { z } from "zod";

export const fileSchema = z.object({
  fileName: z.string().min(1, "fileName is required"),
  fileUrl: z.url("Invalid fileUrl"),
  contentType: z.string().optional(),
  fileSize: z.number().optional(),
  status: z.string(),
});

export const complianceDocumentSchema = z.object({
  youTubeLinks: z
    .array(z.object({ url: z.url("Invalid YouTube URL") }))
    .optional(),
});

export const complianceDocumentUpdateSchema =
  complianceDocumentSchema.partial();

export const complianceDocumentParamsSchema = z.object({
  complianceDocumentId: z
    .string({ message: "ID is required" })
    .regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid Object-Id format" }),
});

export const singleDocumentParamsSchema = z.object({
  complianceDocumentId: z
    .string({ message: "Compliance Document ID is required" })
    .regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid Object-Id format" }),
  documentId: z
    .string({ message: "Document ID is required" })
    .regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid Object-Id format" }),
});

export type SingleDocumentParams = z.infer<typeof singleDocumentParamsSchema>;
