"server only";

import prisma from "@/lib/db";
import { requireAdmin } from "./require-admin";

export async function adminGetCourses({
  page = 1,
  limit = 10,
}: {
  page: number;
  limit: number;
}) {
  await requireAdmin();
  // await new Promise((resolve) => setTimeout(resolve, 10000));
  const skip = (page - 1) * limit;

  const data = await prisma.course.findMany({
    skip,
    take: limit,

    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      title: true,
      smallDescription: true,
      duration: true,
      level: true,
      status: true,
      price: true,
      fileKey: true,
      slug: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  const totalCourses = await prisma.course.count();
  return {
    data,
    totalCourses,
  };
}

export type AdminGetCoursesResponse = Awaited<
  ReturnType<typeof adminGetCourses>
>;

export type AdminGetCoursesTypes = AdminGetCoursesResponse["data"];
export type AdminCourseType = AdminGetCoursesTypes[number];
