import Link from "next/link";

const GROUPS = [
  {
    title: "Üben",
    links: [
      { label: "Alle Prüfungen", href: "/pruefungen" },
      { label: "Fachinformatiker Anwendungsentwicklung", href: "/fachinformatiker-anwendungsentwicklung" },
      { label: "AP1", href: "/fachinformatiker-anwendungsentwicklung/ap1" },
      { label: "AP2", href: "/fachinformatiker-anwendungsentwicklung/ap2" },
    ],
  },
  {
    title: "Wissen",
    links: [
      { label: "Ratgeber", href: "/ratgeber" },
      { label: "Häufige Fragen", href: "/faq" },
      { label: "Preise", href: "/preise" },
    ],
  },
  {
    title: "Rechtliches",
    links: [
      { label: "Nutzungsbedingungen", href: "/agb" },
      { label: "Datenschutz", href: "/datenschutz" },
      { label: "Impressum", href: "/impressum" },
      { label: "Verträge hier kündigen", href: "/kuendigen" },
      { label: "Vertrag widerrufen", href: "/widerruf" },
    ],
  },
];

export default function SiteFooter() {
  return (
    <footer style={{ borderTop: "1px solid var(--border)", background: "var(--bg-alt)", color: "var(--text)" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "48px 28px 32px", display: "flex", flexWrap: "wrap", gap: "36px 64px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", alignSelf: "flex-start", marginRight: "auto" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.svg" width={28} height={28} alt="" style={{ borderRadius: "8px" }} />
          <span style={{ fontFamily: "var(--font-space), sans-serif", fontWeight: 700, fontSize: "18px", letterSpacing: "-.02em" }}>paukr</span>
        </div>
        {GROUPS.map((group) => (
          <nav key={group.title} aria-label={group.title} style={{ fontSize: "15px" }}>
            <div style={{ fontWeight: 600, marginBottom: "10px" }}>{group.title}</div>
            <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
              {group.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="pk-footer-link" style={{ display: "inline-block", padding: "5px 0", textDecoration: "none", color: "var(--muted)", fontWeight: 500, transition: "color .2s" }}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div style={{ borderTop: "1px solid var(--border)", padding: "20px 28px", textAlign: "center", color: "var(--muted)", fontSize: "13px" }}>
        paukr ist ein unabhängiges Übungsangebot ohne Verbindung zu den Industrie- und Handelskammern, der DIHK, der AkA oder der ZPA. Alle Fragen sind eigene Übungsfragen, keine Original-Prüfungsaufgaben. Keine Bestehensgarantie.
        <br />
        © 2026 paukr. Alle Rechte vorbehalten.
      </div>
    </footer>
  );
}
