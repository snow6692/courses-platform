import Stripe from "stripe";
import { env } from "./config";
export const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-06-30.basil",
  typescript: true,
});
