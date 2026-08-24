import type { CSSProperties, ReactNode } from "react";

/** A single shimmering placeholder block. Decorative, so it stays out of the
 *  accessibility tree: the surrounding shell announces the loading state once
 *  instead of letting every block speak for itself. */
export function Skel({
  w = "100%",
  h = 14,
  r = 10,
  style,
}: {
  w?: string | number;
  h?: string | number;
  r?: string | number;
  style?: CSSProperties;
}) {
  return (
    <span
      className="pk-skel"
      aria-hidden="true"
      style={{ display: "block", width: w, height: h, borderRadius: r, ...style }}
    />
  );
}

/** Page frame shared by the loading screens. It deliberately carries no
 *  data-theme: these render on the server, where the theme is not known yet,
 *  so the stylesheet falls back to the OS setting. */
export function SkelPage({ children }: { children: ReactNode }) {
  return (
    <div
      className="eh"
      data-accent="indigo"
      role="status"
      aria-busy="true"
      style={{
        background: "var(--bg)",
        color: "var(--text)",
        minHeight: "100vh",
        overflowX: "hidden",
        fontSize: "17px",
        lineHeight: 1.6,
      }}
    >
      <span
        style={{
          position: "absolute",
          width: "1px",
          height: "1px",
          overflow: "hidden",
          clip: "rect(0 0 0 0)",
          whiteSpace: "nowrap",
        }}
      >
        Wird geladen
      </span>
      {children}
    </div>
  );
}

/** The sticky app header, rebuilt as placeholders so the real header does not
 *  shift the page when it takes over. */
export function SkelHeader() {
  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
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
        <Skel w={32} h={32} r={9} />
        <Skel w={78} h={18} />
        <div style={{ flex: 1 }} />
        <Skel w={40} h={40} r={11} />
        <Skel w={40} h={40} r="50%" />
      </div>
    </header>
  );
}
