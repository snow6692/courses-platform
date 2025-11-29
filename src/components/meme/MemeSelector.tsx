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

export default function MemeSelector({
  quizId,
  onSuccess,
}: {
  quizId: string;
  onSuccess?: () => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  const { data: memes = [], isLoading } = useGlobalMemes(open);

  const handleSelect = (memeId: string) => {
    startTransition(async () => {
      const result = await addMemeToQuiz(memeId, quizId);
      if (result.status === "success") {
        toast.success(result.message);
        setOpen(false);
        onSuccess?.();
      } else {
        toast.error(result.message);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Select from Library</Button>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] max-w-4xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Select Meme from Library</DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <div className="text-muted-foreground py-8 text-center">
            Loading memes...
          </div>
        ) : (
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
            {memes.map((meme) => (
              <Card
                key={meme.id}
                className="hover:ring-primary cursor-pointer overflow-hidden transition-all hover:ring-2"
                onClick={() => handleSelect(meme.id)}
              >
                <div className="bg-muted relative flex aspect-video items-center justify-center">
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
                No memes found.
              </p>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
