import { z } from "zod";

export const createAnswerSchema = z.object({
  questionId: z.string(),
  text: z.string().min(1),
  isCorrect: z.boolean(),
});

export type createAnswerType = z.infer<typeof createAnswerSchema>;
