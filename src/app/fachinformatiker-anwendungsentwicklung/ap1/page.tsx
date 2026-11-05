import Link from "next/link";
import Breadcrumbs from "@/components/site/Breadcrumbs";
import CtaBox from "@/components/site/CtaBox";
import JsonLd from "@/components/site/JsonLd";
import SampleQuestions from "@/components/site/SampleQuestions";
import SiteShell from "@/components/site/SiteShell";
import { FIAE_PATH, FIAE_SLUG, LAW_URL } from "@/lib/fiae";
import { loadTopicSamples } from "@/lib/public-exams";
import { pageMetadata } from "@/lib/seo";
import { learningResource } from "@/lib/structured-data";

export const revalidate = 3600;

const PATH = `${FIAE_PATH}/ap1`;
const DESCRIPTION = "AP1 für Fachinformatiker: Einrichten eines IT-gestützten Arbeitsplatzes. Was geprüft wird, wie viel die Prüfung zählt und wie du dich vorbereitest.";

export const metadata = pageMetadata({
  title: "AP1 Fachinformatiker: Inhalte und Übungsfragen | paukr",
  description: DESCRIPTION,
  path: PATH,
});

export default async function Ap1Page() {
  const samples = await loadTopicSamples(FIAE_SLUG, [{ topic: "Netzwerke", keys: ["net-dhcp", "net-dns", "net-firewall", "net-private-ip"] }]);
  return (
    <SiteShell source="fiae-ap1">
      <JsonLd data={learningResource({ name: "AP1 für Fachinformatiker Anwendungsentwicklung", description: DESCRIPTION, path: PATH, teaches: ["Einrichten eines IT-gestützten Arbeitsplatzes"] })} />
      <Breadcrumbs items={[{ name: "Startseite", path: "/" }, { name: "Fachinformatiker Anwendungsentwicklung", path: FIAE_PATH }, { name: "AP1", path: PATH }]} />
      <h1>AP1 für Fachinformatiker: Einrichten eines IT-gestützten Arbeitsplatzes</h1>
      <p className="pk-lead">
        Die AP1 ist Teil 1 der Abschlussprüfung. Sie findet im vierten Ausbildungshalbjahr statt und ist für alle Fachrichtungen dieselbe.
      </p>

      <h2>Die wichtigsten Fakten</h2>
      <ul>
        <li>Schriftliche Prüfung mit praxisbezogenen Aufgaben</li>
        <li>90 Minuten Prüfungszeit</li>
        <li>20 % der Gesamtnote</li>
        <li>Den genauen Termin legt deine Kammer fest</li>
      </ul>

      <h2>Was in der AP1 geprüft wird</h2>
      <p>Laut Verordnung sollst du nachweisen, dass du</p>
      <ul>
        <li>den Bedarf von Kunden passend zur Zielgruppe ermitteln kannst,</li>
        <li>Hard- und Software auswählen und die Beschaffung anstoßen kannst,</li>
        <li>einen IT-Arbeitsplatz konfigurieren und testen kannst und dabei Datenschutz, IT-Sicherheit und Qualitätssicherung beachtest,</li>
        <li>Kunden in die Nutzung des Arbeitsplatzes einweisen kannst,</li>
        <li>deine Leistung kontrollieren und protokollieren kannst.</li>
      </ul>

      <h2>Wie wichtig ist die AP1?</h2>
      <p>
        Die AP1 fließt mit 20 % in dein Gesamtergebnis ein. Die Regeln zu einzelnen Prüfungsbereichen beziehen sich auf Teil 2, eine schwache AP1 musst du aber im Gesamtergebnis ausgleichen. Details stehen in der <a href={LAW_URL} rel="noopener">Verordnung</a>. Danach geht es mit der <Link href={`${FIAE_PATH}/ap2`}>AP2</Link> weiter.
      </p>

      <h2>So bereitest du dich vor</h2>
      <p>Gehe einen Beispielfall einmal von vorne bis hinten durch: Ein Kunde braucht einen neuen Arbeitsplatz. Was fragst du ihn, welche Geräte vergleichst du und wie richtest du alles sicher ein? Wer diesen Ablauf erklären kann, hat den roten Faden der AP1 verstanden.</p>
      <p>
        Grundlagen wie Netzwerke solltest du dabei sicher beherrschen. Unsere Fragen sind nach Themen sortiert, deshalb passt nicht jede davon direkt zur AP1. Wie du die Zeit bis zur Prüfung einteilst, steht im <Link href="/ratgeber/lernplan-abschlusspruefung">Lernplan</Link>.
      </p>

      <h2>Beispielfragen aus dem Bereich Netzwerke</h2>
      <p>Überleg dir erst deine Antwort und schau dann in die Lösung. Die Aufgaben in der echten Prüfung sehen anders aus.</p>
      <SampleQuestions questions={samples} />
      <CtaBox source="fiae-ap1" title="Netzwerke und weitere Themen üben" text="Jede Frage hat eine Erklärung, und falsche Antworten kommen später wieder." />
    </SiteShell>
  );
}
