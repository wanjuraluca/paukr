import { createClient } from "@/lib/supabase/server";
import AppClient, { type QuizQuestion, type TopicInfo } from "./AppClient";

export const dynamic = "force-dynamic";

// How many questions one practice session pulls from the approved pool.
const SESSION_SIZE = 10;

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

interface ExamRow {
  id: string;
  name: string;
  topics: { id: string; name: string; sort_order: number }[];
}
interface QuestionRow {
  id: string;
  question_text: string;
  explanation: string | null;
  topics: { name: string; exam_id: string };
  answer_options: { option_text: string; is_correct: boolean }[];
}

export default async function AppPage() {
  const supabase = await createClient();

  const { data: exam } = await supabase
    .from("exams")
    .select("id, name, topics(id, name, sort_order)")
    .eq("slug", "fiae-ae")
    .single<ExamRow>();

  let questions: QuizQuestion[] = [];
  let topics: TopicInfo[] = [];

  if (exam) {
    const { data: rows } = await supabase
      .from("questions")
      .select(
        "id, question_text, explanation, topics!inner(name, exam_id), answer_options(option_text, is_correct)",
      )
      .eq("topics.exam_id", exam.id)
      .returns<QuestionRow[]>();

    const all: QuizQuestion[] = (rows ?? []).map((r) => ({
      id: r.id,
      topic: r.topics.name,
      q: r.question_text,
      expl: r.explanation,
      // Shuffle options so the correct answer's position carries no signal.
      options: shuffle(
        (r.answer_options ?? []).map((o) => ({
          text: o.option_text,
          isCorrect: o.is_correct,
        })),
      ),
    }));

    const counts = new Map<string, number>();
    for (const a of all) counts.set(a.topic, (counts.get(a.topic) ?? 0) + 1);
    topics = (exam.topics ?? [])
      .slice()
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((t) => ({ name: t.name, count: counts.get(t.name) ?? 0 }));

    questions = shuffle(all).slice(0, SESSION_SIZE);
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const displayName =
    (user?.user_metadata?.display_name as string | undefined) ||
    user?.email ||
    "";

  return (
    <AppClient
      examName={exam?.name ?? "Prüfung"}
      topics={topics}
      questions={questions}
      userName={displayName}
    />
  );
}
