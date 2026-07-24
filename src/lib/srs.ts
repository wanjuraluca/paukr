// Spaced-repetition scheduling (SM-2, the SuperMemo/Anki algorithm).
//
// Our quiz is multiple-choice with a binary correct/wrong outcome, so we don't
// have the classic 0-5 self-graded "quality". Instead we derive quality from
// the outcome plus how much the user hesitated (response time): a confident
// correct answer is worth more than a slow, unsure one, and any wrong answer
// resets the card. This keeps the maths identical to SM-2 while fitting a
// tap-to-answer UI.

export interface SrsState {
  easeFactor: number; // SM-2 "EF", how fast intervals grow. >= 1.3.
  intervalDays: number; // Days until the card is next due.
  repetitions: number; // Consecutive successful reviews.
}

export interface SrsReviewInput {
  correct: boolean;
  /** Time from showing the question to answering, in milliseconds. */
  responseMs: number;
}

export interface SrsResult extends SrsState {
  /** SM-2 quality (0-5) this review was scored as. */
  quality: number;
  /** Milliseconds from now until the card is next due. */
  dueInMs: number;
}

export const DEFAULT_EASE = 2.5;
const MIN_EASE = 1.3;

// A correct answer under this counts as "confident" (quality 5); a slower but
// still correct answer counts as "hesitant" (quality 3). Tuned for typical
// IHK-style multiple-choice questions.
const CONFIDENT_MS = 12_000;

const DAY_MS = 24 * 60 * 60 * 1000;

/** Maps a binary outcome + hesitation onto an SM-2 quality grade (0-5). */
export function qualityFromOutcome({ correct, responseMs }: SrsReviewInput): number {
  if (!correct) return 1; // Any wrong answer is a lapse (< 3 resets the card).
  return responseMs <= CONFIDENT_MS ? 5 : 3;
}

/**
 * Runs one SM-2 review step. Pass the card's current state (or a fresh card for
 * the first-ever review) and the outcome; returns the next state plus when the
 * card becomes due again.
 */
export function reviewCard(state: SrsState, input: SrsReviewInput): SrsResult {
  const quality = qualityFromOutcome(input);

  let { easeFactor, repetitions } = state;
  let intervalDays: number;

  if (quality >= 3) {
    // Successful recall: grow the interval.
    if (repetitions === 0) intervalDays = 1;
    else if (repetitions === 1) intervalDays = 6;
    else intervalDays = Math.round(state.intervalDays * easeFactor);
    repetitions += 1;
  } else {
    // Lapse: reset the streak and resurface the card in the same session
    // (due immediately, so the next session-builder picks it up).
    repetitions = 0;
    intervalDays = 0;
  }

  // SM-2 ease-factor update, clamped so cards never drop below MIN_EASE.
  easeFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  if (easeFactor < MIN_EASE) easeFactor = MIN_EASE;

  return {
    easeFactor,
    intervalDays,
    repetitions,
    quality,
    dueInMs: intervalDays * DAY_MS,
  };
}

/** The state of a card that has never been reviewed. */
export function freshCard(): SrsState {
  return { easeFactor: DEFAULT_EASE, intervalDays: 0, repetitions: 0 };
}
