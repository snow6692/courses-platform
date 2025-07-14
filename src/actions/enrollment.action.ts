"use server";
import { redirect } from "next/navigation";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { env } from "@/lib/config";
import { requireUser } from "@/app/data/user/require-user";
import { APIResponse } from "@/lib/types";
import prisma from "@/lib/db";
import arcjet, { detectBot, fixedWindow } from "@/lib/arcjet";
import { request } from "@arcjet/next";

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
      max: 5,
    }),
  );

export async function enrollInCourse(
  courseId: string,
): Promise<APIResponse | never> {
  const user = await requireUser();
  let checkoutUrl: string;
  try {
    const req = await request();
    const decision = await aj.protect(req, {
      fingerprint: user.id as string,
    });
    if (decision.isDenied()) {
      if (decision.reason.isRateLimit())
        return {
          status: "error",
          message: "Too many requests",
        };
      if (decision.reason.isBot())
        return {
          status: "error",
          message: "You are a bot! Please try again later",
        };
    }

    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: {
        id: true,
        title: true,
        price: true,
        slug: true,
      },
    });

    if (!course) {
      return {
        status: "error",
        message: "Course not found",
      };
    }

    let stripeCustomerId: string;
    const userWithStripeCustomerId = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        stripeCustomerId: true,
      },
    });

    if (userWithStripeCustomerId?.stripeCustomerId) {
      stripeCustomerId = userWithStripeCustomerId.stripeCustomerId;
    } else {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
        metadata: {
          userId: user.id,
        },
      });

      stripeCustomerId = customer.id;

      await prisma.user.update({
        where: { id: user.id },
        data: {
          stripeCustomerId,
        },
      });
    }

    const result = await prisma.$transaction(async (tx) => {
      //Check if user already bought the course
      const existingEnrollment = await tx.enrollment.findUnique({
        where: {
          userId_courseId: {
            courseId: course.id,
            userId: user.id,
          },
        },
        select: {
          id: true,
          status: true,
        },
      });

      if (existingEnrollment?.status === "SUCCESSFUL")
        return {
          status: "Success",
          message: "You are already enrolled in this Course",
        };

      let enrollment;

      if (existingEnrollment) {
        enrollment = await tx.enrollment.update({
          where: {
            id: existingEnrollment.id,
          },
          data: {
            amount: course.price,
            status: "PENDING",
            updatedAt: new Date(),
          },
        });
      } else {
        enrollment = await tx.enrollment.create({
          data: {
            userId: user.id,
            courseId: course.id,
            amount: course.price,
            status: "PENDING",
          },
        });
      }

      const checkoutSession = await stripe.checkout.sessions.create({
        customer: stripeCustomerId,
        line_items: [
          {
            price: "price_1RkgkDCrGTF12qtPSygyx9fE",
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${env.BETTER_AUTH_URL}/payment/success`,
        cancel_url: `${env.BETTER_AUTH_URL}/payment/cancel`,
        metadata: {
          userId: user.id,
          courseId: course.id,
          enrollmentId: enrollment.id,
        },
      });
      return {
        enrollment: enrollment,
        checkoutUrl: checkoutSession.url,
      };
    });

    checkoutUrl = result.checkoutUrl as string;
  } catch (error) {
    if (error instanceof Stripe.errors.StripeAPIError) {
      return {
        status: "error",
        message: "Payment system Error. Please try again later",
      };
    }
    return {
      status: "error",
      message: "Failed to enroll in course",
    };
  }

  redirect(checkoutUrl);
}
