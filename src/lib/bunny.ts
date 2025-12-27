import { env } from "./config";
import crypto from "crypto";

const BUNNY_API_BASE = "https://video.bunnycdn.com/library";

/**
 * Create a new video in Bunny Stream library
 * Returns the video GUID and TUS upload URL
 */
export async function createBunnyVideo(title: string) {
  const response = await fetch(
    `${BUNNY_API_BASE}/${env.BUNNY_STREAM_LIBRARY_ID}/videos`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        AccessKey: env.BUNNY_STREAM_API_KEY,
      },
      body: JSON.stringify({ title }),
    },
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to create video: ${error}`);
  }

  const video = await response.json();

  // Generate TUS upload URL
  const tusUploadUrl = `https://video.bunnycdn.com/tusupload`;

  return {
    videoId: video.guid as string,
    libraryId: env.BUNNY_STREAM_LIBRARY_ID,
    tusUploadUrl,
    expirationTime: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
  };
}

/**
 * Get video encoding status and details
 */
export async function getBunnyVideoStatus(videoId: string) {
  const response = await fetch(
    `${BUNNY_API_BASE}/${env.BUNNY_STREAM_LIBRARY_ID}/videos/${videoId}`,
    {
      headers: {
        Accept: "application/json",
        AccessKey: env.BUNNY_STREAM_API_KEY,
      },
    },
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to get video status: ${error}`);
  }

  const video = await response.json();

  // Status codes: 0 = created, 1 = uploaded, 2 = processing, 3 = transcoding, 4 = finished, 5 = error
  const statusMap: Record<number, string> = {
    0: "created",
    1: "uploaded",
    2: "processing",
    3: "transcoding",
    4: "finished",
    5: "error",
    6: "upload_failed",
  };

  return {
    videoId: video.guid,
    status: statusMap[video.status] || "unknown",
    encodeProgress: video.encodeProgress || 0,
    length: video.length || 0,
    thumbnailUrl: video.thumbnailFileName
      ? `https://${env.BUNNY_STREAM_CDN_HOSTNAME}/${video.guid}/${video.thumbnailFileName}`
      : null,
    availableResolutions: video.availableResolutions || null,
  };
}

/**
 * Delete a video from Bunny Stream
 */
export async function deleteBunnyVideo(videoId: string) {
  const response = await fetch(
    `${BUNNY_API_BASE}/${env.BUNNY_STREAM_LIBRARY_ID}/videos/${videoId}`,
    {
      method: "DELETE",
      headers: {
        AccessKey: env.BUNNY_STREAM_API_KEY,
      },
    },
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to delete video: ${error}`);
  }

  return { success: true };
}

/**
 * Generate a signed/token-authenticated embed URL for secure playback
 * Token format: SHA256_HEX(token_security_key + video_id + expiration)
 */
export function generateBunnyEmbedUrl(
  videoId: string,
  expiresInSeconds: number = 3600,
): string {
  const expires = Math.floor(Date.now() / 1000) + expiresInSeconds;
  const tokenKey = env.BUNNY_STREAM_TOKEN_KEY;

  // Generate security token using HEX encoding (required by Bunny)
  const hashableBase = `${tokenKey}${videoId}${expires}`;
  const token = crypto.createHash("sha256").update(hashableBase).digest("hex");

  // Build embed URL with token
  const embedUrl = `https://iframe.mediadelivery.net/embed/${env.BUNNY_STREAM_LIBRARY_ID}/${videoId}?token=${token}&expires=${expires}&autoplay=false&preload=true`;

  return embedUrl;
}

/**
 * Generate TUS upload headers for direct upload
 */
export function generateTusUploadHeaders(videoId: string) {
  const expirationTime = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  const libraryId = env.BUNNY_STREAM_LIBRARY_ID;
  const apiKey = env.BUNNY_STREAM_API_KEY;

  // Create signature for TUS upload
  const signatureString = `${libraryId}${apiKey}${expirationTime}${videoId}`;
  const signature = crypto
    .createHash("sha256")
    .update(signatureString)
    .digest("hex");

  return {
    AuthorizationSignature: signature,
    AuthorizationExpire: expirationTime.toString(),
    VideoId: videoId,
    LibraryId: libraryId,
  };
}

// ============================================
// BUNNY STORAGE (for images, PDFs, etc.)
// ============================================

/**
 * Upload a file to Bunny Storage
 * @param file - File buffer to upload
 * @param fileName - Name/path for the file (e.g., "images/course-1.jpg")
 * @returns URL of the uploaded file
 */
export async function uploadToBunnyStorage(
  fileBuffer: Buffer,
  fileName: string,
): Promise<{ url: string; path: string }> {
  const storageZone = env.BUNNY_STORAGE_ZONE_NAME;
  const accessKey = env.BUNNY_STORAGE_ACCESS_KEY;
  const hostname = env.BUNNY_STORAGE_HOSTNAME;

  const uploadUrl = `https://${hostname}/${storageZone}/${fileName}`;

  const response = await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      AccessKey: accessKey,
      "Content-Type": "application/octet-stream",
    },
    body: new Uint8Array(fileBuffer),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to upload file to Bunny Storage: ${error}`);
  }

  // Return the CDN URL for the file
  const cdnUrl = `${env.BUNNY_STORAGE_CDN_URL}/${fileName}`;

  return {
    url: cdnUrl,
    path: fileName,
  };
}

/**
 * Delete a file from Bunny Storage
 * @param filePath - Path of the file to delete (e.g., "images/course-1.jpg")
 */
export async function deleteFromBunnyStorage(filePath: string): Promise<void> {
  const storageZone = env.BUNNY_STORAGE_ZONE_NAME;
  const accessKey = env.BUNNY_STORAGE_ACCESS_KEY;
  const hostname = env.BUNNY_STORAGE_HOSTNAME;

  const deleteUrl = `https://${hostname}/${storageZone}/${filePath}`;

  const response = await fetch(deleteUrl, {
    method: "DELETE",
    headers: {
      AccessKey: accessKey,
    },
  });

  // 404 is okay - file might already be deleted
  if (!response.ok && response.status !== 404) {
    const error = await response.text();
    throw new Error(`Failed to delete file from Bunny Storage: ${error}`);
  }
}

/**
 * Get CDN URL for a Bunny Storage file
 */
export function getBunnyStorageUrl(filePath: string): string {
  return `${env.BUNNY_STORAGE_CDN_URL}/${filePath}`;
}
