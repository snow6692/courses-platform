"use client";

import React, { useState, useTransition } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";
import { Trash2 } from "lucide-react";
import { tryCatch } from "@/hooks/try-catch";
import { deleteLesson } from "@/actions/lesson.action";
import { toast } from "sonner";
import { useLanguage } from "@/providers/LanguageContext";

function DeleteLesson({
  courseId,
  lessonId,
  chapterId,
}: {
  lessonId: string;
  courseId: string;
  chapterId: string;
}) {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  async function onSubmit() {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(
        deleteLesson({ chapterId, courseId, lessonId }),
      );
      if (error) {
        toast.error(t("common.unexpected_error"));
        return;
      }
      if (result.status === "success") {
        toast.success(result.message);
        setOpen(false);
      } else if (result.status === "error") {
        toast.error(result.message);
      }
    });
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant={"ghost"} size={"icon"}>
          <Trash2 className="size-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("common.are_you_sure")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t("common.delete_lesson_confirm")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={pending}>
            {t("common.cancel")}
          </AlertDialogCancel>
          <Button
            onClick={onSubmit}
            disabled={pending}
            className="cursor-pointer bg-red-500 text-white hover:bg-red-600"
          >
            {pending ? t("common.deleting") : t("common.delete")}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default DeleteLesson;
