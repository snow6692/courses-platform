"use client";

import { useState, useEffect } from "react";
import { X, FileQuestion, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useLanguage } from "@/providers/LanguageContext";
import QuizPlayer from "./QuizPlayer";
import { QuizForStudent } from "@/app/data/quiz/get-quiz";

interface QuizSheetProps {
  quizId: string;
  trigger: React.ReactNode;
  onQuizLoad?: () => void;
}

export default function QuizSheet({
  quizId,
  trigger,
  onQuizLoad,
}: QuizSheetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [quiz, setQuiz] = useState<QuizForStudent | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { t, dir } = useLanguage();

  // Fetch quiz data when sheet opens
  useEffect(() => {
    if (isOpen && !quiz) {
      loadQuiz();
    }
  }, [isOpen]);

  const loadQuiz = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/quiz/${quizId}`);
      if (!response.ok) {
        throw new Error("Failed to load quiz");
      }
      const data = await response.json();
      setQuiz(data);
      onQuizLoad?.();
    } catch (error) {
      console.error("Error loading quiz:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      // Optionally reset quiz state when closing
      // setQuiz(null);
    }
  };

  return (
    <>
      {/* Custom trigger element */}
      <div onClick={() => setIsOpen(true)} className="cursor-pointer">
        {trigger}
      </div>

      {/* Sheet */}
      <Sheet open={isOpen} onOpenChange={handleOpenChange}>
        <SheetContent
          side={dir === "rtl" ? "left" : "right"}
          className="w-full max-w-full p-0 sm:max-w-full md:max-w-[90vw] lg:max-w-[85vw]"
        >
          <SheetHeader className="sr-only">
            <SheetTitle>{t("quiz.settings.title")}</SheetTitle>
          </SheetHeader>

          {/* Close Button - Fixed position */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
            className="absolute top-4 z-50 h-10 w-10 rounded-full bg-white/90 shadow-md backdrop-blur-sm hover:bg-white"
            style={{ [dir === "rtl" ? "right" : "left"]: "1rem" }}
          >
            <X className="h-5 w-5" />
          </Button>

          {/* Quiz Content */}
          <div className="h-full overflow-y-auto">
            {isLoading ? (
              <div className="flex h-full items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                  <Loader2 className="h-12 w-12 animate-spin text-red-600" />
                  <p className="text-gray-600">
                    {t("quiz.settings.title") || "Loading Quiz..."}
                  </p>
                </div>
              </div>
            ) : quiz ? (
              <QuizPlayer quiz={quiz} />
            ) : (
              <div className="flex h-full items-center justify-center">
                <div className="flex flex-col items-center gap-4 text-center">
                  <FileQuestion className="h-16 w-16 text-gray-400" />
                  <p className="text-gray-600">
                    {t("quiz.player.submit_error") ||
                      "Failed to load quiz. Please try again."}
                  </p>
                  <Button onClick={loadQuiz} variant="outline">
                    {t("quiz.result.retry") || "Retry"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
