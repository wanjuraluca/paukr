import type { CSSProperties } from "react";
import LegalShell from "../legal/LegalShell";
import { pageMetadata } from "@/lib/seo";

const heading: CSSProperties = { fontFamily: "var(--font-space), sans-serif" };

export const metadata = pageMetadata({
  title: "Impressum | paukr",
  description: "Anbieterkennzeichnung von paukr nach § 5 DDG mit Kontaktdaten und dem Hinweis, dass paukr unabhängig von den Prüfungsstellen ist.",
  path: "/impressum",
});

export default function ImpressumPage() {
  return (
    <LegalShell>
      <h1 style={{ ...heading, fontWeight: 700, fontSize: "clamp(28px,3.4vw,38px)", letterSpacing: "-.02em", margin: "0 0 32px" }}>
        Impressum
      </h1>

      <h2 style={{ ...heading, fontWeight: 600, fontSize: "18px", margin: "0 0 10px" }}>Angaben gemäß § 5 DDG</h2>
      <p style={{ margin: "0 0 24px" }}>
        Luca Wanjura
        <br />
        Uranusweg 18
        <br />
        45770 Marl
        <br />
        Deutschland
      </p>

      <h2 style={{ ...heading, fontWeight: 600, fontSize: "18px", margin: "0 0 10px" }}>Kontakt</h2>
      <p style={{ margin: "0 0 24px" }}>
        E-Mail: <a href="mailto:info@paukr.app" style={{ color: "var(--accent-strong)" }}>info@paukr.app</a>
      </p>

      <h2 style={{ ...heading, fontWeight: 600, fontSize: "18px", margin: "0 0 10px" }}>Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</h2>
      <p style={{ margin: "0 0 24px" }}>
        Luca Wanjura (Anschrift wie oben)
      </p>

      <h2 style={{ ...heading, fontWeight: 600, fontSize: "18px", margin: "0 0 10px" }}>Haftungshinweis</h2>
      <p style={{ margin: "0 0 24px" }}>
        paukr ist ein unabhängiges Übungsangebot und steht in keiner Verbindung zu den Industrie- und Handelskammern, der
        DIHK, der AkA, der ZPA oder einer anderen Prüfungsstelle. Die Übungsfragen und Simulationen sind eigenständig
        erstellt und keine Original-Prüfungsaufgaben.
      </p>

      <h2 style={{ ...heading, fontWeight: 600, fontSize: "18px", margin: "0 0 10px" }}>Streitschlichtung</h2>
      <p style={{ margin: 0, color: "var(--muted)" }}>
        Wir sind nicht bereit und nicht verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle
        teilzunehmen.
      </p>
    </LegalShell>
  );
}
