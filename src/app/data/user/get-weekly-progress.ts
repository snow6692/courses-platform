import prisma from "@/lib/db";
import { requireUser } from "./require-user";
import { startOfDay, subDays, format } from "date-fns";
import { ar, enUS } from "date-fns/locale";

export interface WeeklyProgressData {
  day: string;
  dayShort: string;
  count: number;
  date: string;
}

export async function getWeeklyProgress(
  language: "ar" | "en" = "ar",
): Promise<WeeklyProgressData[]> {
  const user = await requireUser();

  // Get last 7 days
  const today = startOfDay(new Date());
  const sevenDaysAgo = subDays(today, 6); // Include today

  // Get all lesson completions in the last 7 days
  const completions = await prisma.lessonProgress.findMany({
    where: {
      userId: user.id,
      completed: true,
      updatedAt: {
        gte: sevenDaysAgo,
      },
    },
    select: {
      updatedAt: true,
    },
  });

  // Group by day
  const dayMap = new Map<string, number>();

  // Initialize all 7 days with 0
  for (let i = 6; i >= 0; i--) {
    const date = subDays(today, i);
    const dateKey = format(date, "yyyy-MM-dd");
    dayMap.set(dateKey, 0);
  }

  // Count completions per day
  completions.forEach((completion) => {
    const dateKey = format(new Date(completion.updatedAt), "yyyy-MM-dd");
    if (dayMap.has(dateKey)) {
      dayMap.set(dateKey, (dayMap.get(dateKey) || 0) + 1);
    }
  });

  // Convert to array with day names
  const locale = language === "ar" ? ar : enUS;
  const result: WeeklyProgressData[] = [];

  for (let i = 6; i >= 0; i--) {
    const date = subDays(today, i);
    const dateKey = format(date, "yyyy-MM-dd");
    const dayName = format(date, "EEEE", { locale });
    const dayShort = format(date, "EEE", { locale });

    result.push({
      day: dayName,
      dayShort,
      count: dayMap.get(dateKey) || 0,
      date: dateKey,
    });
  }

  return result;
}
