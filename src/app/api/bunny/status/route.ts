import { NextRequest, NextResponse } from "next/server";
import { getBunnyVideoStatus } from "@/lib/bunny";
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

    const status = await getBunnyVideoStatus(videoId);

    return NextResponse.json(status);
  } catch (error) {
    console.error("Bunny status error:", error);
    return NextResponse.json(
      { error: "Failed to get video status" },
      { status: 500 },
    );
  }
}
