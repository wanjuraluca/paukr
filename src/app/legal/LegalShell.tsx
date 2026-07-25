"use client";

import { useEffect, useState } from "react";

// Shared shell for the legal pages (Impressum/Datenschutz/AGB): same
// light/dark toggle pattern as the rest of the app, plain readable content
// layout instead of the marketing/app chrome.
export default function LegalShell({ children }: { children: React.ReactNode }) {
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
      <header style={{ position: "sticky", top: 0, zIndex: 40, background: "color-mix(in oklch, var(--bg) 82%, transparent)", backdropFilter: "blur(12px)", borderBottom: "1px solid var(--border)" }}>
        <div style={{ maxWidth: "760px", margin: "0 auto", padding: "16px 24px", display: "flex", alignItems: "center", gap: "14px" }}>
          <a href="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none", color: "var(--text)" }}>
            <span style={{ width: "28px", height: "28px", borderRadius: "8px", background: "var(--accent)", display: "grid", placeItems: "center" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M4 13.5L10 19L20 6" stroke="var(--on-accent)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <span style={{ fontFamily: "var(--font-space), sans-serif", fontWeight: 700, fontSize: "18px", letterSpacing: "-.02em" }}>paukr</span>
          </a>
          <a href="/" style={{ marginLeft: "auto", fontSize: "14px", color: "var(--muted)", textDecoration: "none" }}>← Zurück zur Startseite</a>
          <button
            onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
            aria-label="Modus wechseln"
            className="pk-theme-btn"
            style={{ width: "36px", height: "36px", borderRadius: "10px", border: "1px solid var(--border)", background: "var(--surface)", color: "var(--text)", cursor: "pointer", display: "grid", placeItems: "center", transition: "transform .18s, border-color .2s" }}
          >
            {isDark ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2" />
                <path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M6.5 17.5L5 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
              </svg>
            )}
          </button>
        </div>
      </header>
      <main style={{ maxWidth: "760px", margin: "0 auto", padding: "48px 24px 90px", fontSize: "15.5px", lineHeight: 1.7 }}>
        {children}
      </main>
    </div>
  );
}
