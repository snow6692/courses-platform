"use client";

import { Button } from "@/components/ui/button";
import { IconPlus, IconMoodSmile } from "@tabler/icons-react";
import MemeForm from "@/components/meme/MemeForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useLanguage } from "@/providers/LanguageContext";

export default function MemePageHeader() {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4">
        <div className="bg-primary/10 flex size-14 items-center justify-center rounded-2xl">
          <IconMoodSmile className="text-primary size-7" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {t("admin.memes.title")}
          </h1>
          <p className="text-muted-foreground">
            {t("admin.memes.description")}
          </p>
        </div>
      </div>

      <Dialog>
        <DialogTrigger asChild>
          <Button className="gap-2">
            <IconPlus className="size-4" />
            {t("admin.memes.add_meme")}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <IconMoodSmile className="text-primary size-5" />
              {t("admin.memes.add_new_meme")}
            </DialogTitle>
          </DialogHeader>
          <MemeForm />
        </DialogContent>
      </Dialog>
    </div>
  );
}
