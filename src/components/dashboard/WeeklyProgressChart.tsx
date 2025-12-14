"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Sparkles } from "lucide-react";
import { useLanguage } from "@/providers/LanguageContext";

interface WeeklyProgressData {
  day: string;
  dayShort: string;
  count: number;
  date: string;
}

interface WeeklyProgressChartProps {
  data: WeeklyProgressData[];
  totalProgress: number;
}

export function WeeklyProgressChart({
  data,
  totalProgress,
}: WeeklyProgressChartProps) {
  const { t, language } = useLanguage();

  // Find the max value for highlighting
  const maxCount = Math.max(...data.map((d) => d.count), 1);
  const totalCompletedThisWeek = data.reduce((acc, d) => acc + d.count, 0);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <TrendingUp className="size-5 text-red-500" />
          {t("dashboard.weekly_progress") || "تقدمك الأسبوعي"}
        </CardTitle>
        <span className="flex items-center gap-1 text-sm text-green-600">
          <TrendingUp className="size-4" />
          {totalProgress}%
        </span>
      </CardHeader>
      <CardContent>
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="dayShort"
                tick={{ fontSize: 12, fill: "#6b7280" }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fontSize: 12, fill: "#6b7280" }}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload as WeeklyProgressData;
                    return (
                      <div className="rounded-lg border bg-white p-2 shadow-lg">
                        <p className="text-sm font-medium">{data.day}</p>
                        <p className="text-sm text-gray-600">
                          {data.count}{" "}
                          {language === "ar"
                            ? "درس مكتمل"
                            : "lessons completed"}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.count === maxCount ? "#ef4444" : "#fca5a5"}
                    opacity={entry.count === maxCount ? 1 : 0.7}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <p className="mt-4 text-center text-sm text-gray-500">
          <Sparkles className="ml-1 inline size-4 text-amber-500" />
          {totalCompletedThisWeek > 0
            ? language === "ar"
              ? `أكملت ${totalCompletedThisWeek} درس هذا الأسبوع! 💪`
              : `You completed ${totalCompletedThisWeek} lessons this week! 💪`
            : language === "ar"
              ? "ابدأ التعلم اليوم! 🚀"
              : "Start learning today! 🚀"}
        </p>
      </CardContent>
    </Card>
  );
}
