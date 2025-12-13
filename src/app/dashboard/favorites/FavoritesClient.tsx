"use client";

import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import RenderDescription from "@/components/rich-text-editor/RenderDescription";
import { useConstructUrl } from "@/hooks/use-construct-url";
import { ToggleFavoriteButton } from "@/components/quiz/ToggleFavoriteButton";
import QuizPlayer from "@/components/quiz/QuizPlayer";
import { QuizForStudent } from "@/app/data/quiz/get-quiz";
import { ArrowLeft, Play } from "lucide-react";
import { FavoritesQuizSkeleton } from "@/components/quiz/QuizSkeletons";

interface FavoritesClientProps {
  initialFavorites: any[]; // Type should match getFavoriteQuestions return type
}

const FAVORITES_QUIZ_ID = "favorites-quiz";
const getQuizStorageKey = (quizId: string) => `quiz_state_${quizId}`;
const getQuizResultKey = (quizId: string) => `quiz_result_${quizId}`;

export default function FavoritesClient({
  initialFavorites,
}: FavoritesClientProps) {
  const [isQuizMode, setIsQuizMode] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [favorites] = useState(initialFavorites);

  // Check localStorage on mount to resume quiz if there's a saved state
  useEffect(() => {
    if (typeof window === "undefined") {
      setIsInitialized(true);
      return;
    }

    try {
      const storageKey = getQuizStorageKey(FAVORITES_QUIZ_ID);
      const resultKey = getQuizResultKey(FAVORITES_QUIZ_ID);

      // Check if there's a saved quiz state or result
      const savedState = localStorage.getItem(storageKey);
      const savedResult = localStorage.getItem(resultKey);

      if (savedState || savedResult) {
        const maxAge = 24 * 60 * 60 * 1000; // 24 hours

        if (savedState) {
          const state = JSON.parse(savedState);
          if (Date.now() - state.timestamp < maxAge) {
            // Resume quiz mode
            setIsQuizMode(true);
          }
        } else if (savedResult) {
          // Show result
          setIsQuizMode(true);
        }
      }
    } catch (error) {
      console.error("Failed to check quiz state:", error);
    }

    setIsInitialized(true);
  }, []);

  const handleStartQuiz = () => {
    if (favorites.length === 0) return;
    setIsQuizMode(true);
  };

  const handleExitQuiz = () => {
    // Clear localStorage when user explicitly exits
    try {
      localStorage.removeItem(getQuizStorageKey(FAVORITES_QUIZ_ID));
      localStorage.removeItem(getQuizResultKey(FAVORITES_QUIZ_ID));
    } catch (error) {
      console.error("Failed to clear quiz state:", error);
    }
    setIsQuizMode(false);
  };

  // Memoize the virtual quiz so it doesn't get recreated on every render
  // This fixes localStorage and state persistence issues
  const virtualQuiz: QuizForStudent | null = useMemo(() => {
    if (favorites.length === 0) return null;

    // Create stable date objects
    const now = new Date();

    return {
      id: FAVORITES_QUIZ_ID,
      title: "My Favorite Questions",
      description: "A customized quiz from your favorite questions.",
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
          id: "fav-section",
          title: "Favorites",
          timeLimit: null, // Timer set via custom settings
          position: 0,
          quizId: FAVORITES_QUIZ_ID,
          createdAt: now,
          updatedAt: now,
          questions: favorites.map((q, index) => ({
            ...q,
            position: index,
            sectionId: "fav-section",
            favoriteQuestions: [{ userId: "current-user", questionId: q.id }],
          })),
        },
      ],
      memes: [], // No memes for favorites quiz
    };
  }, [favorites]);

  // Show loading state until initialized
  if (!isInitialized) {
    return <FavoritesQuizSkeleton />;
  }

  if (isQuizMode && virtualQuiz) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" onClick={handleExitQuiz} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Favorites
        </Button>
        <QuizPlayer quiz={virtualQuiz} key="favorites-quiz-player" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Favorite Questions</h1>
        <Button onClick={handleStartQuiz} disabled={favorites.length === 0}>
          <Play className="mr-2 h-4 w-4" />
          Start Quiz ({favorites.length})
        </Button>
      </div>

      {favorites.length === 0 ? (
        <div className="text-muted-foreground py-12 text-center">
          You haven't added any questions to your favorites yet.
        </div>
      ) : (
        <div className="grid gap-6">
          {favorites.map((q, index) => (
            <Card key={q.id} className="relative p-6">
              <div className="absolute top-4 right-4">
                <ToggleFavoriteButton questionId={q.id} isFavorited={true} />
              </div>
              <div className="flex items-start gap-4 pr-12">
                <span className="bg-muted flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-bold">
                  {index + 1}
                </span>
                <div className="space-y-2">
                  <RenderDescription json={q.text} />
                  {q.imageKey && (
                    <img
                      src={useConstructUrl(q.imageKey)}
                      alt="Question Image"
                      className="mt-2 h-auto max-w-full rounded-lg"
                    />
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
