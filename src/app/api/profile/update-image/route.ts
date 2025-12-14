import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { S3 } from "@/lib/S3Client";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { env } from "@/lib/config";

// Helper function to extract S3 key from URL
function extractS3Key(imageUrl: string): string | null {
  if (!imageUrl) return null;

  // URL format: https://bucket.fly.storage.tigris.dev/key
  try {
    const url = new URL(imageUrl);
    // Remove leading slash from pathname
    return url.pathname.slice(1);
  } catch {
    // If it's already just a key (old format)
    if (imageUrl.startsWith("profile/")) {
      return imageUrl;
    }
    return null;
  }
}

// Helper function to delete file from S3
async function deleteFromS3(key: string): Promise<void> {
  try {
    const command = new DeleteObjectCommand({
      Bucket: env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES,
      Key: key,
    });
    await S3.send(command);
    console.log("Deleted old image from S3:", key);
  } catch (error) {
    console.error("Failed to delete old image from S3:", error);
    // Don't throw - we still want to update the image even if delete fails
  }
}

export async function POST(request: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { imageUrl } = body;

    if (!imageUrl) {
      return NextResponse.json(
        { error: "Image URL is required" },
        { status: 400 },
      );
    }

    // Get current user to check for old image
    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { image: true },
    });

    // Delete old image from S3 if it exists
    if (currentUser?.image) {
      const oldKey = extractS3Key(currentUser.image);
      if (oldKey) {
        await deleteFromS3(oldKey);
      }
    }

    // Update user in database with new image
    const updatedUser = await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        image: imageUrl,
      },
    });

    console.log("User image updated:", updatedUser.id);

    // Revalidate paths to ensure fresh data
    revalidatePath("/dashboard/profile");
    revalidatePath("/");

    return NextResponse.json({
      success: true,
      imageUrl: updatedUser.image,
    });
  } catch (error) {
    console.error("Update image error:", error);
    return NextResponse.json(
      { error: "Failed to update image" },
      { status: 500 },
    );
  }
}
