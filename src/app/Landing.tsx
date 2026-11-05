import type { CSSProperties } from "react";
import Link from "next/link";
import AppLink from "@/components/site/AppLink";
import JsonLd from "@/components/site/JsonLd";
import SiteFooter from "@/components/site/SiteFooter";
import SiteHeader from "@/components/site/SiteHeader";
import { ThemeRoot } from "@/components/site/Theme";
import { organization, softwareApplication, website } from "@/lib/structured-data";

// Rounded down to the nearest 10 with a "+", so it reads honestly even as
// the exact count shifts (e.g. 43 -> "40+", not a number that looks fake-precise).
// An exact multiple of 10 is shown as is, since "300+" would overstate 300.
function questionCountLabel(total: number): string {
  const rounded = (Math.floor(total / 10) * 10).toLocaleString("de-DE");
  return total % 10 === 0 ? rounded : `${rounded}+`;
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

export default function Landing({
  questionCount,
  examCount,
  exams,
}: {
  questionCount: number;
  examCount: number;
  exams: { slug: string; name: string; count: number }[];
}) {
  const QUESTION_COUNT_LABEL = questionCountLabel(questionCount);

  const heading: CSSProperties = {
    fontFamily: "var(--font-space), sans-serif",
  };

  return (
    <ThemeRoot
      style={{
        background: "var(--bg)",
        color: "var(--text)",
        minHeight: "100dvh",
        overflowX: "hidden",
        transition: "background .5s ease, color .5s ease",
        fontSize: "17px",
        lineHeight: 1.6,
      }}
    >
      <JsonLd data={[organization(), website(), softwareApplication()]} />
      <SiteHeader />
      <main>
      {/* ===== HERO ===== */}
      <section
        className="pk-hero-grid"
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
              fontWeight: 700,
              fontSize: "clamp(36px,4.8vw,58px)",
              lineHeight: 1.03,
              letterSpacing: "-.03em",
              margin: "0 0 22px",
              textWrap: "balance",
            }}
          >
            Übungsfragen für deine Abschlussprüfung, die sich nicht wie <span style={{ color: "var(--accent)" }}>Lernen</span> anfühlen.
          </h1>
          <p
            style={{
              fontSize: "19px",
              color: "var(--muted)",
              maxWidth: "500px",
              margin: "0 0 34px",
              lineHeight: 1.6,
              textWrap: "pretty",
            }}
          >
            Für Fachinformatiker Anwendungsentwicklung und {examCount - 1} weitere Ausbildungsberufe: Wähle deine Prüfung, übe mit eigenen Fragen und einer Simulation mit Zeitlimit und sammle dabei XP.
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
            <AppLink
              className="pk-btn-accent-lg"
              style={{
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
            </AppLink>
            <Link
              href="/pruefungen"
              className="pk-btn-ghost"
              style={{
                textDecoration: "none",
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
              Beispielfragen ansehen
            </Link>
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
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M8 3h8l4 4v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" stroke="var(--accent)" strokeWidth="2" strokeLinejoin="round" />
              <path d="M8 11l2.5 2.5L16 8" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>
              <strong style={{ color: "var(--text)" }}>{QUESTION_COUNT_LABEL}</strong> eigene Übungsfragen zur Vorbereitung auf IHK-Abschlussprüfungen
            </span>
          </div>
        </div>

        {/* product mockup */}
        <div style={{ animation: "pk-revUp .7s cubic-bezier(.16,1,.3,1) .2s both", position: "relative", zIndex: 1 }}>
          <div style={{ animation: "pk-floaty 7s ease-in-out infinite" }}>
            <div
              className="pk-hero-mockup"
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
      </section>

      {/* ===== EXAMS ===== */}
      <section id="pruefungen" style={{ maxWidth: "1200px", margin: "0 auto", padding: "24px 28px 40px" }}>
        <h2 style={{ ...heading, fontWeight: 700, fontSize: "clamp(26px,3vw,36px)", letterSpacing: "-.02em", margin: "0 0 8px" }}>Für welche Prüfung übst du?</h2>
        <p style={{ color: "var(--muted)", margin: "0 0 24px", maxWidth: "640px" }}>
          Zu jedem Beruf findest du die Themen und Beispielfragen mit Lösung, ganz ohne Anmeldung. Für Fachinformatiker Anwendungsentwicklung erklären wir außerdem den{" "}
          <Link href="/fachinformatiker-anwendungsentwicklung" style={{ color: "var(--accent-strong)", textDecoration: "underline", textUnderlineOffset: "2px" }}>Aufbau der Prüfung mit AP1 und AP2</Link>.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: "12px" }}>
          {exams.map((exam) => (
            <Link key={exam.slug} href={`/pruefungen/${exam.slug}`} className="pk-exam-card" style={{ display: "block", padding: "16px 18px", borderRadius: "14px", background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)", textDecoration: "none", transition: "transform .2s, border-color .2s" }}>
              <span style={{ display: "block", fontWeight: 600 }}>{exam.name}</span>
              <span style={{ display: "block", fontSize: "14px", color: "var(--muted)" }}>{exam.count.toLocaleString("de-DE")} Übungsfragen</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section id="features" style={{ maxWidth: "1200px", margin: "0 auto", padding: "80px 28px" }}>
        <div style={{ animation: "pk-revUp .7s cubic-bezier(.16,1,.3,1) 0s both", maxWidth: "640px", margin: "0 auto 56px", textAlign: "center" }}>
          <span style={{ fontSize: "14px", fontWeight: 600, color: "var(--accent-strong)" }}>Features</span>
          <h2 style={{ ...heading, fontWeight: 700, fontSize: "clamp(30px,3.6vw,44px)", letterSpacing: "-.025em", margin: "12px 0 14px", lineHeight: 1.1 }}>
            Alles, was du zum Üben brauchst
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
              title: "Eigene Übungsfragen",
              body: `${QUESTION_COUNT_LABEL} selbst erstellte Übungsfragen zu den Themen deiner Prüfung, nach Themen sortiert. Keine Original-Prüfungsaufgaben.`,
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
              title: "Prüfungssimulation",
              body: "Übe mit Zeitlimit und Fragenmix, ausgewertet wird am Ende. Umfang und Zeit legen wir selbst fest, sie entsprechen nicht der echten Prüfung.",
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
              style={{
                animation: `pk-revUp .7s cubic-bezier(.16,1,.3,1) ${f.delay} backwards`,
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
              In drei Schritten vorbereitet
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: "28px" }}>
            {[
              { delay: "0s", num: "01", title: "Prüfung wählen", body: "Such dir deine Prüfung aus dem Katalog. Der Rest wird passgenau für dich vorbereitet." },
              { delay: ".12s", num: "02", title: "Üben & simulieren", body: "Arbeite dich in deinem Tempo durch die Fragen und teste dich in Simulationen mit Zeitlimit." },
              { delay: ".24s", num: "03", title: "Vorbereitet reingehen", body: "Du siehst, welche Themen schon sitzen und wo du noch üben solltest. Bestehen musst du die Prüfung am Ende selbst." },
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

      {/* ===== FACTS ===== */}
      <section style={{ maxWidth: "1200px", margin: "0 auto", padding: "88px 28px" }}>
        <div className="pk-stats-grid" style={{ animation: "pk-revUp .7s cubic-bezier(.16,1,.3,1) 0s both", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: "20px", textAlign: "center" }}>
          {[
            { value: QUESTION_COUNT_LABEL, label: "Übungsfragen im Pool", border: false },
            { value: String(examCount), label: examCount === 1 ? "Prüfung" : "Prüfungen", border: true },
            { value: "0 €", label: "Für den Einstieg", border: true },
          ].map((stat) => (
            <div key={stat.label} style={{ padding: "24px 12px", borderLeft: stat.border ? "1px solid var(--border)" : undefined }}>
              <div style={{ ...heading, fontWeight: 700, fontSize: "clamp(30px,3.4vw,42px)", letterSpacing: "-.02em", color: "var(--accent)" }}>{stat.value}</div>
              <div style={{ color: "var(--muted)", fontSize: "15px", marginTop: "4px" }}>{stat.label}</div>
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
            <p style={{ fontSize: "18px", color: "var(--muted)", margin: 0 }}>Free ohne Kreditkarte. Pro verlängert sich monatlich und ist jederzeit zum Monatsende kündbar.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: "22px", alignItems: "stretch" }}>
            {/* Free */}
            <div style={{ animation: "pk-revUp .7s cubic-bezier(.16,1,.3,1) 0s both", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "22px", padding: "34px" }}>
              <h3 style={{ ...heading, fontWeight: 600, fontSize: "20px", margin: "0 0 6px" }}>Free</h3>
              <p style={{ color: "var(--muted)", fontSize: "15px", margin: "0 0 22px" }}>Zum Ausprobieren.</p>
              <div style={{ display: "flex", alignItems: "baseline", gap: "6px", marginBottom: "26px" }}>
                <span style={{ ...heading, fontWeight: 700, fontSize: "44px", letterSpacing: "-.02em" }}>0 €</span>
                <span style={{ color: "var(--muted)", fontSize: "15px" }}>/ Monat</span>
              </div>
              <AppLink
                className="pk-price-btn-ghost"
                style={{ display: "block", boxSizing: "border-box", textAlign: "center", textDecoration: "none", width: "100%", fontWeight: 600, fontSize: "15.5px", padding: "13px", borderRadius: "13px", background: "var(--surface)", color: "var(--text)", border: "1px solid var(--border)", transition: "transform .18s, border-color .2s" }}
              >
                Kostenlos starten
              </AppLink>
              <div style={{ height: "1px", background: "var(--border)", margin: "26px 0" }} />
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "14px", fontSize: "15px" }}>
                <CheckItem text="Alle Fragen und Themen" filled={false} />
                <CheckItem text="3 kostenlose Lernsitzungen pro Prüfung" filled={false} />
                <CheckItem text="XP und Fortschritt" filled={false} />
              </ul>
            </div>
            {/* Pro */}
            <div style={{ animation: "pk-revUp .7s cubic-bezier(.16,1,.3,1) .1s both", position: "relative", background: "var(--surface)", border: "1.5px solid var(--accent)", borderRadius: "22px", padding: "34px", boxShadow: "0 20px 50px color-mix(in oklch, var(--accent) 18%, transparent)" }}>
              <h3 style={{ ...heading, fontWeight: 600, fontSize: "20px", margin: "0 0 6px" }}>Pro</h3>
              <p style={{ color: "var(--muted)", fontSize: "15px", margin: "0 0 22px" }}>Für alle, die ohne Limit üben wollen.</p>
              <div style={{ display: "flex", alignItems: "baseline", gap: "6px", marginBottom: "26px" }}>
                <span style={{ ...heading, fontWeight: 700, fontSize: "44px", letterSpacing: "-.02em" }}>9,99 €</span>
                <span style={{ color: "var(--muted)", fontSize: "15px" }}>/ Monat (Endpreis)</span>
              </div>
              <Link
                href="/upgrade"
                className="pk-price-btn-accent"
                style={{ display: "block", boxSizing: "border-box", textAlign: "center", textDecoration: "none", width: "100%", fontWeight: 600, fontSize: "15.5px", padding: "13px", borderRadius: "13px", background: "var(--accent)", color: "var(--on-accent)", boxShadow: "0 8px 22px color-mix(in oklch, var(--accent) 34%, transparent)", transition: "transform .18s cubic-bezier(.2,.9,.3,1.3), box-shadow .25s" }}
              >
                Pro holen
              </Link>
              <div style={{ height: "1px", background: "var(--border)", margin: "26px 0" }} />
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "14px", fontSize: "15px" }}>
                <CheckItem text="Alle Fragen und Themen" filled />
                <CheckItem text="Unbegrenzte Lernsitzungen und Simulationen" filled />
                <CheckItem text="Unbegrenzte Blitz-Läufe" filled />
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
            <AppLink
              className="pk-cta-btn"
              style={{ fontWeight: 600, fontSize: "17px", padding: "16px 30px", borderRadius: "16px", background: "var(--accent)", color: "var(--on-accent)", display: "inline-flex", alignItems: "center", gap: "10px", boxShadow: "0 10px 30px color-mix(in oklch, var(--accent) 38%, transparent)", transition: "transform .2s cubic-bezier(.2,.9,.3,1.3), box-shadow .25s" }}
            >
              Jetzt kostenlos starten
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M5 12h13M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </AppLink>
          </div>
        </div>
      </section>

      </main>
      <SiteFooter />
    </ThemeRoot>
  );
}
