import { z } from "zod";

export const quizPlayerSchema = z.object({
  answers: z.record(z.string(), z.string().min(1, "Please select an answer")),
});

export type QuizPlayerSchemaType = z.infer<typeof quizPlayerSchema>;
