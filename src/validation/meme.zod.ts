import { MemeTrigger, MemeType } from "@/lib/enums";
import { z } from "zod";

export const createMemeSchema = z.object({
  fileKey: z.string().min(1, "File is required"),
  type: z.nativeEnum(MemeType),
  trigger: z.nativeEnum(MemeTrigger),
  quizId: z.string().optional().nullable(),
  questionId: z.string().optional().nullable(),
});

export type CreateMemeSchema = z.infer<typeof createMemeSchema>;
