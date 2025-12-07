import prisma from "@/lib/db";

export async function getBestSellingCourses() {
  const courses = await prisma.course.findMany({
    where: {
      status: "PUBLISHED",
    },
    take: 3,
    orderBy: {
      enrollments: {
        _count: "desc",
      },
    },
    select: {
      id: true,
      title: true,
      smallDescription: true,
      price: true,
      duration: true,
      level: true,
      category: true,
      slug: true,
      fileKey: true,

      _count: {
        select: {
          enrollments: true,
        },
      },
      user: {
        select: {
          name: true,
          image: true,
        },
      },
    },
  });

  return courses;
}

export type BestSellingCourseType = Awaited<
  ReturnType<typeof getBestSellingCourses>
>[number];
