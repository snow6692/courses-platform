// components/quiz/admin/QuizMemeGrid.tsx

"use client";

import { Card } from "@/components/ui/card";
import RemoveMemeFromQuiz from "@/components/meme/RemoveMemeFromQuiz";
import { useConstructUrl } from "@/hooks/use-construct-url";
import { useLanguage } from "@/providers/LanguageContext";

import type { AdminGetQuizOfCourse } from "@/app/data/quiz/admin/admin-get-quiz-of-course";

interface QuizMemeGridProps {
  memes: AdminGetQuizOfCourse["memes"];
  quizId: string;
}

export function QuizMemeGrid({ memes, quizId }: QuizMemeGridProps) {
  const { t } = useLanguage();

  if (memes.length === 0) return null;

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {memes.map(({ meme }) => (
        <MemeCard key={meme.id} meme={meme} quizId={quizId} />
      ))}
    </div>
  );
}

function MemeCard({
  meme,
  quizId,
}: {
  meme: AdminGetQuizOfCourse["memes"][number]["meme"];
  quizId: string;
}) {
  const { t } = useLanguage();
  const fileUrl = useConstructUrl(meme.fileKey);

  const triggerLabels: Record<string, string> = {
    TOO_SLOW: t("admin.memes.triggers.too_slow"),
    RANDOM: t("admin.memes.triggers.random"),
  };

  return (
    <Card className="group relative overflow-hidden">
      {/* Remove button - positioned at top right */}
      <RemoveMemeFromQuiz memeId={meme.id} quizId={quizId} />

      {/* Media */}
      {meme.type === "VIDEO" ? (
        <video src={fileUrl} controls className="aspect-video w-full" />
      ) : (
        <img
          src={fileUrl}
          alt="meme"
          className="aspect-video w-full object-cover"
        />
      )}

      {/* Trigger label */}
      <div className="p-2 text-xs font-medium">
        {triggerLabels[meme.trigger] || meme.trigger}
      </div>
    </Card>
  );
}
