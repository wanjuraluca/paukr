"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  recordAttempt,
  startExamAttempt,
  recordExamAnswer,
  finishExamAttempt,
  startPracticeSession,
} from "./actions";
import { FREE_TRY_LIMIT } from "@/lib/limits";
import { gradeExam, PASS_THRESHOLD, type GradeResult } from "@/lib/grading";

const PRODUCT_NAME = "paukr";

// How many questions one practice session pulls from the eligible pool.
const SESSION_SIZE = 10;
// Our exam-simulation format (Teil 1 style: written, timed, 100-point scale).
// Not a byte-for-byte copy of the real exam's time limit.
const SIM_TIME_LIMIT_SECONDS = 60 * 60;
// The simulation stays locked until the user has mastered this share of the
// question pool (a Fahrschul-app style unlock gate).
const SIM_UNLOCK_PCT = 80;
// Passing the simulation this many times in a row marks the user as ready.
const READINESS_STREAK = 5;

type Screen = "dashboard" | "detail" | "practice" | "result" | "paywall";
// "practice" = due reviews + new questions; "wrong" = only questions the user
// last got wrong (the "Falsche Fragen üben" mode); "sim" = the timed,
// graded exam simulation (all questions, once, no per-question feedback).
type PracticeMode = "practice" | "wrong" | "sim";

export interface QuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
}
export interface QuizQuestion {
  id: string;
  topic: string;
  q: string;
  expl: string | null;
  questionType: "single" | "multiple";
  options: QuizOption[];
  // Spaced-repetition metadata for this user (null / true when never seen).
  dueAt: string | null;
  lastCorrect: boolean | null;
  isNew: boolean;
}
export interface TopicInfo {
  name: string;
  count: number;
}
interface Props {
  examId: string;
  examName: string;
  topics: TopicInfo[];
  questions: QuizQuestion[];
  userName?: string;
  xpTotal?: number;
  currentStreak?: number;
  simPassStreak?: number;
  isAdmin?: boolean;
  isPro?: boolean;
  // Remaining free-tier session starts for this exam (only meaningful when
  // !isPro), computed server-side from practice_sessions + exam_attempts.
  triesLeft?: number;
}

/**
 * Builds a practice session from the full question pool. In "practice" mode it
 * prioritises questions that are due for review (soonest first), then fills up
 * with never-seen questions. In "wrong" mode it returns only questions the user
 * last answered incorrectly. In "sim" mode it returns the whole pool, shuffled,
 * as a single one-shot graded run.
 */
function buildSession(pool: QuizQuestion[], mode: PracticeMode): QuizQuestion[] {
  if (mode === "wrong") {
    return pool
      .filter((q) => q.lastCorrect === false)
      .sort((a, b) => dueTime(a) - dueTime(b));
  }
  if (mode === "sim") {
    return shuffleArr(pool);
  }
  const now = Date.now();
  const due = pool
    .filter((q) => !q.isNew && q.dueAt !== null && new Date(q.dueAt).getTime() <= now)
    .sort((a, b) => dueTime(a) - dueTime(b));
  const fresh = shuffleArr(pool.filter((q) => q.isNew));
  return [...due, ...fresh].slice(0, SESSION_SIZE);
}

function formatClock(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function dueTime(q: QuizQuestion): number {
  return q.dueAt ? new Date(q.dueAt).getTime() : Number.POSITIVE_INFINITY;
}

function shuffleArr<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function initialsOf(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return "?";
  const parts = trimmed.split(/[\s@.]+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return trimmed.slice(0, 2).toUpperCase();
}

const passColor = (v: number) =>
  v >= 75 ? "var(--accent)" : v >= 60 ? "var(--accent-strong)" : "var(--err)";

const heading: CSSProperties = { fontFamily: "var(--font-space), sans-serif" };

export default function AppClient({
  examId,
  examName,
  topics,
  questions,
  userName = "",
  xpTotal = 0,
  currentStreak = 0,
  simPassStreak = 0,
  isAdmin = false,
  isPro = false,
  triesLeft = FREE_TRY_LIMIT,
}: Props) {
  const router = useRouter();
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [menuOpen, setMenuOpen] = useState(false);
  const [screen, setScreen] = useState<Screen>("dashboard");
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  // Multi-select (checkbox) picks for question_type = "multiple", by option
  // index. Confirmed via an explicit check button, unlike single-choice which
  // submits immediately on click.
  const [selectedMulti, setSelectedMulti] = useState<number[]>([]);
  const [answered, setAnswered] = useState(false);
  const [xp, setXp] = useState(xpTotal);
  const [xpDisplay, setXpDisplay] = useState(xpTotal);
  const [xpBump, setXpBump] = useState(0);
  const [results, setResults] = useState<{ topic: string; correct: boolean }[]>([]);
  // The questions for the current run, and which mode built it.
  const [session, setSession] = useState<QuizQuestion[]>([]);
  const [mode, setMode] = useState<PracticeMode>("practice");
  const rafRef = useRef<number | null>(null);
  // When the current question was shown, to measure hesitation for SM-2.
  const shownAtRef = useRef<number>(0);
  // Exam-simulation-only state: the running attempt, countdown and final grade.
  const [examAttemptId, setExamAttemptId] = useState<string | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(SIM_TIME_LIMIT_SECONDS);
  const [gradeResult, setGradeResult] = useState<GradeResult | null>(null);
  const finishingRef = useRef(false);
  // Consecutive passed simulations, seeded from the server and updated live as
  // the user finishes runs this session (server recomputes on next load).
  const [passStreak, setPassStreak] = useState(simPassStreak);
  // Local copy of the remaining free tries so the indicator updates instantly
  // after a session start, without waiting for a full page reload.
  const [triesLeftState, setTriesLeftState] = useState(triesLeft);
  // Which mode was blocked by the paywall, only used to render its copy.
  const [paywallMode, setPaywallMode] = useState<PracticeMode>("practice");

  useEffect(() => {
    const dark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;
    setTheme(dark ? "dark" : "light");
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Countdown for the exam simulation; auto-finishes when time runs out.
  useEffect(() => {
    if (screen !== "practice" || mode !== "sim") return;
    if (secondsLeft <= 0) {
      finishSimulation();
      return;
    }
    const id = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen, mode, secondsLeft]);

  const isDark = theme === "dark";
  const total = session.length;
  const q = session[qIndex];

  // How many questions the user last got wrong, drives the "Falsche Fragen"
  // entry point and its badge.
  const wrongCount = useMemo(
    () => questions.filter((x) => x.lastCorrect === false).length,
    [questions],
  );
  // Share of the pool the user currently has right (last answer correct). This
  // single "% richtig" metric drives every progress bar/ring in the app and
  // fills toward unlocking the simulation.
  const masteredPct = useMemo(() => {
    if (questions.length === 0) return 0;
    const mastered = questions.filter((x) => x.lastCorrect === true).length;
    return Math.round((mastered / questions.length) * 100);
  }, [questions]);
  const simUnlocked = masteredPct >= SIM_UNLOCK_PCT;
  const examReady = passStreak >= READINESS_STREAK;

  // First name for the greeting (before any space or @).
  const firstName = userName.split(/[\s@]/)[0] ?? "";

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));
  const enterSite = () => router.push("/");
  const signOut = async () => {
    await createClient().auth.signOut();
    router.push("/");
  };
  const openExam = () => setScreen("detail");
  const resetQuiz = () => {
    setQIndex(0);
    setSelected(null);
    setSelectedMulti([]);
    setAnswered(false);
    setResults([]);
    shownAtRef.current = performance.now();
  };
  // Shared entry point for "practice" and "wrong" mode: both count toward the
  // same free-tier try limit as one shared pool of 3 per exam. Checks the
  // limit client-side first (fast path for the common case), then confirms
  // server-side, since the client state could be stale or bypassed.
  const startPracticeMode = async (targetMode: "practice" | "wrong") => {
    if (!isPro && triesLeftState <= 0) {
      setPaywallMode(targetMode);
      setScreen("paywall");
      return;
    }
    const res = await startPracticeSession(examId);
    if (!res.ok) {
      setPaywallMode(targetMode);
      setScreen("paywall");
      return;
    }
    if (res.triesLeft !== undefined) setTriesLeftState(res.triesLeft);
    setMode(targetMode);
    setSession(buildSession(questions, targetMode));
    resetQuiz();
    setScreen("practice");
  };
  const startPractice = () => void startPracticeMode("practice");
  const startWrongPractice = () => void startPracticeMode("wrong");
  const startSimulation = async () => {
    if (!simUnlocked) return; // Gated until the pool is mastered enough.
    if (!isPro && triesLeftState <= 0) {
      setPaywallMode("sim");
      setScreen("paywall");
      return;
    }
    const res = await startExamAttempt(examId, SIM_TIME_LIMIT_SECONDS);
    if (!res.ok) {
      setPaywallMode("sim");
      setScreen("paywall");
      return;
    }
    if (!isPro) setTriesLeftState((t) => Math.max(0, t - 1));
    setMode("sim");
    setSession(buildSession(questions, "sim"));
    resetQuiz();
    setSecondsLeft(SIM_TIME_LIMIT_SECONDS);
    setGradeResult(null);
    finishingRef.current = false;
    setExamAttemptId(res.attemptId ?? null);
    setScreen("practice");
  };
  // Grades and closes out the exam-simulation run (called on time-up or after
  // the last question). Unanswered questions count as incorrect, same as a
  // blank answer in the real written exam.
  const finishSimulation = () => {
    if (finishingRef.current) return;
    finishingRef.current = true;
    const correctCount = results.filter((r) => r.correct).length;
    const total = session.length;
    const grade = gradeExam(correctCount, total);
    setGradeResult(grade);
    // Update the consecutive-pass streak: a pass extends it, a fail resets it.
    setPassStreak((s) => (grade.passed ? s + 1 : 0));
    if (examAttemptId) void finishExamAttempt(examAttemptId, correctCount, total);
    setScreen("result");
  };
  const exitPractice = () => setScreen("detail");
  const backToOverview = () => setScreen("dashboard");
  const goBack = () => setScreen((s) => (s === "detail" ? "dashboard" : "detail"));
  const goToUpgrade = () => router.push("/upgrade");

  const animateXp = (amount: number) => {
    const from = xp;
    const to = from + amount;
    const dur = 700;
    const t0 = performance.now();
    setXpBump((b) => b + 1);
    const step = (now: number) => {
      const p = Math.min(1, (now - t0) / dur);
      const val = Math.round(from + (to - from) * (1 - Math.pow(1 - p, 3)));
      setXpDisplay(val);
      if (p < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        setXp(to);
      }
    };
    rafRef.current = requestAnimationFrame(step);
  };

  const select = (i: number) => {
    if (answered || !q) return;
    const opt = q.options[i];
    if (!opt) return;
    setSelected(i);
    setAnswered(true);
    setResults((r) => [...r, { topic: q.topic, correct: opt.isCorrect }]);
    if (mode !== "sim" && opt.isCorrect) animateXp(50);

    // Persist the attempt + advance spaced repetition (fire-and-forget; the
    // server is the source of truth on the next load).
    const responseMs = Math.max(0, Math.round(performance.now() - shownAtRef.current));
    void recordAttempt(q.id, opt.isCorrect, responseMs, [opt.id]);
    if (mode === "sim" && examAttemptId) {
      void recordExamAnswer(examAttemptId, q.id, opt.id, opt.isCorrect);
    }
  };

  // Toggles one option's checked state for a multiple-choice question. No
  // submission happens until the user confirms via the check button.
  const toggleMulti = (i: number) => {
    if (answered || !q) return;
    setSelectedMulti((cur) =>
      cur.includes(i) ? cur.filter((x) => x !== i) : [...cur, i],
    );
  };

  // Confirms the current checkbox picks for a multiple-choice question.
  // Correct only if the picked set exactly matches the correct set.
  const submitMulti = () => {
    if (answered || !q) return;
    const pickedSet = new Set(selectedMulti);
    const correctSet = new Set(
      q.options.map((o, i) => (o.isCorrect ? i : -1)).filter((i) => i >= 0),
    );
    const isCorrect =
      pickedSet.size === correctSet.size &&
      [...pickedSet].every((i) => correctSet.has(i));
    setAnswered(true);
    setResults((r) => [...r, { topic: q.topic, correct: isCorrect }]);
    if (mode !== "sim" && isCorrect) animateXp(50);

    const optionIds = selectedMulti.map((i) => q.options[i].id);
    const responseMs = Math.max(0, Math.round(performance.now() - shownAtRef.current));
    void recordAttempt(q.id, isCorrect, responseMs, optionIds);
    if (mode === "sim" && examAttemptId) {
      void recordExamAnswer(examAttemptId, q.id, null, isCorrect, optionIds);
    }
  };

  const next = () => {
    if (qIndex + 1 >= total) {
      if (mode === "sim") finishSimulation();
      else setScreen("result");
      return;
    }
    setQIndex((i) => i + 1);
    setSelected(null);
    setSelectedMulti([]);
    setAnswered(false);
    shownAtRef.current = performance.now();
  };

  const showHeader = screen !== "practice";
  const showBack = screen === "detail" || screen === "result" || screen === "paywall";
  const practicePct =
    total > 0
      ? Math.round(((qIndex + (answered ? 1 : 0)) / total) * 100) + "%"
      : "0%";
  const qCounter = qIndex + 1 + " / " + total;
  const nextLabel = qIndex + 1 >= total ? "Ergebnis ansehen" : "Weiter";
  const lastResultCorrect = results.length > 0 ? results[results.length - 1].correct : false;
  const verdictLabel =
    answered && (q?.questionType === "multiple" ? lastResultCorrect : selected !== null && q?.options[selected]?.isCorrect)
      ? "Richtig!"
      : "Nicht ganz.";

  // Result computation from actual answers. In sim mode the graded score
  // (blank answers count against you) replaces the plain practice score.
  const answeredTotal = results.length || total;
  const correctCount = results.filter((r) => r.correct).length;
  const practiceScorePct = answeredTotal ? Math.round((correctCount / answeredTotal) * 100) : 0;
  const scorePct = mode === "sim" && gradeResult ? gradeResult.points : practiceScorePct;
  const passed = mode === "sim" && gradeResult ? gradeResult.passed : scorePct >= 50;
  const ringOffset = Math.round(339 * (1 - scorePct / 100));
  const ringColor = passColor(scorePct);
  const byTopic = new Map<string, { correct: number; total: number }>();
  for (const r of results) {
    const e = byTopic.get(r.topic) ?? { correct: 0, total: 0 };
    e.total += 1;
    if (r.correct) e.correct += 1;
    byTopic.set(r.topic, e);
  }
  const topicScores = [...byTopic.entries()].map(([name, v]) => {
    const p = Math.round((v.correct / v.total) * 100);
    return { name, scoreLabel: p + "%", color: passColor(p) };
  });

  const maxCount = topics.reduce((m, t) => Math.max(m, t.count), 1);

  // Confetti pieces (result screen, only when passed).
  const confetti = [];
  const cols = [
    "var(--accent)",
    "color-mix(in oklch, var(--accent) 55%, var(--bg))",
    "var(--accent-strong)",
  ];
  for (let i = 0; i < 18; i++) {
    const left = Math.round((i * 53 + 7) % 100);
    const size = 6 + (i % 3) * 3;
    const delay = ((i * 137) % 900) / 1000;
    const round = i % 2 === 0 ? "2px" : "50%";
    confetti.push({
      key: i,
      style: {
        position: "absolute" as const,
        top: 0,
        left: `${left}%`,
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: round,
        background: cols[i % 3],
        animation: `pk-confetti ${1.6 + (i % 4) * 0.25}s ease-in ${delay}s both`,
        pointerEvents: "none" as const,
        zIndex: 0,
      },
    });
  }

  return (
    <div
      className="eh"
      data-theme={theme}
      data-accent="indigo"
      style={{
        background: "var(--bg)",
        color: "var(--text)",
        minHeight: "100vh",
        overflowX: "hidden",
        transition: "background .5s ease, color .5s ease",
        fontSize: "17px",
        lineHeight: 1.6,
      }}
    >
      {/* ===== GLOBAL HEADER (not on practice) ===== */}
      {showHeader && (
        <header
          style={{
            position: "sticky",
            top: 0,
            zIndex: 50,
            backdropFilter: "saturate(180%) blur(14px)",
            background: "color-mix(in oklch, var(--bg) 78%, transparent)",
            borderBottom: "1px solid var(--border)",
          }}
        >
          <div
            style={{
              maxWidth: "1160px",
              margin: "0 auto",
              padding: "14px 28px",
              display: "flex",
              alignItems: "center",
              gap: "18px",
            }}
          >
            {showBack && (
              <button
                onClick={goBack}
                aria-label="Zurück"
                className="pk-app-back"
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "11px",
                  border: "1px solid var(--border)",
                  background: "var(--surface)",
                  color: "var(--text)",
                  cursor: "pointer",
                  display: "grid",
                  placeItems: "center",
                  transition: "transform .18s, border-color .2s",
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            )}
            <div
              onClick={enterSite}
              style={{ display: "flex", alignItems: "center", gap: "10px", marginRight: "auto", cursor: "pointer" }}
            >
              <img src="/logo.svg" width={30} height={30} alt="" style={{ borderRadius: "9px", boxShadow: "0 4px 14px color-mix(in oklch, var(--accent) 40%, transparent)" }} />
              <span style={{ ...heading, fontWeight: 700, fontSize: "20px", letterSpacing: "-.02em" }}>{PRODUCT_NAME}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "5px 14px 5px 6px", borderRadius: "100px", border: "1px solid var(--border)", background: "var(--surface)" }}>
              <span style={{ ...heading, width: "26px", height: "26px", borderRadius: "50%", background: "color-mix(in oklch, var(--accent) 22%, var(--bg))", display: "grid", placeItems: "center", color: "var(--accent-strong)", fontWeight: 700, fontSize: "12px" }}>{currentStreak}</span>
              <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--muted)" }}>Serie</span>
            </div>
            <button
              onClick={toggleTheme}
              aria-label="Modus wechseln"
              className="pk-theme-btn"
              style={{ width: "40px", height: "40px", borderRadius: "11px", border: "1px solid var(--border)", background: "var(--surface)", color: "var(--text)", cursor: "pointer", display: "grid", placeItems: "center", transition: "transform .18s, border-color .2s" }}
            >
              {isDark ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2" />
                  <path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M6.5 17.5L5 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                </svg>
              )}
            </button>
            <div style={{ position: "relative" }}>
              <button
                aria-label="Profil"
                onClick={() => setMenuOpen((o) => !o)}
                className="pk-profile-btn"
                style={{ ...heading, width: "40px", height: "40px", borderRadius: "50%", border: "1px solid var(--border)", background: "color-mix(in oklch, var(--accent) 16%, var(--bg))", color: "var(--accent-strong)", cursor: "pointer", display: "grid", placeItems: "center", fontWeight: 700, fontSize: "15px", transition: "transform .18s" }}
              >
                {initialsOf(userName)}
              </button>
              {menuOpen && (
                <div
                  style={{ position: "absolute", top: "48px", right: 0, minWidth: "200px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "14px", boxShadow: "var(--shadow-lg)", padding: "8px", zIndex: 60 }}
                >
                  {userName && (
                    <div style={{ padding: "8px 12px", fontSize: "13px", color: "var(--muted)", borderBottom: "1px solid var(--border)", marginBottom: "6px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {userName}
                    </div>
                  )}
                  <button
                    onClick={() => router.push("/upgrade")}
                    className="pk-menu-item"
                    style={{ width: "100%", textAlign: "left", cursor: "pointer", fontFamily: "var(--font-hanken), sans-serif", fontWeight: 600, fontSize: "14px", padding: "9px 12px", borderRadius: "10px", background: "transparent", color: "var(--accent-strong)", border: "none", transition: "background .18s, transform .12s" }}
                  >
                    Auf Pro upgraden
                  </button>
                  {isAdmin && (
                    <button
                      onClick={() => router.push("/review")}
                      className="pk-menu-item"
                      style={{ width: "100%", textAlign: "left", cursor: "pointer", fontFamily: "var(--font-hanken), sans-serif", fontWeight: 600, fontSize: "14px", padding: "9px 12px", borderRadius: "10px", background: "transparent", color: "var(--text)", border: "none", transition: "background .18s, transform .12s" }}
                    >
                      Fragen-Review
                    </button>
                  )}
                  <button
                    onClick={signOut}
                    className="pk-menu-item"
                    style={{ width: "100%", textAlign: "left", cursor: "pointer", fontFamily: "var(--font-hanken), sans-serif", fontWeight: 600, fontSize: "14px", padding: "9px 12px", borderRadius: "10px", background: "transparent", color: "var(--text)", border: "none", transition: "background .18s, transform .12s" }}
                  >
                    Abmelden
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>
      )}

      {/* ===== SCREEN 1: DASHBOARD ===== */}
      {screen === "dashboard" && (
        <main style={{ maxWidth: "1160px", margin: "0 auto", padding: "64px 28px 90px" }}>
          <div style={{ animation: "pk-revUp .6s cubic-bezier(.16,1,.3,1) both", marginBottom: "44px" }}>
            <span style={{ fontSize: "15px", fontWeight: 600, color: "var(--accent-strong)" }}>Willkommen zurück{firstName ? `, ${firstName}` : ""}</span>
            <h1 style={{ ...heading, fontWeight: 700, fontSize: "clamp(34px,4.4vw,52px)", letterSpacing: "-.03em", margin: "10px 0 12px", lineHeight: 1.05 }}>Wähle deine Prüfung</h1>
            <p style={{ fontSize: "19px", color: "var(--muted)", margin: 0, maxWidth: "560px" }}>Starte da, wo du aufgehört hast, oder such dir ein neues Ziel. Weitere Prüfungen kommen bald dazu.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: "20px" }}>
            <button
              onClick={openExam}
              className="pk-exam-card"
              style={{ animation: "pk-revUp .6s cubic-bezier(.16,1,.3,1) .05s both", textAlign: "left", cursor: "pointer", fontFamily: "inherit", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "22px", padding: "26px", display: "flex", flexDirection: "column", gap: 0, transition: "transform .25s, box-shadow .3s, border-color .3s" }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
                <span style={{ width: "52px", height: "52px", borderRadius: "15px", background: "color-mix(in oklch, var(--accent) 14%, var(--bg))", display: "grid", placeItems: "center" }}>
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                    <path d="M8 3h8l4 4v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" stroke="var(--accent)" strokeWidth="2" strokeLinejoin="round" />
                    <path d="M8 11l2.5 2.5L16 8" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <span style={{ fontSize: "12px", fontWeight: 700, letterSpacing: ".03em", color: "var(--accent-strong)", background: "color-mix(in oklch, var(--accent) 13%, var(--bg))", padding: "5px 11px", borderRadius: "100px" }}>AKTIV</span>
              </div>
              <h3 style={{ ...heading, fontWeight: 600, fontSize: "21px", margin: "0 0 6px", letterSpacing: "-.01em", color: "var(--text)" }}>{examName}</h3>
              <p style={{ fontSize: "15px", color: "var(--muted)", margin: "0 0 22px", lineHeight: 1.5 }}>Fachinformatiker/in, Abschlussprüfung Teil 2.</p>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--muted)" }}>Fragen verfügbar</span>
                <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--accent-strong)" }}>{questions.length}</span>
              </div>
              <div style={{ height: "7px", borderRadius: "100px", background: "var(--bg-alt)", overflow: "hidden" }}>
                <div style={{ width: `${masteredPct}%`, height: "100%", borderRadius: "100px", background: "var(--accent)" }} />
              </div>
            </button>

            <div style={{ animation: "pk-revUp .6s cubic-bezier(.16,1,.3,1) .12s both", background: "var(--surface)", border: "1px dashed var(--border)", borderRadius: "22px", padding: "26px", opacity: 0.6 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
                <span style={{ width: "52px", height: "52px", borderRadius: "15px", background: "var(--bg-alt)", display: "grid", placeItems: "center" }}>
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                    <ellipse cx="12" cy="6" rx="7" ry="3" stroke="var(--muted)" strokeWidth="2" />
                    <path d="M5 6v12c0 1.7 3.1 3 7 3s7-1.3 7-3V6M5 12c0 1.7 3.1 3 7 3s7-1.3 7-3" stroke="var(--muted)" strokeWidth="2" />
                  </svg>
                </span>
                <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--muted)", background: "var(--bg-alt)", padding: "5px 11px", borderRadius: "100px" }}>BALD</span>
              </div>
              <h3 style={{ ...heading, fontWeight: 600, fontSize: "21px", margin: "0 0 6px", letterSpacing: "-.01em" }}>IHK Systemintegration</h3>
              <p style={{ fontSize: "15px", color: "var(--muted)", margin: 0, lineHeight: 1.5 }}>Fachinformatiker/in, in Vorbereitung.</p>
            </div>

            <div style={{ animation: "pk-revUp .6s cubic-bezier(.16,1,.3,1) .18s both", background: "var(--surface)", border: "1px dashed var(--border)", borderRadius: "22px", padding: "26px", opacity: 0.6 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
                <span style={{ width: "52px", height: "52px", borderRadius: "15px", background: "var(--bg-alt)", display: "grid", placeItems: "center" }}>
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                    <rect x="4" y="4" width="16" height="16" rx="4" stroke="var(--muted)" strokeWidth="2" />
                    <path d="M9 15l2-6 2 4 1.5-3" stroke="var(--muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--muted)", background: "var(--bg-alt)", padding: "5px 11px", borderRadius: "100px" }}>BALD</span>
              </div>
              <h3 style={{ ...heading, fontWeight: 600, fontSize: "21px", margin: "0 0 6px", letterSpacing: "-.01em" }}>Kaufmann/-frau E-Commerce</h3>
              <p style={{ fontSize: "15px", color: "var(--muted)", margin: 0, lineHeight: 1.5 }}>Abschlussprüfung, in Vorbereitung.</p>
            </div>

            <div style={{ animation: "pk-revUp .6s cubic-bezier(.16,1,.3,1) .24s both", background: "var(--surface)", border: "1px dashed var(--border)", borderRadius: "22px", padding: "26px", opacity: 0.6, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", minHeight: "220px", color: "var(--muted)" }}>
              <span style={{ width: "44px", height: "44px", borderRadius: "13px", border: "1px dashed var(--border)", display: "grid", placeItems: "center", marginBottom: "14px" }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path d="M12 5v14M5 12h14" stroke="var(--muted)" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </span>
              <span style={{ fontSize: "15px", fontWeight: 600 }}>Weitere Prüfungen folgen</span>
            </div>
          </div>
        </main>
      )}

      {/* ===== SCREEN 2: EXAM DETAIL ===== */}
      {screen === "detail" && (
        <main style={{ maxWidth: "1000px", margin: "0 auto", padding: "56px 28px 90px" }}>
          <div style={{ animation: "pk-revUp .6s cubic-bezier(.16,1,.3,1) both", marginBottom: "36px" }}>
            <span style={{ fontSize: "14px", fontWeight: 600, color: "var(--accent-strong)" }}>IHK · Fachinformatiker/in</span>
            <h1 style={{ ...heading, fontWeight: 700, fontSize: "clamp(30px,4vw,46px)", letterSpacing: "-.03em", margin: "8px 0 12px", lineHeight: 1.05 }}>Anwendungsentwicklung</h1>
            <p style={{ fontSize: "18px", color: "var(--muted)", margin: 0, maxWidth: "600px" }}>Bereite dich gezielt auf die Abschlussprüfung Teil 2 vor: Themen üben oder unter echten Bedingungen simulieren.</p>
          </div>
          <div style={{ animation: "pk-revUp .6s cubic-bezier(.16,1,.3,1) .06s both", display: "grid", gridTemplateColumns: "auto 1fr 1fr", gap: "14px", alignItems: "center", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "20px", padding: "24px 28px", marginBottom: "26px" }}>
            <div style={{ position: "relative", width: "96px", height: "96px" }}>
              <div style={{ width: "96px", height: "96px", borderRadius: "50%", background: `conic-gradient(var(--accent) 0% ${masteredPct}%, var(--bg-alt) ${masteredPct}% 100%)` }} />
              <div style={{ position: "absolute", inset: "10px", borderRadius: "50%", background: "var(--surface)", display: "grid", placeItems: "center" }}>
                <span style={{ ...heading, fontWeight: 700, fontSize: "22px" }}>{masteredPct}%</span>
              </div>
            </div>
            <div style={{ borderLeft: "1px solid var(--border)", paddingLeft: "24px" }}>
              <div style={{ fontSize: "13px", color: "var(--muted)", fontWeight: 600, marginBottom: "4px" }}>XP gesammelt</div>
              <div style={{ ...heading, fontWeight: 700, fontSize: "30px", letterSpacing: "-.02em", color: "var(--accent)" }}>{xpTotal.toLocaleString("de-DE")}</div>
            </div>
            <div style={{ borderLeft: "1px solid var(--border)", paddingLeft: "24px" }}>
              <div style={{ fontSize: "13px", color: "var(--muted)", fontWeight: 600, marginBottom: "4px" }}>Aktuelle Serie</div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2c1 3 3 4.5 3 7a3 3 0 0 1-6 0c0-1 .4-1.8 1-2.5C9 9 8 11 8 13a4 4 0 0 0 8 0c0-3.5-2-6.5-4-11Z" stroke="var(--accent)" strokeWidth="2" strokeLinejoin="round" />
                </svg>
                <span style={{ ...heading, fontWeight: 700, fontSize: "30px", letterSpacing: "-.02em" }}>{currentStreak} {currentStreak === 1 ? "Tag" : "Tage"}</span>
              </div>
            </div>
          </div>

          {/* Wrong-questions review, only shown when there is something to fix. */}
          {wrongCount > 0 && (
            <button
              onClick={startWrongPractice}
              className="pk-mode-secondary"
              style={{ animation: "pk-revUp .6s cubic-bezier(.16,1,.3,1) .08s both", width: "100%", textAlign: "left", cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: "16px", background: "color-mix(in oklch, var(--err) 8%, var(--surface))", color: "var(--text)", border: "1px solid color-mix(in oklch, var(--err) 35%, var(--border))", borderRadius: "18px", padding: "20px 24px", marginBottom: "26px", transition: "transform .2s, border-color .2s, box-shadow .3s" }}
            >
              <span style={{ width: "44px", height: "44px", borderRadius: "13px", background: "color-mix(in oklch, var(--err) 14%, var(--bg))", display: "grid", placeItems: "center", flexShrink: 0 }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M12 8v5M12 16h.01" stroke="var(--err-strong)" strokeWidth="2.2" strokeLinecap="round" />
                  <circle cx="12" cy="12" r="9.5" stroke="var(--err-strong)" strokeWidth="2" />
                </svg>
              </span>
              <span style={{ flex: 1 }}>
                <span style={{ ...heading, display: "block", fontWeight: 600, fontSize: "18px", marginBottom: "3px" }}>Falsche Fragen üben</span>
                <span style={{ fontSize: "14.5px", color: "var(--muted)", lineHeight: 1.5 }}>Wiederhole gezielt, was zuletzt nicht saß, bis es sitzt.</span>
              </span>
              <span style={{ ...heading, fontWeight: 700, fontSize: "15px", color: "var(--err-strong)", background: "color-mix(in oklch, var(--err) 14%, var(--bg))", padding: "7px 14px", borderRadius: "100px", flexShrink: 0 }}>
                {wrongCount} {wrongCount === 1 ? "Frage" : "Fragen"}
              </span>
            </button>
          )}
          {!isPro && (
            <p style={{ animation: "pk-revUp .6s cubic-bezier(.16,1,.3,1) .09s both", fontSize: "14px", fontWeight: 600, color: triesLeftState > 0 ? "var(--muted)" : "var(--err-strong)", margin: "0 0 16px" }}>
              {triesLeftState > 0
                ? `Noch ${triesLeftState} von ${FREE_TRY_LIMIT} kostenlosen Versuchen für diese Prüfung`
                : `Keine kostenlosen Versuche mehr für diese Prüfung`}
            </p>
          )}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "40px" }}>
            <button
              onClick={startPractice}
              className="pk-mode-primary"
              style={{ animation: "pk-revUp .6s cubic-bezier(.16,1,.3,1) .1s both", textAlign: "left", cursor: "pointer", fontFamily: "inherit", background: "var(--accent)", color: "var(--on-accent)", border: "none", borderRadius: "20px", padding: "28px", boxShadow: "0 10px 30px color-mix(in oklch, var(--accent) 32%, transparent)", transition: "transform .2s cubic-bezier(.2,.9,.3,1.3), box-shadow .25s" }}
            >
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" style={{ marginBottom: "16px" }}>
                <path d="M4 6h16M4 12h16M4 18h10" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
              </svg>
              <div style={{ ...heading, fontWeight: 600, fontSize: "22px", marginBottom: "6px" }}>Themen üben</div>
              <div style={{ fontSize: "15px", opacity: 0.85, lineHeight: 1.5 }}>Entspannt lernen, ohne Zeitdruck, mit sofortigem Feedback.</div>
            </button>
            <button
              onClick={startSimulation}
              disabled={!simUnlocked}
              className={simUnlocked ? "pk-mode-secondary" : undefined}
              aria-disabled={!simUnlocked}
              style={{ animation: "pk-revUp .6s cubic-bezier(.16,1,.3,1) .16s both", position: "relative", textAlign: "left", cursor: simUnlocked ? "pointer" : "not-allowed", fontFamily: "inherit", background: "var(--surface)", color: "var(--text)", border: "1px solid var(--border)", borderRadius: "20px", padding: "28px", opacity: simUnlocked ? 1 : 0.62, transition: "transform .2s, border-color .2s, box-shadow .3s" }}
            >
              {!simUnlocked && (
                <span style={{ position: "absolute", top: "22px", right: "22px", color: "var(--muted)" }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <rect x="5" y="11" width="14" height="9" rx="2" stroke="currentColor" strokeWidth="2" />
                    <path d="M8 11V8a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="2" />
                  </svg>
                </span>
              )}
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" style={{ marginBottom: "16px" }}>
                <circle cx="12" cy="13" r="8" stroke="var(--accent)" strokeWidth="2" />
                <path d="M12 9.5V13l2.5 1.5M9 2h6" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <div style={{ ...heading, fontWeight: 600, fontSize: "22px", marginBottom: "6px" }}>Prüfungssimulation</div>
              <div style={{ fontSize: "15px", color: "var(--muted)", lineHeight: 1.5 }}>
                {simUnlocked
                  ? "Zeitlimit, echtes Prüfungsformat, ehrliche Auswertung."
                  : `Freigeschaltet ab ${SIM_UNLOCK_PCT}% richtig beantworteter Fragen.`}
              </div>
            </button>
          </div>

          {/* Unlock progress (while locked) or exam-readiness tracker (once
              unlocked): the Fahrschul-app style consistency loop. */}
          {!simUnlocked ? (
            <div style={{ animation: "pk-revUp .6s cubic-bezier(.16,1,.3,1) .2s both", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "18px", padding: "22px 24px", marginBottom: "40px" }}>
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "12px", gap: "12px" }}>
                <span style={{ fontSize: "15px", fontWeight: 600 }}>Simulationsmodus wird bei {SIM_UNLOCK_PCT}% freigeschaltet</span>
                <span style={{ ...heading, fontSize: "15px", fontWeight: 700, color: "var(--accent-strong)" }}>{masteredPct}%</span>
              </div>
              <div style={{ position: "relative", height: "10px", borderRadius: "100px", background: "var(--bg-alt)", overflow: "hidden" }}>
                <div style={{ width: `${masteredPct}%`, height: "100%", borderRadius: "100px", background: "var(--accent)", transition: "width .6s cubic-bezier(.16,1,.3,1)" }} />
                {/* Marker for the unlock threshold. */}
                <span style={{ position: "absolute", top: "-3px", bottom: "-3px", left: `${SIM_UNLOCK_PCT}%`, width: "2px", background: "var(--muted)", opacity: 0.5 }} />
              </div>
              <p style={{ fontSize: "14px", color: "var(--muted)", margin: "12px 0 0", lineHeight: 1.5 }}>
                Übe weiter im Themenmodus. Jede Frage, die du richtig hast, bringt dich näher an die Freischaltung.
              </p>
            </div>
          ) : examReady ? (
            <div style={{ animation: "pk-revUp .6s cubic-bezier(.16,1,.3,1) .2s both", display: "flex", alignItems: "center", gap: "16px", background: "color-mix(in oklch, var(--accent) 12%, var(--surface))", border: "1px solid color-mix(in oklch, var(--accent) 45%, var(--border))", borderRadius: "18px", padding: "22px 24px", marginBottom: "40px" }}>
              <span style={{ width: "46px", height: "46px", borderRadius: "13px", background: "color-mix(in oklch, var(--accent) 20%, var(--bg))", display: "grid", placeItems: "center", flexShrink: 0 }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                  <path d="M5 13l4 4L19 7" stroke="var(--accent-strong)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <div>
                <div style={{ ...heading, fontWeight: 700, fontSize: "18px", marginBottom: "3px", color: "var(--accent-strong)" }}>Du bist prüfungsbereit!</div>
                <div style={{ fontSize: "14.5px", color: "var(--muted)", lineHeight: 1.5 }}>{READINESS_STREAK} Simulationen in Folge bestanden. Bleib dran, damit es so bleibt.</div>
              </div>
            </div>
          ) : (
            <div style={{ animation: "pk-revUp .6s cubic-bezier(.16,1,.3,1) .2s both", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "18px", padding: "22px 24px", marginBottom: "40px" }}>
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "12px", gap: "12px" }}>
                <span style={{ fontSize: "15px", fontWeight: 600 }}>Weg zur Prüfungsbereitschaft</span>
                <span style={{ ...heading, fontSize: "15px", fontWeight: 700, color: "var(--accent-strong)" }}>{Math.min(passStreak, READINESS_STREAK)} / {READINESS_STREAK}</span>
              </div>
              <div style={{ display: "flex", gap: "6px" }}>
                {Array.from({ length: READINESS_STREAK }).map((_, i) => (
                  <div key={i} style={{ flex: 1, height: "10px", borderRadius: "100px", background: i < passStreak ? "var(--accent)" : "var(--bg-alt)", transition: "background .3s" }} />
                ))}
              </div>
              <p style={{ fontSize: "14px", color: "var(--muted)", margin: "12px 0 0", lineHeight: 1.5 }}>
                Bestehe die Simulation {READINESS_STREAK}-mal in Folge, dann giltst du als prüfungsbereit. Ein Durchfaller setzt den Zähler zurück.
              </p>
            </div>
          )}
          <h2 style={{ ...heading, animation: "pk-revUp .6s cubic-bezier(.16,1,.3,1) .2s both", fontWeight: 600, fontSize: "20px", letterSpacing: "-.01em", margin: "0 0 18px" }}>Themengebiete</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(230px,1fr))", gap: "14px" }}>
            {topics.map((t, i) => (
              <button
                key={t.name}
                onClick={startPractice}
                className="pk-topic-card"
                style={{ animation: `pk-revUp .6s cubic-bezier(.16,1,.3,1) ${(i * 0.06).toFixed(2)}s both`, textAlign: "left", cursor: "pointer", fontFamily: "inherit", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "16px", padding: "20px", transition: "transform .22s, border-color .25s, box-shadow .3s" }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
                  <span style={{ ...heading, fontWeight: 600, fontSize: "16px", color: "var(--text)" }}>{t.name}</span>
                  <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--muted)" }}>{t.count} {t.count === 1 ? "Frage" : "Fragen"}</span>
                </div>
                <div style={{ height: "6px", borderRadius: "100px", background: "var(--bg-alt)", overflow: "hidden" }}>
                  <div style={{ width: `${Math.round((t.count / maxCount) * 100)}%`, height: "100%", borderRadius: "100px", background: "var(--accent)" }} />
                </div>
              </button>
            ))}
          </div>
        </main>
      )}

      {/* ===== SCREEN 3: PRACTICE ===== */}
      {screen === "practice" && (
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
          <div style={{ position: "sticky", top: 0, zIndex: 40, background: "color-mix(in oklch, var(--bg) 82%, transparent)", backdropFilter: "blur(12px)", borderBottom: "1px solid var(--border)" }}>
            <div style={{ height: "4px", background: "var(--bg-alt)" }}>
              <div style={{ width: practicePct, height: "100%", background: "var(--accent)", transition: "width .5s cubic-bezier(.16,1,.3,1)" }} />
            </div>
            <div style={{ maxWidth: "820px", margin: "0 auto", padding: "16px 28px", display: "flex", alignItems: "center", gap: "16px" }}>
              <span style={{ fontSize: "14px", fontWeight: 600, color: "var(--muted)" }}>{mode === "sim" ? "Prüfungssimulation" : (q?.topic ?? "")}</span>
              {mode === "sim" && (
                <span style={{ ...heading, fontSize: "14px", fontWeight: 700, color: secondsLeft <= 60 ? "var(--err-strong)" : "var(--accent-strong)", marginLeft: "auto" }}>
                  {formatClock(secondsLeft)}
                </span>
              )}
              <span style={{ fontSize: "14px", fontWeight: 600, color: "var(--muted)", marginLeft: mode === "sim" ? undefined : "auto" }}>{qCounter}</span>
              <button
                onClick={exitPractice}
                aria-label="Verlassen"
                className="pk-practice-exit"
                style={{ width: "38px", height: "38px", borderRadius: "11px", border: "1px solid var(--border)", background: "var(--surface)", color: "var(--text)", cursor: "pointer", display: "grid", placeItems: "center", transition: "transform .18s, border-color .2s" }}
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
                  <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          </div>
          <main style={{ flex: 1, maxWidth: "820px", width: "100%", margin: "0 auto", padding: "60px 28px 40px", display: "flex", flexDirection: "column" }}>
            {q ? (
              <>
                <div key={q.id} style={{ animation: "pk-revUp .45s cubic-bezier(.16,1,.3,1) both" }}>
                <span style={{ fontSize: "14px", fontWeight: 600, color: "var(--accent-strong)", marginBottom: "16px", display: "block" }}>Frage {qIndex + 1}</span>
                <h1 style={{ ...heading, fontWeight: 600, fontSize: "clamp(24px,3.2vw,34px)", letterSpacing: "-.02em", lineHeight: 1.25, margin: "0 0 40px", maxWidth: "680px" }}>{q.q}</h1>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {q.options.map((o, i) => {
                    const isCorrect = o.isCorrect;
                    const isMulti = q.questionType === "multiple";
                    const chosen = isMulti ? selectedMulti.includes(i) : i === selected;
                    const reveal = answered && mode !== "sim";
                    let bg = "var(--surface)";
                    let border = "var(--border)";
                    let color = "var(--text)";
                    let opacity = 1;
                    if (reveal) {
                      if (isCorrect) {
                        border = "var(--accent)";
                        bg = "color-mix(in oklch, var(--accent) 10%, var(--bg))";
                      } else if (chosen) {
                        border = "var(--err)";
                        bg = "color-mix(in oklch, var(--err) 10%, var(--bg))";
                      } else {
                        color = "var(--muted)";
                        opacity = 0.6;
                      }
                    } else if (answered && chosen) {
                      // Sim mode: show the pick was registered, no correctness.
                      border = "var(--accent)";
                      bg = "color-mix(in oklch, var(--accent) 8%, var(--bg))";
                    } else if (chosen) {
                      // Multi-choice, not yet submitted: show it's checked.
                      border = "var(--accent)";
                      bg = "color-mix(in oklch, var(--accent) 8%, var(--bg))";
                    }
                    return (
                      <button
                        key={i}
                        onClick={() => (isMulti ? toggleMulti(i) : select(i))}
                        className="pk-option-btn"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "14px",
                          textAlign: "left",
                          width: "100%",
                          cursor: answered ? "default" : "pointer",
                          pointerEvents: answered ? "none" : "auto",
                          fontFamily: "var(--font-hanken), sans-serif",
                          fontWeight: 500,
                          fontSize: "16.5px",
                          padding: "16px 18px",
                          borderRadius: "15px",
                          background: bg,
                          color,
                          border: `1.5px solid ${border}`,
                          opacity,
                          transition: "transform .18s, border-color .2s, background .25s, box-shadow .25s",
                        }}
                      >
                        <span
                          style={{
                            ...heading,
                            width: "26px",
                            height: "26px",
                            borderRadius: isMulti ? "7px" : "8px",
                            border: "1.5px solid var(--border)",
                            display: "grid",
                            placeItems: "center",
                            fontWeight: 600,
                            fontSize: "13px",
                            flexShrink: 0,
                            background: isMulti && chosen && !reveal ? "var(--accent)" : "var(--bg)",
                          }}
                        >
                          {isMulti ? (
                            chosen && !reveal ? (
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                <path d="M5 12.5l4.5 4.5L19 7" stroke="var(--on-accent)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            ) : null
                          ) : (
                            ["A", "B", "C", "D"][i]
                          )}
                        </span>
                        <span style={{ flex: 1 }}>{o.text}</span>
                        {reveal && isCorrect && (
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="11" fill="var(--accent)" />
                            <path d="M7 12.5l3 3 6.5-7" stroke="var(--on-accent)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                        {reveal && chosen && !isCorrect && (
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="11" fill="var(--err)" />
                            <path d="M8 8l8 8M16 8l-8 8" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" />
                          </svg>
                        )}
                      </button>
                    );
                  })}
                </div>
                </div>
                {answered && mode !== "sim" && (
                  <div style={{ animation: "pk-popIn .4s cubic-bezier(.16,1,.3,1) both", marginTop: "24px", display: "flex", gap: "13px", alignItems: "flex-start", background: "var(--bg-alt)", border: "1px solid var(--border)", borderRadius: "16px", padding: "18px 20px" }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: "2px" }}>
                      <circle cx="12" cy="12" r="9.5" stroke="var(--accent)" strokeWidth="2" />
                      <path d="M12 11v5M12 8h.01" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: "15px", marginBottom: "3px", color: "var(--text)" }}>{verdictLabel}</div>
                      {q.expl && <div style={{ fontSize: "15px", color: "var(--muted)", lineHeight: 1.5 }}>{q.expl}</div>}
                    </div>
                  </div>
                )}
                <div style={{ marginTop: "auto", paddingTop: "40px", display: "flex", alignItems: "center", gap: "16px" }}>
                  {mode !== "sim" && (
                    <div style={{ display: "flex", alignItems: "center", gap: "9px", padding: "9px 15px", borderRadius: "100px", border: "1px solid var(--border)", background: "var(--surface)" }}>
                      <span key={xpBump} style={{ animation: "pk-xpGlow .6s ease", display: "grid", placeItems: "center" }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <path d="M13 2L4 14h7l-1 8 9-12h-7l1-8Z" fill="var(--accent)" />
                        </svg>
                      </span>
                      <span style={{ ...heading, fontWeight: 700, fontSize: "16px", color: "var(--accent-strong)" }}>{xpDisplay.toLocaleString("de-DE")} XP</span>
                    </div>
                  )}
                  {!answered && q.questionType === "multiple" && (
                    <button
                      onClick={submitMulti}
                      disabled={selectedMulti.length === 0}
                      className="pk-scale-btn"
                      style={{ marginLeft: "auto", border: "none", cursor: selectedMulti.length === 0 ? "not-allowed" : "pointer", opacity: selectedMulti.length === 0 ? 0.5 : 1, fontFamily: "var(--font-hanken), sans-serif", fontWeight: 600, fontSize: "16px", padding: "14px 26px", borderRadius: "14px", background: "var(--accent)", color: "var(--on-accent)", display: "flex", alignItems: "center", gap: "9px", boxShadow: "0 8px 24px color-mix(in oklch, var(--accent) 34%, transparent)", transition: "transform .2s cubic-bezier(.2,.9,.3,1.3)" }}
                    >
                      Prüfen
                    </button>
                  )}
                  {answered && (
                    <button
                      onClick={next}
                      className="pk-scale-btn"
                      style={{ animation: "pk-popIn .35s cubic-bezier(.16,1,.3,1) both", marginLeft: "auto", border: "none", cursor: "pointer", fontFamily: "var(--font-hanken), sans-serif", fontWeight: 600, fontSize: "16px", padding: "14px 26px", borderRadius: "14px", background: "var(--accent)", color: "var(--on-accent)", display: "flex", alignItems: "center", gap: "9px", boxShadow: "0 8px 24px color-mix(in oklch, var(--accent) 34%, transparent)", transition: "transform .2s cubic-bezier(.2,.9,.3,1.3)" }}
                    >
                      {nextLabel}
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M5 12h13M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  )}
                </div>
              </>
            ) : (
              <div style={{ textAlign: "center", color: "var(--muted)", paddingTop: "80px" }}>
                <p style={{ ...heading, fontSize: "22px", color: "var(--text)", marginBottom: "8px" }}>
                  {questions.length === 0
                    ? "Noch keine Fragen freigegeben"
                    : mode === "sim"
                      ? "Noch zu wenige Fragen für eine Simulation"
                      : mode === "wrong"
                        ? "Keine falschen Fragen, stark!"
                        : "Alles wiederholt für heute 🎉"}
                </p>
                <p style={{ marginBottom: "24px" }}>
                  {questions.length === 0
                    ? "Sobald im Review Fragen freigegeben sind, erscheinen sie hier."
                    : mode === "sim"
                      ? "Der Fragenpool ist gerade leer. Schau später wieder vorbei."
                      : mode === "wrong"
                        ? "Du hast aktuell keine offenen Fehler zum Wiederholen."
                        : "Es sind gerade keine Fragen zur Wiederholung fällig. Schau später wieder vorbei."}
                </p>
                <button onClick={exitPractice} className="pk-scale-btn-sm" style={{ cursor: "pointer", fontFamily: "var(--font-hanken), sans-serif", fontWeight: 600, fontSize: "15px", padding: "12px 22px", borderRadius: "13px", background: "var(--accent)", color: "var(--on-accent)", border: "none" }}>Zurück</button>
              </div>
            )}
          </main>
        </div>
      )}

      {/* ===== SCREEN 4: RESULT ===== */}
      {screen === "result" && (
        <main style={{ position: "relative", maxWidth: "760px", margin: "0 auto", padding: "56px 28px 90px", overflow: "hidden" }}>
          {passed && confetti.map((c) => <span key={c.key} style={c.style} />)}
          <div style={{ position: "relative", zIndex: 1, textAlign: "center", animation: "pk-revUp .6s cubic-bezier(.16,1,.3,1) both" }}>
            <div style={{ position: "relative", width: "150px", height: "150px", margin: "0 auto 26px" }}>
              <svg width="150" height="150" viewBox="0 0 120 120" style={{ transform: "rotate(-90deg)" }}>
                <circle cx="60" cy="60" r="54" fill="none" stroke="var(--bg-alt)" strokeWidth="11" />
                <circle cx="60" cy="60" r="54" fill="none" stroke={ringColor} strokeWidth="11" strokeLinecap="round" strokeDasharray="339" strokeDashoffset={ringOffset} style={{ animation: "pk-ringFill 1.1s cubic-bezier(.16,1,.3,1) both" }} />
              </svg>
              <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <span style={{ ...heading, fontWeight: 700, fontSize: "42px", letterSpacing: "-.03em", lineHeight: 1 }}>{scorePct}{mode === "sim" ? "" : "%"}</span>
                <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--muted)" }}>{mode === "sim" ? "Punkte" : "Ergebnis"}</span>
              </div>
            </div>
            <span style={{ display: "inline-block", padding: "6px 16px", borderRadius: "100px", background: passed ? "color-mix(in oklch, var(--accent) 14%, var(--bg))" : "color-mix(in oklch, var(--err) 14%, var(--bg))", color: passed ? "var(--accent-strong)" : "var(--err-strong)", fontSize: "14px", fontWeight: 700, marginBottom: "16px" }}>
              {mode === "sim" && gradeResult
                ? `${passed ? "Bestanden" : "Nicht bestanden"} · Note ${gradeResult.grade} (${gradeResult.gradeLabel})`
                : passed ? "Bestanden 🎯" : "Nicht bestanden"}
            </span>
            <h1 style={{ ...heading, fontWeight: 700, fontSize: "clamp(30px,4vw,44px)", letterSpacing: "-.03em", margin: "0 0 10px", lineHeight: 1.05 }}>
              {passed ? "Stark, du hast bestanden!" : "Fast geschafft, dranbleiben!"}
            </h1>
            <p style={{ fontSize: "18px", color: "var(--muted)", margin: "0 auto 40px", maxWidth: "460px" }}>
              {mode === "sim"
                ? `${correctCount} von ${session.length} Fragen richtig, ${scorePct} von 100 Punkten (Bestehensgrenze: ${PASS_THRESHOLD}).`
                : `${correctCount} von ${answeredTotal} Fragen richtig. ${passed ? "Ein paar Themen brauchen noch etwas Feinschliff." : "Übe die schwachen Themen gezielt weiter."}`}
            </p>
            {mode === "sim" && (
              <div style={{ marginBottom: "40px" }}>
                {examReady ? (
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "9px", padding: "10px 18px", borderRadius: "100px", background: "color-mix(in oklch, var(--accent) 16%, var(--bg))", color: "var(--accent-strong)", fontSize: "15px", fontWeight: 700 }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Prüfungsbereit! {READINESS_STREAK} in Folge bestanden
                  </span>
                ) : passed ? (
                  <span style={{ fontSize: "15px", fontWeight: 600, color: "var(--accent-strong)" }}>
                    {passStreak} von {READINESS_STREAK} in Folge bestanden, noch {READINESS_STREAK - passStreak} bis prüfungsbereit.
                  </span>
                ) : (
                  <span style={{ fontSize: "15px", fontWeight: 600, color: "var(--err-strong)" }}>
                    Serie zurückgesetzt. Für die Prüfungsbereitschaft {READINESS_STREAK} in Folge bestehen.
                  </span>
                )}
              </div>
            )}
          </div>
          {topicScores.length > 0 && (
            <div style={{ position: "relative", zIndex: 1, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "22px", padding: "28px", marginBottom: "28px", animation: "pk-revUp .6s cubic-bezier(.16,1,.3,1) .08s both" }}>
              <h2 style={{ ...heading, fontWeight: 600, fontSize: "18px", margin: "0 0 22px", letterSpacing: "-.01em" }}>Nach Themengebiet</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                {topicScores.map((t) => (
                  <div key={t.name}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                      <span style={{ fontSize: "15px", fontWeight: 600 }}>{t.name}</span>
                      <span style={{ fontSize: "14px", fontWeight: 700, color: t.color }}>{t.scoreLabel}</span>
                    </div>
                    <div style={{ height: "9px", borderRadius: "100px", background: "var(--bg-alt)", overflow: "hidden" }}>
                      <div style={{ width: t.scoreLabel, height: "100%", borderRadius: "100px", background: t.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div style={{ position: "relative", zIndex: 1, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", animation: "pk-revUp .6s cubic-bezier(.16,1,.3,1) .14s both" }}>
            <button
              onClick={mode === "sim" ? startSimulation : startPractice}
              className="pk-price-btn-ghost"
              style={{ cursor: "pointer", fontFamily: "var(--font-hanken), sans-serif", fontWeight: 600, fontSize: "16px", padding: "16px", borderRadius: "15px", background: "var(--surface)", color: "var(--text)", border: "1px solid var(--border)", transition: "transform .18s, border-color .2s" }}
            >
              {mode === "sim" ? "Erneut simulieren" : "Nochmal üben"}
            </button>
            <button
              onClick={backToOverview}
              className="pk-scale-btn-sm"
              style={{ cursor: "pointer", fontFamily: "var(--font-hanken), sans-serif", fontWeight: 600, fontSize: "16px", padding: "16px", borderRadius: "15px", background: "var(--accent)", color: "var(--on-accent)", border: "none", boxShadow: "0 8px 24px color-mix(in oklch, var(--accent) 32%, transparent)", transition: "transform .2s cubic-bezier(.2,.9,.3,1.3)" }}
            >
              Zurück zur Übersicht
            </button>
          </div>
        </main>
      )}

      {/* ===== SCREEN 5: PAYWALL ===== */}
      {screen === "paywall" && (
        <main style={{ maxWidth: "560px", margin: "0 auto", padding: "90px 28px" }}>
          <div style={{ animation: "pk-revUp .6s cubic-bezier(.16,1,.3,1) both", textAlign: "center", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "24px", padding: "44px 36px" }}>
            <span style={{ width: "64px", height: "64px", borderRadius: "18px", background: "color-mix(in oklch, var(--accent) 16%, var(--bg))", display: "grid", placeItems: "center", margin: "0 auto 22px" }}>
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
                <rect x="5" y="11" width="14" height="9" rx="2" stroke="var(--accent-strong)" strokeWidth="2" />
                <path d="M8 11V8a4 4 0 0 1 8 0v3" stroke="var(--accent-strong)" strokeWidth="2" />
              </svg>
            </span>
            <h1 style={{ ...heading, fontWeight: 700, fontSize: "clamp(26px,3.4vw,34px)", letterSpacing: "-.03em", margin: "0 0 12px" }}>
              Deine kostenlosen Versuche sind aufgebraucht
            </h1>
            <p style={{ fontSize: "16.5px", color: "var(--muted)", margin: "0 0 30px", lineHeight: 1.55 }}>
              Du hast die {FREE_TRY_LIMIT} kostenlosen {paywallMode === "sim" ? "Prüfungssimulationen" : "Lernsitzungen"} für {examName} bereits genutzt.
              Mit Pro übst du unbegrenzt weiter, ohne Limit.
            </p>
            <button
              onClick={goToUpgrade}
              className="pk-scale-btn-sm"
              style={{ cursor: "pointer", fontFamily: "var(--font-hanken), sans-serif", fontWeight: 600, fontSize: "16px", padding: "16px 28px", borderRadius: "15px", background: "var(--accent)", color: "var(--on-accent)", border: "none", boxShadow: "0 8px 24px color-mix(in oklch, var(--accent) 32%, transparent)", transition: "transform .2s cubic-bezier(.2,.9,.3,1.3)" }}
            >
              Auf Pro upgraden
            </button>
            <div style={{ marginTop: "18px" }}>
              <button
                onClick={() => setScreen("detail")}
                style={{ cursor: "pointer", fontFamily: "var(--font-hanken), sans-serif", fontWeight: 600, fontSize: "14.5px", padding: "8px", borderRadius: "10px", background: "transparent", color: "var(--muted)", border: "none" }}
              >
                Zurück zur Prüfung
              </button>
            </div>
          </div>
        </main>
      )}
    </div>
  );
}
