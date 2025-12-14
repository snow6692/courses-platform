import prisma from "@/lib/db";
import { unstable_cache } from "next/cache";

export type HeroStats = {
  usersCount: number;
  coursesCount: number;
};

// Cached function for static generation
export const getHeroStats = unstable_cache(
  async (): Promise<HeroStats> => {
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
  },
  ["hero-stats"],
  {
    revalidate: 300, // 5 minutes
    tags: ["hero-stats"],
  },
);
