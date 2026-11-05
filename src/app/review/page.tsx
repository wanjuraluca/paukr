import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { noindexMetadata } from "@/lib/seo";
import ReviewShell from "./ReviewShell";
import {
  approveQuestion,
  unapproveQuestion,
  rejectQuestion,
  approveAll,
  resolveReport,
} from "./actions";

export const dynamic = "force-dynamic";
export const metadata = noindexMetadata("Fragen-Review | paukr");

interface ReviewQuestion {
  id: string;
  question_text: string;
  explanation: string | null;
  difficulty: number;
  reviewed: boolean;
  source_key: string | null;
  question_type: "single" | "multiple";
  topics: { name: string; sort_order: number } | null;
  answer_options: { option_text: string; is_correct: boolean; sort_order: number }[];
}

const heading = { fontFamily: "var(--font-space), sans-serif" } as const;

export default async function ReviewPage() {
  // Gate behind auth + an explicit admin flag on the profile, not just a
  // warning label — this page can approve/reject/delete question content.
  const authClient = await createClient();
  const {
    data: { user },
  } = await authClient.auth.getUser();
  if (!user) redirect("/auth?next=/review");

  const { data: profile } = await authClient
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single<{ is_admin: boolean }>();
  if (!profile?.is_admin) redirect("/app");

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("questions")
    .select(
      "id, question_text, explanation, difficulty, reviewed, source_key, question_type, topics(name, sort_order), answer_options(option_text, is_correct, sort_order)",
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

  // Real platform stats (admin-only, bypasses RLS via the service-role
  // client). No estimates or made-up numbers here, just actual row counts.
  const [{ count: userCount }, { count: practiceAnswerCount }, { data: scoredAttempts }] =
    await Promise.all([
      supabase.from("profiles").select("*", { count: "exact", head: true }),
      supabase.from("question_attempts").select("*", { count: "exact", head: true }),
      supabase
        .from("exam_attempts")
        .select("score_correct, score_total")
        .not("finished_at", "is", null)
        .not("score_total", "is", null)
        .returns<{ score_correct: number | null; score_total: number | null }[]>(),
    ]);

  // Pass rate needs correct*2 >= total, which PostgREST can't express as a
  // simple count filter, so this is computed from the fetched scores instead.
  const scored = (scoredAttempts ?? []).filter((a) => (a.score_total ?? 0) > 0);
  const passedCount = scored.filter((a) => (a.score_correct ?? 0) * 2 >= (a.score_total ?? 0)).length;
  const passRateLabel = scored.length > 0 ? `${Math.round((passedCount / scored.length) * 100)}%` : "–";
  const attemptCount = scored.length;

  const { data: sources } = await supabase
    .from("signup_source_stats")
    .select("source, signups, active, pro")
    .order("signups", { ascending: false })
    .returns<{ source: string; signups: number; active: number; pro: number }[]>();

  const { data: reports } = await supabase
    .from("question_reports")
    .select("id, message, created_at, questions(question_text)")
    .is("resolved_at", null)
    .order("created_at", { ascending: false })
    .returns<{ id: string; message: string; created_at: string; questions: { question_text: string } | null }[]>();

  return (
    <ReviewShell>
      <main style={{ maxWidth: "820px", margin: "0 auto", padding: "56px 24px 90px", fontSize: "16px", lineHeight: 1.6 }}>
        <h1 style={{ ...heading, fontWeight: 700, fontSize: "34px", letterSpacing: "-.02em", margin: "0 0 8px" }}>
          Fragen-Review
        </h1>
        <p style={{ color: "var(--muted)", margin: "0 0 24px" }}>
          Freigegebene Fragen erscheinen im Übungsmodus. Entwürfe bleiben verborgen.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(130px,1fr))", gap: "12px", marginBottom: "32px" }}>
          {[
            { value: String(userCount ?? 0), label: "Registrierte Nutzer" },
            { value: String(practiceAnswerCount ?? 0), label: "Übungsantworten" },
            { value: String(attemptCount), label: "Prüfungssimulationen" },
            { value: passRateLabel, label: "Bestehensquote (real)" },
          ].map((s) => (
            <div key={s.label} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "14px", padding: "16px 18px" }}>
              <div style={{ ...heading, fontWeight: 700, fontSize: "26px", letterSpacing: "-.02em", color: "var(--accent)" }}>{s.value}</div>
              <div style={{ fontSize: "13px", color: "var(--muted)", marginTop: "2px" }}>{s.label}</div>
            </div>
          ))}
        </div>

        {(sources ?? []).length > 0 && (
          <section style={{ marginBottom: "32px" }}>
            <h2 style={{ ...heading, fontWeight: 600, fontSize: "20px", margin: "0 0 12px" }}>Herkunft der Anmeldungen</h2>
            <div style={{ overflowX: "auto", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "14px" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14.5px" }}>
                <thead>
                  <tr style={{ textAlign: "left", color: "var(--muted)" }}>
                    <th style={{ padding: "12px 16px", fontWeight: 600 }}>Quelle</th>
                    <th style={{ padding: "12px 16px", fontWeight: 600 }}>Anmeldungen</th>
                    <th style={{ padding: "12px 16px", fontWeight: 600 }}>Haben geübt</th>
                    <th style={{ padding: "12px 16px", fontWeight: 600 }}>Pro</th>
                  </tr>
                </thead>
                <tbody>
                  {sources!.map((s) => (
                    <tr key={s.source} style={{ borderTop: "1px solid var(--border)" }}>
                      <td style={{ padding: "10px 16px" }}>{s.source}</td>
                      <td style={{ padding: "10px 16px" }}>{s.signups}</td>
                      <td style={{ padding: "10px 16px" }}>{s.active}</td>
                      <td style={{ padding: "10px 16px" }}>{s.pro}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {(reports ?? []).length > 0 && (
          <section style={{ marginBottom: "32px" }}>
            <h2 style={{ ...heading, fontWeight: 600, fontSize: "20px", margin: "0 0 12px" }}>Gemeldete Fehler ({reports!.length})</h2>
            {reports!.map((r) => (
              <div key={r.id} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "14px", padding: "16px 18px", marginBottom: "10px" }}>
                <div style={{ fontWeight: 600 }}>{r.questions?.question_text}</div>
                <p style={{ margin: "6px 0 10px", color: "var(--muted)" }}>{r.message}</p>
                <form action={resolveReport}>
                  <input type="hidden" name="id" value={r.id} />
                  <button type="submit" className="pk-review-btn-ghost" style={{ cursor: "pointer", fontFamily: "inherit", fontWeight: 600, fontSize: "14px", padding: "7px 14px", borderRadius: "10px", background: "transparent", color: "var(--text)", border: "1px solid var(--border)" }}>Erledigt</button>
                </form>
              </div>
            ))}
          </section>
        )}

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
                className="pk-review-btn-accent"
                style={{ cursor: "pointer", fontFamily: "var(--font-hanken), sans-serif", fontWeight: 600, fontSize: "14px", padding: "9px 16px", borderRadius: "11px", background: "var(--accent)", color: "var(--on-accent)", border: "none", transition: "transform .18s, box-shadow .2s" }}
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
                  <span style={{ fontSize: "12px", fontWeight: 700, padding: "4px 10px", borderRadius: "100px", background: "var(--bg-alt)", color: "var(--text)" }}>
                    {q.question_type === "multiple" ? "Mehrfachauswahl" : "Einfachauswahl"}
                  </span>
                  <span style={{ fontSize: "12px", fontWeight: 700, color: q.question_type === "multiple" ? "var(--accent-strong)" : "var(--muted)", background: q.question_type === "multiple" ? "color-mix(in oklch, var(--accent) 13%, var(--bg))" : "var(--bg-alt)", padding: "4px 10px", borderRadius: "100px" }}>
                    {q.question_type === "multiple" ? "Mehrfachauswahl" : "Einzelauswahl"}
                  </span>
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
                        {["A", "B", "C", "D", "E"][i]}
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
                        <button type="submit" className="pk-review-btn-accent" style={{ cursor: "pointer", fontFamily: "var(--font-hanken), sans-serif", fontWeight: 600, fontSize: "14px", padding: "10px 18px", borderRadius: "11px", background: "var(--accent)", color: "var(--on-accent)", border: "none", transition: "transform .18s, box-shadow .2s" }}>
                          Freigeben
                        </button>
                      </form>
                      <form action={rejectQuestion}>
                        <input type="hidden" name="id" value={q.id} />
                        <button type="submit" className="pk-review-btn-ghost" style={{ cursor: "pointer", fontFamily: "var(--font-hanken), sans-serif", fontWeight: 600, fontSize: "14px", padding: "10px 18px", borderRadius: "11px", background: "var(--surface)", color: "var(--err-strong)", border: "1px solid color-mix(in oklch, var(--err) 45%, var(--border))", transition: "transform .18s, border-color .2s" }}>
                          Ablehnen
                        </button>
                      </form>
                    </>
                  ) : (
                    <form action={unapproveQuestion}>
                      <input type="hidden" name="id" value={q.id} />
                      <button type="submit" className="pk-review-btn-ghost" style={{ cursor: "pointer", fontFamily: "var(--font-hanken), sans-serif", fontWeight: 600, fontSize: "14px", padding: "10px 18px", borderRadius: "11px", background: "var(--surface)", color: "var(--text)", border: "1px solid var(--border)", transition: "transform .18s, border-color .2s" }}>
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
    </ReviewShell>
  );
}
