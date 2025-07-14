import { env } from "@/lib/config";
import prisma from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import Stripe from "stripe";

export async function POST(request: Request) {
  const body = await request.text();
  const headersList = await headers();

  const signature = headersList.get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (error) {
    return new Response("Webhook error", { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  if (event.type === "checkout.session.completed") {
    const courseId = session.metadata?.courseId;
    const customerId = session.customer as string;

    if (!courseId) throw new Error("Course id not found...");
    const user = await prisma.user.findUnique({
      where: { stripeCustomerId: customerId },
    });
    if (!user) throw new Error("User not found...");

    await prisma.enrollment.update({
      where: {
        id: session.metadata?.enrollmentId as string,
      },
      data: {
        userId: user.id,
        status: "SUCCESSFUL",
        courseId: courseId,
        amount: ((session.amount_total as number) / 100) as number,
      },
    });
  }

  return new Response(null, { status: 200 });
}
