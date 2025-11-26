import { z } from "zod";

export const createQuestionSchema = z.object({
  quizId: z.string(),
  text: z.string().min(1),
  imageKey: z.string().optional(),
  explanation: z.string().optional(),
  explanationImageKey: z.string().optional(),
  explanationVideoKey: z.string().optional(),
});

export const createAnswerSchema = z.object({
  questionId: z.string(),
  text: z.string().min(1),
  isCorrect: z.boolean(),
});
