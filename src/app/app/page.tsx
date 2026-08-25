import { createClient } from "@/lib/supabase/server";
import AppClient, { type ExamBundle } from "./AppClient";
import { FREE_TRY_LIMIT } from "@/lib/limits";

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
  slug: string;
  name: string;
  description: string | null;
  topics: { id: string; name: string; sort_order: number }[];
}
interface QuestionRow {
  id: string;
  question_text: string;
  explanation: string | null;
  question_type: "single" | "multiple";
  difficulty: number;
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

  const { data: examRows } = await supabase
    .from("exams")
    .select("id, slug, name, description, topics(id, name, sort_order)")
    .eq("is_active", true)
    .order("sort_order")
    .returns<ExamRow[]>();

  // Real per-user stats (fall back to zero for a brand-new profile). These
  // are global to the user, not per exam.
  let xpTotal = 0;
  let currentStreak = 0;
  let isAdmin = false;
  let isPro = false;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("xp_total, current_streak, is_admin, subscription_tier")
      .eq("id", user.id)
      .single<{
        xp_total: number;
        current_streak: number;
        is_admin: boolean;
        subscription_tier: string;
      }>();
    xpTotal = profile?.xp_total ?? 0;
    currentStreak = profile?.current_streak ?? 0;
    isAdmin = profile?.is_admin ?? false;
    isPro = profile?.subscription_tier === "pro";
  }

  // Builds one exam's full bundle: its shuffled question pool (with this
  // user's spaced-repetition state joined in), topic list with counts, and
  // this exam's free-tier try/streak/Blitz numbers. An exam with zero
  // approved questions yet (e.g. freshly seeded, content still in progress)
  // still gets a valid, empty bundle rather than being skipped.
  async function buildExamBundle(exam: ExamRow): Promise<ExamBundle> {
    const { data: rows } = await supabase
      .from("questions")
      .select(
        "id, question_text, explanation, question_type, difficulty, topics!inner(name, exam_id), answer_options(id, option_text, is_correct)",
      )
      .eq("topics.exam_id", exam.id)
      .returns<QuestionRow[]>();

    const reviews = new Map<string, ReviewRow>();
    if (user) {
      const { data: rev } = await supabase
        .from("question_reviews")
        .select("question_id, due_at, last_correct, repetitions")
        .eq("user_id", user.id)
        .returns<ReviewRow[]>();
      for (const r of rev ?? []) reviews.set(r.question_id, r);
    }

    const questions: ExamBundle["questions"] = (rows ?? []).map((r) => {
      const rev = reviews.get(r.id);
      return {
        id: r.id,
        topic: r.topics.name,
        q: r.question_text,
        expl: r.explanation,
        questionType: r.question_type,
        difficulty: r.difficulty ?? 1,
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
    const topics = (exam.topics ?? [])
      .slice()
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((t) => ({ name: t.name, count: counts.get(t.name) ?? 0 }));

    // Remaining free-tier session starts for this exam (practice runs and
    // exam simulations share one counter). Pro users are never limited.
    let triesLeft = FREE_TRY_LIMIT;
    // How many exam simulations the user has passed in a row (trailing
    // streak of finished attempts scoring >= 50 points).
    let simPassStreak = 0;
    // Deepest finished Blitz run for this exam.
    let bestBlitzDepth = 0;

    if (user) {
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

      const { data: bestRun } = await supabase
        .from("blitz_runs")
        .select("depth")
        .eq("user_id", user.id)
        .eq("exam_id", exam.id)
        .order("depth", { ascending: false })
        .limit(1)
        .maybeSingle<{ depth: number }>();
      bestBlitzDepth = bestRun?.depth ?? 0;

      if (!isPro) {
        const [{ count: practiceCount }, { count: simCount }, { count: blitzCount }] =
          await Promise.all([
            supabase
              .from("practice_sessions")
              .select("id", { count: "exact", head: true })
              .eq("user_id", user.id)
              .eq("exam_id", exam.id),
            supabase
              .from("exam_attempts")
              .select("id", { count: "exact", head: true })
              .eq("user_id", user.id)
              .eq("exam_id", exam.id),
            supabase
              .from("blitz_runs")
              .select("id", { count: "exact", head: true })
              .eq("user_id", user.id)
              .eq("exam_id", exam.id),
          ]);
        const used = (practiceCount ?? 0) + (simCount ?? 0) + (blitzCount ?? 0);
        triesLeft = Math.max(0, FREE_TRY_LIMIT - used);
      }
    }

    return {
      id: exam.id,
      name: exam.name,
      description: exam.description ?? "",
      topics,
      questions,
      triesLeft,
      simPassStreak,
      bestBlitzDepth,
    };
  }

  const exams = await Promise.all((examRows ?? []).map(buildExamBundle));

  const displayName =
    (user?.user_metadata?.display_name as string | undefined) ||
    user?.email ||
    "";

  return (
    <AppClient
      exams={exams}
      userName={displayName}
      xpTotal={xpTotal}
      currentStreak={currentStreak}
      isAdmin={isAdmin}
      isPro={isPro}
    />
  );
}
