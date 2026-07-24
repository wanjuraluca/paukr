import { createAdminClient } from "@/lib/supabase/admin";
import {
  approveQuestion,
  unapproveQuestion,
  rejectQuestion,
  approveAll,
} from "./actions";

export const dynamic = "force-dynamic";

interface ReviewQuestion {
  id: string;
  question_text: string;
  explanation: string | null;
  difficulty: number;
  reviewed: boolean;
  source_key: string | null;
  topics: { name: string; sort_order: number } | null;
  answer_options: { option_text: string; is_correct: boolean; sort_order: number }[];
}

const heading = { fontFamily: "var(--font-space), sans-serif" } as const;

export default async function ReviewPage() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("questions")
    .select(
      "id, question_text, explanation, difficulty, reviewed, source_key, topics(name, sort_order), answer_options(option_text, is_correct, sort_order)",
    )
    .returns<ReviewQuestion[]>();

  const questions = (data ?? []).slice().sort((a, b) => {
    const ta = a.topics?.sort_order ?? 0;
    const tb = b.topics?.sort_order ?? 0;
    if (ta !== tb) return ta - tb;
    return (a.source_key ?? "").localeCompare(b.source_key ?? "");
  });

  const pending = questions.filter((q) => !q.reviewed).length;
  const approved = questions.filter((q) => q.reviewed).length;

  return (
    <div
      className="eh"
      style={{
        background: "var(--bg)",
        color: "var(--text)",
        minHeight: "100vh",
        fontSize: "16px",
        lineHeight: 1.6,
      }}
    >
      <main style={{ maxWidth: "820px", margin: "0 auto", padding: "56px 24px 90px" }}>
        <div
          style={{
            padding: "12px 16px",
            borderRadius: "12px",
            border: "1px solid var(--border)",
            background: "color-mix(in oklch, var(--err) 10%, var(--bg))",
            color: "var(--err-strong)",
            fontSize: "13px",
            fontWeight: 600,
            marginBottom: "28px",
          }}
        >
          Interne Review-Seite, ohne Zugriffsschutz. Vor einem echten Deploy hinter Login/Auth legen.
        </div>

        <h1 style={{ ...heading, fontWeight: 700, fontSize: "34px", letterSpacing: "-.02em", margin: "0 0 8px" }}>
          Fragen-Review
        </h1>
        <p style={{ color: "var(--muted)", margin: "0 0 24px" }}>
          Freigegebene Fragen erscheinen im Übungsmodus. Entwürfe bleiben verborgen.
        </p>

        <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap", marginBottom: "32px" }}>
          <span style={{ ...heading, fontWeight: 600, fontSize: "14px", padding: "6px 12px", borderRadius: "100px", border: "1px solid var(--border)", background: "var(--surface)" }}>
            {pending} Entwurf{pending === 1 ? "" : "e"}
          </span>
          <span style={{ ...heading, fontWeight: 600, fontSize: "14px", padding: "6px 12px", borderRadius: "100px", border: "1px solid var(--border)", background: "var(--surface)", color: "var(--accent-strong)" }}>
            {approved} freigegeben
          </span>
          {pending > 0 && (
            <form action={approveAll} style={{ marginLeft: "auto" }}>
              <button
                type="submit"
                style={{ cursor: "pointer", fontFamily: "var(--font-hanken), sans-serif", fontWeight: 600, fontSize: "14px", padding: "9px 16px", borderRadius: "11px", background: "var(--accent)", color: "var(--on-accent)", border: "none" }}
              >
                Alle Entwürfe freigeben
              </button>
            </form>
          )}
        </div>

        {error && (
          <p style={{ color: "var(--err-strong)" }}>Fehler beim Laden: {error.message}</p>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {questions.map((q) => {
            const opts = q.answer_options.slice().sort((a, b) => a.sort_order - b.sort_order);
            return (
              <div
                key={q.id}
                style={{
                  background: "var(--surface)",
                  border: `1px solid ${q.reviewed ? "color-mix(in oklch, var(--accent) 45%, var(--border))" : "var(--border)"}`,
                  borderRadius: "18px",
                  padding: "22px 24px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px", flexWrap: "wrap" }}>
                  <span style={{ fontSize: "12px", fontWeight: 700, letterSpacing: ".03em", color: "var(--accent-strong)", background: "color-mix(in oklch, var(--accent) 13%, var(--bg))", padding: "4px 10px", borderRadius: "100px" }}>
                    {q.topics?.name ?? "—"}
                  </span>
                  <span style={{ fontSize: "12px", color: "var(--muted)", fontFamily: "var(--font-space), monospace" }}>
                    {q.source_key}
                  </span>
                  <span style={{ fontSize: "12px", color: "var(--muted)" }}>· Schwierigkeit {q.difficulty}</span>
                  <span
                    style={{
                      marginLeft: "auto",
                      fontSize: "12px",
                      fontWeight: 700,
                      padding: "4px 10px",
                      borderRadius: "100px",
                      background: q.reviewed ? "color-mix(in oklch, var(--accent) 14%, var(--bg))" : "var(--bg-alt)",
                      color: q.reviewed ? "var(--accent-strong)" : "var(--muted)",
                    }}
                  >
                    {q.reviewed ? "Freigegeben" : "Entwurf"}
                  </span>
                </div>

                <p style={{ ...heading, fontWeight: 600, fontSize: "17px", margin: "0 0 14px", lineHeight: 1.35 }}>
                  {q.question_text}
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "14px" }}>
                  {opts.map((o, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        padding: "10px 13px",
                        borderRadius: "11px",
                        fontSize: "14.5px",
                        border: `1.5px solid ${o.is_correct ? "var(--accent)" : "var(--border)"}`,
                        background: o.is_correct ? "color-mix(in oklch, var(--accent) 10%, var(--bg))" : "var(--surface)",
                        color: o.is_correct ? "var(--text)" : "var(--muted)",
                        fontWeight: o.is_correct ? 600 : 500,
                      }}
                    >
                      <span style={{ ...heading, width: "22px", height: "22px", borderRadius: "7px", border: "1.5px solid var(--border)", display: "grid", placeItems: "center", fontSize: "12px", fontWeight: 600, flexShrink: 0, background: "var(--bg)" }}>
                        {["A", "B", "C", "D"][i]}
                      </span>
                      <span style={{ flex: 1 }}>{o.option_text}</span>
                      {o.is_correct && (
                        <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--accent-strong)" }}>richtig</span>
                      )}
                    </div>
                  ))}
                </div>

                {q.explanation && (
                  <p style={{ fontSize: "14px", color: "var(--muted)", margin: "0 0 16px", lineHeight: 1.5 }}>
                    <strong style={{ color: "var(--text)" }}>Erklärung: </strong>
                    {q.explanation}
                  </p>
                )}

                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  {!q.reviewed ? (
                    <>
                      <form action={approveQuestion}>
                        <input type="hidden" name="id" value={q.id} />
                        <button type="submit" style={{ cursor: "pointer", fontFamily: "var(--font-hanken), sans-serif", fontWeight: 600, fontSize: "14px", padding: "10px 18px", borderRadius: "11px", background: "var(--accent)", color: "var(--on-accent)", border: "none" }}>
                          Freigeben
                        </button>
                      </form>
                      <form action={rejectQuestion}>
                        <input type="hidden" name="id" value={q.id} />
                        <button type="submit" style={{ cursor: "pointer", fontFamily: "var(--font-hanken), sans-serif", fontWeight: 600, fontSize: "14px", padding: "10px 18px", borderRadius: "11px", background: "var(--surface)", color: "var(--err-strong)", border: "1px solid color-mix(in oklch, var(--err) 45%, var(--border))" }}>
                          Ablehnen
                        </button>
                      </form>
                    </>
                  ) : (
                    <form action={unapproveQuestion}>
                      <input type="hidden" name="id" value={q.id} />
                      <button type="submit" style={{ cursor: "pointer", fontFamily: "var(--font-hanken), sans-serif", fontWeight: 600, fontSize: "14px", padding: "10px 18px", borderRadius: "11px", background: "var(--surface)", color: "var(--text)", border: "1px solid var(--border)" }}>
                        Freigabe zurückziehen
                      </button>
                    </form>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
