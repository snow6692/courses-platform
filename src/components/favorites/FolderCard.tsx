"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useLanguage } from "@/providers/LanguageContext";
import { deleteFolder } from "@/actions/favorites/folder.actions";
import { toast } from "sonner";
import {
  Folder,
  MoreVertical,
  Pencil,
  Trash2,
  Play,
  FileQuestion,
} from "lucide-react";
import { EditFolderDialog } from "./EditFolderDialog";

interface FolderCardProps {
  folder: {
    id: string;
    name: string;
    description?: string | null;
    color: string;
    questionsCount: number;
  };
  onDeleted?: () => void;
  onUpdated?: () => void;
}

export function FolderCard({ folder, onDeleted, onUpdated }: FolderCardProps) {
  const { t } = useLanguage();
  const [isPending, startTransition] = useTransition();
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteFolder(folder.id);
      if (result.success) {
        toast.success(t("favorites.folder_deleted"));
        onDeleted?.();
      } else {
        toast.error(result.error || "Failed to delete folder");
      }
      setShowDeleteAlert(false);
    });
  };

  return (
    <>
      <Card className="group relative overflow-hidden transition-all hover:shadow-md">
        <div className="p-5">
          <Link href={`/dashboard/favorites/${folder.id}`} className="block">
            <div className="flex items-start gap-4">
              <div
                className="flex size-12 shrink-0 items-center justify-center rounded-xl"
                style={{ backgroundColor: `${folder.color}20` }}
              >
                <Folder className="size-6" style={{ color: folder.color }} />
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="truncate text-lg font-semibold">
                  {folder.name}
                </h3>
                {folder.description && (
                  <p className="text-muted-foreground mt-1 line-clamp-1 text-sm">
                    {folder.description}
                  </p>
                )}
                <div className="mt-2 flex items-center gap-2">
                  <FileQuestion className="text-muted-foreground size-4" />
                  <span className="text-muted-foreground text-sm">
                    {folder.questionsCount} {t("favorites.questions")}
                  </span>
                </div>
              </div>
            </div>
          </Link>

          {/* Quick action - Start Quiz (outside the main Link) */}
          {folder.questionsCount > 0 && (
            <div className="mt-4 border-t pt-4">
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link href={`/dashboard/favorites/${folder.id}?quiz=true`}>
                  <Play className="mr-2 size-4" />
                  {t("favorites.start_folder_quiz")}
                </Link>
              </Button>
            </div>
          )}
        </div>

        {/* Dropdown Menu */}
        <div className="absolute top-3 right-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-8 opacity-0 transition-opacity group-hover:opacity-100"
                onClick={(e) => e.preventDefault()}
              >
                <MoreVertical className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setShowEditDialog(true)}>
                <Pencil className="mr-2 size-4" />
                {t("favorites.edit_folder")}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setShowDeleteAlert(true)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 size-4" />
                {t("favorites.delete_folder")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Color indicator */}
        <div
          className="absolute right-0 bottom-0 left-0 h-1"
          style={{ backgroundColor: folder.color }}
        />
      </Card>

      {/* Delete confirmation */}
      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("favorites.delete_folder")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("favorites.delete_folder_confirm")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>
              {t("favorites.cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t("favorites.delete_folder")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit dialog */}
      <EditFolderDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        folder={folder}
        onUpdated={onUpdated}
      />
    </>
  );
}
