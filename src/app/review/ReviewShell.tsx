"use client";

import { useEffect, useState } from "react";

// Thin client wrapper so the (server-rendered) review page can still toggle
// light/dark, same pattern as AppClient: detect system preference on mount,
// then let the button override it via data-theme on the .eh wrapper.
export default function ReviewShell({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const dark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;
    setTheme(dark ? "dark" : "light");
  }, []);

  const isDark = theme === "dark";

  return (
    <div
      className="eh"
      data-theme={theme}
      data-accent="indigo"
      style={{ background: "var(--bg)", color: "var(--text)", minHeight: "100vh", transition: "background .3s ease, color .3s ease" }}
    >
      <button
        onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
        aria-label="Modus wechseln"
        style={{
          position: "fixed",
          top: "20px",
          right: "20px",
          zIndex: 50,
          width: "40px",
          height: "40px",
          borderRadius: "11px",
          border: "1px solid var(--border)",
          background: "var(--surface)",
          color: "var(--text)",
          cursor: "pointer",
          display: "grid",
          placeItems: "center",
        }}
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
      {children}
    </div>
  );
}
