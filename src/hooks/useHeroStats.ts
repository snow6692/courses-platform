// hooks/useHeroStats.ts
import { useQuery } from "@tanstack/react-query";
import { getHeroStats } from "@/actions/stats.action";

export function useHeroStats() {
  return useQuery({
    queryKey: ["hero-stats"],
    queryFn: async () => {
      const data = await getHeroStats();
      return {
        usersCount: data.usersCount,
        coursesCount: data.coursesCount,
      };
    },
    staleTime: 1000 * 60 * 60 * 24 * 7, //  7 days
    refetchOnWindowFocus: false,
  });
}
