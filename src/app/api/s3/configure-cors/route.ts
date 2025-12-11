import { S3 } from "@/lib/S3Client";
import { env } from "@/lib/config";
import { PutBucketCorsCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const command = new PutBucketCorsCommand({
      Bucket: env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES,
      CORSConfiguration: {
        CORSRules: [
          {
            AllowedHeaders: ["*"],
            AllowedMethods: ["PUT", "POST", "GET", "DELETE", "HEAD"],
            AllowedOrigins: [
              "https://courses-platform-nu.vercel.app",
              "http://localhost:3000",
            ],
            ExposeHeaders: ["ETag"],
            MaxAgeSeconds: 3600,
          },
        ],
      },
    });

    await S3.send(command);

    return NextResponse.json({
      success: true,
      message: "CORS configured successfully",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        error: "Failed to configure CORS",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
