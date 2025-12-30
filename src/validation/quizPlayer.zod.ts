import { z } from "zod";

export const quizPlayerSchema = z.object({
  answers: z.record(
    z.string(),
    z.union([
      z.string().min(1, "validation.select_answer"),
      z.array(z.string()).min(1, "validation.select_at_least_one_answer"),
    ]),
  ),
});

export type QuizPlayerSchemaType = z.infer<typeof quizPlayerSchema>;
