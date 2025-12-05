"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import RenderDescription from "@/components/rich-text-editor/RenderDescription";
import { useConstructUrl } from "@/hooks/use-construct-url";
import { ToggleFavoriteButton } from "@/components/quiz/ToggleFavoriteButton";
import QuizPlayer from "@/components/quiz/QuizPlayer";
import { QuizForStudent } from "@/app/data/quiz/get-quiz";
import { ArrowLeft, Play } from "lucide-react";

interface FavoritesClientProps {
  initialFavorites: any[]; // Type should match getFavoriteQuestions return type
}

export default function FavoritesClient({
  initialFavorites,
}: FavoritesClientProps) {
  const [isQuizMode, setIsQuizMode] = useState(false);
  const [favorites, setFavorites] = useState(initialFavorites);

  // Filter out questions that might have been unfavorited in the list view
  // For simplicity, we'll just use the initial list or re-fetch if needed.
  // But since ToggleFavoriteButton updates the server state, we might want to filter locally too if we want immediate feedback.
  // For now, let's assume the user wants to quiz on what was loaded.

  const handleStartQuiz = () => {
    if (favorites.length === 0) return;
    setIsQuizMode(true);
  };

  if (isQuizMode) {
    // Construct a virtual quiz object
    const virtualQuiz: QuizForStudent = {
      id: "favorites-quiz",
      title: "My Favorite Questions",
      description: "A customized quiz from your favorite questions.",
      timeLimit: null,
      type: "COURSE", // specific type doesn't matter much here
      isActive: true,
      courseId: null,
      chapterId: null,
      lessonId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      sections: [
        {
          id: "fav-section",
          title: "Favorites",
          timeLimit: null,
          position: 0,
          quizId: "favorites-quiz",
          createdAt: new Date(),
          updatedAt: new Date(),
          questions: favorites.map((q, index) => ({
            ...q,
            position: index,
            sectionId: "fav-section",
            favoriteQuestions: [{ userId: "current-user", questionId: q.id }], // Mock to show as favorited
          })),
        },
      ],
      memes: [], // No memes for favorites quiz for now
    };

    return (
      <div className="space-y-4">
        <Button
          variant="ghost"
          onClick={() => setIsQuizMode(false)}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Favorites
        </Button>
        <QuizPlayer quiz={virtualQuiz} />
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
                <span className="bg-muted flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full font-bold">
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
