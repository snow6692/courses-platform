import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import type {
  Course,
  CourseLevel,
  CourseStatus,
  Chapter,
  Enrollment,
  Lesson,
} from "@prisma/client";
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

export type { Course, CourseLevel, CourseStatus, Chapter, Enrollment, Lesson };
export default prisma;
