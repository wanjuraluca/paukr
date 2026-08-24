"use server";

import { createClient } from "@/lib/supabase/server";
import { reviewCard, freshCard, type SrsState } from "@/lib/srs";
import { FREE_TRY_LIMIT } from "@/lib/limits";

const XP_PER_CORRECT = 50;

// Mirrored in the DB trigger (enforce_free_try_limit) as the real guarantee,
// FREE_TRY_LIMIT here is the friendly check that returns a clear result
// instead of a raw DB error.

async function triesUsed(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  examId: string,
): Promise<number> {
  const [practice, sim, blitz] = await Promise.all([
    supabase
      .from("practice_sessions")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("exam_id", examId),
    supabase
      .from("exam_attempts")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("exam_id", examId),
    supabase
      .from("blitz_runs")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("exam_id", examId),
  ]);
  return (practice.count ?? 0) + (sim.count ?? 0) + (blitz.count ?? 0);
}

async function isPro(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
): Promise<boolean> {
  const { data } = await supabase
    .from("profiles")
    .select("subscription_tier")
    .eq("id", userId)
    .single<{ subscription_tier: string }>();
  return data?.subscription_tier === "pro";
}

export interface RecordAttemptResult {
  ok: boolean;
  xpTotal?: number;
  xpGained?: number;
  currentStreak?: number;
}

/**
 * Persists one practice answer: logs the attempt, advances the question's
 * spaced-repetition state (SM-2), updates the per-topic progress counters and
 * the user's XP/streak. Returns the fresh XP/streak so the client can show
 * real numbers instead of placeholders.
 */
export async function recordAttempt(
  questionId: string,
  correct: boolean,
  responseMs: number,
  selectedOptionIds: string[] = [],
): Promise<RecordAttemptResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false };

  // Resolve the question's topic (for progress counters) and type (to know
  // whether to write selected_option_id or the multi-select join rows).
  const { data: q } = await supabase
    .from("questions")
    .select("topic_id, question_type")
    .eq("id", questionId)
    .single<{ topic_id: string; question_type: "single" | "multiple" }>();
  if (!q) return { ok: false };

  // --- Spaced repetition (SM-2) ---------------------------------------
  const { data: existing } = await supabase
    .from("question_reviews")
    .select(
      "ease_factor, interval_days, repetitions, total_attempts, total_correct, consecutive_wrong",
    )
    .eq("user_id", user.id)
    .eq("question_id", questionId)
    .maybeSingle();

  const prevState: SrsState = existing
    ? {
        easeFactor: existing.ease_factor,
        intervalDays: existing.interval_days,
        repetitions: existing.repetitions,
      }
    : freshCard();

  const result = reviewCard(prevState, { correct, responseMs });
  const now = Date.now();
  const dueAt = new Date(now + result.dueInMs).toISOString();

  await supabase.from("question_reviews").upsert(
    {
      user_id: user.id,
      question_id: questionId,
      ease_factor: result.easeFactor,
      interval_days: result.intervalDays,
      repetitions: result.repetitions,
      due_at: dueAt,
      last_reviewed_at: new Date(now).toISOString(),
      last_correct: correct,
      total_attempts: (existing?.total_attempts ?? 0) + 1,
      total_correct: (existing?.total_correct ?? 0) + (correct ? 1 : 0),
      consecutive_wrong: correct ? 0 : (existing?.consecutive_wrong ?? 0) + 1,
    },
    { onConflict: "user_id,question_id" },
  );

  // --- Raw attempt log ------------------------------------------------
  const { data: attempt } = await supabase
    .from("question_attempts")
    .insert({
      user_id: user.id,
      question_id: questionId,
      selected_option_id:
        q.question_type === "single" ? (selectedOptionIds[0] ?? null) : null,
      is_correct: correct,
    })
    .select("id")
    .single<{ id: string }>();

  if (q.question_type === "multiple" && attempt && selectedOptionIds.length > 0) {
    await supabase.from("question_attempt_selections").insert(
      selectedOptionIds.map((optionId) => ({
        attempt_id: attempt.id,
        option_id: optionId,
      })),
    );
  }

  // --- Per-topic progress counters ------------------------------------
  const { data: prog } = await supabase
    .from("user_topic_progress")
    .select("questions_answered, questions_correct")
    .eq("user_id", user.id)
    .eq("topic_id", q.topic_id)
    .maybeSingle();

  await supabase.from("user_topic_progress").upsert(
    {
      user_id: user.id,
      topic_id: q.topic_id,
      questions_answered: (prog?.questions_answered ?? 0) + 1,
      questions_correct: (prog?.questions_correct ?? 0) + (correct ? 1 : 0),
      updated_at: new Date(now).toISOString(),
    },
    { onConflict: "user_id,topic_id" },
  );

  // --- XP + streak ----------------------------------------------------
  const { data: profile } = await supabase
    .from("profiles")
    .select("xp_total, current_streak, longest_streak, last_activity_date")
    .eq("id", user.id)
    .single<{
      xp_total: number;
      current_streak: number;
      longest_streak: number;
      last_activity_date: string | null;
    }>();

  const xpGained = correct ? XP_PER_CORRECT : 0;
  const xpTotal = (profile?.xp_total ?? 0) + xpGained;

  const { streak, longest } = advanceStreak(
    profile?.current_streak ?? 0,
    profile?.longest_streak ?? 0,
    profile?.last_activity_date ?? null,
  );

  await supabase
    .from("profiles")
    .update({
      xp_total: xpTotal,
      current_streak: streak,
      longest_streak: longest,
      last_activity_date: todayISODate(),
    })
    .eq("id", user.id);

  return { ok: true, xpTotal, xpGained, currentStreak: streak };
}

export interface StartExamResult {
  ok: boolean;
  attemptId?: string;
  limitReached?: boolean;
}

/** Starts a new timed exam-simulation run and returns its attempt id. */
export async function startExamAttempt(
  examId: string,
  timeLimitSeconds: number,
): Promise<StartExamResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false };

  if (!(await isPro(supabase, user.id))) {
    const used = await triesUsed(supabase, user.id, examId);
    if (used >= FREE_TRY_LIMIT) return { ok: false, limitReached: true };
  }

  const { data, error } = await supabase
    .from("exam_attempts")
    .insert({ user_id: user.id, exam_id: examId, time_limit_seconds: timeLimitSeconds })
    .select("id")
    .single<{ id: string }>();

  if (error) {
    // The DB trigger raises free_try_limit_reached if a race let two starts
    // through the check above at once, treat that the same as a friendly limit.
    return { ok: false, limitReached: error.message.includes("free_try_limit_reached") };
  }
  if (!data) return { ok: false };
  return { ok: true, attemptId: data.id };
}

export interface StartPracticeResult {
  ok: boolean;
  limitReached?: boolean;
  triesLeft?: number;
}

/**
 * Records the start of a practice-mode session (either "practice" or "wrong
 * questions" mode) so it counts toward the free-tier try limit even if the
 * user abandons it before answering anything. Returns the remaining tries so
 * the client can update its indicator without a full page reload.
 */
export async function startPracticeSession(examId: string): Promise<StartPracticeResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false };

  const pro = await isPro(supabase, user.id);
  if (!pro) {
    const used = await triesUsed(supabase, user.id, examId);
    if (used >= FREE_TRY_LIMIT) return { ok: false, limitReached: true };
  }

  const { error } = await supabase
    .from("practice_sessions")
    .insert({ user_id: user.id, exam_id: examId });

  if (error) {
    return { ok: false, limitReached: error.message.includes("free_try_limit_reached") };
  }

  if (pro) return { ok: true };
  const used = await triesUsed(supabase, user.id, examId);
  return { ok: true, triesLeft: Math.max(0, FREE_TRY_LIMIT - used) };
}

export interface StartBlitzResult {
  ok: boolean;
  runId?: string;
  limitReached?: boolean;
  triesLeft?: number;
}

/**
 * Opens a Blitz run. Counts toward the same shared free-tier try limit as
 * practice sessions and exam simulations, checked here for a clear result and
 * enforced again by the DB trigger.
 */
export async function startBlitzRun(examId: string): Promise<StartBlitzResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false };

  const pro = await isPro(supabase, user.id);
  if (!pro) {
    const used = await triesUsed(supabase, user.id, examId);
    if (used >= FREE_TRY_LIMIT) return { ok: false, limitReached: true };
  }

  const { data, error } = await supabase
    .from("blitz_runs")
    .insert({ user_id: user.id, exam_id: examId })
    .select("id")
    .single<{ id: string }>();

  if (error) {
    return { ok: false, limitReached: error.message.includes("free_try_limit_reached") };
  }
  if (!data) return { ok: false };

  if (pro) return { ok: true, runId: data.id };
  const used = await triesUsed(supabase, user.id, examId);
  return { ok: true, runId: data.id, triesLeft: Math.max(0, FREE_TRY_LIMIT - used) };
}

/** Closes out a Blitz run with the depth it reached. */
export async function finishBlitzRun(
  runId: string,
  depth: number,
  correctCount: number,
): Promise<void> {
  const supabase = await createClient();
  await supabase
    .from("blitz_runs")
    .update({
      finished_at: new Date().toISOString(),
      depth,
      correct_count: correctCount,
    })
    .eq("id", runId);
}

/** Logs one answer within an exam-simulation run (separate from practice log). */
export async function recordExamAnswer(
  attemptId: string,
  questionId: string,
  selectedOptionId: string | null,
  correct: boolean,
  selectedOptionIds: string[] = [],
): Promise<void> {
  const supabase = await createClient();
  const { data: answer } = await supabase
    .from("exam_attempt_answers")
    .insert({
      exam_attempt_id: attemptId,
      question_id: questionId,
      selected_option_id: selectedOptionId,
      is_correct: correct,
    })
    .select("id")
    .single<{ id: string }>();

  if (answer && selectedOptionIds.length > 0) {
    await supabase.from("exam_attempt_answer_selections").insert(
      selectedOptionIds.map((optionId) => ({
        answer_id: answer.id,
        option_id: optionId,
      })),
    );
  }
}

/** Closes out an exam-simulation run with its final score. */
export async function finishExamAttempt(
  attemptId: string,
  scoreCorrect: number,
  scoreTotal: number,
): Promise<void> {
  const supabase = await createClient();
  await supabase
    .from("exam_attempts")
    .update({
      finished_at: new Date().toISOString(),
      score_correct: scoreCorrect,
      score_total: scoreTotal,
    })
    .eq("id", attemptId);
}

function todayISODate(): string {
  return new Date().toISOString().slice(0, 10);
}

/**
 * Advances the daily streak: +1 if the last activity was yesterday, unchanged
 * if it was already today, reset to 1 otherwise (or first ever activity).
 */
function advanceStreak(
  current: number,
  longest: number,
  lastDate: string | null,
): { streak: number; longest: number } {
  const today = todayISODate();
  if (lastDate === today) return { streak: current, longest };

  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);
  const streak = lastDate === yesterday ? current + 1 : 1;
  return { streak, longest: Math.max(longest, streak) };
}
