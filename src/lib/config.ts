import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url(),
    GOOGLE_CLIENT_ID: z.string().min(1),
    GOOGLE_CLIENT_SECRET: z.string().min(1),
    BETTER_AUTH_URL: z.string().url(),
    BETTER_AUTH_SECRET: z.string().min(1),
    STRIPE_SECRET_KEY: z.string().min(1),
    STRIPE_WEBHOOK_SECRET: z.string().min(1),
    // Twilio
    TWILIO_ACCOUNT_SID: z.string().min(1),
    TWILIO_AUTH_TOKEN: z.string().min(1),
    TWILIO_WHATSAPP_NUMBER: z.string().min(1),
    TWILIO_TEMPLATE_SID: z.string().min(1),
    // Bunny Stream
    BUNNY_STREAM_API_KEY: z.string().min(1),
    BUNNY_STREAM_LIBRARY_ID: z.string().min(1),
    BUNNY_STREAM_CDN_HOSTNAME: z.string().min(1),
    BUNNY_STREAM_TOKEN_KEY: z.string().min(1),
    // Bunny Storage
    BUNNY_STORAGE_ZONE_NAME: z.string().min(1),
    BUNNY_STORAGE_ACCESS_KEY: z.string().min(1),
    BUNNY_STORAGE_HOSTNAME: z.string().min(1),
    BUNNY_STORAGE_CDN_URL: z.string().url(),
  },
  client: {
    NEXT_PUBLIC_BUNNY_CDN_URL: z.string().url(),
  },

  experimental__runtimeEnv: {
    NEXT_PUBLIC_BUNNY_CDN_URL: process.env.NEXT_PUBLIC_BUNNY_CDN_URL,
  },
});
