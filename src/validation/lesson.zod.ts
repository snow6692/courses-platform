import { z } from "zod";

export const lessonSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters long" }),
  chapterId: z.string().uuid({ message: "Invalid chapter id" }),
  courseId: z.string().uuid({ message: "Invalid course id" }),
  description: z.string().optional(),
  thumbnailKey: z.string().optional(),
  videoKey: z.string().optional(),
  bunnyVideoId: z.string().optional(),
  isFree: z.boolean().optional(),
});

export type LessonSchemaType = z.infer<typeof lessonSchema>;
