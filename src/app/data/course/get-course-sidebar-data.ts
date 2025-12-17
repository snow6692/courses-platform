import { requireUser } from "../user/require-user";
import prisma from "@/lib/db";
import { notFound } from "next/navigation";

export async function getCourseSidebarData(slug: string) {
  const user = await requireUser();
  const course = await prisma.course.findUnique({
    where: {
      slug,
    },
    select: {
      id: true,
      title: true,
      fileKey: true,
      pdfKey: true,
      duration: true,
      slug: true,
      // Course-level quizzes
      quizzes: {
        where: {
          type: "COURSE",
          isActive: true,
        },
        select: {
          id: true,
          title: true,
        },
      },
      chapters: {
        orderBy: {
          position: "asc",
        },
        select: {
          id: true,
          title: true,
          position: true,
          // Chapter-level quizzes
          quizzes: {
            where: {
              type: "CHAPTER",
              isActive: true,
            },
            select: {
              id: true,
              title: true,
            },
          },
          lessons: {
            orderBy: {
              position: "asc",
            },
            select: {
              id: true,
              title: true,
              position: true,
              description: true,
              isFree: true,
              // Lesson-level quizzes
              quizzes: {
                where: {
                  type: "LESSON",
                  isActive: true,
                },
                select: {
                  id: true,
                  title: true,
                },
              },
              lessonProgress: {
                where: {
                  userId: user.id,
                },
                select: {
                  completed: true,
                  lessonId: true,
                  id: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!course) return notFound();

  const enrollment = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: {
        courseId: course.id,
        userId: user.id,
      },
    },
    select: {
      status: true,
    },
  });

  // if (!enrollment || enrollment.status !== "SUCCESSFUL") return notFound();
  // if (!enrollment) return notFound();

  return { ...course, isEnrolled: enrollment?.status === "SUCCESSFUL" };
}

export type CourseSidebarData = Awaited<
  ReturnType<typeof getCourseSidebarData>
>;
