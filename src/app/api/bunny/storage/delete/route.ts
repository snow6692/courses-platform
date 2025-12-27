import { NextRequest, NextResponse } from "next/server";
import { deleteFromBunnyStorage } from "@/lib/bunny";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const filePath = searchParams.get("path");

    if (!filePath) {
      return NextResponse.json(
        { error: "File path is required" },
        { status: 400 },
      );
    }

    await deleteFromBunnyStorage(filePath);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Bunny Storage delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete file" },
      { status: 500 },
    );
  }
}
