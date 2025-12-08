
// Re-export types for type safety

export const CourseLevelEnum = {
  BEGINNER: "BEGINNER",
  INTERMEDIATE: "INTERMEDIATE",
  ADVANCED: "ADVANCED",
} as const;

export const CourseStatusEnum = {
  DRAFT: "DRAFT",
  PUBLISHED: "PUBLISHED",
  ARCHIVED: "ARCHIVED",
} as const;

// Optional: for nicer autocomplete
export type CourseLevelValue = typeof CourseLevelEnum[keyof typeof CourseLevelEnum];
export type CourseStatusValue = typeof CourseStatusEnum[keyof typeof CourseStatusEnum];