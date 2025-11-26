"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import CreateQuizDialog from "./CreateQuizDialog";

type Props = {
  quizType: "COURSE" | "CHAPTER" | "LESSON";
  courseId?: string;
  chapterId?: string;
  lessonId?: string;
  label?: string;
};

export function CreateQuizButton({
  quizType,
  courseId,
  chapterId,
  lessonId,
  label,
}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)} variant="outline" size="sm">
        <Plus className="mr-1 size-4" />
        {label || "New Quiz"}
      </Button>

      <CreateQuizDialog
        open={open}
        onOpenChange={setOpen}
        courseId={quizType === "COURSE" ? courseId : null}
        chapterId={quizType === "CHAPTER" ? chapterId : null}
        lessonId={quizType === "LESSON" ? lessonId : null}
        quizType={quizType}
      />
    </>
  );
}
