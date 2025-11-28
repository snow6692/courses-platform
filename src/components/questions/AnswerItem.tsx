"use client";

import { Switch } from "@/components/ui/switch";
import { CheckCircle2, Circle, Pencil, Check, X, Trash2 } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import {
  toggleAnswerCorrect,
  updateAnswer,
  deleteAnswer,
} from "@/actions/quiz/answer.action";
import { tryCatch } from "@/hooks/try-catch";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "../shared/ConfirmDialog";

export default function AnswerItem({
  answer: initialAnswer,
  questionId,
  courseId,
}: {
  answer: {
    id: string;
    text: string;
    isCorrect: boolean;
  };
  questionId: string;
  courseId: string;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(initialAnswer.text);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  // Toggle correct/incorrect
  const handleToggle = () => {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(
        toggleAnswerCorrect(
          initialAnswer.id,
          !initialAnswer.isCorrect,
          courseId,
        ),
      );
      if (error || result?.status === "error") {
        toast.error(result?.message || "Failed to update");
        return;
      }
      toast.success(result.message);
      router.refresh();
    });
  };

  // Save edited text
  const handleSave = () => {
    if (text.trim() === initialAnswer.text || text.trim() === "") {
      if (text.trim() === "") toast.error("Answer cannot be empty");
      setText(initialAnswer.text);
      setIsEditing(false);
      return;
    }

    startTransition(async () => {
      const { data: result, error } = await tryCatch(
        updateAnswer(
          {
            id: initialAnswer.id,
            questionId,
            text: text.trim(),
            isCorrect: initialAnswer.isCorrect,
          },
          courseId,
        ),
      );

      if (error || result?.status === "error") {
        toast.error(result?.message || "Failed to update");
        setText(initialAnswer.text);
        return;
      }

      toast.success("Answer updated");
      setIsEditing(false);
      router.refresh();
    });
  };

  // Cancel editing
  const handleCancel = () => {
    setText(initialAnswer.text);
    setIsEditing(false);
  };

  // Delete with confirmation
  const handleDelete = async () => {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(
        deleteAnswer(initialAnswer.id, courseId),
      );

      if (error || result?.status === "error") {
        toast.error(result?.message || "Failed to delete answer");
        return;
      }

      toast.success("Answer deleted successfully");
      router.refresh();
    });
  };

  return (
    <div className="hover:bg-muted/50 flex items-center justify-between rounded-lg border p-4 transition-colors">
      <div className="flex flex-1 items-center gap-3">
        {initialAnswer.isCorrect ? (
          <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-green-600" />
        ) : (
          <Circle className="text-muted-foreground h-5 w-5 flex-shrink-0" />
        )}

        {isEditing ? (
          <Input
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="h-9"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSave();
              if (e.key === "Escape") handleCancel();
            }}
          />
        ) : (
          <span className={initialAnswer.isCorrect ? "font-medium" : ""}>
            {initialAnswer.text}
          </span>
        )}
      </div>

      <div className="flex items-center gap-2">
        {/* Edit / Save / Cancel */}
        {isEditing ? (
          <>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8"
              onClick={handleSave}
              disabled={isPending}
            >
              <Check className="h-4 w-4 text-green-600" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8"
              onClick={handleCancel}
              disabled={isPending}
            >
              <X className="h-4 w-4 text-red-600" />
            </Button>
          </>
        ) : (
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8"
            onClick={() => setIsEditing(true)}
            disabled={isPending}
          >
            <Pencil className="h-4 w-4" />
          </Button>
        )}

        {/* Delete with ConfirmDialog */}
        <ConfirmDialog
          trigger={
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8"
              disabled={isPending || isEditing}
            >
              <Trash2 className="h-4 w-4 text-red-600" />
            </Button>
          }
          title="Delete this answer?"
          description="This action cannot be undone. The answer will be permanently removed."
          confirmLabel="Delete"
          cancelLabel="Cancel"
          confirmVariant="destructive"
          onConfirm={handleDelete}
        />

        {/* Correct Toggle */}
        <Switch
          checked={initialAnswer.isCorrect}
          onCheckedChange={handleToggle}
          disabled={isPending || isEditing}
        />
      </div>
    </div>
  );
}
