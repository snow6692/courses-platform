import twilio from "twilio";
import { env } from "./config";

const client = twilio(env.TWILIO_ACCOUNT_SID, env.TWILIO_AUTH_TOKEN);

export async function sendWhatsAppOTP(phoneNumber: string, otp: string) {
  try {
    await client.messages.create({
      body: `Your verification code is: ${otp}`,
      from: env.TWILIO_WHATSAPP_NUMBER,
      to: `whatsapp:${phoneNumber}`,
    });
    console.log(`OTP sent to ${phoneNumber}`);
  } catch (error) {
    console.error("Failed to send WhatsApp OTP:", error);
    throw error;
  }
}
