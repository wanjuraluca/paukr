import type { CSSProperties } from "react";
import LegalShell from "../legal/LegalShell";

const heading: CSSProperties = { fontFamily: "var(--font-space), sans-serif" };
const h2: CSSProperties = { ...heading, fontWeight: 600, fontSize: "18px", margin: "36px 0 10px" };

export const metadata = { title: "Nutzungsbedingungen · paukr" };

export default function AgbPage() {
  return (
    <LegalShell>
      <h1 style={{ ...heading, fontWeight: 700, fontSize: "clamp(28px,3.4vw,38px)", letterSpacing: "-.02em", margin: "0 0 8px" }}>
        Nutzungsbedingungen
      </h1>
      <p style={{ margin: "0 0 24px", color: "var(--muted)", fontSize: "14px" }}>Stand: Juli 2026</p>

      <h2 style={{ ...h2, marginTop: 0 }}>1. Geltungsbereich</h2>
      <p>
        Diese Nutzungsbedingungen gelten für die Nutzung von paukr, einer Lernplattform zur Vorbereitung auf
        IHK-Prüfungen (paukr.app), betrieben von Luca Wanjura.
      </p>

      <h2 style={h2}>2. Leistungsbeschreibung</h2>
      <p>
        paukr stellt Übungsfragen, eine Lernfortschritts-Anzeige und eine zeitlich begrenzte Prüfungssimulation zur
        Verfügung. Die Inhalte sind eigenständig erstellt, an realen Prüfungsordnungen und Rahmenplänen orientiert, aber
        keine 1:1-Kopie echter Prüfungsfragen und kein offizielles Material einer Industrie- und Handelskammer.
      </p>

      <h2 style={h2}>3. Keine Erfolgsgarantie</h2>
      <p>
        <strong style={{ color: "var(--text)" }}>
          Die Nutzung von paukr ist keine Garantie für das Bestehen einer echten IHK-Prüfung oder einer anderen
          Prüfung.
        </strong>{" "}
        Fragen, Erklärungen, Simulationsergebnisse, Punktzahlen und Notenangaben dienen ausschließlich der eigenen
        Vorbereitung und spiegeln nicht zwingend Umfang, Schwierigkeit oder Bestehensgrenzen der tatsächlichen Prüfung
        wider. Für die Richtigkeit, Vollständigkeit oder Aktualität der Inhalte wird keine Gewähr übernommen. Die
        Verantwortung für die eigene Prüfungsvorbereitung und das Bestehen der Prüfung liegt allein bei der nutzenden
        Person.
      </p>

      <h2 style={h2}>4. Registrierung und Konto</h2>
      <p>
        Für die Nutzung ist ein Konto erforderlich. Du bist verpflichtet, wahrheitsgemäße Angaben zu machen und dein
        Passwort geheim zu halten. Nutzer unter 16 Jahren benötigen die Einwilligung eines Erziehungsberechtigten.
      </p>

      <h2 style={h2}>5. Kostenlose und kostenpflichtige Leistungen</h2>
      <p>
        Der Funktionsumfang von paukr ist aktuell vollständig kostenlos nutzbar. Sollten künftig kostenpflichtige
        Zusatzfunktionen (z. B. ein Pro-Tarif) eingeführt werden, wird dies vorab klar gekennzeichnet; bestehende
        kostenlose Funktionen bleiben davon unberührt.
      </p>

      <h2 style={h2}>6. Pflichten der Nutzer</h2>
      <p>
        Du verpflichtest dich, paukr nicht missbräuchlich zu nutzen, insbesondere keine automatisierten Massenabfragen
        durchzuführen, keine Inhalte unbefugt zu vervielfältigen oder weiterzuverbreiten und keine gesetzeswidrigen
        Handlungen über die Plattform vorzunehmen.
      </p>

      <h2 style={h2}>7. Haftung</h2>
      <p>
        Wir haften unbeschränkt bei Vorsatz und grober Fahrlässigkeit sowie bei der Verletzung von Leben, Körper oder
        Gesundheit. Bei leicht fahrlässiger Verletzung wesentlicher Vertragspflichten (Kardinalpflichten) ist die Haftung
        auf den vorhersehbaren, vertragstypischen Schaden begrenzt. Im Übrigen ist die Haftung für leichte Fahrlässigkeit
        ausgeschlossen. Dies gilt insbesondere für Schäden, die aus der Nutzung, Auslegung oder dem Verlass auf die
        Inhalte von paukr entstehen, einschließlich eines nicht bestandenen Prüfungsversuchs.
      </p>

      <h2 style={h2}>8. Kündigung</h2>
      <p>
        Du kannst dein Konto jederzeit ohne Angabe von Gründen löschen lassen, indem du uns unter{" "}
        <a href="mailto:info@paukr.app" style={{ color: "var(--accent-strong)" }}>info@paukr.app</a> kontaktierst. Wir
        behalten uns vor, Konten bei Verstoß gegen diese Nutzungsbedingungen zu sperren.
      </p>

      <h2 style={h2}>9. Änderungen dieser Bedingungen</h2>
      <p>
        Wir können diese Nutzungsbedingungen bei Bedarf anpassen, etwa wenn neue Funktionen hinzukommen. Über
        wesentliche Änderungen informieren wir per E-Mail oder innerhalb der Anwendung.
      </p>

      <h2 style={h2}>10. Schlussbestimmungen</h2>
      <p>
        Es gilt deutsches Recht. Sollte eine Bestimmung dieser Nutzungsbedingungen unwirksam sein, bleibt die
        Wirksamkeit der übrigen Bestimmungen davon unberührt.
      </p>
    </LegalShell>
  );
}
