import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { isProStatus } from "@/lib/subscription";
import { contractConfirmationText } from "@/lib/legal-texts";
import { formatBerlin, sendMail } from "@/lib/mail";
import type Stripe from "stripe";

// A non-2xx answer makes Stripe send the event again later. Every step below is
// safe to repeat, so a failed write or mail is retried instead of getting lost.
function retryLater(event: Stripe.Event, reason: string) {
  console.error(`Stripe webhook ${event.type} (${event.id}): ${reason}`);
  return NextResponse.json({ error: "Processing failed" }, { status: 500 });
}

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
      const { error } = await admin
        .from("profiles")
        .update({
          subscription_tier: "pro",
          stripe_subscription_id: subscriptionId,
        })
        .eq("id", userId);
      if (error) return retryLater(event, error.message);
    }
    // Contract confirmation on a durable medium, including the withdrawal terms.
    const email = session.customer_details?.email ?? session.customer_email;
    if (email) {
      const consentAt = session.metadata?.early_start_consent_at ?? "";
      const stamp = consentAt ? formatBerlin(new Date(consentAt).getTime()) : null;
      const sent = await sendMail(
        email,
        "Deine Vertragsbestätigung für paukr Pro",
        contractConfirmationText(stamp ? `${stamp.date}, ${stamp.time} Uhr` : "beim Kauf"),
      );
      if (!sent) return retryLater(event, "contract confirmation mail not sent");
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
    const { data: profile, error: lookupError } = await admin
      .from("profiles")
      .select("id, stripe_subscription_id")
      .eq("stripe_customer_id", customerId)
      .maybeSingle<{ id: string; stripe_subscription_id: string | null }>();
    if (lookupError) return retryLater(event, lookupError.message);

    // An event for an older subscription must not overwrite a newer one.
    const isCurrent =
      !profile?.stripe_subscription_id ||
      profile.stripe_subscription_id === subscription.id;

    if (profile && isCurrent) {
      const ended = event.type === "customer.subscription.deleted";
      const pro = !ended && isProStatus(subscription.status);
      const { error } = await admin
        .from("profiles")
        .update({
          subscription_tier: pro ? "pro" : "free",
          stripe_subscription_id: ended ? null : subscription.id,
        })
        .eq("id", profile.id);
      if (error) return retryLater(event, error.message);
    }
  }

  return NextResponse.json({ received: true });
}
