"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const heading: CSSProperties = { fontFamily: "var(--font-space), sans-serif" };

function friendlyError(message: string) {
  if (message.toLowerCase().includes("password")) return "Das Passwort muss mindestens 6 Zeichen haben.";
  return message;
}

export default function ResetPasswordClient() {
  const router = useRouter();
  const supabase = createClient();

  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const dark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;
    setTheme(dark ? "dark" : "light");
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Die Passwörter stimmen nicht überein.");
      return;
    }
    setBusy(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) setError(friendlyError(error.message));
      else setDone(true);
    } finally {
      setBusy(false);
    }
  }

  const inputStyle: CSSProperties = {
    width: "100%",
    borderRadius: "12px",
    border: "1px solid var(--border)",
    background: "var(--bg)",
    color: "var(--text)",
    padding: "12px 14px",
    fontSize: "15px",
    fontFamily: "var(--font-hanken), sans-serif",
    outline: "none",
  };

  return (
    <div
      className="eh"
      data-theme={theme}
      data-accent="indigo"
      style={{
        background: "var(--bg)",
        color: "var(--text)",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
        fontSize: "17px",
      }}
    >
      <div style={{ width: "100%", maxWidth: "400px" }}>
        <a href="/" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", textDecoration: "none", color: "var(--text)", marginBottom: "28px" }}>
          <span style={{ width: "32px", height: "32px", borderRadius: "9px", background: "var(--accent)", display: "grid", placeItems: "center", boxShadow: "0 4px 14px color-mix(in oklch, var(--accent) 40%, transparent)" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M4 13.5L10 19L20 6" stroke="var(--on-accent)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span style={{ ...heading, fontWeight: 700, fontSize: "22px", letterSpacing: "-.02em" }}>paukr</span>
        </a>

        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "24px", padding: "32px", boxShadow: "var(--shadow-lg)" }}>
          {done ? (
            <div style={{ textAlign: "center" }}>
              <h2 style={{ ...heading, fontWeight: 700, fontSize: "24px", margin: "0 0 10px" }}>Passwort geändert</h2>
              <p style={{ color: "var(--muted)", fontSize: "15px", margin: "0 0 24px", lineHeight: 1.5 }}>
                Dein neues Passwort ist gesetzt. Du kannst dich jetzt damit anmelden.
              </p>
              <button
                onClick={() => router.push("/app")}
                style={{ width: "100%", cursor: "pointer", fontFamily: "var(--font-hanken), sans-serif", fontWeight: 600, fontSize: "15px", padding: "13px", borderRadius: "13px", background: "var(--accent)", color: "var(--on-accent)", border: "none", boxShadow: "0 8px 22px color-mix(in oklch, var(--accent) 34%, transparent)" }}
              >
                Weiter zu paukr
              </button>
            </div>
          ) : (
            <>
              <div style={{ textAlign: "center", marginBottom: "22px" }}>
                <h2 style={{ ...heading, fontWeight: 700, fontSize: "24px", margin: "0 0 6px" }}>Neues Passwort</h2>
                <p style={{ color: "var(--muted)", fontSize: "14px", margin: 0 }}>Wähle ein neues Passwort für dein Konto.</p>
              </div>
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--muted)" }}>Neues Passwort</label>
                  <div style={{ position: "relative" }}>
                    <input type={showPassword ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" style={{ ...inputStyle, paddingRight: "60px" }} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", cursor: "pointer", background: "none", border: "none", color: "var(--muted)", fontSize: "13px", fontFamily: "var(--font-hanken), sans-serif" }}>
                      {showPassword ? "verbergen" : "zeigen"}
                    </button>
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--muted)" }}>Passwort bestätigen</label>
                  <input type={showPassword ? "text" : "password"} required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" style={inputStyle} />
                </div>

                {error && (
                  <div style={{ borderRadius: "12px", border: "1px solid color-mix(in oklch, var(--err) 45%, var(--border))", background: "color-mix(in oklch, var(--err) 10%, var(--bg))", color: "var(--err-strong)", padding: "10px 14px", fontSize: "14px" }}>
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={busy}
                  style={{ width: "100%", cursor: busy ? "default" : "pointer", fontFamily: "var(--font-hanken), sans-serif", fontWeight: 600, fontSize: "15px", padding: "13px", borderRadius: "13px", background: "var(--accent)", color: "var(--on-accent)", border: "none", boxShadow: "0 8px 22px color-mix(in oklch, var(--accent) 34%, transparent)", opacity: busy ? 0.7 : 1 }}
                >
                  {busy ? "Moment…" : "Passwort speichern"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
