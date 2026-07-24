"use server";

import { createClient } from "@/lib/supabase/server";
import { reviewCard, freshCard, type SrsState } from "@/lib/srs";

const XP_PER_CORRECT = 50;

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
): Promise<RecordAttemptResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false };

  // Resolve the question's topic for the progress counters.
  const { data: q } = await supabase
    .from("questions")
    .select("topic_id")
    .eq("id", questionId)
    .single<{ topic_id: string }>();
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
  await supabase.from("question_attempts").insert({
    user_id: user.id,
    question_id: questionId,
    is_correct: correct,
  });

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

  const { data, error } = await supabase
    .from("exam_attempts")
    .insert({ user_id: user.id, exam_id: examId, time_limit_seconds: timeLimitSeconds })
    .select("id")
    .single<{ id: string }>();

  if (error || !data) return { ok: false };
  return { ok: true, attemptId: data.id };
}

/** Logs one answer within an exam-simulation run (separate from practice log). */
export async function recordExamAnswer(
  attemptId: string,
  questionId: string,
  selectedOptionId: string | null,
  correct: boolean,
): Promise<void> {
  const supabase = await createClient();
  await supabase.from("exam_attempt_answers").insert({
    exam_attempt_id: attemptId,
    question_id: questionId,
    selected_option_id: selectedOptionId,
    is_correct: correct,
  });
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
