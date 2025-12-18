"use client";

import { addMemeToQuiz } from "@/actions/meme/meme.action";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTransition, useState } from "react";
import { toast } from "sonner";
import { useConstructUrl } from "@/hooks/use-construct-url";
import { useGlobalMemes } from "@/hooks/use-global-memes";
import { useLanguage } from "@/providers/LanguageContext";
import { Loader2 } from "lucide-react";

export default function MemeSelector({
  quizId,
  onSuccess,
}: {
  quizId: string;
  onSuccess?: () => void;
}) {
  const { t } = useLanguage();
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const [selectedMemeId, setSelectedMemeId] = useState<string | null>(null);

  const { data: memes = [], isLoading } = useGlobalMemes(open);

  const handleSelect = (memeId: string) => {
    setSelectedMemeId(memeId);
    startTransition(async () => {
      const result = await addMemeToQuiz(memeId, quizId);
      if (result.status === "success") {
        toast.success(result.message);
        setOpen(false);
        setSelectedMemeId(null);
        onSuccess?.();
      } else {
        toast.error(result.message);
        setSelectedMemeId(null);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          {t("admin.memes.select_from_library")}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] max-w-4xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("admin.memes.select_meme_title")}</DialogTitle>
        </DialogHeader>

        {/* Loading overlay when adding meme */}
        {isPending && (
          <div className="bg-background/80 absolute inset-0 z-50 flex items-center justify-center rounded-lg backdrop-blur-sm">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="text-primary h-8 w-8 animate-spin" />
              <p className="text-sm font-medium">
                {t("admin.memes.adding_meme")}
              </p>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="text-muted-foreground py-8 text-center">
            <Loader2 className="mx-auto mb-2 h-6 w-6 animate-spin" />
            {t("admin.memes.loading_memes")}
          </div>
        ) : (
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
            {memes.map((meme) => (
              <Card
                key={meme.id}
                className={`hover:ring-primary cursor-pointer overflow-hidden transition-all hover:ring-2 ${
                  selectedMemeId === meme.id
                    ? "ring-primary opacity-50 ring-2"
                    : ""
                } ${isPending ? "pointer-events-none" : ""}`}
                onClick={() => !isPending && handleSelect(meme.id)}
              >
                <div className="bg-muted relative flex aspect-video items-center justify-center">
                  {selectedMemeId === meme.id && isPending && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/50">
                      <Loader2 className="h-8 w-8 animate-spin text-white" />
                    </div>
                  )}
                  {meme.type === "VIDEO" ? (
                    <video
                      src={useConstructUrl(meme.fileKey)}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <img
                      src={useConstructUrl(meme.fileKey)}
                      alt="Meme"
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>
                <CardContent className="p-2">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="text-xs">
                      {meme.trigger}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
            {memes.length === 0 && (
              <p className="text-muted-foreground col-span-full text-center">
                {t("admin.memes.no_memes")}
              </p>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
