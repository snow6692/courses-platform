"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/providers/LanguageContext";
import { FolderCard } from "@/components/favorites/FolderCard";
import { CreateFolderDialog } from "@/components/favorites/CreateFolderDialog";
import { getFolders } from "@/actions/favorites/folder.actions";
import { FolderPlus, Folder } from "lucide-react";
import { useRouter } from "next/navigation";

interface FolderData {
  id: string;
  name: string;
  description: string | null;
  color: string;
  questionsCount: number;
  createdAt: Date;
}

interface FavoritesPageClientProps {
  initialFolders: FolderData[];
}

export default function FavoritesPageClient({
  initialFolders,
}: FavoritesPageClientProps) {
  const { t } = useLanguage();
  const router = useRouter();
  const [folders, setFolders] = useState(initialFolders);
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const refreshFolders = async () => {
    const updatedFolders = await getFolders();
    setFolders(updatedFolders);
  };

  const handleFolderCreated = () => {
    refreshFolders();
    setShowCreateDialog(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t("favorites.title")}</h1>
          <p className="text-muted-foreground mt-1">
            {t("favorites.folders")} ({folders.length})
          </p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <FolderPlus className="mr-2 size-4" />
          {t("favorites.create_folder")}
        </Button>
      </div>

      {/* Folders Grid */}
      {folders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="bg-muted mb-4 rounded-full p-6">
            <Folder className="text-muted-foreground size-12" />
          </div>
          <h2 className="mb-2 text-xl font-semibold">
            {t("favorites.no_folders")}
          </h2>
          <p className="text-muted-foreground mb-6 max-w-md">
            {t("favorites.no_folders_description")}
          </p>
          <Button onClick={() => setShowCreateDialog(true)}>
            <FolderPlus className="mr-2 size-4" />
            {t("favorites.create_folder")}
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {folders.map((folder) => (
            <FolderCard
              key={folder.id}
              folder={folder}
              onDeleted={refreshFolders}
              onUpdated={refreshFolders}
            />
          ))}
        </div>
      )}

      {/* Create Folder Dialog */}
      <CreateFolderDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onFolderCreated={handleFolderCreated}
      />
    </div>
  );
}
