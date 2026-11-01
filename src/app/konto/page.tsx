import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import LegalShell from "../legal/LegalShell";
import KontoClient from "./KontoClient";

export const dynamic = "force-dynamic";
export const metadata = { title: "Dein Konto · paukr" };

export default async function KontoPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth?next=/konto");

  const { data: profile } = await supabase
    .from("profiles")
    .select("subscription_tier")
    .eq("id", user.id)
    .single<{ subscription_tier: string }>();

  return (
    <LegalShell>
      <KontoClient email={user.email ?? ""} isPro={profile?.subscription_tier === "pro"} />
    </LegalShell>
  );
}
