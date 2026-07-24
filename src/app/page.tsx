"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { useRouter } from "next/navigation";

const PRODUCT_NAME = "paukr";

// Repeated star used in the testimonial ratings.
function Star() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2l2.9 6.3 6.9.7-5.1 4.6 1.4 6.7L12 17.8 5.9 20.3l1.4-6.7L2.2 9l6.9-.7L12 2Z" />
    </svg>
  );
}

function Stars() {
  return (
    <div style={{ display: "flex", gap: "3px", marginBottom: "14px", color: "var(--accent)" }}>
      <Star />
      <Star />
      <Star />
      <Star />
      <Star />
    </div>
  );
}

function CheckItem({ text, filled }: { text: string; filled: boolean }) {
  return (
    <li style={{ display: "flex", gap: "11px", alignItems: "flex-start" }}>
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        style={{ flexShrink: 0, marginTop: "1px" }}
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          fill={filled ? "var(--accent)" : "color-mix(in oklch, var(--accent) 16%, var(--bg))"}
        />
        <path
          d="M8 12.5l2.5 2.5L16 9"
          stroke={filled ? "var(--on-accent)" : "var(--accent-strong)"}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {text}
    </li>
  );
}

export default function Home() {
  const router = useRouter();
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const dark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;
    setTheme(dark ? "dark" : "light");
  }, []);

  const isDark = theme === "dark";
  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));
  const goToApp = () => router.push("/app");

  const heading: CSSProperties = {
    fontFamily: "var(--font-space), sans-serif",
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
        overflowX: "hidden",
        transition: "background .5s ease, color .5s ease",
        fontSize: "17px",
        lineHeight: 1.6,
      }}
    >
      {/* ===== NAV ===== */}
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          backdropFilter: "saturate(180%) blur(14px)",
          background: "color-mix(in oklch, var(--bg) 78%, transparent)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "14px 28px",
            display: "flex",
            alignItems: "center",
            gap: "32px",
          }}
        >
          <a
            href="#top"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              textDecoration: "none",
              color: "var(--text)",
              marginRight: "auto",
            }}
          >
            <span
              style={{
                width: "30px",
                height: "30px",
                borderRadius: "9px",
                background: "var(--accent)",
                display: "grid",
                placeItems: "center",
                boxShadow: "0 4px 14px color-mix(in oklch, var(--accent) 40%, transparent)",
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                <path
                  d="M4 13.5L10 19L20 6"
                  stroke="var(--on-accent)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span style={{ ...heading, fontWeight: 700, fontSize: "20px", letterSpacing: "-.02em" }}>
              {PRODUCT_NAME}
            </span>
          </a>
          <div style={{ display: "flex", alignItems: "center", gap: "28px", marginRight: "auto" }}>
            <a
              href="#features"
              className="pk-navlink"
              style={{ textDecoration: "none", color: "var(--muted)", fontWeight: 500, fontSize: "15px", padding: "8px 2px", transition: "color .2s" }}
            >
              Features
            </a>
            <a
              href="#how"
              className="pk-navlink"
              style={{ textDecoration: "none", color: "var(--muted)", fontWeight: 500, fontSize: "15px", padding: "8px 2px", transition: "color .2s" }}
            >
              So funktioniert&apos;s
            </a>
            <a
              href="#pricing"
              className="pk-navlink"
              style={{ textDecoration: "none", color: "var(--muted)", fontWeight: 500, fontSize: "15px", padding: "8px 2px", transition: "color .2s" }}
            >
              Preise
            </a>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <button
              onClick={toggleTheme}
              aria-label="Modus wechseln"
              className="pk-theme-btn"
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "11px",
                border: "1px solid var(--border)",
                background: "var(--surface)",
                color: "var(--text)",
                cursor: "pointer",
                display: "grid",
                placeItems: "center",
                transition: "transform .18s, border-color .2s, background .3s",
              }}
            >
              {isDark ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2" />
                  <path
                    d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M6.5 17.5L5 19"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </button>
            <button
              onClick={goToApp}
              className="pk-btn-accent"
              style={{
                border: "none",
                cursor: "pointer",
                fontFamily: "var(--font-hanken), sans-serif",
                fontWeight: 600,
                fontSize: "15px",
                padding: "11px 20px",
                borderRadius: "12px",
                background: "var(--accent)",
                color: "var(--on-accent)",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                boxShadow: "0 6px 20px color-mix(in oklch, var(--accent) 32%, transparent)",
                transition: "transform .18s cubic-bezier(.2,.9,.3,1.3), box-shadow .25s",
              }}
            >
              Kostenlos starten
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                <path d="M5 12h13M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      <div id="top" />

      {/* ===== HERO ===== */}
      <header
        style={{
          position: "relative",
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "96px 28px 80px",
          display: "grid",
          gridTemplateColumns: "1.05fr .95fr",
          gap: "56px",
          alignItems: "center",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-40px",
            left: "40%",
            width: "520px",
            height: "520px",
            borderRadius: "50%",
            background: "radial-gradient(circle, color-mix(in oklch, var(--accent) 22%, transparent), transparent 70%)",
            filter: "blur(40px)",
            animation: "pk-pulseglow 7s ease-in-out infinite",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div
            style={{
              animation: "pk-revUp .7s cubic-bezier(.16,1,.3,1) 0s both",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "6px 14px 6px 8px",
              borderRadius: "100px",
              border: "1px solid var(--border)",
              background: "var(--surface)",
              fontSize: "13px",
              fontWeight: 600,
              color: "var(--muted)",
              marginBottom: "26px",
            }}
          >
            <span
              style={{
                padding: "2px 9px",
                borderRadius: "100px",
                background: "color-mix(in oklch, var(--accent) 14%, var(--bg))",
                color: "var(--accent-strong)",
                fontSize: "12px",
              }}
            >
              Neu
            </span>
            Gamifizierte Prüfungsvorbereitung
          </div>
          <h1
            style={{
              ...heading,
              animation: "pk-revUp .7s cubic-bezier(.16,1,.3,1) .06s both",
              fontWeight: 700,
              fontSize: "clamp(40px,5.4vw,66px)",
              lineHeight: 1.03,
              letterSpacing: "-.03em",
              margin: "0 0 22px",
              textWrap: "balance",
            }}
          >
            Lernen, das sich endlich
            <br />
            nicht wie <span style={{ color: "var(--accent)" }}>Lernen</span> anfühlt.
          </h1>
          <p
            style={{
              animation: "pk-revUp .7s cubic-bezier(.16,1,.3,1) .12s both",
              fontSize: "19px",
              color: "var(--muted)",
              maxWidth: "500px",
              margin: "0 0 34px",
              lineHeight: 1.6,
              textWrap: "pretty",
            }}
          >
            Wähle deine Prüfung, übe mit echten Fragen und einer realistischen Simulation - und
            sammle XP, während du besser wirst. Strukturiert, motivierend, ohne Ballast.
          </p>
          <div
            style={{
              animation: "pk-revUp .7s cubic-bezier(.16,1,.3,1) .18s both",
              display: "flex",
              flexWrap: "wrap",
              gap: "14px",
              alignItems: "center",
            }}
          >
            <button
              onClick={goToApp}
              className="pk-btn-accent-lg"
              style={{
                border: "none",
                cursor: "pointer",
                fontFamily: "var(--font-hanken), sans-serif",
                fontWeight: 600,
                fontSize: "16px",
                padding: "15px 26px",
                borderRadius: "15px",
                background: "var(--accent)",
                color: "var(--on-accent)",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                boxShadow: "0 8px 26px color-mix(in oklch, var(--accent) 34%, transparent)",
                transition: "transform .2s cubic-bezier(.2,.9,.3,1.3), box-shadow .25s",
              }}
            >
              Kostenlos starten
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
                <path d="M5 12h13M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              onClick={goToApp}
              className="pk-btn-ghost"
              style={{
                cursor: "pointer",
                fontFamily: "var(--font-hanken), sans-serif",
                fontWeight: 600,
                fontSize: "16px",
                padding: "15px 24px",
                borderRadius: "15px",
                background: "var(--surface)",
                color: "var(--text)",
                border: "1px solid var(--border)",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                transition: "transform .2s, border-color .2s, background .3s",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="9.5" stroke="currentColor" strokeWidth="2" />
                <path d="M10 8.5l6 3.5-6 3.5V8.5Z" fill="currentColor" />
              </svg>
              Demo ansehen
            </button>
          </div>
          <div
            style={{
              animation: "pk-revUp .7s cubic-bezier(.16,1,.3,1) .24s both",
              marginTop: "30px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              color: "var(--muted)",
              fontSize: "14px",
            }}
          >
            <div style={{ display: "flex" }}>
              <span style={{ width: "26px", height: "26px", borderRadius: "50%", background: "color-mix(in oklch,var(--accent) 30%,var(--bg))", border: "2px solid var(--bg)" }} />
              <span style={{ width: "26px", height: "26px", borderRadius: "50%", background: "color-mix(in oklch,var(--accent) 50%,var(--bg))", border: "2px solid var(--bg)", marginLeft: "-9px" }} />
              <span style={{ width: "26px", height: "26px", borderRadius: "50%", background: "var(--accent)", border: "2px solid var(--bg)", marginLeft: "-9px" }} />
            </div>
            <span>
              <strong style={{ color: "var(--text)" }}>8.500+</strong> Prüflinge lernen schon mit {PRODUCT_NAME}
            </span>
          </div>
        </div>

        {/* product mockup */}
        <div style={{ animation: "pk-revUp .7s cubic-bezier(.16,1,.3,1) .2s both", position: "relative", zIndex: 1 }}>
          <div style={{ animation: "pk-floaty 7s ease-in-out infinite" }}>
            <div
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "24px",
                boxShadow: "var(--shadow-lg)",
                padding: "22px",
                maxWidth: "440px",
                marginLeft: "auto",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ width: "9px", height: "9px", borderRadius: "50%", background: "var(--border)" }} />
                  <span style={{ fontSize: "13px", color: "var(--muted)", fontWeight: 600 }}>Frage 12 / 40</span>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "5px 11px",
                    borderRadius: "100px",
                    background: "color-mix(in oklch, var(--accent) 14%, var(--bg))",
                    color: "var(--accent-strong)",
                    fontSize: "13px",
                    fontWeight: 700,
                  }}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                    <path d="M13 2L4 14h7l-1 8 9-12h-7l1-8Z" fill="currentColor" />
                  </svg>
                  +240 XP
                </div>
              </div>
              <div style={{ height: "6px", borderRadius: "100px", background: "var(--bg-alt)", marginBottom: "22px", overflow: "hidden" }}>
                <div style={{ width: "62%", height: "100%", borderRadius: "100px", background: "var(--accent)" }} />
              </div>
              <p style={{ ...heading, fontWeight: 600, fontSize: "18px", margin: "0 0 16px", lineHeight: 1.35 }}>
                Welche Kündigungsfrist gilt in der Probezeit?
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <div style={{ padding: "13px 15px", borderRadius: "13px", border: "1px solid var(--border)", fontSize: "14px", fontWeight: 500, color: "var(--muted)" }}>
                  4 Wochen zum Monatsende
                </div>
                <div
                  style={{
                    padding: "13px 15px",
                    borderRadius: "13px",
                    border: "1.5px solid var(--accent)",
                    background: "color-mix(in oklch, var(--accent) 10%, var(--bg))",
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "var(--text)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  2 Wochen
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" fill="var(--accent)" />
                    <path d="M8 12.5l2.5 2.5L16 9" stroke="var(--on-accent)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div style={{ padding: "13px 15px", borderRadius: "13px", border: "1px solid var(--border)", fontSize: "14px", fontWeight: 500, color: "var(--muted)" }}>
                  3 Monate zum Quartalsende
                </div>
              </div>
            </div>
            <div
              style={{
                position: "absolute",
                bottom: "-26px",
                left: "-10px",
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "16px",
                boxShadow: "var(--shadow)",
                padding: "13px 16px",
                display: "flex",
                alignItems: "center",
                gap: "11px",
                animation: "pk-floaty2 5.5s ease-in-out infinite",
              }}
            >
              <span style={{ width: "38px", height: "38px", borderRadius: "11px", background: "color-mix(in oklch, var(--accent) 14%, var(--bg))", display: "grid", placeItems: "center" }}>
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2c1 3 3 4.5 3 7a3 3 0 0 1-6 0c0-1 .4-1.8 1-2.5C9 9 8 11 8 13a4 4 0 0 0 8 0c0-3.5-2-6.5-4-11Z" fill="var(--accent)" />
                </svg>
              </span>
              <div>
                <div style={{ ...heading, fontWeight: 700, fontSize: "17px" }}>7 Tage</div>
                <div style={{ fontSize: "12px", color: "var(--muted)", fontWeight: 500 }}>Serie · weiter so!</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ===== LOGO STRIP ===== */}
      <section style={{ animation: "pk-revUp .7s cubic-bezier(.16,1,.3,1) 0s both", maxWidth: "1000px", margin: "0 auto", padding: "20px 28px 60px" }}>
        <p style={{ textAlign: "center", fontSize: "13px", letterSpacing: ".08em", textTransform: "uppercase", color: "var(--muted)", fontWeight: 600, margin: "0 0 22px" }}>
          Eingesetzt in Ausbildung &amp; Weiterbildung
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "center", gap: "44px", opacity: 0.55 }}>
          {["Berufskolleg", "IHK Akademie", "LernWerk", "Campus 42"].map((name) => (
            <span key={name} style={{ ...heading, fontWeight: 700, fontSize: "20px", letterSpacing: "-.02em" }}>
              {name}
            </span>
          ))}
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section id="features" style={{ maxWidth: "1200px", margin: "0 auto", padding: "80px 28px" }}>
        <div style={{ animation: "pk-revUp .7s cubic-bezier(.16,1,.3,1) 0s both", maxWidth: "640px", margin: "0 auto 56px", textAlign: "center" }}>
          <span style={{ fontSize: "14px", fontWeight: 600, color: "var(--accent-strong)" }}>Features</span>
          <h2 style={{ ...heading, fontWeight: 700, fontSize: "clamp(30px,3.6vw,44px)", letterSpacing: "-.025em", margin: "12px 0 14px", lineHeight: 1.1 }}>
            Alles, was du zum Bestehen brauchst
          </h2>
          <p style={{ fontSize: "18px", color: "var(--muted)", margin: 0, textWrap: "pretty" }}>
            Kein Feature-Wust. Nur die Werkzeuge, die dich wirklich weiterbringen.
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))", gap: "20px" }}>
          {[
            {
              delay: "0s",
              icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <rect x="4" y="4" width="16" height="16" rx="4" stroke="var(--accent)" strokeWidth="2" />
                  <path d="M8 9.5h8M8 13h8M8 16.5h4.5" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" />
                </svg>
              ),
              title: "Prüfungsgerechte Fragen",
              body: "Tausende Fragen im Original-Stil deiner Prüfung, sortiert nach Themen und Schwierigkeit.",
            },
            {
              delay: ".08s",
              icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="8.5" stroke="var(--accent)" strokeWidth="2" />
                  <circle cx="12" cy="12" r="4" stroke="var(--accent)" strokeWidth="2" />
                  <circle cx="12" cy="12" r="1" fill="var(--accent)" />
                </svg>
              ),
              title: "Adaptives Üben",
              body: "Die Plattform erkennt deine Schwächen und wiederholt genau das, was noch sitzen muss.",
            },
            {
              delay: ".16s",
              icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="8.5" stroke="var(--accent)" strokeWidth="2" />
                  <path d="M12 7.5V12l3 2" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ),
              title: "Realistische Simulation",
              body: "Übe unter echten Prüfungsbedingungen: Zeitlimit, Fragenmix und ehrliche Auswertung.",
            },
            {
              delay: ".24s",
              icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path d="M5 19V11M12 19V5M19 19v-6" stroke="var(--accent)" strokeWidth="2.4" strokeLinecap="round" />
                </svg>
              ),
              title: "XP & Fortschritt",
              body: "Sammle Punkte, halte deine Serie und sieh schwarz auf weiß, wie du besser wirst.",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="pk-feature-card"
              onAnimationEnd={(e) => {
                e.currentTarget.style.animation = "none";
              }}
              style={{
                animation: `pk-revUp .7s cubic-bezier(.16,1,.3,1) ${f.delay} both`,
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "20px",
                padding: "28px",
                transition: "transform .25s, box-shadow .3s, border-color .3s",
              }}
            >
              <span style={{ width: "46px", height: "46px", borderRadius: "13px", background: "color-mix(in oklch, var(--accent) 13%, var(--bg))", display: "grid", placeItems: "center", marginBottom: "18px" }}>
                {f.icon}
              </span>
              <h3 style={{ ...heading, fontWeight: 600, fontSize: "20px", margin: "0 0 9px", letterSpacing: "-.01em" }}>{f.title}</h3>
              <p style={{ fontSize: "15.5px", color: "var(--muted)", margin: 0, lineHeight: 1.55 }}>{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section id="how" style={{ background: "var(--bg-alt)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", transition: "background .5s" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "88px 28px" }}>
          <div style={{ animation: "pk-revUp .7s cubic-bezier(.16,1,.3,1) 0s both", maxWidth: "640px", margin: "0 auto 60px", textAlign: "center" }}>
            <span style={{ fontSize: "14px", fontWeight: 600, color: "var(--accent-strong)" }}>So funktioniert&apos;s</span>
            <h2 style={{ ...heading, fontWeight: 700, fontSize: "clamp(30px,3.6vw,44px)", letterSpacing: "-.025em", margin: "12px 0 0", lineHeight: 1.1 }}>
              In drei Schritten zur bestandenen Prüfung
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: "28px" }}>
            {[
              { delay: "0s", num: "01", title: "Prüfung wählen", body: "Such dir deine Prüfung aus dem Katalog. Der Rest wird passgenau für dich vorbereitet." },
              { delay: ".12s", num: "02", title: "Üben & simulieren", body: "Arbeite dich durch Fragen und volle Simulationen, in deinem Tempo, mit sofortigem Feedback." },
              { delay: ".24s", num: "03", title: "Bestehen", body: "Geh mit einem sicheren Gefühl in die echte Prüfung. Du weißt genau, was dich erwartet." },
            ].map((s) => (
              <div key={s.num} style={{ animation: `pk-revUp .7s cubic-bezier(.16,1,.3,1) ${s.delay} both` }}>
                <div style={{ ...heading, fontWeight: 700, fontSize: "15px", color: "var(--accent)", marginBottom: "16px", display: "flex", alignItems: "center", gap: "12px" }}>
                  {s.num}
                  <span style={{ flex: 1, height: "1px", background: "var(--border)" }} />
                </div>
                <h3 style={{ ...heading, fontWeight: 600, fontSize: "22px", margin: "0 0 10px", letterSpacing: "-.01em" }}>{s.title}</h3>
                <p style={{ fontSize: "16px", color: "var(--muted)", margin: 0, lineHeight: 1.6 }}>{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SOCIAL PROOF ===== */}
      <section style={{ maxWidth: "1200px", margin: "0 auto", padding: "88px 28px" }}>
        <div style={{ animation: "pk-revUp .7s cubic-bezier(.16,1,.3,1) 0s both", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: "20px", marginBottom: "56px", textAlign: "center" }}>
          {[
            { value: "12.000+", label: "Fragen im Pool", border: false },
            { value: "8.500+", label: "Aktive Prüflinge", border: true },
            { value: "94%", label: "Bestehensquote", border: true },
            { value: "4.8/5", label: "Ø Bewertung", border: true },
          ].map((stat) => (
            <div key={stat.label} style={{ padding: "24px 12px", borderLeft: stat.border ? "1px solid var(--border)" : undefined }}>
              <div style={{ ...heading, fontWeight: 700, fontSize: "clamp(30px,3.4vw,42px)", letterSpacing: "-.02em", color: "var(--accent)" }}>{stat.value}</div>
              <div style={{ color: "var(--muted)", fontSize: "15px", marginTop: "4px" }}>{stat.label}</div>
            </div>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: "20px" }}>
          {[
            {
              delay: "0s",
              quote: "„Ich hab die Prüfungssimulation gehasst geliebt: genau die Fragen kamen dran. Bestanden beim ersten Versuch.“",
              name: "Lena M.",
              role: "Kauffrau für Büromanagement",
              avatar: "color-mix(in oklch, var(--accent) 25%, var(--bg))",
            },
            {
              delay: ".1s",
              quote: "„Das XP-System klingt albern, aber es hat mich tatsächlich jeden Tag ans Üben gebracht. Serie nicht reißen lassen!“",
              name: "Jonas K.",
              role: "Fachinformatiker in Ausbildung",
              avatar: "color-mix(in oklch, var(--accent) 45%, var(--bg))",
            },
            {
              delay: ".2s",
              quote: "„Endlich eine Plattform, die nicht aussieht wie aus 2009. Übersichtlich, schnell, und macht sogar Spaß.“",
              name: "Aylin T.",
              role: "Industriekauffrau",
              avatar: "var(--accent)",
            },
          ].map((t) => (
            <div key={t.name} style={{ animation: `pk-revUp .7s cubic-bezier(.16,1,.3,1) ${t.delay} both`, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "20px", padding: "28px" }}>
              <Stars />
              <p style={{ fontSize: "16px", lineHeight: 1.6, margin: "0 0 20px", color: "var(--text)" }}>{t.quote}</p>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span style={{ width: "40px", height: "40px", borderRadius: "50%", background: t.avatar }} />
                <div>
                  <div style={{ fontWeight: 600, fontSize: "15px" }}>{t.name}</div>
                  <div style={{ color: "var(--muted)", fontSize: "13px" }}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== PRICING ===== */}
      <section id="pricing" style={{ background: "var(--bg-alt)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", transition: "background .5s" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "88px 28px" }}>
          <div style={{ animation: "pk-revUp .7s cubic-bezier(.16,1,.3,1) 0s both", maxWidth: "620px", margin: "0 auto 56px", textAlign: "center" }}>
            <span style={{ fontSize: "14px", fontWeight: 600, color: "var(--accent-strong)" }}>Preise</span>
            <h2 style={{ ...heading, fontWeight: 700, fontSize: "clamp(30px,3.6vw,44px)", letterSpacing: "-.025em", margin: "12px 0 14px", lineHeight: 1.1 }}>
              Starte kostenlos. Upgrade, wenn&apos;s ernst wird.
            </h2>
            <p style={{ fontSize: "18px", color: "var(--muted)", margin: 0 }}>Keine Kreditkarte nötig. Jederzeit kündbar.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: "22px", alignItems: "stretch" }}>
            {/* Free */}
            <div style={{ animation: "pk-revUp .7s cubic-bezier(.16,1,.3,1) 0s both", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "22px", padding: "34px" }}>
              <h3 style={{ ...heading, fontWeight: 600, fontSize: "20px", margin: "0 0 6px" }}>Free</h3>
              <p style={{ color: "var(--muted)", fontSize: "15px", margin: "0 0 22px" }}>Zum Reinschnuppern &amp; für Basics.</p>
              <div style={{ display: "flex", alignItems: "baseline", gap: "6px", marginBottom: "26px" }}>
                <span style={{ ...heading, fontWeight: 700, fontSize: "44px", letterSpacing: "-.02em" }}>0 €</span>
                <span style={{ color: "var(--muted)", fontSize: "15px" }}>/ Monat</span>
              </div>
              <button
                onClick={goToApp}
                className="pk-price-btn-ghost"
                style={{ width: "100%", cursor: "pointer", fontFamily: "var(--font-hanken), sans-serif", fontWeight: 600, fontSize: "15.5px", padding: "13px", borderRadius: "13px", background: "var(--surface)", color: "var(--text)", border: "1px solid var(--border)", transition: "transform .18s, border-color .2s" }}
              >
                Kostenlos starten
              </button>
              <div style={{ height: "1px", background: "var(--border)", margin: "26px 0" }} />
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "14px", fontSize: "15px" }}>
                <CheckItem text="Basis-Fragenpool" filled={false} />
                <CheckItem text="3 Simulationen pro Monat" filled={false} />
                <CheckItem text="XP & Fortschritts-Tracking" filled={false} />
              </ul>
            </div>
            {/* Pro */}
            <div style={{ animation: "pk-revUp .7s cubic-bezier(.16,1,.3,1) .1s both", position: "relative", background: "var(--surface)", border: "1.5px solid var(--accent)", borderRadius: "22px", padding: "34px", boxShadow: "0 20px 50px color-mix(in oklch, var(--accent) 18%, transparent)" }}>
              <span style={{ position: "absolute", top: "-13px", left: "34px", padding: "5px 13px", borderRadius: "100px", background: "var(--accent)", color: "var(--on-accent)", fontSize: "12px", fontWeight: 700, letterSpacing: ".02em" }}>Beliebt</span>
              <h3 style={{ ...heading, fontWeight: 600, fontSize: "20px", margin: "0 0 6px" }}>Pro</h3>
              <p style={{ color: "var(--muted)", fontSize: "15px", margin: "0 0 22px" }}>Für alle, die wirklich bestehen wollen.</p>
              <div style={{ display: "flex", alignItems: "baseline", gap: "6px", marginBottom: "26px" }}>
                <span style={{ ...heading, fontWeight: 700, fontSize: "44px", letterSpacing: "-.02em" }}>9 €</span>
                <span style={{ color: "var(--muted)", fontSize: "15px" }}>/ Monat</span>
              </div>
              <button
                onClick={goToApp}
                className="pk-price-btn-accent"
                style={{ width: "100%", cursor: "pointer", fontFamily: "var(--font-hanken), sans-serif", fontWeight: 600, fontSize: "15.5px", padding: "13px", borderRadius: "13px", background: "var(--accent)", color: "var(--on-accent)", border: "none", boxShadow: "0 8px 22px color-mix(in oklch, var(--accent) 34%, transparent)", transition: "transform .18s cubic-bezier(.2,.9,.3,1.3), box-shadow .25s" }}
              >
                Pro holen
              </button>
              <div style={{ height: "1px", background: "var(--border)", margin: "26px 0" }} />
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "14px", fontSize: "15px" }}>
                <CheckItem text="Kompletter Fragenpool" filled />
                <CheckItem text="Unbegrenzte Simulationen" filled />
                <CheckItem text="Adaptives Üben & Schwächen-Analyse" filled />
                <CheckItem text="Detaillierte Auswertung" filled />
                <CheckItem text="Werbefrei" filled />
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section style={{ maxWidth: "1200px", margin: "0 auto", padding: "100px 28px" }}>
        <div style={{ animation: "pk-revUp .7s cubic-bezier(.16,1,.3,1) 0s both", position: "relative", overflow: "hidden", borderRadius: "32px", border: "1px solid var(--border)", background: "var(--surface)", padding: "clamp(48px,7vw,88px) 28px", textAlign: "center" }}>
          <div style={{ position: "absolute", top: "-120px", left: "50%", transform: "translateX(-50%)", width: "640px", height: "400px", background: "radial-gradient(circle, color-mix(in oklch, var(--accent) 22%, transparent), transparent 68%)", filter: "blur(30px)", animation: "pk-pulseglow 8s ease-in-out infinite", pointerEvents: "none" }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <h2 style={{ ...heading, fontWeight: 700, fontSize: "clamp(32px,4.4vw,54px)", letterSpacing: "-.03em", margin: "0 auto 18px", lineHeight: 1.05, maxWidth: "640px", textWrap: "balance" }}>
              Bereit, deine Prüfung entspannt anzugehen?
            </h2>
            <p style={{ fontSize: "19px", color: "var(--muted)", margin: "0 auto 34px", maxWidth: "520px", textWrap: "pretty" }}>
              Leg in unter einer Minute los, kostenlos, ohne Kreditkarte.
            </p>
            <button
              onClick={goToApp}
              className="pk-cta-btn"
              style={{ border: "none", cursor: "pointer", fontFamily: "var(--font-hanken), sans-serif", fontWeight: 600, fontSize: "17px", padding: "16px 30px", borderRadius: "16px", background: "var(--accent)", color: "var(--on-accent)", display: "inline-flex", alignItems: "center", gap: "10px", boxShadow: "0 10px 30px color-mix(in oklch, var(--accent) 38%, transparent)", transition: "transform .2s cubic-bezier(.2,.9,.3,1.3), box-shadow .25s" }}
            >
              Jetzt kostenlos starten
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M5 12h13M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer style={{ borderTop: "1px solid var(--border)", background: "var(--bg-alt)", transition: "background .5s" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "48px 28px", display: "flex", flexWrap: "wrap", gap: "28px", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ width: "28px", height: "28px", borderRadius: "8px", background: "var(--accent)", display: "grid", placeItems: "center" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M4 13.5L10 19L20 6" stroke="var(--on-accent)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <span style={{ ...heading, fontWeight: 700, fontSize: "18px", letterSpacing: "-.02em" }}>{PRODUCT_NAME}</span>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "26px", fontSize: "15px" }}>
            {[
              { label: "Features", href: "#features" },
              { label: "Preise", href: "#pricing" },
              { label: "Datenschutz", href: "#" },
              { label: "Impressum", href: "#" },
            ].map((l) => (
              <a key={l.label} href={l.href} className="pk-footer-link" style={{ textDecoration: "none", color: "var(--muted)", fontWeight: 500, transition: "color .2s" }}>
                {l.label}
              </a>
            ))}
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <a href="#" aria-label="Social" className="pk-social-btn" style={{ width: "36px", height: "36px", borderRadius: "10px", border: "1px solid var(--border)", display: "grid", placeItems: "center", color: "var(--muted)", transition: "color .2s, border-color .2s" }}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
                <path d="M12 3c-2.5 3-2.5 15 0 18M12 3c2.5 3 2.5 15 0 18M3.5 9h17M3.5 15h17" stroke="currentColor" strokeWidth="1.4" />
              </svg>
            </a>
            <a href="#" aria-label="Social" className="pk-social-btn" style={{ width: "36px", height: "36px", borderRadius: "10px", border: "1px solid var(--border)", display: "grid", placeItems: "center", color: "var(--muted)", transition: "color .2s, border-color .2s" }}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
                <rect x="4" y="4" width="16" height="16" rx="4" stroke="currentColor" strokeWidth="1.8" />
                <circle cx="12" cy="12" r="3.5" stroke="currentColor" strokeWidth="1.8" />
                <circle cx="16.5" cy="7.5" r="1" fill="currentColor" />
              </svg>
            </a>
          </div>
        </div>
        <div style={{ borderTop: "1px solid var(--border)", padding: "20px 28px", textAlign: "center", color: "var(--muted)", fontSize: "13px" }}>
          © 2026 {PRODUCT_NAME} · Arbeitstitel, alle Inhalte sind Platzhalter.
        </div>
      </footer>
    </div>
  );
}
