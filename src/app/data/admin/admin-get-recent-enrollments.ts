import prisma from "@/lib/db";

export async function adminGetRecentEnrollments(limit = 10) {
  const enrollments = await prisma.enrollment.findMany({
    take: limit,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phoneNumber: true,
        },
      },
      Course: {
        select: {
          id: true,
          title: true,
          slug: true,
          price: true,
        },
      },
    },
  });

  return enrollments;
}
