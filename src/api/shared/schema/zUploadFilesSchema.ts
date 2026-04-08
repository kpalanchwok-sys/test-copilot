import { z } from "zod";

const fileSchema = z.object({
  fileName: z.string(),
  contentType: z.string(),
  _id: z.string().optional(),
});

export const uploadFileSchema = z.object({
  images: z.array(fileSchema).optional(),
  documents: z.array(fileSchema).optional(),
  videos: z.array(fileSchema).optional(),
});

export const confirmUploadFileSchema = z.object({
  images: z.array(z.string()).optional(),
  documents: z.array(z.string()).optional(),
  videos: z.array(z.string()).optional(),
});

export type UploadBoatFileSchema = z.infer<typeof uploadFileSchema>;

export const deleteBoatFilesSchema = z.object({
  body: z.object({
    imageIds: z.array(z.string()).optional().default([]),
    documentIds: z.array(z.string()).optional().default([]),
    videoIds: z.array(z.string()).optional().default([]),
  }),
});
