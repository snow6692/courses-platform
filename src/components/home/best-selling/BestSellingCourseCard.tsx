"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, Clock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useConstructUrl } from "@/hooks/use-construct-url";
import { BestSellingCourseType } from "@/app/data/course/get-best-selling-courses";
import { useLanguage } from "@/providers/LanguageContext";

interface BestSellingCourseCardProps {
  course: BestSellingCourseType;
}

export function BestSellingCourseCard({ course }: BestSellingCourseCardProps) {
  const { t, dir } = useLanguage();
  const imageUrl = useConstructUrl(course.fileKey);

  return (
    <Card className="group hover:border-primary flex flex-col gap-0 overflow-hidden border p-0 transition-all duration-300 hover:shadow-lg">
      {/* Course Image */}
      <div className="relative aspect-video w-full overflow-hidden bg-gray-100">
        <Image
          src={imageUrl}
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
              {course.duration} {t("home.best_selling.hours")}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <span className="text-foreground text-lg font-bold">
            {course.price} {t("home.best_selling.currency")}
          </span>

          <Link href={`/courses/${course.slug}`}>
            <Button className="bg-primary hover:bg-primary/90 shadow-md transition-colors">
              {t("home.best_selling.details")}
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
