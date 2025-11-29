import { NextResponse } from "next/server";
import { S3 } from "@/lib/S3Client";
import { env } from "@/lib/config";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { requireUser } from "@/app/data/user/require-user";

export async function POST(request: Request) {
  await requireUser();

  try {
    const body = await request.json();
    const { key } = body;

    if (!key) {
      return NextResponse.json({ error: "Key is required" }, { status: 400 });
    }

    const command = new GetObjectCommand({
      Bucket: env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES,
      Key: key,
    });

    //     Link video expires after a minute
    const signedUrl = await getSignedUrl(S3, command, {
      expiresIn: 60,
    });

    return NextResponse.json({ url: signedUrl }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to generate presigned get url" },
      { status: 500 },
    );
  }
}
