import { NextRequest, NextResponse } from "next/server";
import { createBunnyVideo, generateTusUploadHeaders } from "@/lib/bunny";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title } = await request.json();

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    // Create video in Bunny Stream
    const result = await createBunnyVideo(title);

    // Generate TUS upload headers
    const tusHeaders = await generateTusUploadHeaders(result.videoId);

    return NextResponse.json({
      videoId: result.videoId,
      libraryId: result.libraryId,
      tusUploadUrl: result.tusUploadUrl,
      tusHeaders,
    });
  } catch (error) {
    console.error("Bunny create video error:", error);
    return NextResponse.json(
      { error: "Failed to create video" },
      { status: 500 },
    );
  }
}
