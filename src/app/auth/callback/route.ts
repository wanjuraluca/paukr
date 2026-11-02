import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { safeNextPath } from "@/lib/safe-next";
import { sourceFrom } from "@/lib/signup-source";

// Only for new accounts (the confirmation link lasts up to a day), so a later
// login through a marked link doesn't count as a signup from there. A failure
// here must never block the login.
async function saveSignupSource(userId: string, createdAt: string, source: string) {
  if (Date.now() - new Date(createdAt).getTime() > 24 * 60 * 60 * 1000) return;
  try {
    await createAdminClient()
      .from("profiles")
      .update({ signup_source: source })
      .eq("id", userId)
      .is("signup_source", null);
  } catch {}
}

// Exchanges the OAuth / email-confirmation code for a session, then
// redirects to the originally requested page.
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = safeNextPath(searchParams.get("next"));

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const source = sourceFrom(searchParams);
      if (source && data.user) await saveSignupSource(data.user.id, data.user.created_at, source);
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/auth?error=1`);
}
