"use server";

import { getStripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

// Deletes the account and, through the foreign keys, all learning data. A
// running subscription is ended first, so nobody keeps paying without an account.
export async function deleteAccount(confirmation: string): Promise<{ ok: boolean; error?: string }> {
  if (confirmation !== "LÖSCHEN") return { ok: false, error: "Bitte tippe LÖSCHEN zur Bestätigung ein." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Bitte melde dich zuerst an." };

  const admin = createAdminClient();
  const { data: profile } = await admin
    .from("profiles")
    .select("stripe_subscription_id")
    .eq("id", user.id)
    .maybeSingle<{ stripe_subscription_id: string | null }>();

  if (profile?.stripe_subscription_id) {
    try {
      await getStripe().subscriptions.cancel(profile.stripe_subscription_id);
    } catch (err) {
      // An id the current Stripe mode doesn't know has nothing left to end.
      const code = (err as { code?: string }).code;
      if (code !== "resource_missing") {
        return { ok: false, error: "Dein Abo konnte gerade nicht beendet werden. Bitte versuch es später noch einmal oder schreib an info@paukr.app." };
      }
    }
  }

  const { error } = await admin.auth.admin.deleteUser(user.id);
  if (error) {
    return { ok: false, error: "Dein Konto konnte gerade nicht gelöscht werden. Bitte schreib an info@paukr.app." };
  }
  return { ok: true };
}
