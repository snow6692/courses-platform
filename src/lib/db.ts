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
  CourseStatus,
  Enrollment,
  MemeTrigger,
  MemeType,
  Meme,
} from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL!;

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

const adapter = new PrismaPg({
  connectionString,
});

const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export { MemeTrigger, MemeType, CourseStatus };

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
  Enrollment,
  Meme,
};
export default prisma;
