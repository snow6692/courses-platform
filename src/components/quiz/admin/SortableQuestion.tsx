// components/quiz/admin/SortableQuestion.tsx

"use client";

import { useTransition } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Plus, Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";

import QuestionForm from "../../questions/QuestionForm";
import AnswerItem from "@/components/questions/AnswerItem";
import AnswerForm from "@/components/questions/AnswerForm";
import RenderDescription from "@/components/rich-text-editor/RenderDescription";
import { useConstructUrl } from "@/hooks/use-construct-url";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/providers/LanguageContext";

import { tryCatch } from "@/hooks/try-catch";
import { deleteQuestion } from "@/actions/quiz/question.action";

import type { AdminGetQuizOfCourse } from "@/app/data/quiz/admin/admin-get-quiz-of-course";

interface SortableQuestionProps {
  question: AdminGetQuizOfCourse["sections"][number]["questions"][number];
  quizId: string;
  courseId: string;
  chapterId?: string;
  lessonId?: string;
  sectionId: string;
}

export function SortableQuestion({
  question,
  quizId,
  courseId,
  chapterId,
  lessonId,
  sectionId,
}: SortableQuestionProps) {
  const { t } = useLanguage();
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: question.id,
    });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleDeleteQuestion = async () => {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(
        deleteQuestion(question.id, quizId, courseId, sectionId),
      );

      if (error) {
        toast.error(t("admin.quiz.error_occurred"));
        return;
      }

      if (result.status === "success") {
        toast.success(result.message);
        router.refresh();
      } else if (result.status === "error") {
        toast.error(result.message);
      }
    });
  };

  return (
    <Card ref={setNodeRef} style={style} className="p-3 sm:p-6">
      <div className="flex items-start gap-2 sm:gap-4">
        <Button
          variant="ghost"
          size="icon"
          {...listeners}
          {...attributes}
          className="h-8 w-8 shrink-0 cursor-grab sm:h-10 sm:w-10"
        >
          <GripVertical className="h-4 w-4" />
        </Button>
        <div className="min-w-0 flex-1">
          {/* Question Content and Actions */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            {/* Question Text */}
            <div className="min-w-0 flex-1">
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <RenderDescription json={question.text} />
              </div>
              {question.imageKey && (
                <img
                  src={useConstructUrl(question.imageKey)}
                  alt=""
                  className="mt-4 max-w-full rounded-lg sm:max-w-md"
                />
              )}
              {question.explanation && (
                <div className="text-muted-foreground mt-4 text-xs sm:text-sm">
                  <span className="font-medium">
                    {t("admin.quiz.explanation")}:{" "}
                  </span>
                  {(() => {
                    try {
                      const parsed = JSON.parse(question.explanation);
                      return <RenderDescription json={parsed} />;
                    } catch {
                      return question.explanation;
                    }
                  })()}
                </div>
              )}
            </div>

            {/* Question Actions */}
            <div className="flex shrink-0 flex-wrap items-center gap-2">
              <ConfirmDialog
                trigger={
                  <Button
                    disabled={pending}
                    variant="destructive"
                    size="sm"
                    className="h-8 bg-red-600 text-xs hover:bg-red-700 sm:h-9 sm:text-sm"
                  >
                    <Trash2 className="me-1 h-3 w-3" />
                    {t("admin.quiz.delete")}
                  </Button>
                }
                title={t("admin.quiz.delete_question")}
                description={t("admin.quiz.delete_question_confirm")}
                confirmLabel={t("admin.quiz.delete")}
                cancelLabel={t("admin.quiz.cancel")}
                confirmVariant="destructive"
                onConfirm={handleDeleteQuestion}
              />

              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 gap-1 text-xs sm:h-9 sm:text-sm"
                  >
                    <Pencil className="h-3 w-3 sm:h-4 sm:w-4" />
                    {t("admin.quiz.edit")}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
                  <DialogTitle>{t("admin.quiz.edit_question")}</DialogTitle>
                  <QuestionForm
                    quizId={quizId}
                    courseId={courseId}
                    question={question}
                    sectionId={question.sectionId}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {/* Answers List */}
            <div className="space-y-3">
              {question.answers.length === 0 ? (
                <p className="text-muted-foreground text-sm italic">
                  {t("admin.quiz.no_answers")}
                </p>
              ) : (
                question.answers.map((answer) => (
                  <AnswerItem
                    key={answer.id}
                    answer={answer}
                    questionId={question.id}
                    courseId={courseId}
                    chapterId={chapterId}
                  />
                ))
              )}
            </div>

            {/* Add Answer Form */}
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-center gap-1 border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800"
                >
                  <Plus className="size-4" />
                  {t("admin.quiz.new_answer")}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogTitle>{t("admin.quiz.create_answer")}</DialogTitle>
                <AnswerForm questionId={question.id} courseId={courseId} />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </Card>
  );
}
