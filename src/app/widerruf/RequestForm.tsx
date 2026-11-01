"use client";

import { useState, type CSSProperties } from "react";
import { submitContractRequest, type RequestResult } from "./actions";

const input: CSSProperties = { width: "100%", boxSizing: "border-box", padding: "11px 13px", borderRadius: "10px", border: "1px solid var(--border)", background: "var(--bg)", color: "var(--text)", fontSize: "15px", fontFamily: "inherit" };
const labelStyle: CSSProperties = { display: "block", fontSize: "14px", fontWeight: 600, margin: "14px 0 6px" };
const button: CSSProperties = { border: "none", borderRadius: "12px", padding: "13px 22px", background: "var(--accent)", color: "var(--on-accent)", fontWeight: 700, fontSize: "15px", cursor: "pointer", marginTop: "18px" };
const ghost: CSSProperties = { ...button, background: "transparent", color: "var(--text)", border: "1px solid var(--border)", marginLeft: "10px" };
const box: CSSProperties = { border: "1px solid var(--border)", borderRadius: "16px", background: "var(--surface)", padding: "22px 24px", margin: "0 0 24px" };

function stamp(ms: number) {
  const d = new Date(ms);
  const date = d.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric", timeZone: "Europe/Berlin" });
  const time = d.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Berlin" });
  return `${date} um ${time} Uhr`;
}

// Two-step public form: first the details, then a separate confirm button.
// Works without an account, as § 356a and § 312k BGB expect.
export default function RequestForm({ kind }: { kind: "withdrawal" | "cancellation" }) {
  const isWithdrawal = kind === "withdrawal";
  const [step, setStep] = useState<"edit" | "review">("edit");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contract, setContract] = useState("paukr Pro");
  const [cancelType, setCancelType] = useState("Ordentliche Kündigung zum nächstmöglichen Zeitpunkt");
  const [reason, setReason] = useState("");
  const [website, setWebsite] = useState("");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<RequestResult | null>(null);

  const extraordinary = cancelType.startsWith("Außerordentliche");
  const details = isWithdrawal ? "" : extraordinary && reason.trim() ? `${cancelType}. Grund: ${reason.trim()}` : cancelType;
  const complete = name.trim() && contract.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const send = async () => {
    setBusy(true);
    setResult(await submitContractRequest({ kind, name, email, contract, details, website }));
    setBusy(false);
  };

  if (result?.ok) {
    return (
      <div style={box}>
        <strong>{isWithdrawal ? "Dein Widerruf ist eingegangen." : "Deine Kündigung ist eingegangen."}</strong>
        <p style={{ margin: "10px 0 0" }}>
          Eingegangen am {stamp(result.receivedAt!)}.{" "}
          {result.emailSent
            ? `Eine Eingangsbestätigung haben wir an ${email.trim()} geschickt.`
            : "Die Bestätigungsmail konnte gerade nicht verschickt werden. Bitte mach einen Screenshot dieser Seite und schreib kurz an info@paukr.app."}
        </p>
      </div>
    );
  }

  if (step === "review") {
    return (
      <div style={box}>
        <strong>Bitte prüfe deine Angaben</strong>
        <p style={{ margin: "10px 0 0" }}>
          Name: {name.trim()}<br />
          E-Mail für die Bestätigung: {email.trim()}<br />
          Vertrag: {contract.trim()}
          {details && <><br />Art: {details}</>}
        </p>
        <button onClick={send} disabled={busy} className="pk-btn-accent" style={{ ...button, opacity: busy ? 0.7 : 1 }}>
          {isWithdrawal ? "Widerruf bestätigen" : "Jetzt kündigen"}
        </button>
        <button onClick={() => setStep("edit")} disabled={busy} style={ghost}>Zurück</button>
        {result && !result.ok && <p style={{ color: "var(--err-strong)", margin: "14px 0 0" }}>{result.error}</p>}
      </div>
    );
  }

  return (
    <div style={box}>
      <label style={labelStyle} htmlFor="req-name">Dein Name</label>
      <input id="req-name" style={input} value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
      <label style={labelStyle} htmlFor="req-email">E-Mail für die Bestätigung</label>
      <input id="req-email" type="email" style={input} value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
      <label style={labelStyle} htmlFor="req-contract">Vertrag</label>
      <input id="req-contract" style={input} value={contract} onChange={(e) => setContract(e.target.value)} />
      {!isWithdrawal && (
        <>
          <label style={labelStyle} htmlFor="req-type">Art der Kündigung</label>
          <select id="req-type" style={input} value={cancelType} onChange={(e) => setCancelType(e.target.value)}>
            <option>Ordentliche Kündigung zum nächstmöglichen Zeitpunkt</option>
            <option>Außerordentliche Kündigung</option>
          </select>
          {extraordinary && (
            <>
              <label style={labelStyle} htmlFor="req-reason">Grund der außerordentlichen Kündigung</label>
              <textarea id="req-reason" style={{ ...input, minHeight: "80px" }} value={reason} onChange={(e) => setReason(e.target.value)} />
            </>
          )}
        </>
      )}
      <input aria-hidden="true" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} style={{ position: "absolute", left: "-9999px" }} />
      <button onClick={() => setStep("review")} disabled={!complete} className="pk-btn-accent" style={{ ...button, opacity: complete ? 1 : 0.5, cursor: complete ? "pointer" : "default" }}>
        Weiter zur Bestätigung
      </button>
    </div>
  );
}
