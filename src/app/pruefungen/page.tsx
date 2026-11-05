import Link from "next/link";
import Breadcrumbs from "@/components/site/Breadcrumbs";
import SiteShell from "@/components/site/SiteShell";
import { loadPublicExams, questionCount } from "@/lib/public-exams";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 3600;

export const metadata = pageMetadata({
  title: "Übungsfragen für Abschlussprüfungen nach Beruf | paukr",
  description: "Eigene Übungsfragen für Ausbildungsberufe, nach Themen sortiert, mit Erklärungen und Simulation. Beispielfragen ansehen und kostenlos starten.",
  path: "/pruefungen",
});

export default async function PruefungenPage() {
  const exams = await loadPublicExams();
  return (
    <SiteShell>
      <Breadcrumbs items={[{ name: "Startseite", path: "/" }, { name: "Prüfungen", path: "/pruefungen" }]} />
      <h1>Übungsfragen für deine Abschlussprüfung</h1>
      <p className="pk-lead">Wähle deinen Ausbildungsberuf und schau dir Themen und Beispielfragen an.</p>
      <div style={{ display: "grid", gap: "12px" }}>
        {exams.map((exam) => (
          <Link
            key={exam.id}
            href={`/pruefungen/${exam.slug}`}
            className="pk-exam-card"
            style={{ display: "block", padding: "18px 20px", borderRadius: "14px", background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)", textDecoration: "none", transition: "transform .2s, border-color .2s" }}
          >
            <span style={{ display: "block", fontFamily: "var(--font-space), sans-serif", fontWeight: 600, fontSize: "18px" }}>{exam.name}</span>
            <span style={{ display: "block", fontSize: "14px", color: "var(--muted)", marginTop: "2px" }}>
              {questionCount(exam).toLocaleString("de-DE")} Übungsfragen in {exam.topics.length} Themen
            </span>
          </Link>
        ))}
      </div>
    </SiteShell>
  );
}
