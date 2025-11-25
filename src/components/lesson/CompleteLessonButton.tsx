"use client";
import React, { useTransition } from "react";
import { Button } from "../ui/button";
import { CheckCircle } from "lucide-react";
import { markLessonCompleted } from "@/actions/lesson.action";
import { tryCatch } from "@/hooks/try-catch";
import { toast } from "sonner";
import { useConfetti } from "@/hooks/use-confetti";

function CompleteLessonButton({
  id,
  slug,
  lessonProgress,
}: {
  id: string;
  slug: string;
  lessonProgress: { completed: boolean; lessonId: string }[];
}) {
  const [pending, startTransition] = useTransition();
  const { triggerConfetti } = useConfetti();
  const onSubmit = () => {
    //Update Course
    startTransition(async () => {
      const { data: result, error } = await tryCatch(
        markLessonCompleted(id, slug),
      );
      //Failed on client side
      if (error) {
        toast.error("Failed to update course, Try again later");
        return;
      }
      if (result.status === "success") {
        toast.success(result.message);
        triggerConfetti();

        return;
      }
      if (result.status === "error") {
        toast.error(result.message);
        return;
      }
    });
  };
  return (
    <div className="border-b py-4">
      {lessonProgress.length > 0 ? (
        <Button
          variant={"outline"}
          className="bg-green-500/10 text-green-500 hover:text-green-600"
        >
          <CheckCircle className="mr-2 size-4 text-green-500" />
          Completed
        </Button>
      ) : (
        <Button variant={"outline"} onClick={onSubmit} disabled={pending}>
          <CheckCircle className="mr-2 size-4 text-green-500" />
          Mark as complete
        </Button>
      )}
    </div>
  );
}

export default CompleteLessonButton;
