import React, { useState, useTransition } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";
import { Trash2 } from "lucide-react";
import { AlertDescription } from "../ui/alert";
import { tryCatch } from "@/hooks/try-catch";
import { deleteLesson } from "@/actions/lesson.action";
import { toast } from "sonner";

function DeleteLesson({
  courseId,
  lessonId,
  chapterId,
}: {
  lessonId: string;
  courseId: string;
  chapterId: string;
}) {
  const [open, setOpen] = useState(false);

  const [pending, startTransition] = useTransition();
  async function onSubmit() {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(
        deleteLesson({ chapterId, courseId, lessonId }),
      );
      if (error) {
        toast.error("An unexpected error occurred, Please try again.");
        return;
      }
      if (result.status === "success") {
        toast.success(result.message);

        setOpen(false);
      } else if (result.status === "error") {
        toast.error(result.message);
      }
    });
  }
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant={"ghost"} size={"icon"}>
          <Trash2 className="size-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDescription>
            This action cannot be undone. This will delete this lesson.
          </AlertDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={pending}>Cancel</AlertDialogCancel>
          <Button
            onClick={onSubmit}
            disabled={pending}
            className="cursor-pointer bg-red-500 text-white hover:bg-red-600"
          >
            {pending ? "Deleting..." : "Delete"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default DeleteLesson;
