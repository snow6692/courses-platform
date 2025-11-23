// src/app/api/webhook/stripe/route.ts

export const dynamic = "force-dynamic";
export const revalidate = 0;

import { env } from "@/lib/config";
import prisma from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import Stripe from "stripe";

export async function POST(request: Request) {
  console.log("WEBHOOK HIT → /api/webhook/stripe");

  const body = await request.text();
  const headerList = await headers();
  const signature = headerList.get("Stripe-Signature") as string;

  if (!signature) return new Response("No signature", { status: 400 });

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      env.STRIPE_WEBHOOK_SECRET!,
    );
    console.log("Event verified:", event.type);
  } catch (err: any) {
    console.log("Webhook Error:", err.message);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as any;

    const enrollmentId = session.metadata?.enrollmentId;
    if (!enrollmentId) {
      console.log("No enrollmentId → skipping");
      return new Response("OK", { status: 200 });
    }

    console.log("Payment status:", session.payment_status);
    console.log("Metadata:", session.metadata);

    let customerId =
      typeof session.customer === "string"
        ? session.customer
        : session.customer?.id;

    // Dev fallback for test events
    if (!customerId && process.env.NODE_ENV === "development") {
      const devUser = await prisma.user.findFirst({
        where: { stripeCustomerId: { not: null } },
      });
      if (devUser?.stripeCustomerId) customerId = devUser.stripeCustomerId;
    }

    if (!customerId) {
      console.log("No customer → test event");
      return new Response("OK", { status: 200 });
    }

    const user = await prisma.user.findUnique({
      where: { stripeCustomerId: customerId },
      select: { id: true },
    });

    if (!user) {
      console.log("User not found");
      return new Response("OK", { status: 200 });
    }

    if (session.payment_status === "paid") {
      try {
        const enrollment = await prisma.enrollment.findUnique({
          where: { id: enrollmentId },
        });
        if (!enrollment) {
          console.log(
            `Enrollment ${enrollmentId} not found → test event, ignoring`,
          );
          return new Response("OK", { status: 200 });
        }

        await prisma.enrollment.update({
          where: { id: enrollmentId },
          data: {
            userId: user.id,
            status: "SUCCESSFUL",
            amount: session.amount_total
              ? session.amount_total / 100
              : undefined,
          },
        });

        console.log(`ENROLLMENT ${enrollmentId} → SUCCESSFUL`);
      } catch (error: any) {
        if (error.code === "P2025") {
          console.log("Enrollment not found → safe (test event)");
        } else {
          console.error("Update failed:", error);
        }
      }
    }
  }

  return new Response("OK", { status: 200 });
}
