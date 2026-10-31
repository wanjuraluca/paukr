"use client";

import { useState, type CSSProperties } from "react";
import { cancelSubscription, type CancelResult } from "./actions";

export type CancelView =
  | { kind: "login" }
  | { kind: "none" }
  | { kind: "scheduled"; periodEnd: number | null }
  | { kind: "active"; periodEnd: number | null; email: string };

const heading: CSSProperties = { fontFamily: "var(--font-space), sans-serif" };
const h1: CSSProperties = { ...heading, fontWeight: 700, fontSize: "clamp(28px,3.4vw,38px)", letterSpacing: "-.02em", margin: "0 0 20px" };
const box: CSSProperties = { border: "1px solid var(--border)", borderRadius: "16px", background: "var(--surface)", padding: "22px 24px", margin: "0 0 24px" };
const row: CSSProperties = { display: "flex", flexWrap: "wrap", gap: "4px 16px", padding: "8px 0", borderBottom: "1px solid var(--border)" };
const label: CSSProperties = { color: "var(--muted)", minWidth: "190px" };
const button: CSSProperties = {
  border: "none",
  borderRadius: "12px",
  padding: "13px 22px",
  background: "var(--accent)",
  color: "var(--on-accent)",
  fontWeight: 700,
  fontSize: "15px",
  cursor: "pointer",
  textDecoration: "none",
  display: "inline-block",
};

function date(ms: number) {
  return new Date(ms).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric", timeZone: "Europe/Berlin" });
}
function time(ms: number) {
  return new Date(ms).toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Berlin" });
}

const mailHint = (
  <p style={{ color: "var(--muted)", margin: "24px 0 0" }}>
    Du kannst auch jederzeit formlos per E-Mail an{" "}
    <a href="mailto:info@paukr.app" style={{ color: "var(--accent-strong)" }}>info@paukr.app</a> kündigen.
  </p>
);

export default function KuendigenClient({ view }: { view: CancelView }) {
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<CancelResult | null>(null);

  if (view.kind === "login") {
    return (
      <>
        <h1 style={h1}>Verträge hier kündigen</h1>
        <p style={{ margin: "0 0 24px" }}>
          Melde dich mit dem Konto an, über das du paukr Pro abgeschlossen hast. Danach kannst du dein Abo hier direkt kündigen.
        </p>
        <a href="/auth?next=/kuendigen" className="pk-btn-accent" style={button}>Anmelden und kündigen</a>
        {mailHint}
      </>
    );
  }

  if (view.kind === "none") {
    return (
      <>
        <h1 style={h1}>Verträge hier kündigen</h1>
        <p style={{ margin: 0 }}>Für dein Konto läuft gerade kein kostenpflichtiges Abo, es gibt also nichts zu kündigen.</p>
        {mailHint}
      </>
    );
  }

  if (view.kind === "scheduled") {
    return (
      <>
        <h1 style={h1}>Dein Abo ist bereits gekündigt</h1>
        <p style={{ margin: 0 }}>
          {view.periodEnd
            ? `Pro läuft noch bis zum ${date(view.periodEnd)}. Danach wird dein Konto automatisch auf Free umgestellt.`
            : "Pro läuft bis zum Ende des aktuellen Abrechnungszeitraums. Danach wird dein Konto automatisch auf Free umgestellt."}
        </p>
        {mailHint}
      </>
    );
  }

  if (result?.ok) {
    const end = result.periodEnd ? date(result.periodEnd) : "zum Ende des laufenden Abrechnungszeitraums";
    return (
      <>
        <h1 style={h1}>Deine Kündigung ist eingegangen</h1>
        <div style={box}>
          <div style={row}><span style={label}>Vertrag</span><span>paukr Pro</span></div>
          <div style={row}><span style={label}>Eingegangen am</span><span>{date(result.receivedAt!)} um {time(result.receivedAt!)} Uhr</span></div>
          <div style={{ ...row, borderBottom: "none" }}><span style={label}>Wirksam zum</span><span>{end}</span></div>
        </div>
        <p style={{ margin: 0 }}>
          {result.emailSent
            ? `Eine Bestätigung haben wir an ${view.email} geschickt.`
            : "Bitte mach dir einen Screenshot dieser Seite als Bestätigung. Die Bestätigungsmail konnte gerade nicht verschickt werden."}
        </p>
      </>
    );
  }

  const onCancel = async () => {
    setBusy(true);
    setResult(await cancelSubscription());
    setBusy(false);
  };

  return (
    <>
      <h1 style={h1}>Verträge hier kündigen</h1>
      <p style={{ margin: "0 0 24px" }}>Prüf die Angaben und bestätige die Kündigung mit dem Button unten.</p>
      <div style={box}>
        <div style={row}><span style={label}>Vertrag</span><span>paukr Pro, 9,99 € pro Monat</span></div>
        <div style={row}><span style={label}>Art der Kündigung</span><span>Ordentliche Kündigung</span></div>
        <div style={row}>
          <span style={label}>Wirksam zum</span>
          <span>{view.periodEnd ? `Ende des Abrechnungszeitraums am ${date(view.periodEnd)}` : "Ende des laufenden Abrechnungszeitraums"}</span>
        </div>
        <div style={{ ...row, borderBottom: "none" }}><span style={label}>Bestätigung per E-Mail an</span><span>{view.email}</span></div>
      </div>
      <p style={{ color: "var(--muted)", margin: "0 0 24px" }}>
        Bis dahin kannst du Pro weiter nutzen. Danach wird dein Konto auf Free umgestellt, dein Lernfortschritt bleibt erhalten.
      </p>
      <button onClick={onCancel} disabled={busy} className="pk-btn-accent" style={{ ...button, opacity: busy ? 0.7 : 1, cursor: busy ? "default" : "pointer" }}>
        {busy ? "Wird gekündigt" : "Jetzt kündigen"}
      </button>
      {result && !result.ok && (
        <p style={{ color: "var(--err-strong)", margin: "14px 0 0" }}>{result.error}</p>
      )}
      {mailHint}
    </>
  );
}
