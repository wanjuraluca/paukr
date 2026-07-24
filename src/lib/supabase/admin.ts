import { createClient } from "@supabase/supabase-js";

// Server-only admin client using the secret key. Bypasses RLS, so it can
// read draft questions and change their review status.
// NEVER import this into a client component or expose it to the browser.
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}
