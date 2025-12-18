"use client";

import { useState, useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/providers/LanguageContext";
import { createFolder } from "@/actions/favorites/folder.actions";
import { toast } from "sonner";
import { Loader2, FolderPlus } from "lucide-react";

const FOLDER_COLORS = [
  "#6366f1", // Indigo
  "#8b5cf6", // Violet
  "#ec4899", // Pink
  "#ef4444", // Red
  "#f97316", // Orange
  "#eab308", // Yellow
  "#22c55e", // Green
  "#14b8a6", // Teal
  "#06b6d4", // Cyan
  "#3b82f6", // Blue
];

interface CreateFolderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onFolderCreated?: (folder: { id: string; name: string }) => void;
}

export function CreateFolderDialog({
  open,
  onOpenChange,
  onFolderCreated,
}: CreateFolderDialogProps) {
  const { t } = useLanguage();
  const [isPending, startTransition] = useTransition();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState(FOLDER_COLORS[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error(t("favorites.folder_name_required"));
      return;
    }

    startTransition(async () => {
      const result = await createFolder(
        name.trim(),
        description.trim() || undefined,
        color,
      );

      if (result.success && result.folder) {
        toast.success(t("favorites.folder_created"));
        onFolderCreated?.(result.folder);
        onOpenChange(false);
        // Reset form
        setName("");
        setDescription("");
        setColor(FOLDER_COLORS[0]);
      } else {
        toast.error(result.error || t("favorites.folder_exists"));
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FolderPlus className="size-5" />
            {t("favorites.create_folder")}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="folder-name">{t("favorites.folder_name")}</Label>
            <Input
              id="folder-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("favorites.folder_name_placeholder")}
              disabled={isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="folder-description">
              {t("favorites.folder_description")}
            </Label>
            <Textarea
              id="folder-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t("favorites.folder_description_placeholder")}
              disabled={isPending}
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label>{t("favorites.folder_color")}</Label>
            <div className="flex flex-wrap gap-2">
              {FOLDER_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`size-8 rounded-full transition-all ${
                    color === c
                      ? "ring-primary ring-2 ring-offset-2"
                      : "hover:scale-110"
                  }`}
                  style={{ backgroundColor: c }}
                  disabled={isPending}
                />
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              {t("favorites.cancel")}
            </Button>
            <Button type="submit" disabled={isPending || !name.trim()}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  {t("favorites.create")}
                </>
              ) : (
                t("favorites.create")
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
