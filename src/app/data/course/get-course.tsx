import prisma from "@/lib/db";
import { notFound } from "next/navigation";
import { cache } from "react";

export const getCourse = cache(async (slug: string) => {
  const course = await prisma.course.findUnique({
    where: {
      slug,
    },
    select: {
      id: true,
      fileKey: true,
      pdfKey: true,
      slug: true,
      title: true,
      level: true,
      price: true,
      duration: true,
      description: true,
      category: true,
      smallDescription: true,
      user: {
        select: {
          name: true,
        },
      },
      _count: {
        select: {
          enrollments: true,
        },
      },
      chapters: {
        select: {
          id: true,
          title: true,
          lessons: {
            select: {
              id: true,
              title: true,
              isFree: true,
            },
            orderBy: {
              position: "asc",
            },
          },
        },
        orderBy: {
          position: "asc",
        },
      },
    },
  });

  if (!course) {
    return notFound();
  }
  return course;
});
