"use client";

import { useState } from "react";
import { reportQuestion } from "./actions";

export default function ReportQuestion({ questionId }: { questionId: string }) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<"idle" | "sent" | "error">("idle");

  if (status === "sent") {
    return <p style={{ fontSize: "13.5px", color: "var(--muted)", margin: "12px 0 0" }}>Danke, wir schauen uns das an.</p>;
  }
  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        style={{ marginTop: "4px", padding: "10px 0", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", fontSize: "13.5px", color: "var(--muted)", textDecoration: "underline" }}
      >
        Fehler in dieser Frage melden
      </button>
    );
  }

  const send = async () => {
    setBusy(true);
    const res = await reportQuestion(questionId, message);
    setBusy(false);
    setStatus(res.ok ? "sent" : "error");
  };

  return (
    <div style={{ marginTop: "12px" }}>
      <textarea
        aria-label="Was stimmt an dieser Frage nicht?"
        placeholder="Was stimmt an dieser Frage nicht?"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        maxLength={1000}
        style={{ width: "100%", boxSizing: "border-box", minHeight: "76px", padding: "10px 12px", borderRadius: "10px", border: "1px solid var(--border)", background: "var(--bg)", color: "var(--text)", fontFamily: "inherit", fontSize: "14px" }}
      />
      <button
        onClick={send}
        disabled={busy || !message.trim()}
        style={{ marginTop: "8px", padding: "8px 14px", borderRadius: "10px", border: "1px solid var(--border)", background: "var(--surface)", color: "var(--text)", cursor: busy || !message.trim() ? "default" : "pointer", opacity: busy || !message.trim() ? 0.6 : 1, fontFamily: "inherit", fontWeight: 600, fontSize: "13.5px" }}
      >
        Meldung senden
      </button>
      {status === "error" && (
        <p style={{ fontSize: "13.5px", color: "var(--err-strong)", margin: "8px 0 0" }}>
          Das hat nicht geklappt. Schreib uns gern an info@paukr.app.
        </p>
      )}
    </div>
  );
}
