import dotenv from 'dotenv';
import { S3Client, PutBucketCorsCommand } from '@aws-sdk/client-s3';

dotenv.config();

const S3 = new S3Client({
    region: process.env.AWS_REGION,
    endpoint: process.env.AWS_ENDPOINT_URL_S3,
    forcePathStyle: false, // Matching src/lib/S3Client.ts
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

async function run() {
    try {
        const bucketName = process.env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES;
        if (!bucketName) {
            throw new Error("NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES is not defined in .env");
        }
        console.log('Configuring CORS for bucket:', bucketName);
        console.log('Endpoint:', process.env.AWS_ENDPOINT_URL_S3);

        const command = new PutBucketCorsCommand({
            Bucket: bucketName,
            CORSConfiguration: {
                CORSRules: [
                    {
                        AllowedHeaders: ["*"],
                        AllowedMethods: ["PUT", "POST", "GET", "DELETE", "HEAD"],
                        AllowedOrigins: ["https://courses-platform-nu.vercel.app", "http://localhost:3000"], // Added * just to be sure
                        ExposeHeaders: ["ETag"],
                        MaxAgeSeconds: 3600,
                    },
                ],
            },
        });

        await S3.send(command);
        console.log('Success! CORS configuration updated.');
    } catch (error) {
        console.error('Error configuring CORS:', error);
        process.exit(1);
    }
}

run();
