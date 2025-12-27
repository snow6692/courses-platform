import { NextRequest, NextResponse } from "next/server";
import { deleteBunnyVideo } from "@/lib/bunny";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const videoId = searchParams.get("videoId");

    if (!videoId) {
      return NextResponse.json(
        { error: "Video ID is required" },
        { status: 400 },
      );
    }

    await deleteBunnyVideo(videoId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Bunny delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete video" },
      { status: 500 },
    );
  }
}
