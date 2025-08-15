import "server-only"


import prisma from "@/lib/db";
import { requireAdmin } from "./require-admin";

export async function adminGetDashboardStats() {
  await requireAdmin();

  const [totalUsers, totalCustomers, totalCourses, totalLessons] =
    await Promise.all([
      //Total users
      prisma.user.count(),
      //Total customers
      prisma.user.count({
        where: {
          enrollments: {
            some: {},
          },
        },
      }),

      //Total courses
      prisma.course.count(),
      // total lessons
      prisma.lesson.count(),
    ]);

  return {
    totalUsers,
    totalCustomers,
    totalCourses,
    totalLessons,
  };
}
