// components/quiz/admin/QuizStructure.tsx

"use client";

import { useState, useEffect } from "react";
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
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";

import SectionForm from "./SectionForm";
import { SortableSection } from "./SortableSection";
import { QuizHeader } from "./QuizHeader";
import { QuizMemeGrid } from "./QuizMemeGrid";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/providers/LanguageContext";

import {
  reorderSections,
  reorderQuestionsInSection,
} from "@/actions/quiz/section.action";

import type { AdminGetQuizOfCourse } from "@/app/data/quiz/admin/admin-get-quiz-of-course";

interface QuizStructureProps {
  quiz: AdminGetQuizOfCourse;
  courseId: string;
  chapterId?: string;
  lessonId?: string;
}

export default function QuizStructure({
  quiz: initialQuiz,
  courseId,
  chapterId,
  lessonId,
}: QuizStructureProps) {
  const { t } = useLanguage();
  const router = useRouter();

  const [sections, setSections] = useState(
    initialQuiz.sections.map((s) => ({ ...s, isOpen: true })),
  );

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor),
  );

  // Sync sections with initial quiz when it changes
  useEffect(() => {
    setSections((prev) =>
      initialQuiz.sections.map((s) => ({
        ...s,
        isOpen: prev.find((p) => p.id === s.id)?.isOpen ?? true,
      })),
    );
  }, [initialQuiz.sections]);

  const toggleSection = (sectionId: string) => {
    setSections((prev) =>
      prev.map((s) => (s.id === sectionId ? { ...s, isOpen: !s.isOpen } : s)),
    );
  };

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
    <div className="space-y-6 p-4 sm:space-y-8 sm:p-8">
      {/* Quiz Header */}
      <QuizHeader
        quizId={initialQuiz.id}
        quizTitle={initialQuiz.title}
        courseId={courseId}
        onMemeAdded={() => router.refresh()}
      />

      {/* Memes Grid */}
      <QuizMemeGrid memes={initialQuiz.memes} quizId={initialQuiz.id} />

      {/* Add Section Button */}
      <Dialog>
        <DialogTrigger asChild>
          <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700">
            <Plus className="me-2 h-4 w-4" />
            {t("admin.quiz.add_section")}
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>{t("admin.quiz.add_section")}</DialogTitle>
          <SectionForm quizId={initialQuiz.id} courseId={courseId} />
        </DialogContent>
      </Dialog>

      {/* Sections List */}
      <DndContext
        id="dnd-sections"
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
          {sections.length === 0 && (
            <Card className="p-16 text-center">
              <p className="text-muted-foreground">
                {t("admin.quiz.no_sections")}
              </p>
            </Card>
          )}
          {sections.map((section) => (
            <SortableSection
              key={section.id}
              section={section}
              quizId={initialQuiz.id}
              courseId={courseId}
              lessonId={lessonId}
              onReorderQuestions={handleReorderQuestions}
              isOpen={section.isOpen}
              onToggle={() => toggleSection(section.id)}
            />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
}

// Re-export for backward compatibility
export { SortableQuestion } from "./SortableQuestion";
