import prisma from "@/lib/db";

interface GetStudentsParams {
  search?: string;
  courseFilter?: string;
  bannedFilter?: "all" | "banned" | "active";
  page?: number;
  pageSize?: number;
}

export async function adminGetStudents({
  search,
  courseFilter,
  bannedFilter = "all",
  page = 1,
  pageSize = 10,
}: GetStudentsParams) {
  const where: any = {};

  // Search by name, email, or phone number
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
      { phoneNumber: { contains: search, mode: "insensitive" } },
    ];
  }

  // Filter by banned status
  if (bannedFilter === "banned") {
    where.banned = true;
  } else if (bannedFilter === "active") {
    where.NOT = { banned: true };
  }

  // Filter by course enrollment
  if (courseFilter) {
    where.enrollments = {
      some: {
        Course: {
          slug: courseFilter,
        },
      },
    };
  }

  // Only get users who have enrollments
  if (!courseFilter) {
    where.enrollments = {
      some: {},
    };
  }

  // Use Promise.all for parallel queries - better performance
  const [totalCount, students] = await Promise.all([
    prisma.user.count({ where }),
    prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        phoneNumber: true,
        banned: true,
        banReason: true,
        enrollments: {
          select: {
            id: true,
            createdAt: true,
            amount: true,
            Course: {
              select: {
                id: true,
                title: true,
                slug: true,
                price: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ]);

  const totalPages = Math.ceil(totalCount / pageSize);

  return {
    students,
    totalCount,
    totalPages,
    currentPage: page,
  };
}
