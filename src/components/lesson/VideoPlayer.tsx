"use client";

import { useVideoUrl } from "@/hooks/useVideoUrl";
import { useConstructUrl } from "@/hooks/use-construct-url";
import { useSession } from "@/hooks/useAuthUser";
import { BookIcon } from "lucide-react";
import { Skeleton } from "../ui/skeleton";

export default function VideoPlayer({
  thumbnailKey,
  videoKey,
}: {
  thumbnailKey: string;
  videoKey: string;
}) {
  const thumbnailUrl = useConstructUrl(thumbnailKey);

  const { data: videoUrl, isLoading, error } = useVideoUrl(videoKey);

  const {
    session: { user },
  } = useSession();

  if (!videoKey) {
    return (
      <div className="bg-muted flex aspect-video flex-col items-center justify-center rounded-lg">
        <BookIcon className="text-primary mx-auto mb-4 size-16" />
        <p className="text-muted-foreground">
          This lesson doesn't have a video
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="aspect-video overflow-hidden rounded-lg">
        <Skeleton className="h-full w-full bg-zinc-800" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex aspect-video items-center justify-center rounded-lg bg-red-500/20 text-red-400">
        Failed to load secure video
      </div>
    );
  }

  return (
    <div
      className="relative aspect-video overflow-hidden rounded-lg bg-black"
      onContextMenu={(e) => e.preventDefault()}
    >
      <video
        controls
        poster={thumbnailUrl}
        controlsList="nodownload"
        disablePictureInPicture
        disableRemotePlayback
        playsInline
        className="h-full w-full object-cover"
        onContextMenu={(e) => e.preventDefault()}
      >
        <source src={videoUrl} type="video/mp4" />
        <source src={videoUrl} type="video/webm" />
        <source src={videoUrl} type="video/ogg" />
        Your Browser doesn't support the video tag
      </video>
      {/* Watermark */}
      <div className="pointer-events-none absolute inset-0 flex flex-col justify-between p-8 text-2xl font-bold text-white opacity-40">
        <div>{user?.email}</div>
        <div className="text-right">{user?.id}</div>
        <div className="self-center">{new Date().toLocaleString()}</div>
      </div>
    </div>
  );
}
