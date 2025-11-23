import { useQuery } from "@tanstack/react-query";
async function fetchSignedVideoUrl(key: string) {
  const res = await fetch("/api/s3/get", {
    method: "POST",
    body: JSON.stringify({ key }),
  });

  if (!res.ok) throw new Error("Failed to get signed url");

  const data = await res.json();
  return data.url;
}

export function useVideoUrl(videoKey: string) {
  return useQuery({
    queryKey: ["video-url", videoKey],
    queryFn: () => fetchSignedVideoUrl(videoKey),
    enabled: !!videoKey, //      Use the query when have a key
    staleTime: 0, //
    gcTime: 0, //
    refetchOnWindowFocus: false, //
  });
}
