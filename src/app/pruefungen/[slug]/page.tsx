import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import LegalShell from "../../legal/LegalShell";
import ExamCta from "../ExamCta";
import PublicFooter from "../PublicFooter";
import { FREE_TRY_LIMIT, PROBE_SIM_QUESTIONS, PROBE_SIM_SECONDS } from "@/lib/limits";
import { loadPublicExams, loadSampleQuestions, questionCount } from "@/lib/public-exams";

export const revalidate = 3600;

const heading: CSSProperties = { fontFamily: "var(--font-space), sans-serif" };
const h2: CSSProperties = { ...heading, fontWeight: 600, fontSize: "22px", letterSpacing: "-.01em", margin: "44px 0 14px" };
const card: CSSProperties = { padding: "18px 20px", borderRadius: "14px", background: "var(--surface)", border: "1px solid var(--border)" };

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
  const title = `${exam.name}: Übungsfragen zur Abschlussprüfung · paukr`;
  const description = `${questionCount(exam).toLocaleString("de-DE")} eigene Übungsfragen für ${exam.name}, nach Themen sortiert und mit Erklärungen. Beispielfragen ansehen und kostenlos üben.`;
  const url = `/pruefungen/${exam.slug}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, siteName: "paukr", locale: "de_DE", type: "website" },
  };
}

export default async function ExamPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const exam = await findExam(slug);
  if (!exam) notFound();
  const samples = await loadSampleQuestions(exam);
  const source = `pruefung-${exam.slug}`;

  return (
    <LegalShell>
      <p style={{ margin: "0 0 10px", fontSize: "14px" }}>
        <Link href="/pruefungen" style={{ color: "var(--accent-strong)", textDecoration: "none" }}>Alle Prüfungen</Link>
      </p>
      <h1 style={{ ...heading, fontWeight: 700, fontSize: "clamp(28px,3.4vw,38px)", letterSpacing: "-.02em", lineHeight: 1.15, margin: "0 0 12px" }}>
        Übungsfragen: {exam.name}
      </h1>
      {exam.description && <p style={{ color: "var(--muted)", fontSize: "17px", margin: "0 0 12px" }}>{exam.description}</p>}
      <p style={{ margin: "0 0 22px", fontWeight: 600 }}>
        {questionCount(exam).toLocaleString("de-DE")} Übungsfragen in {exam.topics.length} Themen
      </p>
      <ExamCta source={source} label="Kostenlos üben" />

      <h2 style={h2}>Themen</h2>
      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: "8px" }}>
        {exam.topics.map((t) => (
          <li key={t.id} style={{ ...card, padding: "12px 16px", display: "flex", justifyContent: "space-between", gap: "14px" }}>
            <span>{t.name}</span>
            <span style={{ color: "var(--muted)", whiteSpace: "nowrap" }}>{t.questions[0]?.count ?? 0} Fragen</span>
          </li>
        ))}
      </ul>

      <h2 style={h2}>Beispielfragen</h2>
      <p style={{ margin: "0 0 14px", color: "var(--muted)" }}>Überleg dir erst deine Antwort und schau dann in die Lösung.</p>
      <div style={{ display: "grid", gap: "12px" }}>
        {samples.map((q) => {
          const correct = q.answer_options.find((o) => o.is_correct);
          return (
            <article key={q.id} style={card}>
              <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--accent-strong)", marginBottom: "4px" }}>{q.topic}</div>
              <h3 style={{ ...heading, fontWeight: 600, fontSize: "17px", lineHeight: 1.35, margin: "0 0 10px" }}>{q.question_text}</h3>
              <ul style={{ paddingLeft: "20px", margin: "0 0 10px" }}>
                {q.answer_options.map((o) => (
                  <li key={o.id}>{o.option_text}</li>
                ))}
              </ul>
              <details>
                <summary style={{ cursor: "pointer", padding: "6px 0", fontWeight: 600, color: "var(--accent-strong)" }}>Lösung anzeigen</summary>
                <p style={{ margin: "6px 0 0" }}><strong>{correct?.option_text}</strong></p>
                {q.explanation && <p style={{ margin: "6px 0 0", color: "var(--muted)" }}>{q.explanation}</p>}
              </details>
            </article>
          );
        })}
      </div>

      <h2 style={h2}>So übst du mit paukr</h2>
      <ul style={{ paddingLeft: "20px", margin: "0 0 16px" }}>
        <li>Du übst nach Thema und bekommst nach jeder Antwort direkt die Erklärung.</li>
        <li>Falsch beantwortete Fragen kommen wieder, bis sie sitzen.</li>
        <li>In der Probe-Simulation beantwortest du {PROBE_SIM_QUESTIONS} Fragen in {PROBE_SIM_SECONDS / 60} Minuten und siehst das Ergebnis erst am Ende. Umfang und Zeit legen wir selbst fest, sie entsprechen nicht der echten Prüfung.</li>
      </ul>
      <p style={{ margin: "0 0 22px" }}>
        Kostenlos bekommst du {FREE_TRY_LIMIT} Lernsitzungen pro Prüfung, ohne Kreditkarte. Pro kostet 9,99 € im Monat und hebt diese Grenze auf.
      </p>
      <ExamCta source={source} label="Kostenlos üben" />
      <PublicFooter />
    </LegalShell>
  );
}
