import { env } from "@/lib/config";

export function useConstructUrl(fileKey: string): string {
  return `https://${env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES}.fly.storage.tigris.dev/${fileKey}`;
}
