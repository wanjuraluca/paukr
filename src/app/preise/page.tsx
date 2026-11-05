import Link from "next/link";
import AppLink from "@/components/site/AppLink";
import Breadcrumbs from "@/components/site/Breadcrumbs";
import { CTA_BUTTON_STYLE } from "@/components/site/CtaBox";
import JsonLd from "@/components/site/JsonLd";
import SiteShell from "@/components/site/SiteShell";
import { FREE_TRY_LIMIT } from "@/lib/limits";
import { pageMetadata } from "@/lib/seo";
import { softwareApplication } from "@/lib/structured-data";

export const metadata = pageMetadata({
  title: "Preise: kostenlos starten, Pro für 9,99 € im Monat | paukr",
  description: "paukr kostenlos testen, ohne Kreditkarte. Pro kostet 9,99 € im Monat, ist monatlich kündbar und hebt die Grenze für Lernsitzungen auf.",
  path: "/preise",
});

const ROWS = [
  { label: "Alle Fragen und Themen", free: "Ja", pro: "Ja" },
  { label: "Lernsitzungen, Simulationen und Blitz-Läufe", free: `${FREE_TRY_LIMIT} pro Prüfung`, pro: "Unbegrenzt" },
  { label: "XP und Fortschritt", free: "Ja", pro: "Ja" },
  { label: "Preis", free: "0 €", pro: "9,99 € im Monat (Endpreis)" },
];

export default function PreisePage() {
  return (
    <SiteShell source="preise">
      <JsonLd data={softwareApplication()} />
      <Breadcrumbs items={[{ name: "Startseite", path: "/" }, { name: "Preise", path: "/preise" }]} />
      <h1>Preise</h1>
      <p className="pk-lead">
        Du startest kostenlos und ohne Kreditkarte. Wenn dir paukr hilft und du mehr üben willst, hebt Pro die Grenze auf. Die Fragen sind in beiden Tarifen dieselben.
      </p>
      <div className="pk-table-wrap">
        <table>
          <thead>
            <tr>
              <th scope="col">Leistung</th>
              <th scope="col">Free</th>
              <th scope="col">Pro</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row) => (
              <tr key={row.label}>
                <th scope="row">{row.label}</th>
                <td>{row.free}</td>
                <td>{row.pro}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p style={{ marginTop: "22px" }}>
        <AppLink source="preise" className="pk-scale-btn-sm" style={CTA_BUTTON_STYLE}>
          Kostenlos starten
        </AppLink>
      </p>

      <h2>Wann lohnt sich Pro?</h2>
      <p>
        Die kostenlosen Sitzungen reichen, um paukr kennenzulernen und ein Thema anzutesten. Für eine längere Vorbereitung mit vielen Wiederholungen und mehreren Simulationen brauchst du Pro. Pro gilt nur, solange du es brauchst: Nach der Prüfung kannst du zum Monatsende kündigen.
      </p>

      <h2>Vertrag und Kündigung</h2>
      <p>
        Pro verlängert sich monatlich und ist jederzeit zum Monatsende kündbar. Du kannst über die Seite <Link href="/kuendigen">Verträge hier kündigen</Link> auch ohne Anmeldung kündigen. Informationen zum Widerruf findest du unter <Link href="/widerruf">Vertrag widerrufen</Link>, alle Bedingungen in den <Link href="/agb">Nutzungsbedingungen</Link>.
      </p>
      <p>Eine Garantie zum Bestehen der Prüfung ist mit keinem Tarif verbunden. Weitere Antworten stehen in den <Link href="/faq">häufigen Fragen</Link>.</p>
    </SiteShell>
  );
}
