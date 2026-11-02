const LINKS = [
  { label: "Nutzungsbedingungen", href: "/agb" },
  { label: "Datenschutz", href: "/datenschutz" },
  { label: "Impressum", href: "/impressum" },
  { label: "Verträge hier kündigen", href: "/kuendigen" },
  { label: "Vertrag widerrufen", href: "/widerruf" },
];

export default function PublicFooter() {
  return (
    <footer style={{ marginTop: "56px", paddingTop: "24px", borderTop: "1px solid var(--border)", color: "var(--muted)", fontSize: "13px" }}>
      <p style={{ margin: "0 0 14px" }}>
        paukr ist ein unabhängiges Übungsangebot ohne Verbindung zu den Industrie- und Handelskammern, der DIHK, der AkA
        oder der ZPA. Alle Fragen sind eigene Übungsfragen, keine Original-Prüfungsaufgaben. Keine Bestehensgarantie.
      </p>
      <nav style={{ display: "flex", flexWrap: "wrap", gap: "6px 18px" }}>
        {LINKS.map((l) => (
          <a key={l.href} href={l.href} className="pk-footer-link" style={{ color: "var(--muted)", textDecoration: "none", padding: "4px 0" }}>
            {l.label}
          </a>
        ))}
      </nav>
    </footer>
  );
}
