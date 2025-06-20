import { z } from "zod";
import { CourseLevel, CourseStatus } from "../generated/prisma";
export const courseSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Title at least 3 characters" })
    .max(100, { message: "Title must be less than 100 characters" }),

  description: z
    .string()
    .min(3, { message: "Description at least 3 characters" }),
  fileKey: z.string().min(1, { message: "File is required" }),
  price: z.coerce.number().min(0, { message: "Price is required" }),
  duration: z.coerce
    .number()
    .min(1, { message: "Duration is required" })
    .max(500, { message: "Duration must be less than 500 hours" }),
  level: z.nativeEnum(CourseLevel),
  category: z.string().min(1, { message: "Category is required" }),
  smallDescription: z
    .string()
    .min(3, { message: "Small description at least 3 characters" })
    .max(200, {
      message: "Small description must be less than 200 characters",
    }),
  slug: z.string().min(3, { message: "Slug at least 3 characters" }),
  status: z.nativeEnum(CourseStatus, {
    message: "Status is required",
  }),
});

export type CourseSchemaType = z.infer<typeof courseSchema>;
