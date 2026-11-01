"use client";

import { useState, type CSSProperties } from "react";
import { createClient } from "@/lib/supabase/client";
import { deleteAccount } from "./actions";

const heading: CSSProperties = { fontFamily: "var(--font-space), sans-serif" };
const h2: CSSProperties = { ...heading, fontWeight: 600, fontSize: "18px", margin: "36px 0 10px" };
const link: CSSProperties = { color: "var(--accent-strong)" };

export default function KontoClient({ email, isPro }: { email: string; isPro: boolean }) {
  const [confirmation, setConfirmation] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDelete = async () => {
    setBusy(true);
    setError(null);
    const res = await deleteAccount(confirmation);
    if (!res.ok) {
      setError(res.error ?? "Das hat nicht geklappt.");
      setBusy(false);
      return;
    }
    await createClient().auth.signOut().catch(() => undefined);
    window.location.href = "/";
  };

  return (
    <>
      <h1 style={{ ...heading, fontWeight: 700, fontSize: "clamp(28px,3.4vw,38px)", letterSpacing: "-.02em", margin: "0 0 20px" }}>Dein Konto</h1>
      <p style={{ margin: 0 }}>Angemeldet als {email}</p>

      <h2 style={h2}>Abo</h2>
      <p style={{ margin: 0 }}>
        {isPro ? "Du nutzt paukr Pro. " : "Du nutzt paukr Free. "}
        <a href="/upgrade" style={link}>{isPro ? "Abo verwalten" : "Tarife ansehen"}</a>
      </p>

      <h2 style={h2}>Konto löschen</h2>
      <p style={{ margin: "0 0 14px" }}>
        Dein Konto und dein Lernfortschritt werden sofort und endgültig gelöscht.
        {isPro && " Dein Pro-Abo endet damit sofort, auch wenn der bezahlte Monat noch läuft. Wenn du Pro bis zum Monatsende nutzen möchtest, kündige erst und lösche das Konto danach."}
        {" "}Rechnungsbelege bewahren wir nach den gesetzlichen Fristen auf.
      </p>
      <label htmlFor="delete-confirm" style={{ display: "block", fontSize: "14px", fontWeight: 600, marginBottom: "6px" }}>
        Tippe LÖSCHEN zur Bestätigung ein
      </label>
      <input
        id="delete-confirm"
        value={confirmation}
        onChange={(e) => setConfirmation(e.target.value)}
        autoComplete="off"
        style={{ width: "100%", maxWidth: "320px", boxSizing: "border-box", padding: "11px 13px", borderRadius: "10px", border: "1px solid var(--border)", background: "var(--surface)", color: "var(--text)", fontSize: "15px", fontFamily: "inherit" }}
      />
      <div>
        <button
          onClick={onDelete}
          disabled={busy || confirmation !== "LÖSCHEN"}
          style={{ marginTop: "14px", border: "none", borderRadius: "12px", padding: "13px 22px", background: "var(--err-strong)", color: "#fff", fontWeight: 700, fontSize: "15px", fontFamily: "inherit", cursor: busy || confirmation !== "LÖSCHEN" ? "default" : "pointer", opacity: busy || confirmation !== "LÖSCHEN" ? 0.5 : 1 }}
        >
          {busy ? "Wird gelöscht" : "Konto endgültig löschen"}
        </button>
      </div>
      {error && <p style={{ color: "var(--err-strong)", margin: "12px 0 0" }}>{error}</p>}
    </>
  );
}
