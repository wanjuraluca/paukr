import LegalShell from "./legal/LegalShell";

export const metadata = { title: "Seite nicht gefunden · paukr" };

export default function NotFound() {
  return (
    <LegalShell>
      <h1 style={{ fontFamily: "var(--font-space), sans-serif", fontWeight: 700, fontSize: "clamp(28px,3.4vw,38px)", letterSpacing: "-.02em", margin: "0 0 12px" }}>
        Diese Seite gibt es nicht
      </h1>
      <p style={{ margin: "0 0 24px" }}>Vielleicht hat sich die Adresse geändert oder der Link ist falsch.</p>
      <a href="/app" className="pk-btn-accent" style={{ display: "inline-block", borderRadius: "12px", padding: "13px 22px", background: "var(--accent)", color: "var(--on-accent)", fontWeight: 700, fontSize: "15px", textDecoration: "none" }}>
        Weiter lernen
      </a>
    </LegalShell>
  );
}
