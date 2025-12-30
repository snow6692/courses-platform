import { z } from "zod";

export const sectionSchema = z.object({
  title: z.string().min(1, "validation.title_required"),
  timeLimit: z.coerce.number().min(1, "validation.time_limit_min"),
  position: z.number().int().optional(),
});

export type SectionSchemaType = z.infer<typeof sectionSchema>;
