import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/site/Breadcrumbs";
import CtaBox from "@/components/site/CtaBox";
import JsonLd from "@/components/site/JsonLd";
import SampleQuestions from "@/components/site/SampleQuestions";
import SiteShell from "@/components/site/SiteShell";
import { FIAE_PATH, FIAE_SLUG } from "@/lib/fiae";
import { FREE_TRY_LIMIT, PROBE_SIM_QUESTIONS, PROBE_SIM_SECONDS } from "@/lib/limits";
import { loadPublicExams, loadSampleQuestions, questionCount, shortExamName } from "@/lib/public-exams";
import { pageMetadata } from "@/lib/seo";
import { learningResource } from "@/lib/structured-data";

export const revalidate = 3600;

function describe(name: string, count: number) {
  return `${count.toLocaleString("de-DE")} eigene Übungsfragen für ${name}, nach Themen sortiert und mit Erklärungen. Beispielfragen ansehen und kostenlos üben.`;
}

async function findExam(slug: string) {
  const exams = await loadPublicExams();
  return exams.find((e) => e.slug === slug) ?? null;
}

export async function generateStaticParams() {
  const exams = await loadPublicExams();
  return exams.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const exam = await findExam(slug);
  if (!exam) return {};
  const short = shortExamName(exam);
  return pageMetadata({
    title: `${short}: Übungsfragen | paukr`,
    description: describe(short, questionCount(exam)),
    path: `/pruefungen/${exam.slug}`,
  });
}

export default async function ExamPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const exam = await findExam(slug);
  if (!exam) notFound();
  const samples = await loadSampleQuestions(exam);
  const source = `pruefung-${exam.slug}`;
  const path = `/pruefungen/${exam.slug}`;
  const others = (await loadPublicExams()).filter((e) => e.slug !== exam.slug);

  return (
    <SiteShell source={source}>
      <JsonLd
        data={learningResource({
          name: `Übungsfragen: ${exam.name}`,
          description: describe(exam.name, questionCount(exam)),
          path,
          teaches: exam.topics.map((t) => t.name),
        })}
      />
      <Breadcrumbs items={[{ name: "Startseite", path: "/" }, { name: "Prüfungen", path: "/pruefungen" }, { name: exam.name, path }]} />
      <h1>Übungsfragen: {exam.name}</h1>
      {exam.description && <p className="pk-lead">{exam.description}</p>}
      <p>
        <strong>
          {questionCount(exam).toLocaleString("de-DE")} Übungsfragen in {exam.topics.length} Themen
        </strong>
      </p>
      {exam.slug === FIAE_SLUG && (
        <p>
          Wie die Prüfung aufgebaut ist, liest du auf unserer Seite zu <Link href={FIAE_PATH}>Fachinformatiker Anwendungsentwicklung mit AP1 und AP2</Link>.
        </p>
      )}

      <h2>Themen</h2>
      <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: "8px" }}>
        {exam.topics.map((t) => (
          <li key={t.id} style={{ margin: 0, padding: "12px 16px", borderRadius: "14px", background: "var(--surface)", border: "1px solid var(--border)", display: "flex", justifyContent: "space-between", gap: "14px" }}>
            <span>{t.name}</span>
            <span style={{ color: "var(--muted)", whiteSpace: "nowrap" }}>{t.questions[0]?.count ?? 0} Fragen</span>
          </li>
        ))}
      </ul>

      <h2>Beispielfragen</h2>
      <p>Überleg dir erst deine Antwort und schau dann in die Lösung.</p>
      <SampleQuestions questions={samples} />

      <h2>So übst du mit paukr</h2>
      <ul>
        <li>Du übst nach Thema und bekommst nach jeder Antwort direkt die Erklärung.</li>
        <li>Falsch beantwortete Fragen kommen wieder, bis sie sitzen.</li>
        <li>In der Probe-Simulation beantwortest du {PROBE_SIM_QUESTIONS} Fragen in {PROBE_SIM_SECONDS / 60} Minuten und siehst das Ergebnis erst am Ende. Umfang und Zeit legen wir selbst fest, sie entsprechen nicht der echten Prüfung.</li>
      </ul>
      <p>
        Kostenlos bekommst du {FREE_TRY_LIMIT} Lernsitzungen pro Prüfung, ohne Kreditkarte. <Link href="/preise">Pro kostet 9,99 € im Monat</Link> und hebt diese Grenze auf.
      </p>
      <CtaBox source={source} title="Jetzt kostenlos üben" text="Leg in unter einer Minute los und wiederhole gezielt, was noch nicht sitzt." />

      <h2>Weitere Prüfungen</h2>
      <ul>
        {others.map((other) => (
          <li key={other.id}>
            <Link href={`/pruefungen/${other.slug}`}>{other.name}</Link>
          </li>
        ))}
      </ul>
    </SiteShell>
  );
}
