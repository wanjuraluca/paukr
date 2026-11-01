// Streak days follow the learner's calendar in Germany, not UTC, otherwise an
// answer between midnight and 1 or 2 am would still count for the day before.
export function berlinISODate(ms: number): string {
  // en-CA formats as YYYY-MM-DD.
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Berlin",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(ms));
}

export function todayISODate(): string {
  return berlinISODate(Date.now());
}

/** The calendar day before `isoDate` (YYYY-MM-DD), safe across DST changes. */
export function dayBefore(isoDate: string): string {
  const d = new Date(`${isoDate}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() - 1);
  return d.toISOString().slice(0, 10);
}

/**
 * The streak as it stands right now. The stored value only changes when the
 * user answers, so a streak whose last day is older than yesterday is over.
 */
export function liveStreak(stored: number, lastDate: string | null): number {
  if (!lastDate) return 0;
  const today = todayISODate();
  return lastDate === today || lastDate === dayBefore(today) ? stored : 0;
}
