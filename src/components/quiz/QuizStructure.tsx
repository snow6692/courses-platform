"use client";
import {
  deleteQuestion,
  reorderQuestions,
  toggleAnswerCorrect,
} from "@/actions/quiz/question.action";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useState, useTransition } from "react";
import QuestionForm from "../questions/QuestionForm";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { GripVertical, Trash2 } from "lucide-react";
import { Checkbox } from "../ui/checkbox";
import AnswerForm from "../questions/AnswerForm";
import { CSS } from "@dnd-kit/utilities";
import { ConfirmDialog } from "../shared/ConfirmDialog";
import { deleteQuiz } from "@/actions/quiz/quiz.action";
import { toast } from "sonner";
import { tryCatch } from "@/hooks/try-catch";
import { useRouter } from "next/navigation";
import { QuizButton } from "./admin/QuizButton";

// components/quiz/QuizStructure.tsx

export function QuizStructure({
  quiz,
  courseId,
}: {
  quiz: any;
  courseId: string;
}) {
  const [questions, setQuestions] = useState(quiz.questions ?? []);
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor),
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = questions.findIndex((q: any) => q.id === active.id);
    const newIndex = questions.findIndex((q: any) => q.id === over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    const newOrder = arrayMove(questions, oldIndex, newIndex);
    setQuestions(newOrder);

    reorderQuestions(
      quiz.id,
      newOrder.map((q: any, i: number) => ({ id: q.id, position: i + 1 })),
    );
  };

  const handleDeleteQuiz = async () => {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(
        deleteQuiz(quiz.id, courseId),
      );
      if (error) {
        toast.error("An unexpected error occurred, Please try again.");
        return;
      }

      if (result.status === "success") {
        toast.success(result.message);
        router.push(`/admin/courses/${courseId}/edit`);
      } else if (result.status === "error") {
        toast.error(result.message);
      }
    });
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between">
        <h1 className="mb-6 text-3xl font-bold">
          {quiz.title} - Edit Questions
        </h1>
        <div className="flex items-center gap-2">
          <ConfirmDialog
            trigger={
              <Button variant="destructive" size="sm">
                Delete Quiz
              </Button>
            }
            title="Delete Quiz"
            description="Are you sure you want to delete this quiz?"
            confirmLabel="Delete"
            cancelLabel="Cancel"
            onConfirm={handleDeleteQuiz}
          />
          <QuizButton
            quizType="COURSE"
            courseId={courseId}
            existingQuiz={quiz}
          />
        </div>
      </div>

      <QuestionForm quizId={quiz.id} courseId={courseId} />

      {questions.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground text-lg">
            No questions yet. Click "Add Question" to start building your quiz!
          </p>
        </Card>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={questions.map((q: any) => q.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="mt-8 space-y-6">
              {questions.map((question: any) => (
                <SortableQuestion
                  key={question.id}
                  question={question}
                  quizId={quiz.id}
                  courseId={courseId}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}

export function SortableQuestion({
  question,
  quizId,
  courseId,
}: {
  question: any;
  quizId: string;
  courseId: string;
}) {
  const [pending, startTransition] = useTransition();
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: question.id,
    });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  return (
    <Card ref={setNodeRef} style={style} className="p-6">
      <div className="flex items-start gap-4">
        <Button
          variant="ghost"
          {...listeners}
          {...attributes}
          className="cursor-grab"
        >
          <GripVertical />
        </Button>
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-lg font-medium">{question.text}</p>
              {question.imageKey && (
                <img
                  src={`/api/file/${question.imageKey}`}
                  alt=""
                  className="mt-4 max-w-md"
                />
              )}
              {question.explanation && (
                <p className="text-muted-foreground mt-4 text-sm">
                  Explanation: {question.explanation}
                </p>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                if (confirm("Delete question?")) {
                  deleteQuestion(question.id, quizId, courseId);
                }
              }}
            >
              <Trash2 className="size-4 text-red-500" />
            </Button>
          </div>

          <div className="mt-6 space-y-3">
            {question.answers.map((answer: any) => (
              <div key={answer.id} className="flex items-center gap-3">
                <Checkbox
                  checked={answer.isCorrect}
                  disabled={pending}
                  onCheckedChange={(checked) => {
                    startTransition(async () => {
                      await toggleAnswerCorrect(answer.id, checked as boolean);
                    });
                  }}
                />
                <span>{answer.text}</span>
              </div>
            ))}
            <AnswerForm questionId={question.id} />
          </div>
        </div>
      </div>
    </Card>
  );
}
