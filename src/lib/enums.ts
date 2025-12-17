// Client-safe enum definitions (matching Prisma schema)
// These are plain objects, not imports from Prisma, so they work in client components

export const MemeType = {
  IMAGE: "IMAGE",
  GIF: "GIF",
  VIDEO: "VIDEO",
} as const;

export const MemeTrigger = {
  TOO_SLOW: "TOO_SLOW",
  RANDOM: "RANDOM",
} as const;

export const CourseStatus = {
  DRAFT: "DRAFT",
  PUBLISHED: "PUBLISHED",
  ARCHIVED: "ARCHIVED",
} as const;

export type MemeType = (typeof MemeType)[keyof typeof MemeType];
export type MemeTrigger = (typeof MemeTrigger)[keyof typeof MemeTrigger];
export type CourseStatus = (typeof CourseStatus)[keyof typeof CourseStatus];
