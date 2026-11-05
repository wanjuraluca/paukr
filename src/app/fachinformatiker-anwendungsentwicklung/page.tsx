import Link from "next/link";
import Breadcrumbs from "@/components/site/Breadcrumbs";
import CtaBox from "@/components/site/CtaBox";
import JsonLd from "@/components/site/JsonLd";
import SiteShell from "@/components/site/SiteShell";
import { EXAM_PARTS, FIAE_PATH, FIAE_SLUG, LAW_URL } from "@/lib/fiae";
import { loadPublicExams, questionCount } from "@/lib/public-exams";
import { pageMetadata } from "@/lib/seo";
import { learningResource } from "@/lib/structured-data";

export const revalidate = 3600;

const TITLE = "Fachinformatiker Anwendungsentwicklung Prüfung üben | paukr";
const DESCRIPTION = "Aufbau der Abschlussprüfung für Fachinformatiker Anwendungsentwicklung: AP1, AP2, Gewichtung und Dauer. Dazu kostenlose Übungsfragen mit Erklärung.";

export const metadata = pageMetadata({ title: TITLE, description: DESCRIPTION, path: FIAE_PATH });

export default async function FiaePage() {
  const exam = (await loadPublicExams()).find((e) => e.slug === FIAE_SLUG);
  return (
    <SiteShell source="fiae">
      <JsonLd
        data={learningResource({
          name: "Übungsfragen für Fachinformatiker Anwendungsentwicklung",
          description: DESCRIPTION,
          path: FIAE_PATH,
          teaches: exam?.topics.map((t) => t.name) ?? [],
        })}
      />
      <Breadcrumbs items={[{ name: "Startseite", path: "/" }, { name: "Fachinformatiker Anwendungsentwicklung", path: FIAE_PATH }]} />
      <h1>Fachinformatiker Anwendungsentwicklung: Prüfung verstehen und üben</h1>
      <p className="pk-lead">
        Die Abschlussprüfung besteht aus zwei Teilen, die meist AP1 und AP2 genannt werden. Hier siehst du, was in welchem Teil drankommt, wie viel jeder Bereich zählt und wie du dich mit paukr vorbereitest.
      </p>

      <h2>So ist die Prüfung aufgebaut</h2>
      <p>
        <Link href={`${FIAE_PATH}/ap1`}>Teil 1</Link> findet im vierten Ausbildungshalbjahr statt, <Link href={`${FIAE_PATH}/ap2`}>Teil 2</Link> am Ende der Ausbildung. Den genauen Termin legt deine zuständige Kammer fest.
      </p>
      <div className="pk-table-wrap">
        <table>
          <thead>
            <tr>
              <th scope="col">Teil</th>
              <th scope="col">Prüfungsbereich</th>
              <th scope="col">Form</th>
              <th scope="col">Dauer</th>
              <th scope="col">Anteil</th>
            </tr>
          </thead>
          <tbody>
            {EXAM_PARTS.map((row) => (
              <tr key={row.area}>
                <td>{row.part}</td>
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

      <h2>Wann ist die Prüfung bestanden?</h2>
      <p>Du brauchst mindestens &quot;ausreichend&quot; im Gesamtergebnis und im Ergebnis von Teil 2. Außerdem musst du in mindestens drei Bereichen von Teil 2 &quot;ausreichend&quot; erreichen und darfst dort in keinem Bereich &quot;ungenügend&quot; haben.</p>
      <p>
        Verbindlich sind die <a href={LAW_URL} rel="noopener">Fachinformatikerausbildungsverordnung</a> und die Angaben deiner Kammer. Wir geben die Regeln hier nur vereinfacht wieder.
      </p>

      <h2>Was du mit paukr üben kannst</h2>
      {exam && (
        <p>
          Im Pool liegen {questionCount(exam).toLocaleString("de-DE")} eigene Übungsfragen, sortiert nach Themen und nicht nach AP1 oder AP2:
        </p>
      )}
      {exam && (
        <ul>
          {exam.topics.map((t) => (
            <li key={t.id}>
              {t.name}: {t.questions[0]?.count ?? 0} Fragen
            </li>
          ))}
        </ul>
      )}
      <p>
        Das sind Auswahlfragen mit Erklärung. Sie helfen dir, Wissen zu festigen und Lücken zu finden. In der echten Prüfung bearbeitest du dagegen praxisbezogene Aufgaben schriftlich. Eigenen Code, Diagramme, die Projektarbeit und das Fachgespräch musst du zusätzlich üben.
      </p>
      <p>
        Schau dir zuerst die <Link href={`/pruefungen/${FIAE_SLUG}`}>Beispielfragen mit Lösung</Link> an. Tipps zum Vorgehen findest du im Ratgeber, zum Beispiel zur <Link href="/ratgeber/ap2-vorbereitung">Vorbereitung auf die AP2</Link> und zum <Link href="/ratgeber/lernplan-abschlusspruefung">Lernplan</Link>.
      </p>
      <CtaBox source="fiae" title="Jetzt kostenlos üben" text="Ohne Kreditkarte, mit drei Lernsitzungen pro Prüfung. Falsche Antworten kommen automatisch wieder." />
    </SiteShell>
  );
}
