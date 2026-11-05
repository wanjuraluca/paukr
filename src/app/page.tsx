import { createClient } from "@supabase/supabase-js";
import { loadPublicExams, questionCount as countQuestions } from "@/lib/public-exams";
import { pageMetadata } from "@/lib/seo";
import Landing from "./Landing";

// The landing page shows how many questions and exams are live. It reads them
// from the database instead of a hand-kept constant, so the numbers stay true
// when questions are approved, withdrawn or a new exam is added. Refreshed at
// most once an hour, so visitors still get a cached page.
export const revalidate = 3600;

export const metadata = pageMetadata({
  title: "Übungsfragen für die IHK-Abschlussprüfung üben | paukr",
  description: "Übe für deine Abschlussprüfung mit eigenen Fragen, Erklärungen und Simulationen. Für Fachinformatiker und weitere Berufe. Kostenlos starten.",
  path: "/",
});

// Used only if the database cannot be reached while the page is built.
const FALLBACK = { questionCount: 2700, examCount: 9 };

async function liveCounts(): Promise<{ questionCount: number; examCount: number }> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return FALLBACK;
  try {
    // Anonymous client without cookies: the row-level security policies only
    // show active exams and approved questions, exactly what visitors can use.
    const supabase = createClient(url, key, { auth: { persistSession: false } });
    const [questions, exams] = await Promise.all([
      supabase
        .from("questions")
        .select("id, topics!inner(exams!inner(is_active))", { count: "exact", head: true })
        .eq("topics.exams.is_active", true),
      supabase.from("exams").select("id", { count: "exact", head: true }).eq("is_active", true),
    ]);
    if (questions.error || exams.error || !questions.count || !exams.count) return FALLBACK;
    return { questionCount: questions.count, examCount: exams.count };
  } catch {
    return FALLBACK;
  }
}

export default async function Home() {
  const [{ questionCount, examCount }, exams] = await Promise.all([liveCounts(), loadPublicExams()]);
  return (
    <Landing
      questionCount={questionCount}
      examCount={examCount}
      exams={exams.map((e) => ({ slug: e.slug, name: e.name, count: countQuestions(e) }))}
    />
  );
}
