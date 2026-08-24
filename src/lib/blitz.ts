// Blitz: the timed roguelike run mode. One countdown clock for the whole run,
// correct answers feed it, wrong answers drain it, the run ends the moment the
// clock hits zero. Everything in here is pure so the balance can be reasoned
// about (and tested) without touching React or the DB.

/** Where the clock starts, in seconds. */
export const BLITZ_START_SECONDS = 60;
/** Seconds a correct answer gives back before decay and boons. */
export const BLITZ_BASE_GAIN = 6;
/** Seconds a wrong answer costs before boons. */
export const BLITZ_BASE_PENALTY = 8;
/** A correct answer gives one second less every this many questions. */
export const BLITZ_DECAY_EVERY = 5;
/** However deep the run goes, a correct answer never gives less than this. */
export const BLITZ_MIN_GAIN = 2;
/** However many Zähigkeit stacks, a wrong answer never costs less than this. */
export const BLITZ_MIN_PENALTY = 2;
/** A boon is offered after every this many answered questions. */
export const BLITZ_BOON_INTERVAL = 5;
/** How many boons are offered per pick. */
export const BLITZ_BOON_OFFER = 3;

export type BoonId =
  | "tailwind"
  | "shield"
  | "fifty"
  | "skip"
  | "cushion"
  | "toughness"
  | "risk";

export interface BoonDef {
  id: BoonId;
  /** German label, this is what the player reads. */
  label: string;
  desc: string;
}

export const BOONS: BoonDef[] = [
  {
    id: "tailwind",
    label: "Rückenwind",
    desc: "Jede richtige Antwort gibt dir 2 Sekunden mehr. Stapelbar.",
  },
  {
    id: "shield",
    label: "Schild",
    desc: "Die nächste falsche Antwort kostet dich keine Zeit. Sammelt Ladungen.",
  },
  {
    id: "fifty",
    label: "50:50",
    desc: "Streicht zwei falsche Antworten. 2 Ladungen.",
  },
  {
    id: "skip",
    label: "Überspringen",
    desc: "Frage überspringen, ohne Zeitverlust. 2 Ladungen.",
  },
  {
    id: "cushion",
    label: "Zeitpolster",
    desc: "Sofort 20 Sekunden auf die Uhr.",
  },
  {
    id: "toughness",
    label: "Zähigkeit",
    desc: "Falsche Antworten kosten 3 Sekunden weniger. Stapelbar.",
  },
  {
    id: "risk",
    label: "Risiko",
    desc: "Gewonnene und verlorene Zeit werden verdoppelt. Nur einmal wählbar.",
  },
];

/** Seconds the Zeitpolster boon puts on the clock right away. */
export const CUSHION_SECONDS = 20;

export interface BoonState {
  /** Permanent, stackable: +2s per correct answer each. */
  tailwind: number;
  /** Permanent, stackable: -3s penalty each. */
  toughness: number;
  /** Permanent, once: doubles both gain and penalty. */
  risk: boolean;
  /** Consumable charges. */
  shield: number;
  fifty: number;
  skip: number;
}

export function emptyBoons(): BoonState {
  return { tailwind: 0, toughness: 0, risk: false, shield: 0, fifty: 0, skip: 0 };
}

/**
 * Seconds a correct answer adds at the given depth. The gain decays with depth
 * so every run ends eventually, no matter how well the player answers.
 */
export function gainSeconds(depth: number, boons: BoonState): number {
  const raw =
    BLITZ_BASE_GAIN + boons.tailwind * 2 - Math.floor(depth / BLITZ_DECAY_EVERY);
  const gain = Math.max(BLITZ_MIN_GAIN, raw);
  return boons.risk ? gain * 2 : gain;
}

/** Seconds a wrong answer costs. A held Schild is handled by the caller. */
export function penaltySeconds(boons: BoonState): number {
  const penalty = Math.max(
    BLITZ_MIN_PENALTY,
    BLITZ_BASE_PENALTY - boons.toughness * 3,
  );
  return boons.risk ? penalty * 2 : penalty;
}

/** Boons that can still do something for this run. */
export function availableBoons(boons: BoonState): BoonDef[] {
  return BOONS.filter((b) => !(b.id === "risk" && boons.risk));
}

/** Draws the offer for one boon screen: distinct ids, still-useful boons only. */
export function drawBoonOffer(
  boons: BoonState,
  count: number = BLITZ_BOON_OFFER,
  rand: () => number = Math.random,
): BoonDef[] {
  const pool = availableBoons(boons);
  const picked: BoonDef[] = [];
  const rest = pool.slice();
  while (picked.length < count && rest.length > 0) {
    const i = Math.floor(rand() * rest.length);
    picked.push(rest[i]);
    rest.splice(i, 1);
  }
  return picked;
}

/** Applies a picked boon. Returns the new state plus any instant time bonus. */
export function applyBoon(
  boons: BoonState,
  id: BoonId,
): { boons: BoonState; instantSeconds: number } {
  const next: BoonState = { ...boons };
  let instantSeconds = 0;
  switch (id) {
    case "tailwind":
      next.tailwind += 1;
      break;
    case "toughness":
      next.toughness += 1;
      break;
    case "risk":
      next.risk = true;
      break;
    case "shield":
      next.shield += 1;
      break;
    case "fifty":
      next.fifty += 2;
      break;
    case "skip":
      next.skip += 2;
      break;
    case "cushion":
      instantSeconds = CUSHION_SECONDS;
      break;
  }
  return { boons: next, instantSeconds };
}

/**
 * The difficulty the run aims for at this depth: starts at 1 (so the weighting
 * favours difficulty <= 2) and climbs past 3 as the run goes on.
 */
export function targetDifficulty(depth: number): number {
  return Math.min(5, 1 + depth * 0.15);
}

interface PickableQuestion {
  id: string;
  difficulty: number;
}

/**
 * Picks the next question: never one already used in this run (the used set is
 * cleared once the pool is exhausted), weighted toward the depth's target
 * difficulty so the questions get harder as the clock gets meaner.
 */
export function pickQuestion<T extends PickableQuestion>(
  pool: T[],
  depth: number,
  used: Set<string>,
  rand: () => number = Math.random,
): T | null {
  if (pool.length === 0) return null;
  let candidates = pool.filter((q) => !used.has(q.id));
  if (candidates.length === 0) {
    used.clear();
    candidates = pool;
  }
  const target = targetDifficulty(depth);
  const weights = candidates.map((q) => 1 / (1 + Math.abs(q.difficulty - target)));
  const sum = weights.reduce((a, b) => a + b, 0);
  let roll = rand() * sum;
  for (let i = 0; i < candidates.length; i++) {
    roll -= weights[i];
    if (roll <= 0) return candidates[i];
  }
  return candidates[candidates.length - 1];
}

/**
 * Ids of two wrong options to hide for the 50:50 boon. Correct options are
 * never touched, on single-choice and multiple-choice questions alike. Returns
 * fewer ids when the question does not have two spare wrong options.
 */
export function fiftyFiftyHidden(
  options: { id: string; isCorrect: boolean }[],
  rand: () => number = Math.random,
): string[] {
  const wrong = options.filter((o) => !o.isCorrect).map((o) => o.id);
  const hidden: string[] = [];
  while (hidden.length < 2 && wrong.length > 0) {
    const i = Math.floor(rand() * wrong.length);
    hidden.push(wrong[i]);
    wrong.splice(i, 1);
  }
  return hidden;
}

/** Clock label: tenths under ten seconds, whole seconds above. */
export function formatBlitzClock(msLeft: number): string {
  const ms = Math.max(0, msLeft);
  if (ms < 10_000) return (Math.floor(ms / 100) / 10).toFixed(1);
  return String(Math.ceil(ms / 1000));
}
