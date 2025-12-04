// src/components/lesson/CompleteLessonButton.tsx
"use client";

import React, { useTransition } from "react";
import { Button } from "../ui/button";
import { CheckCircle } from "lucide-react";
import { markLessonCompleted } from "@/actions/lesson.action";
import { toast } from "sonner";
import { useConfetti } from "@/hooks/use-confetti";

interface CompleteLessonButtonProps {
  id: string;
  slug: string;
  isCompleted?: boolean;
}

export default function CompleteLessonButton({
  id,
  slug,
  isCompleted = false,
}: CompleteLessonButtonProps) {
  const [pending, startTransition] = useTransition();
  const { triggerConfetti } = useConfetti();

  const onSubmit = () => {
    startTransition(async () => {
      const result = await markLessonCompleted(id, slug);

      if (!result || result.status === "error") {
        toast.error(result?.message || "Failed to mark lesson as complete");
        return;
      }

      toast.success(result.message || "Lesson completed!");
      triggerConfetti();
    });
  };

  if (isCompleted) {
    return (
      <div className="border-b py-4">
        <Button
          variant="outline"
          disabled
          className="bg-green-500/10 text-green-500 hover:bg-green-500/20"
        >
          <CheckCircle className="mr-2 size-5" />
          Completed
        </Button>
      </div>
    );
  }

  return (
    <div className="border-b py-4">
      <Button
        variant="outline"
        onClick={onSubmit}
        disabled={pending}
        className="hover:bg-green-500/10 text-green-600 hover:text-green-700"
      >
        <CheckCircle className="mr-2 size-5" />
        {pending ? "Saving..." : "Mark as Complete"}
      </Button>
    </div>
  );
}