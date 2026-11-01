// Sends a plain text mail through Resend. Returns false instead of throwing, so
// a mail problem never blocks the action that triggered it.
export async function sendMail(to: string, subject: string, text: string): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return false;
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: "paukr <noreply@paukr.app>", to: [to], subject, text }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export function formatBerlin(ms: number): { date: string; time: string } {
  const d = new Date(ms);
  return {
    date: d.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric", timeZone: "Europe/Berlin" }),
    time: d.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Berlin" }),
  };
}
