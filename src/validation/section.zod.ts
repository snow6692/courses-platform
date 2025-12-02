import { z } from "zod";

export const sectionSchema = z.object({
  title: z.string().min(1, "Title is required"),
  timeLimit: z.coerce.number().min(1, "Time limit must be at least 1 minute"),
  position: z.number().int().optional(),
});

export type SectionSchemaType = z.infer<typeof sectionSchema>;
