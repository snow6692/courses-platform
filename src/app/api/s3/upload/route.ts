import { env } from "@/lib/config";
import { fileUploadSchema } from "@/validation/fileUpload.zod";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { requireAdmin } from "@/app/data/admin/require-admin";

export async function POST(request: Request) {
  await requireAdmin();

  try {
    const body = await request.json();

    const validation = fileUploadSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Invalid request Body",
        },
        {
          status: 400,
        },
      );
    }

    const { fileName, contentType, isImage } = validation.data;

    // Determine folder based on content type
    const folder = isImage
      ? "images"
      : contentType === "application/pdf"
        ? "pdfs"
        : "files";

    const extension = fileName.split(".").pop() || "bin";
    const uniqueKey = `${folder}/${uuidv4()}.${extension}`;

    // Generate Bunny Storage upload URL
    const storageZone = env.BUNNY_STORAGE_ZONE_NAME;
    const hostname = env.BUNNY_STORAGE_HOSTNAME;
    const presignedUrl = `https://${hostname}/${storageZone}/${uniqueKey}`;

    const response = {
      presignedUrl,
      key: uniqueKey,
      // Include access key for client-side upload
      accessKey: env.BUNNY_STORAGE_ACCESS_KEY,
      // Include CDN URL for displaying uploaded file
      cdnUrl: `${env.BUNNY_STORAGE_CDN_URL}/${uniqueKey}`,
    };

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to generate upload url",
      },
      {
        status: 500,
      },
    );
  }
}
