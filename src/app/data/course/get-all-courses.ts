import prisma from "@/lib/db";

export async function getAllCourses() {
  const data = await prisma.course.findMany({
    where: {
      status: "PUBLISHED",
    },
    select: {
      title: true,
      price: true,
      smallDescription: true,
      slug: true,
      fileKey: true,
      id: true,
      level: true,
      duration: true,
      category: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return data;
}

export type PublicCoursesType = Awaited<ReturnType<typeof getAllCourses>>;
export type PublicCourseType = PublicCoursesType[number];
