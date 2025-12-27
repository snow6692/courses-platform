import { NextRequest, NextResponse } from "next/server";
import { uploadToBunnyStorage } from "@/lib/bunny";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "uploads";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "application/pdf",
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Allowed: images, PDF" },
        { status: 400 },
      );
    }

    // Generate unique filename
    const extension = file.name.split(".").pop() || "bin";
    const uniqueFileName = `${folder}/${uuidv4()}.${extension}`;

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Bunny Storage
    const result = await uploadToBunnyStorage(buffer, uniqueFileName);

    return NextResponse.json({
      url: result.url,
      path: result.path,
      fileName: file.name,
    });
  } catch (error) {
    console.error("Bunny Storage upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 },
    );
  }
}
