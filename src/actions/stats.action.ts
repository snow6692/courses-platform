"use server";

import prisma from "@/lib/db";

export type HeroStats = {
  usersCount: number;
  coursesCount: number;
};

export async function getHeroStats(): Promise<HeroStats> {
  try {
    const [usersCount, coursesCount] = await Promise.all([
      prisma.user.count(),
      prisma.course.count(),
    ]);

    return {
      usersCount,
      coursesCount,
    };
  } catch (error) {
    console.error("Failed to fetch hero stats:", error);
    return {
      usersCount: 0,
      coursesCount: 0,
    };
  }
}
