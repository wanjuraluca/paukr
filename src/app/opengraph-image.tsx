import { ImageResponse } from "next/og";

export const alt = "paukr: Übungsfragen zur Prüfungsvorbereitung";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "90px",
        background: "#0c0d13",
        color: "#ffffff",
      }}
    >
      <div style={{ fontSize: 110, fontWeight: 700, color: "#6193ff" }}>paukr</div>
      <div style={{ fontSize: 50, marginTop: 24 }}>Lernen, üben, Prüfung simulieren.</div>
      <div style={{ fontSize: 32, marginTop: 24, color: "#9a9fb0" }}>Übungsfragen für deine Ausbildung. Kostenlos starten.</div>
    </div>,
    size,
  );
}
