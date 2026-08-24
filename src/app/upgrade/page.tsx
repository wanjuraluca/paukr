import { createClient } from "@/lib/supabase/server";
import UpgradeClient from "./UpgradeClient";

export const dynamic = "force-dynamic";

export default async function UpgradePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let isPro = false;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("subscription_tier")
      .eq("id", user.id)
      .single<{ subscription_tier: string }>();
    isPro = profile?.subscription_tier === "pro";
  }

  return <UpgradeClient isPro={isPro} isLoggedIn={!!user} />;
}
