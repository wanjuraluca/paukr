"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";

export async function approveQuestion(formData: FormData) {
  const id = String(formData.get("id"));
  const supabase = createAdminClient();
  await supabase.from("questions").update({ reviewed: true }).eq("id", id);
  revalidatePath("/review");
}

export async function unapproveQuestion(formData: FormData) {
  const id = String(formData.get("id"));
  const supabase = createAdminClient();
  await supabase.from("questions").update({ reviewed: false }).eq("id", id);
  revalidatePath("/review");
}

// Reject permanently removes the draft (its answer options cascade away).
export async function rejectQuestion(formData: FormData) {
  const id = String(formData.get("id"));
  const supabase = createAdminClient();
  await supabase.from("questions").delete().eq("id", id);
  revalidatePath("/review");
}

export async function approveAll() {
  const supabase = createAdminClient();
  await supabase.from("questions").update({ reviewed: true }).eq("reviewed", false);
  revalidatePath("/review");
}
