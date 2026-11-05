import { createClient } from "@/lib/supabase/server";
import { getSubscriptionInfo, isProStatus } from "@/lib/subscription";
import { pageMetadata } from "@/lib/seo";
import LegalShell from "../legal/LegalShell";
import KuendigenClient, { type CancelView } from "./KuendigenClient";

export const dynamic = "force-dynamic";
export const metadata = pageMetadata({
  title: "Verträge hier kündigen | paukr",
  description: "Hier kündigst du dein Pro-Abo bei paukr, auch ohne Anmeldung. Du bekommst eine Eingangsbestätigung per E-Mail.",
  path: "/kuendigen",
});

export default async function KuendigenPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let view: CancelView = { kind: "login" };

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("stripe_subscription_id")
      .eq("id", user.id)
      .maybeSingle<{ stripe_subscription_id: string | null }>();

    const info = profile?.stripe_subscription_id
      ? await getSubscriptionInfo(profile.stripe_subscription_id)
      : null;

    if (!info || !isProStatus(info.status)) {
      view = { kind: "none" };
    } else if (info.cancelAtPeriodEnd) {
      view = { kind: "scheduled", periodEnd: info.periodEnd };
    } else {
      view = { kind: "active", periodEnd: info.periodEnd, email: user.email ?? "" };
    }
  }

  return (
    <LegalShell>
      <KuendigenClient view={view} />
    </LegalShell>
  );
}
