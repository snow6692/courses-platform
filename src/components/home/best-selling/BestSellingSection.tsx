"use client";

import React from "react";
import Link from "next/link";
import { BestSellingCourseCard } from "./BestSellingCourseCard";
import { BestSellingCourseType } from "@/app/data/course/get-best-selling-courses";
import { useLanguage } from "@/providers/LanguageContext";
import { MoveLeft } from "lucide-react";

interface BestSellingSectionProps {
  courses: BestSellingCourseType[];
}

export function BestSellingSection({ courses }: BestSellingSectionProps) {
  const { t, dir } = useLanguage();

  return (
    <section className="bg-background w-full py-12">
      <div className="container mx-auto flex flex-col gap-8 px-6 md:px-12 lg:px-24">
        {/* Header */}
        <div className="flex items-center justify-between">
          {/* Title with icon or just title? Image has an icon maybe? */}
          <div className="flex items-center gap-2">
            <h2 className="text-foreground text-3xl font-bold md:text-4xl">
              {t("home.best_selling.title")}
            </h2>
            {/* Red icon/emoji from image? */}
            <div className="rounded-md bg-[#D32F2F] p-1">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-trending-up"
              >
                <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                <polyline points="16 7 22 7 22 13" />
              </svg>
            </div>
          </div>

          {/* View All Link */}
          <Link
            href="/courses"
            className="group text-primary hover:text-primary/80 flex items-center gap-2 text-lg font-medium transition-colors" // Red color from theme?
          >
            <span>{t("home.best_selling.view_all")}</span>
            <MoveLeft
              className={`h-5 w-5 transition-transform duration-300 ${dir === "rtl" ? "group-hover:-translate-x-1" : "rotate-180 group-hover:translate-x-1"}`}
            />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <BestSellingCourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>
    </section>
  );
}
