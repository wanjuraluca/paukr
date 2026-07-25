import type { CSSProperties } from "react";
import LegalShell from "../legal/LegalShell";

const heading: CSSProperties = { fontFamily: "var(--font-space), sans-serif" };
const h2: CSSProperties = { ...heading, fontWeight: 600, fontSize: "18px", margin: "36px 0 10px" };

export const metadata = { title: "Datenschutz · paukr" };

export default function DatenschutzPage() {
  return (
    <LegalShell>
      <h1 style={{ ...heading, fontWeight: 700, fontSize: "clamp(28px,3.4vw,38px)", letterSpacing: "-.02em", margin: "0 0 8px" }}>
        Datenschutzerklärung
      </h1>
      <p style={{ margin: "0 0 24px", color: "var(--muted)", fontSize: "14px" }}>Stand: Juli 2026</p>

      <h2 style={{ ...h2, marginTop: 0 }}>1. Verantwortlicher</h2>
      <p>
        Luca Wanjura, Uranusweg 18, 45770 Marl, Deutschland
        <br />
        E-Mail: <a href="mailto:info@paukr.app" style={{ color: "var(--accent-strong)" }}>info@paukr.app</a>
      </p>

      <h2 style={h2}>2. Welche Daten wir verarbeiten und warum</h2>
      <p>
        <strong style={{ color: "var(--text)" }}>Registrierung und Login.</strong> Wenn du ein Konto erstellst, speichern
        wir deine E-Mail-Adresse, einen von dir gewählten Anzeigenamen und (bei E-Mail/Passwort-Anmeldung) ein Passwort in
        gehashter Form. Meldest du dich mit Google an, erhalten wir von Google deine E-Mail-Adresse und deinen Namen.
        Rechtsgrundlage ist die Erfüllung des Nutzungsvertrags (Art. 6 Abs. 1 lit. b DSGVO).
      </p>
      <p>
        <strong style={{ color: "var(--text)" }}>Lernfortschritt.</strong> Wir speichern, welche Fragen du wann wie
        beantwortet hast, deinen XP-Stand, deine Lernserie sowie Ergebnisse von Prüfungssimulationen, um dir
        Fortschrittsanzeigen und die Wiederholungslogik anzeigen zu können. Rechtsgrundlage ist ebenfalls die
        Vertragserfüllung.
      </p>
      <p>
        <strong style={{ color: "var(--text)" }}>Technische Daten.</strong> Beim Aufruf der Seite verarbeitet unser
        Hosting-Anbieter (Vercel) technisch notwendige Verbindungsdaten (u. a. IP-Adresse, Zeitpunkt des Zugriffs), um die
        Auslieferung der Seite zu ermöglichen. Rechtsgrundlage ist unser berechtigtes Interesse an einem funktionierenden,
        sicheren Betrieb (Art. 6 Abs. 1 lit. f DSGVO).
      </p>
      <p>
        <strong style={{ color: "var(--text)" }}>Zahlungen.</strong> paukr bietet aktuell keine kostenpflichtigen
        Funktionen an. Sollte künftig ein kostenpflichtiger Plan eingeführt werden, aktualisieren wir diese Erklärung vor
        dessen Start entsprechend.
      </p>

      <h2 style={h2}>3. Eingesetzte Dienstleister</h2>
      <p>Wir setzen folgende Auftragsverarbeiter bzw. Drittanbieter ein:</p>
      <ul style={{ paddingLeft: "22px", margin: "0 0 16px" }}>
        <li><strong style={{ color: "var(--text)" }}>Supabase</strong> — Datenbank, Nutzerkonten und Authentifizierung.</li>
        <li><strong style={{ color: "var(--text)" }}>Vercel Inc.</strong> — Hosting der Webanwendung.</li>
        <li><strong style={{ color: "var(--text)" }}>Resend</strong> — Versand von Transaktions-E-Mails (Kontobestätigung, Passwort-Zurücksetzen).</li>
        <li><strong style={{ color: "var(--text)" }}>Google Ireland Limited</strong> — nur wenn du dich mit Google anmeldest, zum Zweck der Authentifizierung.</li>
      </ul>
      <p>
        Einzelne dieser Anbieter können Daten auch außerhalb der EU/des EWR, insbesondere in den USA, verarbeiten. Soweit
        dies der Fall ist, stützen wir uns auf die EU-Standardvertragsklauseln bzw. vergleichbare, von der jeweiligen
        Rechtsgrundlage anerkannte Garantien.
      </p>

      <h2 style={h2}>4. Cookies</h2>
      <p>
        Wir setzen ausschließlich technisch notwendige Cookies zur Aufrechterhaltung deiner Anmeldesitzung ein. Es werden
        keine Analyse- oder Marketing-Cookies verwendet, für die eine Einwilligung erforderlich wäre.
      </p>

      <h2 style={h2}>5. Speicherdauer</h2>
      <p>
        Wir speichern deine Kontodaten, solange dein Konto besteht. Auf Wunsch löschen wir dein Konto samt aller
        zugehörigen Lerndaten; schreib uns dafür einfach an <a href="mailto:info@paukr.app" style={{ color: "var(--accent-strong)" }}>info@paukr.app</a>.
      </p>

      <h2 style={h2}>6. Deine Rechte</h2>
      <p>
        Du hast das Recht auf Auskunft (Art. 15 DSGVO), Berichtigung (Art. 16), Löschung (Art. 17), Einschränkung der
        Verarbeitung (Art. 18), Datenübertragbarkeit (Art. 20) sowie Widerspruch gegen die Verarbeitung (Art. 21). Wende
        dich dafür an <a href="mailto:info@paukr.app" style={{ color: "var(--accent-strong)" }}>info@paukr.app</a>. Außerdem
        steht dir ein Beschwerderecht bei einer Datenschutz-Aufsichtsbehörde zu.
      </p>

      <h2 style={h2}>7. Minderjährige Nutzer</h2>
      <p>
        paukr richtet sich auch an Auszubildende, von denen manche noch nicht volljährig sind. Nutzer unter 16 Jahren
        benötigen die Einwilligung eines Erziehungsberechtigten zur Kontoerstellung.
      </p>
    </LegalShell>
  );
}
