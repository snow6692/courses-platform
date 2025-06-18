import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url(),
    GOOGLE_CLIENT_ID: z.string().min(1),
    GOOGLE_CLIENT_SECRET: z.string().min(1),
    BETTER_AUTH_URL: z.string().url(),
    BETTER_AUTH_SECRET: z.string().min(1),
    RESEND_API_KEY: z.string().min(1),
  },
  client: {},

  experimental__runtimeEnv: {
    // DATABASE_URL: process.env.DATABASE_URL,
    // GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    // GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    // BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
    // BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    // RESEND_API_KEY: process.env.RESEND_API_KEY,
  },
});
