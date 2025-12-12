import { z } from "zod";

export const quizPlayerSchema = z.object({
  answers: z.record(
    z.string(),
    z.union([
      z.string().min(1, "Please select an answer"),
      z.array(z.string()).min(1, "Please select at least one answer"),
    ]),
  ),
});

export type QuizPlayerSchemaType = z.infer<typeof quizPlayerSchema>;
