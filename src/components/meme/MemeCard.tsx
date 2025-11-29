"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import DeleteMeme from "@/components/meme/DeleteMeme";
import { useConstructUrl } from "@/hooks/use-construct-url";
import type { Meme } from "@/lib/db";

export default function MemeCard({ meme }: { meme: Meme }) {
  const fileUrl = useConstructUrl(meme.fileKey);

  return (
    <Card className="overflow-hidden">
      <div className="bg-muted relative flex aspect-video items-center justify-center">
        {meme.type === "VIDEO" ? (
          <video
            src={fileUrl}
            className="h-full w-full object-cover"
            controls
          />
        ) : (
          <img
            src={fileUrl}
            alt="Meme"
            className="h-full w-full object-cover"
          />
        )}
        <div className="absolute top-2 right-2">
          <DeleteMeme id={meme.id} />
        </div>
      </div>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <Badge variant="outline">{meme.trigger}</Badge>
          <span className="text-muted-foreground text-xs">{meme.type}</span>
        </div>
      </CardContent>
    </Card>
  );
}
