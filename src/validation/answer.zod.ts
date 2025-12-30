import { z } from "zod";

export const createAnswerSchema = z.object({
  questionId: z.string(),
  text: z.string().min(1, { message: "validation.answer_text_required" }),
  isCorrect: z.boolean(),
  imageKey: z.string().optional(),
});

export type createAnswerType = z.infer<typeof createAnswerSchema>;
