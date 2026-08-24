import Stripe from "stripe";

// Server-only Stripe client. Never import this into a client component.
// Lazily instantiated so the build doesn't crash when STRIPE_SECRET_KEY is
// unset (e.g. no .env.local yet, or during static page-data collection).
let cached: Stripe | null = null;

export function getStripe(): Stripe {
  if (!cached) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error("STRIPE_SECRET_KEY is not set");
    cached = new Stripe(key, { apiVersion: "2026-07-29.dahlia" });
  }
  return cached;
}
