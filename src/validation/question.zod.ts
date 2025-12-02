import { z } from "zod";

export const createQuestionSchema = z.object({
  sectionId: z.string(),
  text: z.string().min(1),
  imageKey: z.string().optional(),
  explanation: z.string().optional(),
  explanationImageKey: z.string().optional(),
  explanationVideoKey: z.string().optional(),
});
