"use client";

import { useState, useEffect, useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/providers/LanguageContext";
import { getFolders } from "@/actions/favorites/folder.actions";
import { toggleFavoriteQuestion } from "@/actions/quiz/student.actions";
import { toast } from "sonner";
import { Loader2, Folder, FolderPlus, Check } from "lucide-react";
import { CreateFolderDialog } from "./CreateFolderDialog";
import { cn } from "@/lib/utils";

interface Folder {
  id: string;
  name: string;
  color: string;
  questionsCount: number;
}

interface AddToFolderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  questionId: string;
  onSuccess?: () => void;
}

export function AddToFolderDialog({
  open,
  onOpenChange,
  questionId,
  onSuccess,
}: AddToFolderDialogProps) {
  const { t } = useLanguage();
  const [isPending, startTransition] = useTransition();
  const [folders, setFolders] = useState<Folder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  // Load folders when dialog opens
  useEffect(() => {
    if (open) {
      setIsLoading(true);
      getFolders()
        .then((data) => {
          setFolders(data);
          if (data.length > 0) {
            setSelectedFolderId(data[0].id);
          }
        })
        .finally(() => setIsLoading(false));
    }
  }, [open]);

  const handleAddToFolder = () => {
    if (!selectedFolderId) return;

    startTransition(async () => {
      const result = await toggleFavoriteQuestion(questionId, selectedFolderId);

      if (result.success) {
        toast.success(t("favorites.question_added"));
        onSuccess?.();
        onOpenChange(false);
      } else {
        toast.error(result.error || "Failed to add to favorites");
      }
    });
  };

  const handleFolderCreated = (folder: { id: string; name: string }) => {
    // Refresh folders list and select the new folder
    getFolders().then((data) => {
      setFolders(data);
      setSelectedFolderId(folder.id);
    });
    setShowCreateDialog(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>{t("favorites.add_to_folder")}</DialogTitle>
          </DialogHeader>

          <div className="py-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="text-muted-foreground size-6 animate-spin" />
              </div>
            ) : folders.length === 0 ? (
              <div className="py-6 text-center">
                <Folder className="text-muted-foreground mx-auto mb-3 size-12" />
                <p className="text-muted-foreground mb-4 text-sm">
                  {t("favorites.no_folders_description")}
                </p>
                <Button onClick={() => setShowCreateDialog(true)}>
                  <FolderPlus className="mr-2 size-4" />
                  {t("favorites.create_folder")}
                </Button>
              </div>
            ) : (
              <div className="max-h-[300px] space-y-2 overflow-y-auto">
                {folders.map((folder) => (
                  <button
                    key={folder.id}
                    type="button"
                    onClick={() => setSelectedFolderId(folder.id)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-all",
                      selectedFolderId === folder.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:bg-accent/50",
                    )}
                    disabled={isPending}
                  >
                    <div
                      className="size-4 shrink-0 rounded-full"
                      style={{ backgroundColor: folder.color }}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{folder.name}</p>
                      <p className="text-muted-foreground text-xs">
                        {folder.questionsCount} {t("favorites.questions")}
                      </p>
                    </div>
                    {selectedFolderId === folder.id && (
                      <Check className="text-primary size-4 shrink-0" />
                    )}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => setShowCreateDialog(true)}
                  className="border-border hover:bg-accent/50 flex w-full items-center gap-3 rounded-lg border border-dashed p-3 text-left transition-all"
                  disabled={isPending}
                >
                  <FolderPlus className="text-muted-foreground size-4" />
                  <span className="text-muted-foreground">
                    {t("favorites.create_new_folder")}
                  </span>
                </button>
              </div>
            )}
          </div>

          {folders.length > 0 && (
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isPending}
              >
                {t("favorites.cancel")}
              </Button>
              <Button
                onClick={handleAddToFolder}
                disabled={isPending || !selectedFolderId}
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    {t("favorites.add_to_folder")}
                  </>
                ) : (
                  t("favorites.add_to_folder")
                )}
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>

      <CreateFolderDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onFolderCreated={handleFolderCreated}
      />
    </>
  );
}
