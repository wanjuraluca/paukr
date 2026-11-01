"use client";

import LegalShell from "./legal/LegalShell";

export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return (
    <LegalShell>
      <h1 style={{ fontFamily: "var(--font-space), sans-serif", fontWeight: 700, fontSize: "clamp(28px,3.4vw,38px)", letterSpacing: "-.02em", margin: "0 0 12px" }}>
        Da ist etwas schiefgelaufen
      </h1>
      <p style={{ margin: "0 0 24px" }}>
        Versuch es bitte noch einmal. Wenn es nicht klappt, schreib uns an{" "}
        <a href="mailto:info@paukr.app" style={{ color: "var(--accent-strong)" }}>info@paukr.app</a>.
      </p>
      <button onClick={reset} className="pk-btn-accent" style={{ border: "none", borderRadius: "12px", padding: "13px 22px", background: "var(--accent)", color: "var(--on-accent)", fontWeight: 700, fontSize: "15px", cursor: "pointer" }}>
        Noch einmal versuchen
      </button>
    </LegalShell>
  );
}
