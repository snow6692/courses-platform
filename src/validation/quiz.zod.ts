// validation/quiz.zod.ts
import { z } from "zod";

export const createQuizSchema = z
  .object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    description: z.string().optional(),
    timeLimit: z.coerce.number().int().min(1).max(300).optional(),
    type: z.enum(["COURSE", "CHAPTER", "LESSON"]),
    courseId: z.string().uuid().optional().nullable(),
    chapterId: z.string().uuid().optional().nullable(),
    lessonId: z.string().uuid().optional().nullable(),
  })
  .refine(
    (data) => {
      const count = [data.courseId, data.chapterId, data.lessonId].filter(
        Boolean,
      ).length;
      return count === 1;
    },
    {
      message:
        "Exactly one of courseId, chapterId, or lessonId must be provided",
    },
  );

export const addQuestionSchema = z.object({
  quizId: z.string().uuid(),
  text: z.string().min(1, "Question text is required"),
  imageKey: z.string().optional(),
  explanation: z.string().optional(),
  explanationImageKey: z.string().optional(),
  explanationVideoKey: z.string().optional(),
  answers: z
    .array(
      z.object({
        text: z.string().min(1, "Answer text is required"),
        isCorrect: z.boolean(),
      }),
    )
    .min(2, "At least 2 answers required"),
});

export type CreateQuizSchema = z.infer<typeof createQuizSchema>;
export type AddQuestionSchema = z.infer<typeof addQuestionSchema>;
