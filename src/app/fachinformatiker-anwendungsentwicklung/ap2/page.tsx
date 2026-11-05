import Link from "next/link";
import Breadcrumbs from "@/components/site/Breadcrumbs";
import CtaBox from "@/components/site/CtaBox";
import JsonLd from "@/components/site/JsonLd";
import SiteShell from "@/components/site/SiteShell";
import { EXAM_PARTS, FIAE_PATH, LAW_URL } from "@/lib/fiae";
import { pageMetadata } from "@/lib/seo";
import { learningResource } from "@/lib/structured-data";

const PATH = `${FIAE_PATH}/ap2`;
const DESCRIPTION = "Die AP2 für Fachinformatiker Anwendungsentwicklung: vier Prüfungsbereiche, ihre Gewichtung und Dauer, Bestehensregeln und Tipps zur Vorbereitung.";
const AREAS = EXAM_PARTS.filter((row) => row.part.startsWith("AP2"));

export const metadata = pageMetadata({
  title: "AP2 Fachinformatiker Anwendungsentwicklung üben | paukr",
  description: DESCRIPTION,
  path: PATH,
});

export default function Ap2Page() {
  return (
    <SiteShell source="fiae-ap2">
      <JsonLd data={learningResource({ name: "AP2 für Fachinformatiker Anwendungsentwicklung", description: DESCRIPTION, path: PATH, teaches: AREAS.map((a) => a.area) })} />
      <Breadcrumbs items={[{ name: "Startseite", path: "/" }, { name: "Fachinformatiker Anwendungsentwicklung", path: FIAE_PATH }, { name: "AP2", path: PATH }]} />
      <h1>AP2 für Fachinformatiker Anwendungsentwicklung</h1>
      <p className="pk-lead">
        Die AP2 ist Teil 2 der Abschlussprüfung am Ende der Ausbildung. Sie zählt zusammen 80 % der Gesamtnote und entscheidet deshalb über das Bestehen.
      </p>

      <h2>Die vier Prüfungsbereiche</h2>
      <div className="pk-table-wrap">
        <table>
          <thead>
            <tr>
              <th scope="col">Prüfungsbereich</th>
              <th scope="col">Form</th>
              <th scope="col">Dauer</th>
              <th scope="col">Anteil</th>
            </tr>
          </thead>
          <tbody>
            {AREAS.map((row) => (
              <tr key={row.area}>
                <th scope="row">
                  <Link href={row.path}>{row.area}</Link>
                </th>
                <td>{row.form}</td>
                <td>{row.time}</td>
                <td>{row.weight}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>Was du bestehen musst</h2>
      <p>Das Ergebnis von Teil 2 muss mindestens &quot;ausreichend&quot; sein, ebenso das Gesamtergebnis. In mindestens drei der vier Bereiche brauchst du &quot;ausreichend&quot;, und kein Bereich darf &quot;ungenügend&quot; sein.</p>
      <p>
        In einem der drei schriftlichen Bereiche kannst du unter bestimmten Bedingungen eine mündliche Ergänzungsprüfung beantragen, wenn sie für das Bestehen den Ausschlag geben kann. Sie soll 15 Minuten dauern. Verbindlich ist der Wortlaut der <a href={LAW_URL} rel="noopener">Verordnung</a>, frag im Zweifel bei deiner Kammer nach.
      </p>

      <h2>Worauf du dich konzentrieren solltest</h2>
      <p>
        Die Hälfte der Gesamtnote hängt an der <Link href="/ratgeber/betriebliche-projektarbeit">betrieblichen Projektarbeit</Link> mit Präsentation und Fachgespräch. Dafür reicht kein Üben am Ende, du planst sie über Wochen. Die drei schriftlichen Bereiche übst du am besten parallel dazu in kurzen, regelmäßigen Einheiten.
      </p>
      <p>
        Einen möglichen Ablauf findest du im Artikel <Link href="/ratgeber/ap2-vorbereitung">So bereitest du dich auf die AP2 vor</Link>. Erste Fragen zum Ausprobieren stehen bei den <Link href="/pruefungen/fiae-ae">Beispielfragen</Link>.
      </p>
      <CtaBox source="fiae-ap2" title="Schriftliche Bereiche festigen" text="Übe Programmierung, Datenbanken, Netzwerke und WiSo mit Erklärungen zu jeder Frage." />
    </SiteShell>
  );
}
