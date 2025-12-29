import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { v4 as uuidv4 } from "uuid";
import { env } from "@/lib/config";

/**
 * Generate a presigned-like URL for direct client upload to Bunny Storage
 * Returns the upload URL, key, access key, and final CDN URL
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { fileName, contentType, fileSize, isImage } = body;

    if (!fileName || !contentType) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Validate file type
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "application/pdf",
    ];

    if (!allowedTypes.includes(contentType)) {
      return NextResponse.json(
        { error: "Invalid file type. Allowed: images, PDF" },
        { status: 400 },
      );
    }

    // Validate file size
    const maxSize = isImage ? 5 * 1024 * 1024 : 50 * 1024 * 1024; // 5MB for images, 50MB for PDFs
    if (fileSize && fileSize > maxSize) {
      const limitStr = isImage ? "5MB" : "50MB";
      return NextResponse.json(
        { error: `File size must be less than ${limitStr}` },
        { status: 400 },
      );
    }

    // Generate unique file path
    const extension = fileName.split(".").pop() || "bin";
    const folder = isImage ? "images" : "documents";
    const key = `${folder}/${uuidv4()}.${extension}`;

    // Build the upload URL for Bunny Storage
    const storageZone = env.BUNNY_STORAGE_ZONE_NAME;
    const hostname = env.BUNNY_STORAGE_HOSTNAME;
    const presignedUrl = `https://${hostname}/${storageZone}/${key}`;

    // CDN URL where the file will be accessible after upload
    const cdnUrl = `${env.BUNNY_STORAGE_CDN_URL}/${key}`;

    return NextResponse.json({
      presignedUrl,
      key,
      accessKey: env.BUNNY_STORAGE_ACCESS_KEY,
      cdnUrl,
    });
  } catch (error) {
    console.error("Bunny Storage presign error:", error);
    return NextResponse.json(
      { error: "Failed to generate upload URL" },
      { status: 500 },
    );
  }
}
