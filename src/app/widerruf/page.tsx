import type { CSSProperties } from "react";
import LegalShell from "../legal/LegalShell";
import { MODEL_FORM_LINES, WITHDRAWAL_SECTIONS } from "@/lib/legal-texts";
import { pageMetadata } from "@/lib/seo";
import RequestForm from "./RequestForm";

const heading: CSSProperties = { fontFamily: "var(--font-space), sans-serif" };
const h2: CSSProperties = { ...heading, fontWeight: 600, fontSize: "18px", margin: "36px 0 10px" };

export const metadata = pageMetadata({
  title: "Vertrag widerrufen | paukr",
  description: "Widerrufsbelehrung und Formular für deinen Vertrag mit paukr. Du kannst den Widerruf auch ohne Anmeldung erklären.",
  path: "/widerruf",
});

export default function WiderrufPage() {
  return (
    <LegalShell>
      <h1 style={{ ...heading, fontWeight: 700, fontSize: "clamp(28px,3.4vw,38px)", letterSpacing: "-.02em", margin: "0 0 12px" }}>
        Vertrag widerrufen
      </h1>
      <p style={{ margin: "0 0 24px" }}>Du hast paukr Pro innerhalb der letzten 14 Tage abgeschlossen und möchtest den Vertrag widerrufen? Dafür brauchst du kein Konto und keinen Grund.</p>
      <RequestForm kind="withdrawal" />

      <h2 style={{ ...h2, fontSize: "24px" }}>Widerrufsbelehrung</h2>
      {WITHDRAWAL_SECTIONS.map((s) => (
        <section key={s.title}>
          <h2 style={h2}>{s.title}</h2>
          {s.paragraphs.map((p) => <p key={p}>{p}</p>)}
        </section>
      ))}

      <h2 style={h2}>Muster-Widerrufsformular</h2>
      {MODEL_FORM_LINES.slice(1).map((line) => <p key={line} style={{ margin: "0 0 8px" }}>{line}</p>)}
    </LegalShell>
  );
}
