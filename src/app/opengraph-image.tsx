import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const alt = "paukr: Übungsfragen für deine Abschlussprüfung";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const logo = await readFile(join(process.cwd(), "public", "logo.svg"), "base64");
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "72px 80px",
        background: "#fbf6ee",
        color: "#1b1e1a",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
        {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
        <img src={`data:image/svg+xml;base64,${logo}`} width={84} height={84} />
        <div style={{ fontSize: 60, fontWeight: 700, letterSpacing: -2 }}>paukr</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ fontSize: 76, fontWeight: 700, lineHeight: 1.08, letterSpacing: -2 }}>Übungsfragen für deine</div>
        <div style={{ fontSize: 76, fontWeight: 700, lineHeight: 1.08, letterSpacing: -2, color: "#2f4bff" }}>Abschlussprüfung</div>
      </div>
      <div style={{ display: "flex", fontSize: 32, color: "#555b52", padding: "22px 30px", borderRadius: 20, background: "#e4ece2" }}>
        Üben, wiederholen, Prüfung simulieren. Kostenlos starten auf paukr.app
      </div>
    </div>,
    size,
  );
}
