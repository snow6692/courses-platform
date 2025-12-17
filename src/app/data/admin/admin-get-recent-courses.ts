import "server-only";

import prisma from "@/lib/db";
import { requireAdmin } from "./require-admin";

export async function adminGetRecentCourses() {
  await requireAdmin();

  return prisma.course.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: 2,
    select: {
      id: true,
      title: true,
      smallDescription: true,
      duration: true,
      status: true,
      price: true,
      fileKey: true,
      slug: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}
