import type { CSSProperties } from "react";
import type { Metadata } from "next";
import LegalShell from "../legal/LegalShell";
import PublicFooter from "./PublicFooter";
import { loadPublicExams, questionCount } from "@/lib/public-exams";

export const revalidate = 3600;

const heading: CSSProperties = { fontFamily: "var(--font-space), sans-serif" };

const TITLE = "Übungsfragen für deine Abschlussprüfung · paukr";
const DESCRIPTION = "Eigene Übungsfragen für Ausbildungsberufe, nach Themen sortiert, mit Erklärungen und Simulation. Kostenlos starten.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/pruefungen" },
  openGraph: { title: TITLE, description: DESCRIPTION, url: "/pruefungen", siteName: "paukr", locale: "de_DE", type: "website" },
};

export default async function PruefungenPage() {
  const exams = await loadPublicExams();
  return (
    <LegalShell>
      <h1 style={{ ...heading, fontWeight: 700, fontSize: "clamp(28px,3.4vw,38px)", letterSpacing: "-.02em", lineHeight: 1.15, margin: "0 0 12px" }}>
        Übungsfragen für deine Abschlussprüfung
      </h1>
      <p style={{ color: "var(--muted)", fontSize: "17px", margin: "0 0 32px" }}>
        Wähle deinen Ausbildungsberuf und schau dir Themen und Beispielfragen an.
      </p>
      <div style={{ display: "grid", gap: "12px" }}>
        {exams.map((exam) => (
          <a
            key={exam.id}
            href={`/pruefungen/${exam.slug}`}
            style={{ display: "block", padding: "18px 20px", borderRadius: "14px", background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)", textDecoration: "none" }}
          >
            <div style={{ ...heading, fontWeight: 600, fontSize: "18px" }}>{exam.name}</div>
            <div style={{ fontSize: "14px", color: "var(--muted)", marginTop: "2px" }}>
              {questionCount(exam).toLocaleString("de-DE")} Übungsfragen in {exam.topics.length} Themen
            </div>
          </a>
        ))}
      </div>
      <PublicFooter />
    </LegalShell>
  );
}
