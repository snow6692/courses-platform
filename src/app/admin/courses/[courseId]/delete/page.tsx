"use client";
import { deleteCourse } from "@/actions/course.action";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { tryCatch } from "@/hooks/try-catch";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

function DeleteCoursePage() {
  const [pending, startTransition] = useTransition();
  const [name, setName] = useState("");
  const router = useRouter();
  const { courseId } = useParams<{ courseId: string }>();
  const onSubmit = () => {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(deleteCourse(courseId));
      //Failed on client side
      if (error) {
        toast.error("Failed to create course, Try again later");
        return;
      }

      // Server side status check
      if (result.status === "success") {
        toast.success(result.message);
        router.push("/admin/courses");

        return;
      } else if (result.status === "error") {
        toast.error(result.message);
        return;
      }

      //Success
      toast.success("Course created successfully");
    });
  };
  return (
    <div className="mx-auto w-full max-w-xl">
      <Card className="mt-32">
        <CardHeader>
          <CardTitle>Are you sure you want to delete This course?</CardTitle>
          <CardDescription>
            This action cannot be undone. This will delete the course with its
            own chapters. To confirm please enter below "confirm"
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 space-x-3">
          <Input value={name} onChange={(e) => setName(e.target.value)} />

          <div className="flex justify-between">
            <Link
              className={buttonVariants({
                variant: "outline",
                className: "cursor-pointer",
              })}
              href={"/admin/courses"}
            >
              Cancel
            </Link>
            <Button
              onClick={onSubmit}
              disabled={pending || name !== "confirm"}
              className="cursor-pointer bg-red-500 hover:bg-red-600"
            >
              {pending ? "Delete..." : "Deleting"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default DeleteCoursePage;
