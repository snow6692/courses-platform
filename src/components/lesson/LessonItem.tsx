"use client";
import Link from "next/link";
import { buttonVariants } from "../ui/button";
import { cn } from "@/lib/utils";
import { Check, Play, Lock, FileQuestion } from "lucide-react";
import { usePathname } from "next/navigation";

import { useLanguage } from "@/providers/LanguageContext";

interface IProps {
  lesson: {
    id: string;
    title: string;
    position: number;
    description: string | null;
    isFree: boolean;
  };
  slug: string;
  completed: boolean;
  isLocked: boolean;
  isPurchased: boolean;
  hasQuiz?: boolean;
}
export function LessonItem({
  lesson,
  slug,
  completed,
  isLocked,
  isPurchased,
  hasQuiz,
}: IProps) {
  const { t } = useLanguage();
  const pathname = usePathname();
  const currentLessonId = pathname.split("/").pop(); // the last part of the url (lessonId)
  const isActive = currentLessonId === lesson.id;

  const showLocked = isLocked && !isPurchased;
  const showBadges = !isPurchased;

  return (
    <Link
      href={`/dashboard/${slug}/${lesson.id}`}
      className={buttonVariants({
        variant: completed && !isActive ? "secondary" : "outline",
        className: cn(
          "h-auto w-full justify-start p-3 transition-all",

          // 1. Active + Completed - Solid primary with green check
          isActive &&
            completed &&
            "border-primary bg-primary ring-primary/50 hover:bg-primary/90 text-white shadow-lg ring-2",

          // 2. Completed only (not active) - Light green
          completed &&
            !isActive &&
            "border-green-400 bg-green-100 text-green-800 hover:bg-green-200",

          // 3. Active only (not completed) - Solid primary
          isActive &&
            !completed &&
            "border-primary bg-primary ring-primary/50 hover:bg-primary/90 text-white shadow-lg ring-2",

          // 4. Locked
          showLocked &&
            "cursor-not-allowed border-gray-300 bg-gray-100 text-gray-600 opacity-75",

          // 5. Default
          !completed && !isActive && !showLocked && "hover:bg-accent/50",
        ),
      })}
    >
      {/* ICON */}
      <div className="flex w-full min-w-0 items-center gap-3">
        <div className="shrink-0">
          {completed ? (
            // Completed icon
            <div className="flex size-5 items-center justify-center rounded-full bg-green-600">
              <Check className="size-3 text-white" />
            </div>
          ) : showLocked ? (
            // Locked icon
            <div className="flex size-5 items-center justify-center rounded-full bg-gray-300">
              <Lock className="size-3 text-gray-700" />
            </div>
          ) : (
            // Default play icon
            <div
              className={cn(
                "flex size-5 items-center justify-center rounded-full border-2",
                isActive ? "border-primary bg-primary/10" : "border-gray-400",
              )}
            >
              <Play
                className={cn(
                  "size-2.5 fill-current",
                  isActive ? "text-primary" : "text-gray-500",
                )}
              />
            </div>
          )}
        </div>

        {/* TEXT */}
        <div className="min-w-0 flex-1 space-y-1 text-left">
          <div className="flex items-center gap-2">
            <p
              className={cn(
                "flex-1 truncate text-xs font-medium",
                completed && "text-green-800",
                showLocked && "text-gray-600",
                isActive && !completed && "text-primary",
              )}
            >
              {lesson.position}. {lesson.title}
            </p>

            {/* Free / Paid Badge */}
            {showBadges &&
              (lesson.isFree ? (
                <span className="rounded-full bg-green-700 px-1.5 py-0.5 text-[10px] font-medium text-white">
                  {t("lesson.badge_free")}
                </span>
              ) : (
                <span className="rounded-full bg-red-700 px-1.5 py-0.5 text-[10px] font-medium text-white">
                  {t("lesson.badge_paid")}
                </span>
              ))}

            {/* Quiz Badge */}
            {hasQuiz && (
              <span className="rounded-full bg-purple-100 px-1.5 py-0.5 text-[10px] font-medium text-purple-700">
                <FileQuestion className="inline size-3" />
              </span>
            )}
          </div>

          {/* Subtext */}
          {completed && (
            <p className="text-[10px] font-medium text-green-700">Completed</p>
          )}

          {isActive && !completed && !showLocked && (
            <p className="text-primary text-[10px] font-medium">
              Currently Watching
            </p>
          )}

          {showLocked && (
            <p className="text-[10px] font-medium text-gray-600">
              Locked Lesson
            </p>
          )}

          {isActive && completed && (
            <p className="inline text-[10px] font-medium text-green-800">
              Active
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
