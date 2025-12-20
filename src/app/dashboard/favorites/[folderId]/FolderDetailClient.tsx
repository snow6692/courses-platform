"use client";

import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import RenderDescription from "@/components/rich-text-editor/RenderDescription";
import { useConstructUrl } from "@/hooks/use-construct-url";
import { ToggleFavoriteButton } from "@/components/quiz/ToggleFavoriteButton";
import QuizPlayer from "@/components/quiz/QuizPlayer";
import { QuizForStudent } from "@/app/data/quiz/get-quiz";
import { ArrowLeft, Play, Folder } from "lucide-react";
import { FavoritesQuizSkeleton } from "@/components/quiz/QuizSkeletons";
import { useLanguage } from "@/providers/LanguageContext";
import Link from "next/link";

interface Question {
  id: string;
  text: string;
  imageKey: string | null;
  answers: {
    id: string;
    text: string;
    imageKey: string | null;
    isCorrect: boolean;
  }[];
}

interface FolderDetailClientProps {
  folder: {
    id: string;
    name: string;
    description: string | null;
    color: string;
    questions: Question[];
  };
  startInQuizMode?: boolean;
}

const getQuizStorageKey = (quizId: string) => `quiz_state_${quizId}`;
const getQuizResultKey = (quizId: string) => `quiz_result_${quizId}`;

export default function FolderDetailClient({
  folder,
  startInQuizMode = false,
}: FolderDetailClientProps) {
  const { t } = useLanguage();
  const [isQuizMode, setIsQuizMode] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [questions] = useState(folder.questions);

  const FOLDER_QUIZ_ID = `folder-quiz-${folder.id}`;

  // Check localStorage on mount to resume quiz if there's a saved state
  useEffect(() => {
    if (typeof window === "undefined") {
      setIsInitialized(true);
      return;
    }

    try {
      const storageKey = getQuizStorageKey(FOLDER_QUIZ_ID);
      const resultKey = getQuizResultKey(FOLDER_QUIZ_ID);

      // Check if there's a saved quiz state or result
      const savedState = localStorage.getItem(storageKey);
      const savedResult = localStorage.getItem(resultKey);

      if (savedState || savedResult) {
        const maxAge = 24 * 60 * 60 * 1000; // 24 hours

        if (savedState) {
          const state = JSON.parse(savedState);
          if (Date.now() - state.timestamp < maxAge) {
            setIsQuizMode(true);
          }
        } else if (savedResult) {
          setIsQuizMode(true);
        }
      } else if (startInQuizMode && questions.length > 0) {
        setIsQuizMode(true);
      }
    } catch (error) {
      console.error("Failed to check quiz state:", error);
    }

    setIsInitialized(true);
  }, [FOLDER_QUIZ_ID, startInQuizMode, questions.length]);

  const handleStartQuiz = () => {
    if (questions.length === 0) return;
    setIsQuizMode(true);
  };

  const handleExitQuiz = () => {
    try {
      localStorage.removeItem(getQuizStorageKey(FOLDER_QUIZ_ID));
      localStorage.removeItem(getQuizResultKey(FOLDER_QUIZ_ID));
    } catch (error) {
      console.error("Failed to clear quiz state:", error);
    }
    setIsQuizMode(false);
  };

  // Create virtual quiz for this folder
  const virtualQuiz = useMemo(() => {
    if (questions.length === 0) return null;

    const now = new Date();

    return {
      id: FOLDER_QUIZ_ID,
      title: folder.name,
      description: folder.description,
      timeLimit: null,
      type: "COURSE" as const,
      isActive: true,
      courseId: null,
      chapterId: null,
      lessonId: null,
      createdAt: now,
      updatedAt: now,
      sections: [
        {
          id: `folder-section-${folder.id}`,
          title: folder.name,
          timeLimit: null,
          position: 0,
          quizId: FOLDER_QUIZ_ID,
          createdAt: now,
          updatedAt: now,
          questions: questions.map((q, index) => ({
            ...q,
            position: index,
            sectionId: `folder-section-${folder.id}`,
            explanation: null,
            explanationImageKey: null,
            explanationVideoKey: null,
            createdAt: now,
            updatedAt: now,
            favoriteQuestions: [
              {
                id: `fav-${q.id}`,
                userId: "current-user",
                questionId: q.id,
                folderId: folder.id,
                createdAt: now,
              },
            ],
          })),
        },
      ],
      memes: [],
    } as QuizForStudent;
  }, [questions, folder, FOLDER_QUIZ_ID]);

  // Show loading state until initialized
  if (!isInitialized) {
    return <FavoritesQuizSkeleton />;
  }

  if (isQuizMode && virtualQuiz) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" onClick={handleExitQuiz} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t("favorites.back_to_folders")}
        </Button>
        <QuizPlayer quiz={virtualQuiz} key={`folder-quiz-${folder.id}`} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/favorites">
            <ArrowLeft className="size-5" />
          </Link>
        </Button>
        <div
          className="flex size-12 shrink-0 items-center justify-center rounded-xl"
          style={{ backgroundColor: `${folder.color}20` }}
        >
          <Folder className="size-6" style={{ color: folder.color }} />
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{folder.name}</h1>
          {folder.description && (
            <p className="text-muted-foreground">{folder.description}</p>
          )}
        </div>
        <Button onClick={handleStartQuiz} disabled={questions.length === 0}>
          <Play className="mr-2 h-4 w-4" />
          {t("favorites.start_folder_quiz")} ({questions.length})
        </Button>
      </div>

      {/* Questions List */}
      {questions.length === 0 ? (
        <div className="text-muted-foreground py-12 text-center">
          {t("favorites.no_questions")}
        </div>
      ) : (
        <div className="grid gap-4">
          {questions.map((q, index) => (
            <QuestionCard key={q.id} question={q} index={index} />
          ))}
        </div>
      )}
    </div>
  );
}

function QuestionCard({
  question,
  index,
}: {
  question: Question;
  index: number;
}) {
  const imageUrl = useConstructUrl(question.imageKey);

  return (
    <Card className="relative p-6">
      <div className="absolute top-4 right-4">
        <ToggleFavoriteButton questionId={question.id} isFavorited={true} />
      </div>
      <div className="flex items-start gap-4 pr-12">
        <span className="bg-muted flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-bold">
          {index + 1}
        </span>
        <div className="space-y-2">
          <RenderDescription json={question.text} />
          {question.imageKey && (
            <img
              src={imageUrl}
              alt="Question Image"
              className="mt-2 h-auto max-w-full rounded-lg"
            />
          )}
        </div>
      </div>
    </Card>
  );
}
