import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { isProStatus } from "@/lib/subscription";
import type Stripe from "stripe";

// Stripe webhook. Verifies the signature, marks the profile as pro after
// checkout and keeps the tier in sync with every later subscription change
// (failed renewals, cancellations, reactivations).
export async function POST(request: Request) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature");

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(
      body,
      sig!,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const admin = createAdminClient();

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.supabase_user_id;
    const subscriptionId =
      typeof session.subscription === "string" ? session.subscription : null;
    if (userId) {
      await admin
        .from("profiles")
        .update({
          subscription_tier: "pro",
          stripe_subscription_id: subscriptionId,
        })
        .eq("id", userId);
    }
  }

  if (
    event.type === "customer.subscription.created" ||
    event.type === "customer.subscription.updated" ||
    event.type === "customer.subscription.deleted"
  ) {
    const subscription = event.data.object as Stripe.Subscription;
    const customerId =
      typeof subscription.customer === "string"
        ? subscription.customer
        : subscription.customer.id;
    const { data: profile } = await admin
      .from("profiles")
      .select("id, stripe_subscription_id")
      .eq("stripe_customer_id", customerId)
      .maybeSingle<{ id: string; stripe_subscription_id: string | null }>();

    // An event for an older subscription must not overwrite a newer one.
    const isCurrent =
      !profile?.stripe_subscription_id ||
      profile.stripe_subscription_id === subscription.id;

    if (profile && isCurrent) {
      const ended = event.type === "customer.subscription.deleted";
      const pro = !ended && isProStatus(subscription.status);
      await admin
        .from("profiles")
        .update({
          subscription_tier: pro ? "pro" : "free",
          stripe_subscription_id: ended ? null : subscription.id,
        })
        .eq("id", profile.id);
    }
  }

  return NextResponse.json({ received: true });
}
