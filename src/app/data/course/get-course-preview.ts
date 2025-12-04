// src/app/data/course/get-course-preview.ts

import prisma from "../../../lib/db";
import { notFound } from "next/navigation";

export async function getCoursePreview(slug: string) {
  const course = await prisma.course.findUnique({
    where: { slug },
    select: {
      id: true,
      title: true,
      smallDescription: true,
      description: true,
      fileKey: true,
      price: true,
      chapters: {
        where: {
          lessons: {
            some: { isFree: true },
          },
        },
        select: {
          id: true,
          title: true,
          position: true,
          lessons: {
            where: { isFree: true },
            orderBy: { position: "asc" },
            select: {
              id: true,
              title: true,
              position: true,
              videoKey: true,
              pdfKey: true,
              thumbnailKey: true,
              description: true,
            },
          },
        },
        orderBy: { position: "asc" },
      },
    },
  });

  if (!course || course.chapters.length === 0) {
    notFound();
  }

  return course;
}

export type CoursePreviewType = Awaited<ReturnType<typeof getCoursePreview>>;
