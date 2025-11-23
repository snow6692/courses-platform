import { NextResponse } from "next/server";
import { S3 } from "@/lib/S3Client";
import { env } from "@/lib/config";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import arcjet, { detectBot, fixedWindow } from "@/lib/arcjet";
import { requireUser } from "@/app/data/user/require-user";

const aj = arcjet
  .withRule(
    detectBot({
      mode: "LIVE",
      allow: [],
    }),
  )
  .withRule(
    fixedWindow({
      mode: "LIVE",
      window: "1m",
      max: 15, //
    }),
  );

export async function POST(request: Request) {
  const session = await requireUser();

  try {
    const decision = await aj.protect(request, {
      fingerprint: session.id,
    });

    if (decision.isDenied()) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

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
