"use client";

import { useState, useTransition, useEffect } from "react";
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
import { updateFolder } from "@/actions/favorites/folder.actions";
import { toast } from "sonner";
import { Loader2, Pencil } from "lucide-react";

const FOLDER_COLORS = [
  "#6366f1",
  "#8b5cf6",
  "#ec4899",
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#14b8a6",
  "#06b6d4",
  "#3b82f6",
];

interface EditFolderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  folder: {
    id: string;
    name: string;
    description?: string | null;
    color: string;
  };
  onUpdated?: () => void;
}

export function EditFolderDialog({
  open,
  onOpenChange,
  folder,
  onUpdated,
}: EditFolderDialogProps) {
  const { t } = useLanguage();
  const [isPending, startTransition] = useTransition();
  const [name, setName] = useState(folder.name);
  const [description, setDescription] = useState(folder.description || "");
  const [color, setColor] = useState(folder.color);

  // Reset form when folder changes
  useEffect(() => {
    setName(folder.name);
    setDescription(folder.description || "");
    setColor(folder.color);
  }, [folder]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error(t("favorites.folder_name_required"));
      return;
    }

    startTransition(async () => {
      const result = await updateFolder(folder.id, {
        name: name.trim(),
        description: description.trim() || undefined,
        color,
      });

      if (result.success) {
        toast.success(t("favorites.folder_updated"));
        onUpdated?.();
        onOpenChange(false);
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
            <Pencil className="size-5" />
            {t("favorites.edit_folder")}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-folder-name">
              {t("favorites.folder_name")}
            </Label>
            <Input
              id="edit-folder-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("favorites.folder_name_placeholder")}
              disabled={isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-folder-description">
              {t("favorites.folder_description")}
            </Label>
            <Textarea
              id="edit-folder-description"
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
                  {t("favorites.save")}
                </>
              ) : (
                t("favorites.save")
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
