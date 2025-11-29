"use client";
import {
  deleteQuestion,
  reorderQuestions,
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
import { useState, useTransition, useEffect } from "react";
import QuestionForm from "../../questions/QuestionForm";
import { Card } from "../../ui/card";
import { Button } from "../../ui/button";
import { GripVertical, Pencil, Plus } from "lucide-react";
import AnswerForm from "../../questions/AnswerForm";
import { CSS } from "@dnd-kit/utilities";
import { ConfirmDialog } from "../../shared/ConfirmDialog";
import { deleteQuiz } from "@/actions/quiz/quiz.action";
import { toast } from "sonner";
import { tryCatch } from "@/hooks/try-catch";
import { useRouter } from "next/navigation";
import { QuizButton } from "./QuizButton";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import RenderDescription from "@/components/rich-text-editor/RenderDescription";
import type { AdminGetQuizOfCourse } from "@/app/data/quiz/admin/admin-get-quiz-of-course";
import AnswerItem from "@/components/questions/AnswerItem";
import MemeSelector from "@/components/meme/MemeSelector";
import RemoveMemeFromQuiz from "@/components/meme/RemoveMemeFromQuiz";
import { useConstructUrl } from "@/hooks/use-construct-url";
// components/quiz/QuizStructure.tsx

export function QuizStructure({
  quiz,
  courseId,
  chapterId,
  lessonId,
}: {
  quiz?: AdminGetQuizOfCourse;
  courseId: string;
  chapterId?: string;
  lessonId?: string;
}) {
  // if (!quiz) return notFound();

  const [questions, setQuestions] = useState(quiz!.questions ?? []);
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor),
  );

  // Sync state when quiz prop changes (after router.refresh())
  useEffect(() => {
    setQuestions(quiz!.questions ?? []);
  }, [quiz]);

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = questions.findIndex((q: any) => q.id === active.id);
    const newIndex = questions.findIndex((q: any) => q.id === over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    const newOrder = arrayMove(questions, oldIndex, newIndex);
    setQuestions(newOrder);

    reorderQuestions(
      quiz!.id,
      newOrder.map((q: any, i: number) => ({ id: q.id, position: i + 1 })),
    ).then(() => router.refresh()); // Refresh to get updated data
  };

  const handleDeleteQuiz = async () => {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(
        deleteQuiz(quiz!.id, courseId, chapterId, lessonId),
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
          {quiz!.title} - Edit Questions
        </h1>
        <div className="flex items-center gap-2">
          <MemeSelector quizId={quiz!.id} onSuccess={() => router.refresh()} />
          <ConfirmDialog
            trigger={
              <Button variant="destructive" size="sm" disabled={pending}>
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
            chapterId={chapterId}
            existingQuiz={quiz!}
          />
        </div>
      </div>

      {/* Memes Section */}
      {quiz!.memes && quiz!.memes.length > 0 && (
        <div className="mb-8">
          <h2 className="mb-4 text-xl font-semibold">Quiz Memes</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            {quiz!.memes.map((quizMeme) => (
              <Card key={quizMeme.id} className="relative overflow-hidden">
                <div className="bg-muted flex aspect-video items-center justify-center">
                  {quizMeme.meme.type === "VIDEO" ? (
                    <video
                      src={useConstructUrl(quizMeme.meme.fileKey)}
                      className="h-full w-full object-cover"
                      controls
                    />
                  ) : (
                    <img
                      src={useConstructUrl(quizMeme.meme.fileKey)}
                      alt="Meme"
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>
                <div className="absolute top-2 right-2">
                  <RemoveMemeFromQuiz
                    memeId={quizMeme.meme.id}
                    quizId={quiz!.id}
                  />
                </div>
                <div className="p-2">
                  <span className="bg-secondary rounded px-2 py-1 text-xs font-medium">
                    {quizMeme.meme.trigger}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="default">
            <Plus className="size-4" />
            Add Question
          </Button>
        </DialogTrigger>
        <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
          <DialogTitle>Edit Question</DialogTitle>
          <QuestionForm quizId={quiz!.id} courseId={courseId} />
        </DialogContent>
      </Dialog>

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
            items={questions.map((q) => q.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="mt-8 space-y-6">
              {questions.map((question) => (
                <SortableQuestion
                  key={question.id}
                  question={question}
                  quizId={quiz!.id}
                  courseId={courseId}
                  chapterId={chapterId}
                  lessonId={lessonId}
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
  chapterId,
  lessonId,
}: {
  question: AdminGetQuizOfCourse["questions"][number];
  quizId: string;
  courseId: string;
  chapterId?: string;
  lessonId?: string;
}) {
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
        deleteQuestion(question.id, quizId, courseId),
      );

      if (error) {
        toast.error("An unexpected error occurred, Please try again.");
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
              <RenderDescription json={question.text} />
              {question.imageKey && (
                <img
                  src={useConstructUrl(question.imageKey)}
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
            <div className="flex items-center gap-4">
              <ConfirmDialog
                trigger={
                  <Button disabled={pending} variant="destructive" size="sm">
                    Delete Question
                  </Button>
                }
                title="Delete Question"
                description="Are you sure you want to delete this Question?"
                confirmLabel="Delete"
                cancelLabel="Cancel"
                onConfirm={handleDeleteQuestion}
              />

              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    Edit question
                    <Pencil className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
                  <DialogTitle>Edit Question</DialogTitle>
                  <QuestionForm
                    quizId={quizId}
                    courseId={courseId}
                    question={question}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {/* Answers List with Toggle */}
            <div className="space-y-3">
              {question.answers.length === 0 ? (
                <p className="text-muted-foreground text-sm italic">
                  No answers yet. Add one below.
                </p>
              ) : (
                question.answers.map(
                  (
                    answer: AdminGetQuizOfCourse["questions"][number]["answers"][number],
                  ) => (
                    <AnswerItem
                      key={answer.id}
                      answer={answer}
                      questionId={question.id}
                      courseId={courseId}
                      chapterId={chapterId}
                    />
                  ),
                )
              )}
            </div>

            {/* Add Answer Form */}
            <AnswerForm questionId={question.id} courseId={courseId} />
          </div>
        </div>
      </div>
    </Card>
  );
}
