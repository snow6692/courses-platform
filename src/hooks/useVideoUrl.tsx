import { useQuery } from "@tanstack/react-query";

/**
 * Get video URL from Bunny Storage CDN
 * Since Bunny CDN URLs are public, we don't need signed URLs
 */
function constructBunnyVideoUrl(videoKey: string): string {
  // If already a full URL, return as-is
  if (videoKey.startsWith("http://") || videoKey.startsWith("https://")) {
    return videoKey;
  }
  // Construct Bunny CDN URL for legacy keys
  return `https://spider-pl.b-cdn.net/${videoKey}`;
}

export function useVideoUrl(videoKey: string) {
  return useQuery({
    queryKey: ["video-url", videoKey],
    queryFn: () => Promise.resolve(constructBunnyVideoUrl(videoKey)),
    enabled: !!videoKey,
    staleTime: Infinity, // URL doesn't change
    gcTime: Infinity,
    refetchOnWindowFocus: false,
  });
}
