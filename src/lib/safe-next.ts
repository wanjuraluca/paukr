/**
 * The page to go to after sign-in, taken from the ?next= parameter. Only a
 * path on this site is accepted ("/app", "/upgrade?x=1"). Anything else, such
 * as "https://evil.com", "//evil.com", "/\evil.com" or ".evil.com" (which
 * would turn "https://paukr.app" + next into another host), falls back to /app.
 */
export function safeNextPath(next: string | null | undefined): string {
  // Browsers drop tabs and newlines from URLs and read "\" as "/", so
  // "/\t/evil.com" or "/\\evil.com" would also leave the site.
  if (!next || !next.startsWith("/") || next.startsWith("//") || /[\\\s\x00-\x1f]/.test(next)) {
    return "/app";
  }
  return next;
}
