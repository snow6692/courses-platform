"use client";

import { AdminCourseType } from "@/app/data/admin/admin-get-courses";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useConstructUrl } from "@/hooks/use-construct-url";
import {
  ArrowRight,
  Eye,
  Link2,
  MoreVertical,
  Pencil,
  School,
  TimerIcon,
  Trash,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

function AdminCourseCard({ course }: { course: AdminCourseType }) {
  return (
    <Card className="group relative gap-0 py-0">
      {/* absolute  drop down */}
      <div className="absolute top-2 right-2 z-10">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"secondary"} size={"icon"}>
              <MoreVertical className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem asChild className="cursor-pointer">
              <Link href={`/admin/courses/${course.id}/edit`}>
                <Pencil className="text-primary mr-2 size-4" />
                <span className="text-primary">Edit Course</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="cursor-pointer">
              <Link href={`/courses/${course.slug}`}>
                <Eye className="mr-2 size-4" />
                Preview Course
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild className="cursor-pointer">
              <Link href={`/admin/courses/${course.id}/delete`}>
                <div className="flex cursor-pointer items-center gap-x-2">
                  <Trash className="text-destructive mr-2 size-4" />
                  <span className="text-destructive">Delete Course</span>
                </div>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Image
        src={useConstructUrl(course.fileKey)}
        alt={course.title}
        width={600}
        height={400}
        className="aspect-video h-full w-full rounded-t-lg object-cover"
      />
      <CardContent className="p-4">
        <Link
          href={`/admin/courses/${course.id}/edit`}
          className="group-hover:text-primary line-clamp-2 text-lg font-medium transition-colors hover:underline"
        >
          {course.title}
        </Link>
        <p className="text-muted-foreground mt-2 line-clamp-2 text-sm leading-tight">
          {course.smallDescription}
        </p>
        <div className="mt-4 flex items-center gap-x-5">
          <div className="flex items-center gap-x-2">
            <TimerIcon className="text-primary bg-primary/10 size-6 rounded-md p-1" />
            <p className="text-muted-foreground text-sm">{course.duration}h</p>
          </div>
          <div className="flex items-center gap-x-2">
            <School className="text-primary bg-primary/10 size-6 rounded-md p-1" />
            <p className="text-muted-foreground text-sm">{course.level}</p>
          </div>
        </div>
        <p>{course.price}</p>
        <p>{course.status}</p>
        <Link
          className={buttonVariants({ className: "mt-4 w-full" })}
          href={`/admin/courses/${course.id}/edit`}
        >
          Edit course <ArrowRight className="size-4" />
        </Link>
      </CardContent>
    </Card>
  );
}

export default AdminCourseCard;

//https://courses.fly.storage.tigris.dev/
