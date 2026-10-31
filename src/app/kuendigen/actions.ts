"use server";

import { getStripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";
import { formatDate, toSubscriptionInfo } from "@/lib/subscription";

export interface CancelResult {
  ok: boolean;
  error?: string;
  receivedAt?: number;
  periodEnd?: number | null;
  emailSent?: boolean;
}

function formatTime(ms: number): string {
  return new Date(ms).toLocaleTimeString("de-DE", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Berlin",
  });
}

// The confirmation has to reach the customer in text form right away, so it
// goes out by mail. Skipped (and reported back) if no Resend key is configured.
async function sendConfirmation(to: string, receivedAt: number, periodEnd: number | null) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return false;
  const endText = periodEnd ? formatDate(periodEnd) : "zum Ende des laufenden Abrechnungszeitraums";
  const text = [
    "Hallo,",
    "",
    "wir haben deine Kündigung erhalten.",
    "",
    "Vertrag: paukr Pro (9,99 Euro pro Monat)",
    "Art der Kündigung: ordentliche Kündigung",
    `Eingegangen am: ${formatDate(receivedAt)} um ${formatTime(receivedAt)} Uhr`,
    `Wirksam zum: ${endText}`,
    "",
    "Bis dahin kannst du Pro weiter nutzen. Danach wird dein Konto automatisch auf Free umgestellt, dein Lernfortschritt bleibt erhalten.",
    "",
    "Viele Grüße",
    "paukr",
  ].join("\n");

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: "paukr <noreply@paukr.app>",
        to: [to],
        subject: "Bestätigung deiner Kündigung",
        text,
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function cancelSubscription(): Promise<CancelResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Bitte melde dich zuerst an." };

  const { data: profile } = await supabase
    .from("profiles")
    .select("stripe_subscription_id")
    .eq("id", user.id)
    .maybeSingle<{ stripe_subscription_id: string | null }>();
  if (!profile?.stripe_subscription_id) {
    return { ok: false, error: "Wir haben kein laufendes Abo gefunden." };
  }

  const receivedAt = Date.now();
  let periodEnd: number | null = null;
  try {
    const updated = await getStripe().subscriptions.update(profile.stripe_subscription_id, {
      cancel_at_period_end: true,
    });
    periodEnd = toSubscriptionInfo(updated).periodEnd;
  } catch {
    return {
      ok: false,
      error: "Die Kündigung konnte gerade nicht verarbeitet werden. Bitte versuch es gleich noch einmal oder schreib an info@paukr.app.",
    };
  }

  const emailSent = user.email ? await sendConfirmation(user.email, receivedAt, periodEnd) : false;
  return { ok: true, receivedAt, periodEnd, emailSent };
}
