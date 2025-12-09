"use client";

import React from "react";
import { Card, CardContent } from "../ui/card";
import { PublicCourseType } from "@/app/data/course/get-all-courses";
import Image from "next/image";
import { useConstructUrl } from "@/hooks/use-construct-url";
import Link from "next/link";
import { Clock, User } from "lucide-react";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import { useLanguage } from "@/providers/LanguageContext";

function PublicCourseCard({ course }: { course: PublicCourseType }) {
  const ThumbnailUrl = useConstructUrl(course.fileKey);
  const { t } = useLanguage();

  return (
    <Card className="group hover:border-primary flex flex-col gap-0 overflow-hidden border p-0 transition-all duration-300 hover:shadow-lg">
      {/* Course Image */}
      <div className="relative aspect-video w-full overflow-hidden bg-gray-100">
        <Image
          src={ThumbnailUrl}
          alt={course.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>

      <CardContent className="flex flex-1 flex-col justify-between gap-4 p-5">
        <div className="space-y-2">
          {/* Title */}
          <h3 className="text-foreground line-clamp-1 text-xl font-bold">
            {course.title}
          </h3>

          {/* Small Description */}
          <p className="text-muted-foreground line-clamp-2 text-sm font-medium">
            {course.smallDescription}
          </p>

          {/* Instructor Name */}
          <p className="text-muted-foreground text-sm font-medium">
            {course.user?.name}
          </p>
        </div>

        <div className="bg-border/50 my-2 h-px w-full" />

        {/* Meta Stats Row */}
        <div className="text-muted-foreground flex items-center justify-start gap-4 text-xs font-semibold">
          {/* Students */}
          <div className="flex items-center gap-1">
            <User className="h-4 w-4" />
            <span>{course._count.enrollments}</span>
          </div>

          {/* Duration */}
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>
              {course.duration} {t("courses.card.hours")}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <span className="text-foreground text-lg font-bold">
            {course.price} {t("courses.card.currency")}
          </span>

          <Link href={`/courses/${course.slug}`}>
            <Button className="bg-primary hover:bg-primary/90 shadow-md transition-colors">
              {t("courses.card.details")}
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export default PublicCourseCard;

export function PublicCourseCardSkeleton() {
  return (
    <Card className="group flex flex-col gap-0 overflow-hidden border p-0">
      {/* Image placeholder */}
      <Skeleton className="aspect-video h-full w-full animate-pulse" />
      <CardContent className="flex flex-1 flex-col justify-between gap-4 p-5">
        <div className="space-y-2">
          {/* Title placeholder */}
          <Skeleton className="h-6 w-3/4 animate-pulse" />
          {/* Description placeholders */}
          <Skeleton className="h-4 w-full animate-pulse" />
          <Skeleton className="h-4 w-2/3 animate-pulse" />
          {/* Instructor placeholder */}
          <Skeleton className="h-4 w-1/2 animate-pulse" />
        </div>

        <div className="bg-border/50 my-2 h-px w-full" />

        {/* Meta stats placeholders */}
        <div className="flex items-center justify-start gap-4">
          <div className="flex items-center gap-1">
            <Skeleton className="h-4 w-4 animate-pulse rounded" />
            <Skeleton className="h-4 w-8 animate-pulse" />
          </div>
          <div className="flex items-center gap-1">
            <Skeleton className="h-4 w-4 animate-pulse rounded" />
            <Skeleton className="h-4 w-12 animate-pulse" />
          </div>
        </div>

        {/* Price and button placeholders */}
        <div className="flex items-center justify-between pt-2">
          <Skeleton className="h-6 w-20 animate-pulse" />
          <Skeleton className="h-10 w-28 animate-pulse rounded-md" />
        </div>
      </CardContent>
    </Card>
  );
}
