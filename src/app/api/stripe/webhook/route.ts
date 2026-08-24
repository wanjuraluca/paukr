import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import type Stripe from "stripe";

// Stripe webhook. Verifies the signature, then on checkout completion marks
// the profile as pro, and on subscription cancellation reverts it to free.
export async function POST(request: Request) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature");

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
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

  if (event.type === "customer.subscription.deleted") {
    const subscription = event.data.object as Stripe.Subscription;
    const customerId =
      typeof subscription.customer === "string"
        ? subscription.customer
        : subscription.customer.id;
    const { data: profile } = await admin
      .from("profiles")
      .select("id")
      .eq("stripe_customer_id", customerId)
      .maybeSingle<{ id: string }>();
    if (profile) {
      await admin
        .from("profiles")
        .update({ subscription_tier: "free", stripe_subscription_id: null })
        .eq("id", profile.id);
    }
  }

  return NextResponse.json({ received: true });
}
