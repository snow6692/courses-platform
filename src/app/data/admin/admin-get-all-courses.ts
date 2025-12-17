import prisma from "@/lib/db";

export async function adminGetAllCourses() {
  const courses = await prisma.course.findMany({
    select: {
      id: true,
      title: true,
      slug: true,
      _count: {
        select: {
          enrollments: true,
        },
      },
    },
    orderBy: {
      title: "asc",
    },
  });

  return courses;
}
