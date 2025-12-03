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

import Image from "next/image";
import { useConstructUrl } from "@/hooks/use-construct-url";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import AnswerForm from "./AnswerForm";

export default function AnswerItem({
  answer: initialAnswer,
  questionId,
  courseId,
  chapterId,
}: {
  answer: {
    id: string;
    text: string;
    isCorrect: boolean;
    imageKey?: string | null;
  };
  questionId: string;
  courseId: string;
  chapterId?: string;
}) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const imageUrl = useConstructUrl(initialAnswer.imageKey || "");

  // Toggle correct/incorrect
  const handleToggle = () => {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(
        toggleAnswerCorrect(
          initialAnswer.id,
          !initialAnswer.isCorrect,
          courseId,
          chapterId,
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

        <div className="flex flex-col gap-2">
          {imageUrl ? (
            <div className="relative h-20 w-20 overflow-hidden rounded-md border">
              <Image
                src={imageUrl}
                alt="Answer image"
                fill
                className="object-cover"
              />
            </div>
          ) : (
            ""
          )}
          <span className={initialAnswer.isCorrect ? "font-medium" : ""}>
            {initialAnswer.text}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Edit Dialog */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8"
              disabled={isPending}
            >
              <Pencil className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogTitle>Edit Answer</DialogTitle>
            <AnswerForm
              questionId={questionId}
              courseId={courseId}
              answer={initialAnswer}
              onSuccess={() => setOpen(false)}
            />
          </DialogContent>
        </Dialog>

        {/* Delete with ConfirmDialog */}
        <ConfirmDialog
          trigger={
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8"
              disabled={isPending}
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
          disabled={isPending}
        />
      </div>
    </div>
  );
}
