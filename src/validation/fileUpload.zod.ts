import { z } from "zod";

export const fileUploadSchema = z.object({
  fileName: z.string().min(1, { message: "validation.file_name_required" }),
  contentType: z
    .string()
    .min(1, { message: "validation.content_type_required" }),
  fileSize: z.number().min(1, { message: "validation.file_size_required" }),
  isImage: z.boolean(),
});
export type fileUploadSchema = z.infer<typeof fileUploadSchema>;
