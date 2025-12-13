"use client";

import React, { useMemo } from "react";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import Image from "next/image";
import { useConstructUrl } from "@/hooks/use-construct-url";
import Link from "next/link";
import { buttonVariants } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import { EnrolledCourseType } from "@/app/data/user/get-enrolled-courses";
import { CourseProgressClient } from "./CourseProgressClient";
import { useLanguage } from "@/providers/LanguageContext";
import { Play, CheckCircle2, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

function CourseProgressCard({
  course: enrollment,
}: {
  course: EnrolledCourseType;
}) {
  const { t } = useLanguage();
  const ThumbnailUrl = useConstructUrl(enrollment.Course.fileKey);

  // Calculate if course is completed
  const { isCompleted, completedCount, totalCount } = useMemo(() => {
    let total = 0;
    let completed = 0;

    enrollment.Course.chapters.forEach((chapter) => {
      chapter.lessons.forEach((lesson) => {
        total++;
        if (lesson.lessonProgress.some((p) => p.completed)) {
          completed++;
        }
      });
    });

    return {
      isCompleted: total > 0 && completed === total,
      completedCount: completed,
      totalCount: total,
    };
  }, [enrollment.Course.chapters]);

  return (
    <Card
      className={cn(
        "group relative gap-0 overflow-hidden py-0 transition-all hover:shadow-lg",
        isCompleted && "ring-2 ring-green-500",
      )}
    >
      {/* Level Badge */}
      <Badge className="absolute top-3 right-3 z-10 bg-white/90 text-gray-700 shadow-sm backdrop-blur-sm">
        {enrollment.Course.level}
      </Badge>

      {/* Completed Badge */}
      {isCompleted && (
        <Badge className="absolute top-3 left-3 z-10 gap-1 bg-green-500 text-white shadow-sm">
          <CheckCircle2 className="size-3" />
          {t("dashboard.completed") || "مكتمل"}
        </Badge>
      )}

      {/* Image with overlay */}
      <div className="relative">
        <Image
          width={600}
          height={400}
          src={ThumbnailUrl}
          alt={enrollment.Course.title}
          className="aspect-video h-full w-full object-cover transition-transform group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

        {/* Play button overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
          <div className="flex size-14 items-center justify-center rounded-full bg-white/90 shadow-lg">
            {isCompleted ? (
              <RotateCcw className="size-6 text-green-600" />
            ) : (
              <Play className="size-6 fill-red-600 text-red-600" />
            )}
          </div>
        </div>
      </div>

      <CardContent className="p-5">
        {/* Title */}
        <Link
          prefetch={false}
          href={`/dashboard/${enrollment.Course.slug}`}
          className="group-hover:text-primary mb-2 line-clamp-2 block text-lg font-semibold transition-colors"
        >
          {enrollment.Course.title}
        </Link>

        {/* Description */}
        <p className="text-muted-foreground mb-4 line-clamp-2 text-sm leading-relaxed">
          {enrollment.Course.smallDescription}
        </p>

        {/* Progress */}
        <CourseProgressClient course={enrollment.Course} />

        {/* CTA Button */}
        <Link
          className={buttonVariants({
            variant: isCompleted ? "outline" : "default",
            className: cn(
              "mt-4 w-full gap-2",
              isCompleted &&
                "border-green-500 text-green-600 hover:bg-green-50",
            ),
          })}
          href={`/dashboard/${enrollment.Course.slug}`}
        >
          {isCompleted ? (
            <>
              <RotateCcw className="size-4" />
              {t("dashboard.review_course") || "مراجعة الكورس"}
            </>
          ) : (
            <>
              <Play className="size-4" />
              {t("dashboard.continue_learning") || "أكمل التعلم"}
            </>
          )}
        </Link>
      </CardContent>
    </Card>
  );
}

export default CourseProgressCard;

export function CourseProgressCardSkeleton() {
  return (
    <Card className="group relative gap-0 overflow-hidden py-0">
      {/* Badge placeholder */}
      <Skeleton className="absolute top-3 right-3 z-10 h-6 w-20 rounded-full" />

      {/* Image placeholder */}
      <Skeleton className="aspect-video h-full w-full" />

      <CardContent className="p-5">
        {/* Title placeholder */}
        <Skeleton className="mb-2 h-6 w-3/4" />

        {/* Description placeholder */}
        <Skeleton className="mb-1 h-4 w-full" />
        <Skeleton className="mb-4 h-4 w-2/3" />

        {/* Progress placeholder */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-12" />
          </div>
          <Skeleton className="h-2 w-full rounded-full" />
        </div>

        {/* Button placeholder */}
        <Skeleton className="mt-4 h-10 w-full rounded-md" />
      </CardContent>
    </Card>
  );
}
