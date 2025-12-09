import prisma from "@/lib/db";

export async function getAllCourses(search?: string) {
  const data = await prisma.course.findMany({
    where: {
      status: "PUBLISHED",
      ...(search && {
        OR: [
          {
            title: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            smallDescription: {
              contains: search,
              mode: "insensitive",
            },
          },
        ],
      }),
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
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return data;
}

export type PublicCoursesType = Awaited<ReturnType<typeof getAllCourses>>;
export type PublicCourseType = PublicCoursesType[number];
