"use client";

import { createContext, useContext, useState, useSyncExternalStore, type CSSProperties, type ReactNode } from "react";

type Theme = "light" | "dark";

const QUERY = "(prefers-color-scheme: dark)";
const ThemeContext = createContext<{ theme: Theme; toggle: () => void }>({ theme: "light", toggle: () => {} });

function subscribe(onChange: () => void) {
  const media = window.matchMedia(QUERY);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

// The only part of the public pages that needs state, everything inside can
// stay a server component.
export function ThemeRoot({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  const system = useSyncExternalStore<Theme>(
    subscribe,
    () => (window.matchMedia(QUERY).matches ? "dark" : "light"),
    () => "light",
  );
  const [picked, setPicked] = useState<Theme | null>(null);
  const theme = picked ?? system;

  return (
    <ThemeContext.Provider value={{ theme, toggle: () => setPicked(theme === "dark" ? "light" : "dark") }}>
      <div className="eh" data-theme={theme} data-accent="indigo" style={style}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function ThemeToggle() {
  const { theme, toggle } = useContext(ThemeContext);
  return (
    <button
      onClick={toggle}
      aria-label="Modus wechseln"
      className="pk-theme-btn"
      style={{ width: "40px", height: "40px", borderRadius: "11px", border: "1px solid var(--border)", background: "var(--surface)", color: "var(--text)", cursor: "pointer", display: "grid", placeItems: "center", transition: "transform .18s, border-color .2s, background .3s" }}
    >
      {theme === "dark" ? (
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
  );
}
