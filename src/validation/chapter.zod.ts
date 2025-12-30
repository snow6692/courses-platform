import { z } from "zod";

export const chapterSchema = z.object({
  name: z.string().min(3, { message: "validation.chapter_name_min_length" }),
  courseId: z.string().uuid({ message: "validation.invalid_course_id" }),
});

export type ChapterSchemaType = z.infer<typeof chapterSchema>;
