import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";

export interface SubscriptionInfo {
  id: string;
  status: Stripe.Subscription.Status;
  cancelAtPeriodEnd: boolean;
  // When the current paid period ends (or the cancellation takes effect), as a JS timestamp.
  periodEnd: number | null;
}

// past_due still counts as Pro: Stripe is retrying the payment and only moves
// the subscription to unpaid/canceled once all retries have failed.
export function isProStatus(status: string): boolean {
  return status === "active" || status === "trialing" || status === "past_due";
}

export function toSubscriptionInfo(sub: Stripe.Subscription): SubscriptionInfo {
  const itemEnd = sub.items?.data?.[0]?.current_period_end ?? null;
  const end = sub.cancel_at ?? itemEnd;
  return {
    id: sub.id,
    status: sub.status,
    cancelAtPeriodEnd: sub.cancel_at_period_end || sub.cancel_at !== null,
    periodEnd: end ? end * 1000 : null,
  };
}

export async function getSubscriptionInfo(subscriptionId: string): Promise<SubscriptionInfo | null> {
  try {
    const sub = await getStripe().subscriptions.retrieve(subscriptionId);
    return toSubscriptionInfo(sub);
  } catch {
    return null;
  }
}

export function formatDate(ms: number): string {
  return new Date(ms).toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "Europe/Berlin",
  });
}
