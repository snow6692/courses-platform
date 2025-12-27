import { requireAdmin } from "@/app/data/admin/require-admin";
import { env } from "@/lib/config";
import { NextResponse } from "next/server";

export async function DELETE(request: Request) {
  await requireAdmin();
  try {
    const body = await request.json();
    const { key } = body;
    if (!key) {
      return NextResponse.json({ error: "Key is required" }, { status: 400 });
    }

    // Delete from Bunny Storage
    const storageZone = env.BUNNY_STORAGE_ZONE_NAME;
    const hostname = env.BUNNY_STORAGE_HOSTNAME;
    const accessKey = env.BUNNY_STORAGE_ACCESS_KEY;

    const deleteUrl = `https://${hostname}/${storageZone}/${key}`;

    const response = await fetch(deleteUrl, {
      method: "DELETE",
      headers: {
        AccessKey: accessKey,
      },
    });

    // 404 is okay - file might already be deleted
    if (!response.ok && response.status !== 404) {
      throw new Error("Failed to delete from Bunny Storage");
    }

    return NextResponse.json(
      { message: "File deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete file" },
      { status: 500 },
    );
  }
}
