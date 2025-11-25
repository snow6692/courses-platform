import React from "react";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import Image from "next/image";
import { useConstructUrl } from "@/hooks/use-construct-url";
import Link from "next/link";
import { buttonVariants } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import { EnrolledCourseType } from "@/app/data/user/get-enrolled-courses";
import { CourseProgressClient } from "./CourseProgressClient";
function CourseProgressCard({
  course: enrollment,
}: {
  course: EnrolledCourseType;
}) {
  const ThumbnailUrl = useConstructUrl(enrollment.Course.fileKey);

  return (
    <Card className="group relative gap-0 py-0">
      <Badge className="absolute top-2 right-2 z-10">
        {enrollment.Course.level}
      </Badge>
      <Image
        width={600}
        height={400}
        src={ThumbnailUrl}
        alt="Thumbnail"
        className="aspect-video h-full w-full rounded-t-xl object-cover"
      />
      <CardContent className="p-4">
        <Link
          prefetch={false}
          href={`/dashboard/${enrollment.Course.slug}`}
          className="group-hover:text-primary line-clamp-2 text-lg font-medium transition-colors hover:underline"
        >
          {enrollment.Course.title}
        </Link>
        <p className="text-muted-foreground mt-2 mb-5 line-clamp-2 text-sm leading-tight">
          {enrollment.Course.smallDescription}
        </p>

       
        <CourseProgressClient course={enrollment.Course} />

        <Link
          className={buttonVariants({ className: "mt-4 w-full" })}
          href={`/dashboard/${enrollment.Course.slug}`}
        >
          Continue Learning
        </Link>
      </CardContent>
    </Card>
  );
}

export default CourseProgressCard;

export function PublicCourseCardSkeleton() {
  return (
    <Card className="group relative gap-0 py-0">
      {/* Badge placeholder */}
      <Skeleton className="absolute top-2 right-2 z-10 h-6 w-16 rounded-md" />
      {/* Image placeholder */}
      <Skeleton className="aspect-video h-full w-full animate-pulse rounded-t-xl" />
      <CardContent className="p-4">
        {/* Title placeholder */}
        <Skeleton className="mb-2 h-6 w-3/4 animate-pulse" />
        {/* Description placeholder */}
        <Skeleton className="mb-4 h-4 w-full animate-pulse" />
        <Skeleton className="mb-4 h-4 w-2/3 animate-pulse" />
        {/* Duration and Category placeholders */}
        <div className="mt-4 flex gap-x-5">
          <div className="flex items-center gap-x-2">
            <Skeleton className="h-6 w-6 animate-pulse rounded-md" />
            <Skeleton className="h-4 w-12 animate-pulse" />
          </div>
          <div className="flex items-center gap-x-2">
            <Skeleton className="h-6 w-6 animate-pulse rounded-md" />
            <Skeleton className="h-4 w-16 animate-pulse" />
          </div>
        </div>
        {/* Button placeholder */}
        <Skeleton className="mt-4 h-10 w-full animate-pulse rounded-md" />
      </CardContent>
    </Card>
  );
}
