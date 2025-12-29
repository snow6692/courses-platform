import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { deleteFromBunnyStorage } from "@/lib/bunny";
import { env } from "@/lib/config";

// Helper function to extract file path from Bunny CDN URL
function extractBunnyFilePath(imageUrl: string): string | null {
  if (!imageUrl) return null;

  try {
    // URL format: https://cdn-url.b-cdn.net/path/to/file
    const cdnUrl = env.BUNNY_STORAGE_CDN_URL;
    if (imageUrl.startsWith(cdnUrl)) {
      return imageUrl.replace(`${cdnUrl}/`, "");
    }
    // If it's already just a path
    if (imageUrl.startsWith("profile/")) {
      return imageUrl;
    }
    return null;
  } catch {
    return null;
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

    // Delete old image from Bunny Storage if it exists
    if (currentUser?.image) {
      const oldPath = extractBunnyFilePath(currentUser.image);
      if (oldPath) {
        try {
          await deleteFromBunnyStorage(oldPath);
          console.log("Deleted old image from Bunny Storage:", oldPath);
        } catch (error) {
          console.error(
            "Failed to delete old image from Bunny Storage:",
            error,
          );
          // Don't throw - we still want to update the image even if delete fails
        }
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
