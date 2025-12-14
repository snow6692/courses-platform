import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

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

    console.log("Updating image for user:", session.user.id);
    console.log("New image URL:", imageUrl);

    if (!imageUrl) {
      return NextResponse.json(
        { error: "Image URL is required" },
        { status: 400 },
      );
    }

    // Update user in database
    const updatedUser = await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        image: imageUrl,
      },
    });

    console.log(
      "User updated successfully:",
      updatedUser.id,
      updatedUser.image,
    );

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
