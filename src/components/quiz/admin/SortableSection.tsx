// components/quiz/admin/SortableSection.tsx

"use client";

import { useState } from "react";
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
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  GripVertical,
  Plus,
  Pencil,
  Trash2,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";

import SectionForm from "./SectionForm";
import QuestionForm from "../../questions/QuestionForm";
import { SortableQuestion } from "./SortableQuestion";
import { useLanguage } from "@/providers/LanguageContext";
import { deleteSection } from "@/actions/quiz/section.action";

import type { AdminGetQuizOfCourse } from "@/app/data/quiz/admin/admin-get-quiz-of-course";

interface SortableSectionProps {
  section: AdminGetQuizOfCourse["sections"][number] & { isOpen: boolean };
  quizId: string;
  courseId: string;
  lessonId?: string;
  onReorderQuestions: (
    sectionId: string,
    activeId: string,
    overId: string,
  ) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export function SortableSection({
  section,
  quizId,
  courseId,
  lessonId,
  onReorderQuestions,
  isOpen,
  onToggle,
}: SortableSectionProps) {
  const { t } = useLanguage();
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
      className="p-3 sm:p-6"
    >
      <Collapsible open={isOpen} onOpenChange={onToggle}>
        <div className="mb-4 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
          {/* Section Info */}
          <div className="flex items-center gap-2 sm:gap-4">
            <Button
              {...attributes}
              {...listeners}
              variant="ghost"
              size="icon"
              className="h-8 w-8 cursor-grab sm:h-10 sm:w-10"
            >
              <GripVertical className="h-4 w-4" />
            </Button>
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 sm:h-10 sm:w-10"
              >
                {isOpen ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Button>
            </CollapsibleTrigger>
            <div className="min-w-0 flex-1">
              <h3 className="truncate text-base font-bold sm:text-2xl">
                {section.title}
              </h3>
              <p className="text-muted-foreground text-xs sm:text-sm">
                {section.timeLimit
                  ? `${Math.floor(section.timeLimit / 60)} ${t("admin.quiz.minutes")}`
                  : t("admin.quiz.no_time_limit")}
              </p>
            </div>
          </div>

          {/* Section Actions */}
          <div className="flex flex-wrap items-center gap-1 sm:gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  size="sm"
                  className="h-8 gap-1 bg-emerald-600 text-xs hover:bg-emerald-700 sm:h-9 sm:text-sm"
                >
                  <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">
                    {t("admin.quiz.new_question")}
                  </span>
                  <span className="sm:hidden">{t("admin.quiz.add")}</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
                <DialogTitle>{t("admin.quiz.new_question")}</DialogTitle>
                <QuestionForm
                  quizId={quizId}
                  courseId={courseId}
                  sectionId={section.id}
                />
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="icon" className="h-8 w-8">
                  <Pencil className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogTitle>{t("admin.quiz.edit_section")}</DialogTitle>
                <SectionForm
                  quizId={quizId}
                  courseId={courseId}
                  section={section}
                />
              </DialogContent>
            </Dialog>

            <ConfirmDialog
              title={t("admin.quiz.delete_section")}
              description={t("admin.quiz.delete_section_confirm")}
              confirmLabel={t("admin.quiz.delete")}
              cancelLabel={t("admin.quiz.cancel")}
              confirmVariant="destructive"
              trigger={
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-red-600 hover:bg-red-50 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              }
              onConfirm={() =>
                deleteSection(section.id, courseId).then(() =>
                  location.reload(),
                )
              }
            />
          </div>
        </div>

        {/* Questions */}
        <CollapsibleContent>
          <DndContext
            id={`dnd-questions-${section.id}`}
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={(e) => {
              const { active, over } = e;
              if (over)
                onReorderQuestions(
                  section.id,
                  active.id as string,
                  over.id as string,
                );
            }}
          >
            <SortableContext
              items={section.questions.map((q) => q.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-4">
                {section.questions.map((question) => (
                  <SortableQuestion
                    key={question.id}
                    question={question}
                    quizId={quizId}
                    courseId={courseId}
                    lessonId={lessonId}
                    sectionId={section.id}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
