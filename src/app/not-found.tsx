import Link from "next/link";
import SiteShell from "@/components/site/SiteShell";
import { noindexMetadata } from "@/lib/seo";

export const metadata = noindexMetadata("Seite nicht gefunden | paukr");

export default function NotFound() {
  return (
    <SiteShell>
      <h1>Diese Seite gibt es nicht</h1>
      <p className="pk-lead">Vielleicht hat sich die Adresse geändert oder der Link ist falsch. Hier geht es weiter:</p>
      <ul>
        <li>
          <Link href="/">Startseite</Link>
        </li>
        <li>
          <Link href="/pruefungen">Übungsfragen nach Prüfung</Link>
        </li>
        <li>
          <Link href="/fachinformatiker-anwendungsentwicklung">Fachinformatiker Anwendungsentwicklung</Link>
        </li>
        <li>
          <Link href="/ratgeber">Ratgeber</Link>
        </li>
        <li>
          <Link href="/app">Zur App</Link>
        </li>
      </ul>
    </SiteShell>
  );
}
