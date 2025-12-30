import { z } from "zod";

export const lessonSchema = z.object({
  name: z.string().min(3, { message: "validation.lesson_name_min_length" }),
  chapterId: z.string().uuid({ message: "validation.invalid_chapter_id" }),
  courseId: z.string().uuid({ message: "validation.invalid_course_id" }),
  description: z.string().optional(),
  thumbnailKey: z.string().optional(),
  videoKey: z.string().optional(),
  bunnyVideoId: z.string().optional(),
  isFree: z.boolean().optional(),
});

export type LessonSchemaType = z.infer<typeof lessonSchema>;
