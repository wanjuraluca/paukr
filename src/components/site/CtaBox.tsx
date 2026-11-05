import AppLink from "./AppLink";

export const CTA_BUTTON_STYLE = { display: "inline-block", fontWeight: 600, fontSize: "15.5px", padding: "13px 24px", borderRadius: "13px", background: "var(--accent)", color: "var(--on-accent)" };

export default function CtaBox({ source, title, text, label = "Kostenlos üben" }: { source: string; title: string; text: string; label?: string }) {
  return (
    <aside style={{ margin: "40px 0 0", padding: "24px", borderRadius: "16px", background: "var(--bg-alt)", border: "1px solid var(--border)" }}>
      <div style={{ fontFamily: "var(--font-space), sans-serif", fontWeight: 600, fontSize: "20px", marginBottom: "6px" }}>{title}</div>
      <p style={{ margin: "0 0 16px", color: "var(--muted)" }}>{text}</p>
      <AppLink source={source} className="pk-scale-btn-sm" style={CTA_BUTTON_STYLE}>
        {label}
      </AppLink>
    </aside>
  );
}
