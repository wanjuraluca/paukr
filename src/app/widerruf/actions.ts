"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { formatBerlin, sendMail } from "@/lib/mail";

export interface RequestInput {
  kind: "withdrawal" | "cancellation";
  name: string;
  email: string;
  contract: string;
  details: string;
  // Hidden field, only bots fill it in.
  website: string;
}

export interface RequestResult {
  ok: boolean;
  error?: string;
  receivedAt?: number;
  emailSent?: boolean;
}

const FALLBACK = "Bitte schreib uns an info@paukr.app, die Frist bleibt damit gewahrt.";

export async function submitContractRequest(input: RequestInput): Promise<RequestResult> {
  const name = input.name.trim().slice(0, 200);
  const email = input.email.trim().toLowerCase().slice(0, 200);
  const contract = input.contract.trim().slice(0, 300);
  const details = input.details.trim().slice(0, 1000);

  if (input.website) return { ok: true, receivedAt: Date.now(), emailSent: false };
  if (!name || !contract || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: "Bitte fülle Name, E-Mail und Vertrag vollständig aus." };
  }
  if (input.kind !== "withdrawal" && input.kind !== "cancellation") {
    return { ok: false, error: "Ungültige Anfrage." };
  }

  const admin = createAdminClient();

  // Every submission sends a mail to the given address, so limit how often that can happen.
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const { count } = await admin
    .from("contract_requests")
    .select("id", { count: "exact", head: true })
    .eq("email", email)
    .gte("created_at", since);
  if ((count ?? 0) >= 3) {
    return { ok: false, error: `Für diese Adresse sind heute schon mehrere Erklärungen eingegangen. ${FALLBACK}` };
  }

  const { data: row, error } = await admin
    .from("contract_requests")
    .insert({ kind: input.kind, name, email, contract, details: details || null })
    .select("id, created_at")
    .single<{ id: string; created_at: string }>();
  if (error || !row) {
    return { ok: false, error: `Das hat gerade nicht geklappt. ${FALLBACK}` };
  }

  const receivedAt = new Date(row.created_at).getTime();
  const { date, time } = formatBerlin(receivedAt);
  const label = input.kind === "withdrawal" ? "Widerruf" : "Kündigung";
  const summary = [
    `Art der Erklärung: ${label}`,
    `Name: ${name}`,
    `E-Mail: ${email}`,
    `Vertrag: ${contract}`,
    ...(details ? [`Angaben: ${details}`] : []),
    `Eingegangen am: ${date} um ${time} Uhr`,
  ].join("\n");

  const emailSent = await sendMail(
    email,
    `Eingangsbestätigung: ${label}`,
    `Hallo ${name},\n\nwir haben deine Erklärung erhalten:\n\n${summary}\n\nWir bearbeiten sie und melden uns, falls wir noch etwas brauchen.\n\nViele Grüße\npaukr`,
  );
  await sendMail("info@paukr.app", `Neuer Eingang: ${label}`, `${summary}\n\nID: ${row.id}`);

  if (emailSent) {
    await admin.from("contract_requests").update({ confirmation_sent: true }).eq("id", row.id);
  }
  return { ok: true, receivedAt, emailSent };
}
