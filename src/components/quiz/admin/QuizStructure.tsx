// components/quiz/admin/QuizStructure.tsx

"use client";

import { useState, useTransition } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
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

import SectionForm from "./SectionForm";
import QuestionForm from "../../questions/QuestionForm";
import AnswerItem from "@/components/questions/AnswerItem";
import MemeSelector from "@/components/meme/MemeSelector";
import RemoveMemeFromQuiz from "@/components/meme/RemoveMemeFromQuiz";
import RenderDescription from "@/components/rich-text-editor/RenderDescription";
import { useConstructUrl } from "@/hooks/use-construct-url";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { deleteQuiz } from "@/actions/quiz/quiz.action";
import { deleteSection } from "@/actions/quiz/section.action";
import {
  reorderSections,
  reorderQuestionsInSection,
} from "@/actions/quiz/section.action";

import type { AdminGetQuizOfCourse } from "@/app/data/quiz/admin/admin-get-quiz-of-course";
import { tryCatch } from "@/hooks/try-catch";
import { deleteQuestion } from "@/actions/quiz/question.action";
import AnswerForm from "@/components/questions/AnswerForm";

export default function QuizStructure({
  quiz: initialQuiz,
  courseId,
}: {
  quiz: AdminGetQuizOfCourse;
  courseId: string;
}) {
  const [sections, setSections] = useState(initialQuiz.sections);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor),
  );

  const handleReorderSections = async (activeId: string, overId: string) => {
    const oldIndex = sections.findIndex((s) => s.id === activeId);
    const newIndex = sections.findIndex((s) => s.id === overId);
    const newOrder = arrayMove(sections, oldIndex, newIndex);
    setSections(newOrder);
    await reorderSections(
      initialQuiz.id,
      newOrder.map((s, i) => ({ id: s.id, position: i + 1 })),
    );
    router.refresh();
  };

  const handleReorderQuestions = async (
    sectionId: string,
    activeId: string,
    overId: string,
  ) => {
    setSections((prev) =>
      prev.map((section) => {
        if (section.id !== sectionId) return section;
        const questions = section.questions;
        const oldIndex = questions.findIndex((q) => q.id === activeId);
        const newIndex = questions.findIndex((q) => q.id === overId);
        const newQuestions = arrayMove(questions, oldIndex, newIndex);
        reorderQuestionsInSection(
          sectionId,
          newQuestions.map((q, i) => ({ id: q.id, position: i + 1 })),
          courseId,
        );
        return { ...section, questions: newQuestions };
      }),
    );
    router.refresh();
  };

  return (
    <div className="space-y-8 p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{initialQuiz.title}</h1>
        <div className="flex gap-3">
          <MemeSelector
            quizId={initialQuiz.id}
            onSuccess={() => router.refresh()}
          />
          <ConfirmDialog
            trigger={<Button variant="destructive"> Delete the quiz</Button>}
            title="Delete the quiz"
            description="Are you sure you want to delete this quiz?"
            confirmVariant="destructive"
            confirmLabel=""
            onConfirm={() =>
              startTransition(async () => {
                const result = await deleteQuiz(initialQuiz.id, courseId);
                if (result.status === "success") {
                  toast.success("Quiz deleted successfully");
                  router.push(`/admin/courses/${courseId}/edit`);
                } else {
                  toast.error(result.message);
                }
              })
            }
          />
        </div>
      </div>

      {/* Memes */}
      {initialQuiz.memes.length > 0 && (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {initialQuiz.memes.map(({ meme }) => (
            <Card key={meme.id} className="relative overflow-hidden">
              {meme.type === "VIDEO" ? (
                <video
                  src={useConstructUrl(meme.fileKey)}
                  controls
                  className="aspect-video w-full"
                />
              ) : (
                <img
                  src={useConstructUrl(meme.fileKey)}
                  alt="meme"
                  className="aspect-video w-full object-cover"
                />
              )}
              <RemoveMemeFromQuiz memeId={meme.id} quizId={initialQuiz.id} />
              <div className="p-2 text-xs font-medium">{meme.trigger}</div>
            </Card>
          ))}
        </div>
      )}

      {/* Add Section Button */}
      <Dialog>
        <DialogTrigger asChild>
          <Button size="lg">
            <Plus className="ml-2" /> Add Section
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Add Section</DialogTitle>
          <SectionForm quizId={initialQuiz.id} courseId={courseId} />
        </DialogContent>
      </Dialog>

      {/* Sections List */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={(e) => {
          const { active, over } = e;
          if (over)
            handleReorderSections(active.id as string, over.id as string);
        }}
      >
        <SortableContext
          items={sections.map((s) => s.id)}
          strategy={verticalListSortingStrategy}
        >
          {sections.map((section) => (
            <SortableSection
              key={section.id}
              section={section}
              quizId={initialQuiz.id}
              courseId={courseId}
              onReorderQuestions={handleReorderQuestions}
            />
          ))}
        </SortableContext>
      </DndContext>

      {sections.length === 0 && (
        <Card className="p-16 text-center">
          <p className="text-muted-foreground">
            No sections found. Add a section to start building the quiz!
          </p>
        </Card>
      )}
    </div>
  );
}

function SortableSection({
  section,
  quizId,
  courseId,
  onReorderQuestions,
}: any) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor),
  );
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: section.id });

  return (
    <Card
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className="p-6"
    >
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            {...attributes}
            {...listeners}
            variant="ghost"
            size="icon"
            className="cursor-grab"
          >
            <GripVertical />
          </Button>
          <div>
            <h3 className="text-2xl font-bold">{section.title}</h3>
            <p className="text-muted-foreground text-sm">
              {section.timeLimit
                ? `${Math.floor(section.timeLimit / 60)} دقيقة`
                : "بدون وقت محدد"}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus /> New Question
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
              <QuestionForm
                quizId={quizId}
                courseId={courseId}
                sectionId={section.id}
              />
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon">
                <Pencil className="size-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogTitle>Edit Section</DialogTitle>
              <SectionForm
                quizId={quizId}
                courseId={courseId}
                section={section}
              />
            </DialogContent>
          </Dialog>

          <ConfirmDialog
            title="Delete Sections"
            description="Are you sure you want to delete this section"
            confirmLabel="Delete"
            trigger={
              <Button variant="ghost" size="icon" className="text-red-600">
                <Trash2 />
              </Button>
            }
            onConfirm={() =>
              deleteSection(section.id, courseId).then(() => location.reload())
            }
          />
        </div>
      </div>

      {/* Questions */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={(e) => {
          const { active, over } = e;
          if (over) onReorderQuestions(section.id, active.id, over.id);
        }}
      >
        <SortableContext
          items={section.questions.map((q: any) => q.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-4">
            {section.questions.map((question: any) => (
              <SortableQuestion
                key={question.id}
                question={question}
                quizId={quizId}
                courseId={courseId}
                sectionId={section.id}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </Card>
  );
}

export function SortableQuestion({
  question,
  quizId,
  courseId,
  chapterId,
  lessonId,
  sectionId,
}: {
  question: AdminGetQuizOfCourse["sections"][number]["questions"][number];
  quizId: string;
  courseId: string;
  chapterId?: string;
  lessonId?: string;
  sectionId: string;
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
        deleteQuestion(question.id, quizId, courseId, sectionId),
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
                    sectionId={question.sectionId}
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
                    answer: AdminGetQuizOfCourse["sections"][number]["questions"][number]["answers"][number],
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
