"use client";

import { useState, type CSSProperties } from "react";
import { EARLY_START_CONSENT } from "@/lib/legal-texts";

const heading: CSSProperties = { fontFamily: "var(--font-space), sans-serif" };

interface Props {
  isPro: boolean;
  isLoggedIn: boolean;
  periodEnd: number | null;
  cancelScheduled: boolean;
}

function formatDate(ms: number) {
  return new Date(ms).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric", timeZone: "Europe/Berlin" });
}

const freeFeatures = [
  "Alle Fragen und Themen",
  "3 kostenlose Lernsitzungen pro Prüfung",
  "XP, Serie und Fortschritt",
];

const proFeatures = [
  "Alle Fragen und Themen",
  "Unbegrenzte Lernsitzungen und Simulationen",
  "Unbegrenzte Blitz-Läufe",
];

export default function UpgradeClient({ isPro, isLoggedIn, periodEnd, cancelScheduled }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [consent, setConsent] = useState(false);

  async function openPortal() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json();
      if (!res.ok || !data.url) {
        throw new Error(data.error ?? "Die Abo-Verwaltung konnte nicht geöffnet werden");
      }
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Etwas ist schiefgelaufen");
      setLoading(false);
    }
  }

  async function handleUpgrade() {
    if (!isLoggedIn) {
      window.location.href = "/";
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ earlyStartConsent: consent }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        throw new Error(data.error ?? "Checkout konnte nicht gestartet werden");
      }
      window.location.href = data.url;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Etwas ist schiefgelaufen",
      );
      setLoading(false);
    }
  }

  return (
    <div
      className="eh"
      style={{
        minHeight: "100vh",
        background: "var(--bg)",
        color: "var(--text)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
      }}
    >
      <div style={{ maxWidth: "880px", width: "100%" }}>
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <h1 style={{ ...heading, fontSize: "34px", fontWeight: 700, letterSpacing: "-.02em", margin: 0 }}>
            Mit Pro ohne Limit üben
          </h1>
          <p style={{ color: "var(--muted)", fontSize: "16px", marginTop: "10px" }}>
            Free und Pro haben dieselben Fragen. Pro hebt das Limit von 3 Lernsitzungen pro Prüfung auf.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
          }}
        >
          <div
            style={{
              border: "1px solid var(--border)",
              borderRadius: "18px",
              background: "var(--surface)",
              padding: "28px",
            }}
          >
            <div style={{ ...heading, fontSize: "20px", fontWeight: 700 }}>Free</div>
            <div style={{ ...heading, fontSize: "30px", fontWeight: 700, margin: "8px 0 18px" }}>0 €</div>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
              {freeFeatures.map((f) => (
                <li key={f} style={{ fontSize: "14px", color: "var(--muted)" }}>
                  {f}
                </li>
              ))}
            </ul>
          </div>

          <div
            style={{
              border: "1px solid var(--accent)",
              borderRadius: "18px",
              background: "var(--surface)",
              padding: "28px",
              boxShadow: "var(--shadow)",
            }}
          >
            <div style={{ ...heading, fontSize: "20px", fontWeight: 700, color: "var(--accent-strong)" }}>Pro</div>
            <div style={{ ...heading, fontSize: "30px", fontWeight: 700, margin: "8px 0 18px" }}>
              9,99 € <span style={{ fontSize: "14px", fontWeight: 500, color: "var(--muted)" }}>/ Monat (Endpreis)</span>
            </div>
            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 20px", display: "flex", flexDirection: "column", gap: "10px" }}>
              {proFeatures.map((f) => (
                <li key={f} style={{ fontSize: "14px", color: "var(--text)" }}>
                  {f}
                </li>
              ))}
            </ul>

            {isPro ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <div
                  style={{
                    textAlign: "center",
                    fontWeight: 600,
                    fontSize: "14px",
                    color: "var(--accent-strong)",
                    padding: "12px",
                    borderRadius: "12px",
                    background: "color-mix(in oklch, var(--accent) 14%, var(--bg))",
                  }}
                >
                  {cancelScheduled
                    ? periodEnd
                      ? `Gekündigt, Pro läuft noch bis ${formatDate(periodEnd)}`
                      : "Gekündigt, Pro läuft bis zum Ende des Zeitraums"
                    : periodEnd
                      ? `Pro aktiv, verlängert sich am ${formatDate(periodEnd)}`
                      : "Du bist Pro-Mitglied"}
                </div>
                <button
                  onClick={openPortal}
                  disabled={loading}
                  className="pk-review-btn-ghost"
                  style={{
                    width: "100%",
                    borderRadius: "12px",
                    padding: "12px 18px",
                    border: "1px solid var(--border)",
                    background: "transparent",
                    color: "var(--text)",
                    fontWeight: 600,
                    fontSize: "14px",
                    cursor: loading ? "default" : "pointer",
                    opacity: loading ? 0.7 : 1,
                  }}
                >
                  Zahlungsdaten und Rechnungen
                </button>
                {!cancelScheduled && (
                  <a href="/kuendigen" style={{ textAlign: "center", fontSize: "13px", color: "var(--muted)" }}>
                    Verträge hier kündigen
                  </a>
                )}
              </div>
            ) : (
              <>
                <p style={{ fontSize: "13px", lineHeight: 1.5, color: "var(--muted)", margin: "0 0 12px" }}>
                  Laufzeit ein Monat, verlängert sich automatisch um je einen Monat. Jederzeit zum Monatsende kündbar. Es gelten
                  die <a href="/agb" style={{ color: "var(--accent-strong)" }}>Nutzungsbedingungen</a> und die{" "}
                  <a href="/widerruf" style={{ color: "var(--accent-strong)" }}>Widerrufsbelehrung</a>. Minderjährige brauchen die
                  Zustimmung ihrer Erziehungsberechtigten. Keine Bestehensgarantie.
                </p>
                <label style={{ display: "flex", gap: "9px", alignItems: "flex-start", fontSize: "13px", lineHeight: 1.5, margin: "0 0 14px", cursor: "pointer" }}>
                  <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} style={{ marginTop: "3px" }} />
                  <span>{EARLY_START_CONSENT}</span>
                </label>
                <button
                  onClick={handleUpgrade}
                  disabled={loading || !consent}
                  className="pk-btn-accent"
                  style={{
                    width: "100%",
                    border: "none",
                    borderRadius: "12px",
                    padding: "13px 18px",
                    background: "var(--accent)",
                    color: "var(--on-accent)",
                    fontWeight: 700,
                    fontSize: "15px",
                    cursor: loading || !consent ? "default" : "pointer",
                    opacity: loading || !consent ? 0.6 : 1,
                    transition: "transform .18s, box-shadow .18s",
                  }}
                >
                  {loading ? "Wird geladen" : "Weiter zur Bezahlung"}
                </button>
              </>
            )}
            <a href="/widerruf" style={{ display: "block", textAlign: "center", fontSize: "13px", fontWeight: 600, color: "var(--accent-strong)", marginTop: "12px" }}>
              Vertrag widerrufen
            </a>
            {error && (
              <div style={{ marginTop: "10px", fontSize: "13px", color: "var(--err-strong)" }}>{error}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
