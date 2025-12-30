import { z } from "zod";
import { CourseStatusEnum } from "../lib/course-enums";

export const courseSchema = z.object({
  title: z
    .string()
    .min(3, { message: "validation.title_min_length" })
    .max(100, { message: "validation.title_max_length" }),

  description: z
    .string()
    .min(3, { message: "validation.description_min_length" }),
  fileKey: z.string().min(1, { message: "validation.file_required" }),
  pdfKey: z.string().optional(),
  price: z.coerce.number().min(0, { message: "validation.price_required" }),
  duration: z.coerce
    .number()
    .min(1, { message: "validation.duration_required" })
    .max(500, { message: "validation.duration_max_length" }),
  smallDescription: z
    .string()
    .min(3, { message: "validation.small_description_min_length" })
    .max(200, {
      message: "validation.small_description_max_length",
    }),
  slug: z.string().min(3, { message: "validation.slug_min_length" }),
  status: z.nativeEnum(CourseStatusEnum, {
    message: "validation.status_required",
  }),
});

export type CourseSchemaType = z.infer<typeof courseSchema>;
