import { requireUser } from "./require-user";
import prisma from "@/lib/db";

export async function getEnrolledCourses() {
  const user = await requireUser();
  return await prisma.enrollment.findMany({
    where: {
      userId: user.id,
      status: "SUCCESSFUL",
    },
    select: {
      Course: {
        select: {
          id: true,
          smallDescription: true,
          title: true,
          fileKey: true,
          level: true,
          slug: true,
          duration: true,
          chapters: {
            select: {
              id: true,

              lessons: {
                select: {
                  id: true,
                  lessonProgress: {
                    where: { userId: user.id },
                    select: { lessonId: true, completed: true },
                  },
                },
              },
            },
          },
        },
      },
    },
  });
}

export type EnrolledCourseType = Awaited<
  ReturnType<typeof getEnrolledCourses>
>[0];
