import React from "react";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { PublicCourseType } from "@/app/data/course/get-all-courses";
import Image from "next/image";
import { useConstructUrl } from "@/hooks/use-construct-url";
import Link from "next/link";
import { School, TimerIcon } from "lucide-react";
import { buttonVariants } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
function PublicCourseCard({ course }: { course: PublicCourseType }) {
  const ThumbnailUrl = useConstructUrl(course.fileKey);
  return (
    <Card className="group relative gap-0 py-0">
      <Badge className="absolute top-2 right-2 z-10">{course.level}</Badge>
      <Image
        width={600}
        height={400}
        src={ThumbnailUrl}
        alt="Thumbnail image for course"
        className="aspect-video h-full w-full rounded-t-xl object-cover"
      />
      <CardContent className="p-4">
        <Link
          prefetch={false}
          className="group-hover:text-primary line-clamp-2 text-lg font-medium transition-colors hover:underline"
          href={`/courses/${course.slug}`}
        >
          {course.title}
        </Link>
        <p className="text-muted-foreground mt-2 line-clamp-2 text-sm leading-tight">
          {course.smallDescription}
        </p>
        <div className="mt-4 flex gap-x-5">
          <div className="flex items-center gap-x-2">
            <TimerIcon className="text-primary bg-primary/10 size-6 rounded-md p-1" />
            <p className="text-muted-foreground text-sm">{course.duration}h</p>
          </div>
          <div className="flex items-center gap-x-2">
            <School className="text-primary bg-primary/10 size-6 rounded-md p-1" />
            <p className="text-muted-foreground text-sm">{course.category}</p>
          </div>
        </div>

        <Link
          className={buttonVariants({ className: "mt-4 w-full" })}
          href={`/courses/${course.slug}`}
        >
          Learn More
        </Link>
      </CardContent>
    </Card>
  );
}

export default PublicCourseCard;

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
