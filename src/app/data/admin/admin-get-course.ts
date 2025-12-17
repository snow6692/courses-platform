import prisma from "@/lib/db";
import { requireAdmin } from "./require-admin";
import { notFound } from "next/navigation";

export async function adminGetCourse(id: string) {
  await requireAdmin();

  const course = await prisma.course.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      title: true,
      description: true,
      fileKey: true,
      pdfKey: true,
      price: true,
      duration: true,
      status: true,
      slug: true,
      smallDescription: true,
      chapters: {
        select: {
          id: true,
          title: true,
          position: true,
          quizzes: {
            select: {
              id: true,
              title: true,
              type: true,
              description: true,
              timeLimit: true,
              isActive: true,
              sections: {
                select: {
                  id: true,
                  title: true,
                  position: true,
                  timeLimit: true,
                  questions: {
                    select: {
                      id: true,
                      position: true,
                      sectionId: true,
                      text: true,
                      imageKey: true,
                      explanation: true,
                      explanationImageKey: true,
                      explanationVideoKey: true,
                      answers: {
                        select: {
                          id: true,
                          text: true,
                          isCorrect: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          lessons: {
            select: {
              id: true,
              isFree: true,
              position: true,
              description: true,
              thumbnailKey: true,
              videoKey: true,
              title: true,
              quizzes: {
                select: {
                  id: true,
                  title: true,
                  description: true,
                  timeLimit: true,
                  memes: {
                    select: {
                      meme: {
                        select: {
                          id: true,
                          fileKey: true,
                          type: true,
                          trigger: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });
  if (!course) return notFound();

  return course;
}

export type AdminCourseSingularType = Awaited<
  ReturnType<typeof adminGetCourse>
>;
