// Free-tier users get this many total learning-session starts (practice runs
// and exam simulations share the counter) per exam, then hit the paywall.
// A plain constant, not a server action export, so client components can
// import it directly (a "use server" file may only export async functions).
export const FREE_TRY_LIMIT = 3;
