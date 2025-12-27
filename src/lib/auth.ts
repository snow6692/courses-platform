import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./db";
import { admin, createAuthMiddleware, phoneNumber } from "better-auth/plugins";
import { env } from "./config";
import { sendWhatsAppOTP } from "./twilio";

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
    phoneNumber({
      sendOTP: async ({ phoneNumber, code }) => {
        // Send OTP via WhatsApp using Twilio (don't await for faster response)
        sendWhatsAppOTP(phoneNumber, code).catch(console.error);
      },
      sendPasswordResetOTP: async ({ phoneNumber, code }) => {
        // Send password reset OTP via WhatsApp
        sendWhatsAppOTP(phoneNumber, code).catch(console.error);
      },
      // Note: phoneNumberValidator was removed because it blocks login too
      // Duplicate phone check is handled by the database unique constraint
      signUpOnVerification: {
        getTempEmail: (phoneNumber) => {
          // Use a placeholder email that will be updated later
          // better-auth requires an email field
          return `phone_${phoneNumber.replace(/\+/g, "")}@temp.local`;
        },
        getTempName: () => {
          return "New User"; // Placeholder, will be updated after OTP verification
        },
      },
      otpLength: 6,
      expiresIn: 300, // 5 minutes
    }),
    admin(),
  ],
  hooks: {
    after: createAuthMiddleware(async (ctx) => {
      const newSession = ctx.context.newSession;
      if (newSession) {
        await prisma.session.deleteMany({
          where: {
            userId: newSession.user.id,
            NOT: {
              id: newSession.session.id,
            },
          },
        });
      }
    }),
  },
});
