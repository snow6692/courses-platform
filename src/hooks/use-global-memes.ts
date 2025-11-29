import { useQuery } from "@tanstack/react-query";
import { getGlobalMemes } from "@/app/data/meme/get-memes";

export function useGlobalMemes(enabled: boolean = true) {
  return useQuery({
    queryKey: ["global-memes"],
    queryFn: getGlobalMemes,
    enabled,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
