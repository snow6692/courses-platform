"use client";

import { Button } from "@/components/ui/button";
import { Pencil, Plus } from "lucide-react";
import { useState } from "react";
import CreateQuizDialog from "./CreateQuizDialog";
import { AdminGetQuizOfCourse } from "@/app/data/quiz/admin/admin-get-quiz-of-course";

type Props = {
  quizType: "COURSE" | "CHAPTER" | "LESSON";
  courseId?: string;
  chapterId?: string;
  lessonId?: string;
  label?: string;
  existingQuiz?: Partial<AdminGetQuizOfCourse>;
};

export function QuizButton({
  quizType,
  courseId,
  chapterId,
  lessonId,
  label,
  existingQuiz,
}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen(true);
        }}
        variant="outline"
        size="sm"
      >
        {existingQuiz ? (
          <Pencil className="mr-1 size-4" />
        ) : (
          <Plus className="mr-1 size-4" />
        )}
        {label || existingQuiz ? "Update Quiz" : "Create Quiz"}
      </Button>

      <CreateQuizDialog
        open={open}
        onOpenChange={setOpen}
        courseId={courseId}
        chapterId={chapterId}
        lessonId={lessonId}
        quizType={quizType}
        existingQuiz={existingQuiz}
      />
    </>
  );
}
