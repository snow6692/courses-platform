import {
  PrismaClient,
  Question,
  Answer,
  Chapter,
  Course,
  FavoriteQuestion,
  Lesson,
  LessonProgress,
  Quiz,
  QuizAnswer,
  QuizAttempt,
  CourseLevel,
  CourseStatus,
  Enrollment,
} from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
// import type {
//   Course,
//   CourseLevel,
//   CourseStatus,
//   Chapter,
//   Enrollment,
//   Lesson,
//   Quiz

// } from "@prisma/client";
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

export type {
  Question,
  Answer,
  Chapter,
  Course,
  FavoriteQuestion,
  Lesson,
  LessonProgress,
  Quiz,
  QuizAnswer,
  QuizAttempt,
  CourseLevel,
  CourseStatus,
  Enrollment,
};
export default prisma;
