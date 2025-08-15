import "server-only"

import prisma from "@/lib/db";
import { requireAdmin } from "./require-admin";

export async function adminGetEnrollmentsStat() {
  //Get last month enrollments
  await requireAdmin();
  const monthAgo = new Date();
  monthAgo.setDate(monthAgo.getDate() - 30); // 18 August => 18 July
  const enrollments = await prisma.enrollment.findMany({
    where: {
      createdAt: {
        gte: monthAgo,
      },
    },
    select: {
      createdAt: true,
    },
    orderBy: { createdAt: "asc" },
  });
  /*
  A string in yyyy-mm-dd format (e.g., "2025-07-16").
  enrollments: The number of enrollments on that date (starts at 0).
  */
  const last30Days: { date: string; enrollments: number }[] = [];

  // for 29 days ago for example
  for (let i = 29; i >= 0; i--) {
    const date = new Date();

    date.setDate(date.getDate() - i);

    last30Days.push({
      date: date.toISOString().split("T")[0], //yyyy-mm-dd
      enrollments: 0,
    });
  }

  //Counts how many enrollments occurred on each day.
  enrollments.forEach((enrollment) => {
    const enrollmentDate = enrollment.createdAt.toISOString().split("T")[0];
    const dayIndex = last30Days.findIndex((day) => day.date === enrollmentDate);
    if (dayIndex !== -1) {
      last30Days[dayIndex].enrollments++;
    }
  });
  return last30Days;
}
