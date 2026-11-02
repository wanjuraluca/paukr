// Where a signup came from, read from the link itself (?src= or ?utm_source=).
// Nothing is stored on the visitor's device, the value only travels along the
// URLs up to the auth callback, which saves it on the new profile.
export function sourceFrom(params: { get(name: string): string | null }): string | null {
  const raw = (params.get("src") ?? params.get("utm_source") ?? "").toLowerCase();
  return /^[a-z0-9_-]{1,40}$/.test(raw) ? raw : null;
}
