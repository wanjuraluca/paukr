import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ResetPasswordClient from "./ResetPasswordClient";

export const dynamic = "force-dynamic";

// The recovery link (via /auth/callback) exchanges its code for a session
// before landing here, so a missing session means this page was opened
// directly/expired rather than via a valid reset link.
export default async function ResetPasswordPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth");

  return <ResetPasswordClient />;
}
