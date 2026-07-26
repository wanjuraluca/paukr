"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const heading: CSSProperties = { fontFamily: "var(--font-space), sans-serif" };

const GENERIC_ERROR = "Etwas ist schiefgelaufen. Bitte versuch es gleich nochmal.";

function friendlyError(message: unknown): string {
  if (typeof message !== "string" || message.trim() === "") return GENERIC_ERROR;
  if (message === "Invalid login credentials") return "E-Mail oder Passwort ist falsch.";
  if (message === "User already registered") return "Mit dieser E-Mail existiert bereits ein Konto.";
  if (message.toLowerCase().includes("password")) return "Das Passwort muss mindestens 6 Zeichen haben.";
  if (message.toLowerCase().includes("sending confirmation email") || message.toLowerCase().includes("sending email")) {
    return "Die Bestätigungsmail konnte gerade nicht verschickt werden. Bitte versuch es in ein paar Minuten erneut.";
  }
  return message;
}

export default function AuthClient() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") ?? "/app";
  const supabase = createClient();

  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [isLogin, setIsLogin] = useState(true);
  const [forgotMode, setForgotMode] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [signupDone, setSignupDone] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  useEffect(() => {
    const dark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;
    setTheme(dark ? "dark" : "light");
    if (params.get("error")) setError("Anmeldung fehlgeschlagen. Bitte erneut versuchen.");
  }, [params]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) setError(friendlyError(error.message));
        else router.push(next);
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { display_name: displayName },
            emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
          },
        });
        if (error) setError(friendlyError(error.message));
        else setSignupDone(true);
      }
    } catch {
      setError(GENERIC_ERROR);
    } finally {
      setBusy(false);
    }
  }

  async function handleForgotSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent("/auth/reset-password")}`,
      });
      if (error) setError(friendlyError(error.message));
      else setResetSent(true);
    } catch {
      setError(GENERIC_ERROR);
    } finally {
      setBusy(false);
    }
  }

  async function handleGoogle() {
    setError("");
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });
    if (error) setError(friendlyError(error.message));
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
          <img src="/logo.svg" width={32} height={32} alt="" style={{ borderRadius: "9px", boxShadow: "0 4px 14px color-mix(in oklch, var(--accent) 40%, transparent)" }} />
          <span style={{ ...heading, fontWeight: 700, fontSize: "22px", letterSpacing: "-.02em" }}>paukr</span>
        </a>

        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "24px", padding: "32px", boxShadow: "var(--shadow-lg)" }}>
          {forgotMode ? (
            resetSent ? (
              <div style={{ textAlign: "center" }}>
                <h2 style={{ ...heading, fontWeight: 700, fontSize: "24px", margin: "0 0 10px" }}>Link verschickt</h2>
                <p style={{ color: "var(--muted)", fontSize: "15px", margin: "0 0 24px", lineHeight: 1.5 }}>
                  Wenn ein Konto mit <strong style={{ color: "var(--text)" }}>{email}</strong> existiert, haben wir dir einen Link zum Zurücksetzen deines Passworts geschickt.
                </p>
                <button
                  onClick={() => { setForgotMode(false); setResetSent(false); setError(""); }}
                  style={{ width: "100%", cursor: "pointer", fontFamily: "var(--font-hanken), sans-serif", fontWeight: 600, fontSize: "15px", padding: "13px", borderRadius: "13px", background: "var(--surface)", color: "var(--text)", border: "1px solid var(--border)" }}
                >
                  Zurück zur Anmeldung
                </button>
              </div>
            ) : (
              <>
                <div style={{ textAlign: "center", marginBottom: "22px" }}>
                  <h2 style={{ ...heading, fontWeight: 700, fontSize: "24px", margin: "0 0 6px" }}>Passwort zurücksetzen</h2>
                  <p style={{ color: "var(--muted)", fontSize: "14px", margin: 0 }}>Gib deine E-Mail ein, wir schicken dir einen Link.</p>
                </div>
                <form onSubmit={handleForgotSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--muted)" }}>E-Mail</label>
                    <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="du@beispiel.de" style={inputStyle} />
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
                    {busy ? "Moment…" : "Link schicken"}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setForgotMode(false); setError(""); }}
                    style={{ width: "100%", cursor: "pointer", fontFamily: "var(--font-hanken), sans-serif", fontWeight: 600, fontSize: "14px", padding: "10px", borderRadius: "13px", background: "transparent", color: "var(--muted)", border: "none" }}
                  >
                    Zurück zur Anmeldung
                  </button>
                </form>
              </>
            )
          ) : signupDone ? (
            <div style={{ textAlign: "center" }}>
              <h2 style={{ ...heading, fontWeight: 700, fontSize: "24px", margin: "0 0 10px" }}>Bestätige deine E-Mail</h2>
              <p style={{ color: "var(--muted)", fontSize: "15px", margin: "0 0 24px", lineHeight: 1.5 }}>
                Wir haben einen Bestätigungslink an <strong style={{ color: "var(--text)" }}>{email}</strong> geschickt. Klick ihn, um dein Konto zu aktivieren.
              </p>
              <button
                onClick={() => { setSignupDone(false); setIsLogin(true); setError(""); }}
                style={{ width: "100%", cursor: "pointer", fontFamily: "var(--font-hanken), sans-serif", fontWeight: 600, fontSize: "15px", padding: "13px", borderRadius: "13px", background: "var(--surface)", color: "var(--text)", border: "1px solid var(--border)" }}
              >
                Zurück zur Anmeldung
              </button>
            </div>
          ) : (
            <>
              <div style={{ display: "flex", borderRadius: "13px", border: "1px solid var(--border)", background: "var(--bg)", padding: "4px", marginBottom: "24px" }}>
                <button
                  onClick={() => { setIsLogin(true); setError(""); }}
                  style={{ flex: 1, cursor: "pointer", borderRadius: "10px", padding: "9px", fontSize: "14px", fontWeight: 600, fontFamily: "var(--font-hanken), sans-serif", border: "none", background: isLogin ? "var(--surface)" : "transparent", color: isLogin ? "var(--text)" : "var(--muted)", boxShadow: isLogin ? "var(--shadow)" : "none" }}
                >
                  Anmelden
                </button>
                <button
                  onClick={() => { setIsLogin(false); setError(""); }}
                  style={{ flex: 1, cursor: "pointer", borderRadius: "10px", padding: "9px", fontSize: "14px", fontWeight: 600, fontFamily: "var(--font-hanken), sans-serif", border: "none", background: !isLogin ? "var(--surface)" : "transparent", color: !isLogin ? "var(--text)" : "var(--muted)", boxShadow: !isLogin ? "var(--shadow)" : "none" }}
                >
                  Konto erstellen
                </button>
              </div>

              <div style={{ textAlign: "center", marginBottom: "22px" }}>
                <h2 style={{ ...heading, fontWeight: 700, fontSize: "24px", margin: "0 0 6px" }}>{isLogin ? "Willkommen zurück" : "Konto erstellen"}</h2>
                <p style={{ color: "var(--muted)", fontSize: "14px", margin: 0 }}>{isLogin ? "Melde dich an und lern weiter." : "Starte kostenlos mit deiner Prüfungsvorbereitung."}</p>
              </div>

              <button
                onClick={handleGoogle}
                style={{ width: "100%", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", fontFamily: "var(--font-hanken), sans-serif", fontWeight: 600, fontSize: "15px", padding: "12px", borderRadius: "13px", background: "var(--bg)", color: "var(--text)", border: "1px solid var(--border)", marginBottom: "18px" }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1Z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z" />
                  <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84Z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38Z" />
                </svg>
                Mit Google fortfahren
              </button>

              <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "0 0 18px", color: "var(--muted)", fontSize: "13px" }}>
                <span style={{ flex: 1, height: "1px", background: "var(--border)" }} />
                oder
                <span style={{ flex: 1, height: "1px", background: "var(--border)" }} />
              </div>

              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                {!isLogin && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--muted)" }}>Anzeigename</label>
                    <input value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Dein Name" style={inputStyle} />
                  </div>
                )}
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--muted)" }}>E-Mail</label>
                  <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="du@beispiel.de" style={inputStyle} />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
                    <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--muted)" }}>Passwort</label>
                    {isLogin && (
                      <button
                        type="button"
                        onClick={() => { setForgotMode(true); setError(""); }}
                        style={{ cursor: "pointer", background: "none", border: "none", padding: 0, color: "var(--accent-strong)", fontSize: "12px", fontWeight: 600, fontFamily: "var(--font-hanken), sans-serif" }}
                      >
                        Passwort vergessen?
                      </button>
                    )}
                  </div>
                  <div style={{ position: "relative" }}>
                    <input type={showPassword ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" style={{ ...inputStyle, paddingRight: "60px" }} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", cursor: "pointer", background: "none", border: "none", color: "var(--muted)", fontSize: "13px", fontFamily: "var(--font-hanken), sans-serif" }}>
                      {showPassword ? "verbergen" : "zeigen"}
                    </button>
                  </div>
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
                  {busy ? "Moment…" : isLogin ? "Anmelden" : "Konto erstellen"}
                </button>
              </form>
            </>
          )}
        </div>

        <p style={{ textAlign: "center", color: "var(--muted)", fontSize: "13px", marginTop: "20px" }}>
          <a href="/" style={{ color: "var(--muted)", textDecoration: "none" }}>← Zurück zur Startseite</a>
        </p>
      </div>
    </div>
  );
}
