// Re-export types for type safety

export const CourseStatusEnum = {
  DRAFT: "DRAFT",
  PUBLISHED: "PUBLISHED",
  ARCHIVED: "ARCHIVED",
} as const;

// Optional: for nicer autocomplete
export type CourseStatusValue =
  (typeof CourseStatusEnum)[keyof typeof CourseStatusEnum];
