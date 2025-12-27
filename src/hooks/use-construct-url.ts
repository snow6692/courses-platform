export function useConstructUrl(fileKey: string | null | undefined): string {
  if (!fileKey || fileKey === "undefined" || fileKey === "null") return "";

  // If already a full URL (new Bunny uploads), return as-is
  if (fileKey.startsWith("http://") || fileKey.startsWith("https://")) {
    return fileKey;
  }

  // For legacy keys or relative paths, construct Bunny CDN URL
  // Note: BUNNY_STORAGE_CDN_URL is server-only, so we use the client env
  // For now, use a fallback approach
  return `https://spider-pl.b-cdn.net/${fileKey}`;
}
