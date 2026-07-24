import { createClient } from "@/lib/supabase/server";
import AppClient, { type QuizQuestion, type TopicInfo } from "./AppClient";

export const dynamic = "force-dynamic";

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
  answer_options: { id: string; option_text: string; is_correct: boolean }[];
}
interface ReviewRow {
  question_id: string;
  due_at: string;
  last_correct: boolean | null;
  repetitions: number;
}

export default async function AppPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

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
        "id, question_text, explanation, topics!inner(name, exam_id), answer_options(id, option_text, is_correct)",
      )
      .eq("topics.exam_id", exam.id)
      .returns<QuestionRow[]>();

    // The user's spaced-repetition state, keyed by question id.
    const reviews = new Map<string, ReviewRow>();
    if (user) {
      const { data: rev } = await supabase
        .from("question_reviews")
        .select("question_id, due_at, last_correct, repetitions")
        .eq("user_id", user.id)
        .returns<ReviewRow[]>();
      for (const r of rev ?? []) reviews.set(r.question_id, r);
    }

    questions = (rows ?? []).map((r) => {
      const rev = reviews.get(r.id);
      return {
        id: r.id,
        topic: r.topics.name,
        q: r.question_text,
        expl: r.explanation,
        // Shuffle options so the correct answer's position carries no signal.
        options: shuffle(
          (r.answer_options ?? []).map((o) => ({
            id: o.id,
            text: o.option_text,
            isCorrect: o.is_correct,
          })),
        ),
        dueAt: rev?.due_at ?? null,
        lastCorrect: rev?.last_correct ?? null,
        isNew: !rev,
      };
    });

    const counts = new Map<string, number>();
    for (const a of questions) counts.set(a.topic, (counts.get(a.topic) ?? 0) + 1);
    topics = (exam.topics ?? [])
      .slice()
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((t) => ({ name: t.name, count: counts.get(t.name) ?? 0 }));
  }

  // Real per-user stats (fall back to zero for a brand-new profile).
  let xpTotal = 0;
  let currentStreak = 0;
  // How many exam simulations the user has passed in a row (trailing streak of
  // finished attempts scoring >= 50 points), for the "prüfungsbereit" tracker.
  let simPassStreak = 0;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("xp_total, current_streak")
      .eq("id", user.id)
      .single<{ xp_total: number; current_streak: number }>();
    xpTotal = profile?.xp_total ?? 0;
    currentStreak = profile?.current_streak ?? 0;

    if (exam) {
      const { data: attempts } = await supabase
        .from("exam_attempts")
        .select("score_correct, score_total, finished_at")
        .eq("user_id", user.id)
        .eq("exam_id", exam.id)
        .not("finished_at", "is", null)
        .order("finished_at", { ascending: false })
        .returns<{ score_correct: number | null; score_total: number | null }[]>();
      for (const a of attempts ?? []) {
        const total = a.score_total ?? 0;
        const passed = total > 0 && (a.score_correct ?? 0) * 2 >= total; // >= 50%
        if (passed) simPassStreak += 1;
        else break; // A fail (or unscored) ends the trailing streak.
      }
    }
  }

  const displayName =
    (user?.user_metadata?.display_name as string | undefined) ||
    user?.email ||
    "";

  return (
    <AppClient
      examId={exam?.id ?? ""}
      examName={exam?.name ?? "Prüfung"}
      topics={topics}
      questions={questions}
      userName={displayName}
      xpTotal={xpTotal}
      currentStreak={currentStreak}
      simPassStreak={simPassStreak}
    />
  );
}
