import Breadcrumbs from "@/components/site/Breadcrumbs";
import CtaBox from "@/components/site/CtaBox";
import JsonLd from "@/components/site/JsonLd";
import SiteShell from "@/components/site/SiteShell";
import { FAQ_GROUPS } from "@/lib/faq";
import { pageMetadata } from "@/lib/seo";
import { faqPage } from "@/lib/structured-data";

export const metadata = pageMetadata({
  title: "Häufige Fragen zu paukr und zur Prüfung | paukr",
  description: "Antworten zu Kosten, Kündigung und den Übungsfragen von paukr sowie zu AP1 und AP2 für Fachinformatiker Anwendungsentwicklung.",
  path: "/faq",
});

export default function FaqPage() {
  return (
    <SiteShell source="faq">
      <JsonLd data={faqPage(FAQ_GROUPS.flatMap((g) => g.items))} />
      <Breadcrumbs items={[{ name: "Startseite", path: "/" }, { name: "Häufige Fragen", path: "/faq" }]} />
      <h1>Häufige Fragen</h1>
      <p className="pk-lead">Was paukr ist, was es kostet und was du über die Prüfung wissen solltest.</p>
      {FAQ_GROUPS.map((group) => (
        <section key={group.title}>
          <h2>{group.title}</h2>
          {group.items.map((item) => (
            <div key={item.question}>
              <h3>{item.question}</h3>
              <p>{item.answer}</p>
            </div>
          ))}
        </section>
      ))}
      <CtaBox source="faq" title="Am besten selbst ausprobieren" text="Der Einstieg ist kostenlos und ohne Kreditkarte möglich." label="Kostenlos starten" />
    </SiteShell>
  );
}
