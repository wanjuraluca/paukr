import { createClient } from "@supabase/supabase-js";

export interface PublicTopic {
  id: string;
  name: string;
  sort_order: number;
  questions: { count: number }[];
}
export interface PublicExam {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  topics: PublicTopic[];
}
export interface SampleQuestion {
  id: string;
  question_text: string;
  explanation: string | null;
  answer_options: { id: string; option_text: string; is_correct: boolean }[];
}

// Anonymous client without cookies, so these pages can be cached. Row-level
// security only returns active exams and approved questions.
function anonClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

export function questionCount(exam: PublicExam): number {
  return exam.topics.reduce((sum, t) => sum + (t.questions[0]?.count ?? 0), 0);
}

export async function loadPublicExams(): Promise<PublicExam[]> {
  const supabase = anonClient();
  if (!supabase) return [];
  const { data } = await supabase
    .from("exams")
    .select("id, slug, name, description, topics(id, name, sort_order, questions(count))")
    .eq("is_active", true)
    .order("sort_order")
    .returns<PublicExam[]>();
  return (data ?? []).map((e) => ({
    ...e,
    topics: e.topics.slice().sort((a, b) => a.sort_order - b.sort_order),
  }));
}

// Search titles have about 60 characters, some official names don't fit.
const SHORT_NAMES: Record<string, string> = {
  "fiae-ae": "Fachinformatiker Anwendungsentwicklung",
  fisi: "Fachinformatiker Systemintegration",
  bueromanagement: "Kaufleute für Büromanagement",
  einzelhandel: "Kaufleute im Einzelhandel",
  grosshandel: "Kaufleute Groß- und Außenhandel",
  mfa: "Medizinische Fachangestellte",
  bank: "Bankkaufleute",
};

export function shortExamName(exam: { slug: string; name: string }): string {
  return SHORT_NAMES[exam.slug] ?? exam.name;
}

// Questions chosen by hand for a content page, so they fit its subject. Only
// these keys are shown, a key that was withdrawn simply drops out.
export async function loadTopicSamples(
  examSlug: string,
  picks: { topic: string; keys: string[] }[],
): Promise<(SampleQuestion & { topic: string })[]> {
  const supabase = anonClient();
  if (!supabase) return [];
  const exam = (await loadPublicExams()).find((e) => e.slug === examSlug);
  if (!exam) return [];
  const perPick = await Promise.all(
    picks.map(async (pick) => {
      const topic = exam.topics.find((t) => t.name === pick.topic);
      if (!topic) return [];
      const { data } = await supabase
        .from("questions")
        .select("id, question_text, explanation, answer_options(id, option_text, is_correct)")
        .eq("topic_id", topic.id)
        .eq("question_type", "single")
        .in("source_key", pick.keys)
        .order("source_key")
        .returns<SampleQuestion[]>();
      return (data ?? []).map((q) => ({
        ...q,
        topic: topic.name,
        answer_options: q.answer_options.slice().sort((a, b) => a.option_text.localeCompare(b.option_text, "de")),
      }));
    }),
  );
  return perPick.flat();
}

// Two questions per topic. Sorted by source_key so the page text stays the same
// between builds, options sorted by text so the position says nothing.
export async function loadSampleQuestions(exam: PublicExam): Promise<(SampleQuestion & { topic: string })[]> {
  const supabase = anonClient();
  if (!supabase) return [];
  const perTopic = await Promise.all(
    exam.topics.map(async (topic) => {
      const { data } = await supabase
        .from("questions")
        .select("id, question_text, explanation, answer_options(id, option_text, is_correct)")
        .eq("topic_id", topic.id)
        .eq("question_type", "single")
        .order("source_key")
        .limit(2)
        .returns<SampleQuestion[]>();
      return (data ?? []).map((q) => ({
        ...q,
        topic: topic.name,
        answer_options: q.answer_options.slice().sort((a, b) => a.option_text.localeCompare(b.option_text, "de")),
      }));
    }),
  );
  return perTopic.flat();
}
