"use client";

import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "../ui/skeleton";
import { AlertCircle } from "lucide-react";

interface BunnyVideoPlayerProps {
  bunnyVideoId: string;
  thumbnailUrl?: string;
}

async function fetchEmbedUrl(videoId: string) {
  const res = await fetch(`/api/bunny/embed?videoId=${videoId}`);
  if (!res.ok) throw new Error("Failed to get embed URL");
  const data = await res.json();
  return data.embedUrl;
}

export default function BunnyVideoPlayer({
  bunnyVideoId,
}: BunnyVideoPlayerProps) {
  const {
    data: embedUrl,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["bunny-embed", bunnyVideoId],
    queryFn: () => fetchEmbedUrl(bunnyVideoId),
    enabled: !!bunnyVideoId,
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
    refetchOnWindowFocus: false,
  });

  if (!bunnyVideoId) {
    return null;
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
        <AlertCircle className="mr-2 h-6 w-6" />
        Failed to load video
      </div>
    );
  }

  return (
    <div
      className="relative aspect-video overflow-hidden rounded-lg bg-black"
      style={{
        position: "relative",
        paddingTop: "56.25%",
      }}
    >
      <iframe
        src={embedUrl}
        loading="lazy"
        style={{
          border: "none",
          position: "absolute",
          top: 0,
          height: "100%",
          width: "100%",
        }}
        allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}
