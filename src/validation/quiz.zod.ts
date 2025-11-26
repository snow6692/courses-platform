import { z } from "zod";

// validation/quiz.zod.ts
export const quizSchema = z
  .object({
    quizId: z.string().uuid().optional(), //
    title: z.string().min(3, "Title must be at least 3 characters"),
    description: z.string().optional().nullable(),
    timeLimit: z.coerce.number().int().min(1).max(300).optional().nullable(),

    courseId: z.string().uuid().optional().nullable(),
    chapterId: z.string().uuid().optional().nullable(),
    lessonId: z.string().uuid().optional().nullable(),
  })
  .refine(
    (data) => {
      const ids = [data.courseId, data.chapterId, data.lessonId].filter(
        Boolean,
      ).length;
      return ids === 1;
    },
    {
      message:
        "Exactly one of courseId, chapterId, or lessonId must be provided",
    },
  );

export type QuizSchema = z.infer<typeof quizSchema>;

const createQuestionSchema = z.object({
  quizId: z.string(),
  text: z.string().min(1),
  imageKey: z.string().optional(),
  explanation: z.string().optional(),
  explanationImageKey: z.string().optional(),
  explanationVideoKey: z.string().optional(),
});

const createAnswerSchema = z.object({
  questionId: z.string(),
  text: z.string().min(1),
  isCorrect: z.boolean(),
});
