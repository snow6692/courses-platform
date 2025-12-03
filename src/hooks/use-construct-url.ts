import { env } from "@/lib/config";

export function useConstructUrl(fileKey: string | null | undefined): string {
  if (!fileKey || fileKey === "undefined" || fileKey === "null") return "";
  return `https://${env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES}.fly.storage.tigris.dev/${fileKey}`;
}
