"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

// Server actions can be called directly, so each one checks the admin flag itself.
async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not allowed");
  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single<{ is_admin: boolean }>();
  if (!profile?.is_admin) throw new Error("Not allowed");
}

export async function approveQuestion(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  const supabase = createAdminClient();
  await supabase.from("questions").update({ reviewed: true }).eq("id", id);
  revalidatePath("/review");
}

export async function unapproveQuestion(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  const supabase = createAdminClient();
  await supabase.from("questions").update({ reviewed: false }).eq("id", id);
  revalidatePath("/review");
}

// Reject permanently removes the draft (its answer options cascade away).
export async function rejectQuestion(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  const supabase = createAdminClient();
  await supabase.from("questions").delete().eq("id", id);
  revalidatePath("/review");
}

export async function approveAll() {
  await requireAdmin();
  const supabase = createAdminClient();
  await supabase.from("questions").update({ reviewed: true }).eq("reviewed", false);
  revalidatePath("/review");
}

export async function resolveReport(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  const supabase = createAdminClient();
  await supabase.from("question_reports").update({ resolved_at: new Date().toISOString() }).eq("id", id);
  revalidatePath("/review");
}
