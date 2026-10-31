import { createClient } from "@/lib/supabase/server";
import { getSubscriptionInfo } from "@/lib/subscription";
import UpgradeClient from "./UpgradeClient";

export const dynamic = "force-dynamic";

export default async function UpgradePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let isPro = false;
  let periodEnd: number | null = null;
  let cancelScheduled = false;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("subscription_tier, stripe_subscription_id")
      .eq("id", user.id)
      .single<{ subscription_tier: string; stripe_subscription_id: string | null }>();
    isPro = profile?.subscription_tier === "pro";
    if (isPro && profile?.stripe_subscription_id) {
      const info = await getSubscriptionInfo(profile.stripe_subscription_id);
      periodEnd = info?.periodEnd ?? null;
      cancelScheduled = info?.cancelAtPeriodEnd ?? false;
    }
  }

  return (
    <UpgradeClient
      isPro={isPro}
      isLoggedIn={!!user}
      periodEnd={periodEnd}
      cancelScheduled={cancelScheduled}
    />
  );
}
