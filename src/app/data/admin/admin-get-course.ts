"server only";

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
      price: true,
      duration: true,
      level: true,
      status: true,
      slug: true,
      smallDescription: true,
      category: true,
      chapters: {
        select: {
          id: true,
          title: true,
          position: true,
          lessons: {
            select: {
              id: true,
              position: true,
              description: true,
              thumbnailKey: true,
              videoKey: true,
              title: true,
              
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
