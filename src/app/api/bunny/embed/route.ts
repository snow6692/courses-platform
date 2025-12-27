import { NextRequest, NextResponse } from "next/server";
import { generateBunnyEmbedUrl } from "@/lib/bunny";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user) {
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

    // Generate embed URL with 1 hour expiration
    const embedUrl = await generateBunnyEmbedUrl(videoId, 3600);

    return NextResponse.json({ embedUrl });
  } catch (error) {
    console.error("Bunny embed error:", error);
    return NextResponse.json(
      { error: "Failed to generate embed URL" },
      { status: 500 },
    );
  }
}
