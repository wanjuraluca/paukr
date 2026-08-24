import Stripe from "stripe";

// Server-only Stripe client. Never import this into a client component.
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-07-29.dahlia",
});
