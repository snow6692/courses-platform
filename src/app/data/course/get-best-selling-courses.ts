import prisma from "@/lib/db";
import { unstable_cache } from "next/cache";

export const getBestSellingCourses = unstable_cache(
  async () => {
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
  },
  ["best-selling-courses"],
  {
    revalidate: 300, // 5 minutes
    tags: ["best-selling-courses"],
  },
);

export type BestSellingCourseType = Awaited<
  ReturnType<typeof getBestSellingCourses>
>[number];
