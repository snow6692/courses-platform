import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./db";
import { admin, createAuthMiddleware, emailOTP } from "better-auth/plugins";
import { env } from "./config";
import { resend } from "./resend";
// If your Prisma file is located elsewhere, you can change the path

export const auth = betterAuth({
  database: (options: any) => {
    const adapter = prismaAdapter(prisma, {
      provider: "postgresql",
    })(options) as any;
    return adapter;
  },
  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    },
  },
  plugins: [
    emailOTP({
      async sendVerificationOTP({ email, otp }) {
        await resend.emails.send({
          from: "Snow <onboarding@resend.dev>",
          to: [email],
          subject: "Snow courses - Verify your email",
          html: `<p>Your verification code is <string>${otp}</string></p>`,
        });
      },
    }),
    admin(),
  ],
  hooks: {
    after: createAuthMiddleware(async (ctx) => {
      const newSession = ctx.context.session;
      if (newSession) {
        await prisma.session.deleteMany({
          where: {
            userId: newSession.user.id,
          },
        });
      }
    }),
  },
});
