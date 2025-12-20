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
import { deleteChapter } from "@/actions/chapter.action";
import { toast } from "sonner";
import { Input } from "../ui/input";
import { useLanguage } from "@/providers/LanguageContext";

function DeleteChapter({
  chapterId,
  courseId,
  chapterName,
}: {
  courseId: string;
  chapterId: string;
  chapterName: string;
}) {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [name, setName] = useState("");

  const onSubmit = async () => {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(
        deleteChapter({ chapterId, courseId }),
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
  };

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
            {t("common.delete_chapter_confirm")}{" "}
            {t("common.enter_name_to_delete").replace("{name}", chapterName)}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Input
            placeholder={t("common.enter_chapter_name")}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <AlertDialogCancel disabled={pending}>
            {t("common.cancel")}
          </AlertDialogCancel>

          <Button
            onClick={onSubmit}
            disabled={pending || chapterName !== name}
            className="cursor-pointer bg-red-500 text-white hover:bg-red-600"
          >
            {pending ? t("common.deleting") : t("common.delete")}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default DeleteChapter;
