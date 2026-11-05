import type { SampleQuestion } from "@/lib/public-exams";

export default function SampleQuestions({ questions }: { questions: (SampleQuestion & { topic: string })[] }) {
  return (
    <div style={{ display: "grid", gap: "12px" }}>
      {questions.map((q) => {
        const correct = q.answer_options.find((o) => o.is_correct);
        return (
          <article key={q.id} style={{ padding: "18px 20px", borderRadius: "14px", background: "var(--surface)", border: "1px solid var(--border)" }}>
            <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--accent-strong)", marginBottom: "4px" }}>{q.topic}</div>
            <h3 style={{ fontFamily: "var(--font-space), sans-serif", fontWeight: 600, fontSize: "17px", lineHeight: 1.35, margin: "0 0 10px" }}>{q.question_text}</h3>
            <ul style={{ paddingLeft: "20px", margin: "0 0 10px" }}>
              {q.answer_options.map((o) => (
                <li key={o.id}>{o.option_text}</li>
              ))}
            </ul>
            <details>
              <summary style={{ cursor: "pointer", padding: "6px 0", fontWeight: 600, color: "var(--accent-strong)" }}>Lösung anzeigen</summary>
              <p style={{ margin: "6px 0 0" }}>
                <strong>{correct?.option_text}</strong>
              </p>
              {q.explanation && <p style={{ margin: "6px 0 0", color: "var(--muted)" }}>{q.explanation}</p>}
            </details>
          </article>
        );
      })}
    </div>
  );
}
