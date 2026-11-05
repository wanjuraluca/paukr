import Link from "next/link";
import AppLink from "./AppLink";
import { ThemeToggle } from "./Theme";

const LINKS = [
  { label: "Prüfungen", href: "/pruefungen" },
  { label: "Fachinformatiker", href: "/fachinformatiker-anwendungsentwicklung" },
  { label: "Ratgeber", href: "/ratgeber" },
  { label: "Preise", href: "/preise" },
  { label: "FAQ", href: "/faq" },
];

export default function SiteHeader({ source }: { source?: string }) {
  return (
    <header style={{ position: "sticky", top: 0, zIndex: 50, backdropFilter: "blur(14px)", background: "color-mix(in srgb, var(--bg) 78%, transparent)", borderBottom: "1px solid var(--border)" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "14px 28px", display: "flex", alignItems: "center", gap: "28px" }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none", color: "var(--text)", marginRight: "auto" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.svg" width={30} height={30} alt="" style={{ borderRadius: "9px" }} />
          <span style={{ fontFamily: "var(--font-space), sans-serif", fontWeight: 700, fontSize: "20px", letterSpacing: "-.02em" }}>paukr</span>
        </Link>
        <nav aria-label="Hauptmenü" className="pk-nav-links" style={{ display: "flex", alignItems: "center", gap: "24px", marginRight: "auto" }}>
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="pk-navlink" style={{ textDecoration: "none", color: "var(--muted)", fontWeight: 500, fontSize: "15px", padding: "8px 2px", transition: "color .2s" }}>
              {l.label}
            </Link>
          ))}
        </nav>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <ThemeToggle />
          <AppLink
            source={source}
            ariaLabel="Kostenlos starten"
            className="pk-btn-accent pk-cta-btn-nav"
            style={{ fontWeight: 600, fontSize: "15px", padding: "11px 20px", borderRadius: "12px", background: "var(--accent)", color: "var(--on-accent)", display: "flex", alignItems: "center", gap: "8px", boxShadow: "0 6px 20px color-mix(in oklch, var(--accent) 32%, transparent)", transition: "transform .18s cubic-bezier(.2,.9,.3,1.3), box-shadow .25s" }}
          >
            <span className="pk-cta-label">Kostenlos starten</span>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
              <path d="M5 12h13M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </AppLink>
        </div>
      </div>
    </header>
  );
}
