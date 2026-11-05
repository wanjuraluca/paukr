import Link from "next/link";
import Breadcrumbs from "@/components/site/Breadcrumbs";
import CtaBox from "@/components/site/CtaBox";
import SiteShell from "@/components/site/SiteShell";
import { allArticles } from "@/lib/ratgeber";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Ratgeber zur Abschlussprüfung für Azubis | paukr",
  description: "Lernplan, AP2, Projektarbeit und WiSo: praktische Ratgeber für deine Vorbereitung auf die Abschlussprüfung in der Ausbildung.",
  path: "/ratgeber",
});

export default function RatgeberPage() {
  return (
    <SiteShell source="ratgeber">
      <Breadcrumbs items={[{ name: "Startseite", path: "/" }, { name: "Ratgeber", path: "/ratgeber" }]} />
      <h1>Ratgeber zur Abschlussprüfung</h1>
      <p className="pk-lead">Praktische Tipps für deine Prüfungsvorbereitung, vom Lernplan bis zum Fachgespräch.</p>
      <div style={{ display: "grid", gap: "12px" }}>
        {allArticles().map((article) => (
          <article key={article.slug} style={{ padding: "18px 20px", borderRadius: "14px", background: "var(--surface)", border: "1px solid var(--border)" }}>
            <h2 style={{ fontSize: "19px", margin: "0 0 6px" }}>
              <Link href={`/ratgeber/${article.slug}`} style={{ color: "var(--text)", textDecoration: "none" }}>
                {article.heading}
              </Link>
            </h2>
            <p style={{ margin: 0, color: "var(--muted)", fontSize: "15px" }}>{article.description}</p>
          </article>
        ))}
      </div>
      <CtaBox source="ratgeber" title="Lesen ist gut, üben ist besser" text="Teste dein Wissen mit Übungsfragen und Erklärungen, kostenlos und ohne Kreditkarte." />
    </SiteShell>
  );
}
