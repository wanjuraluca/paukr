import type { CSSProperties } from "react";
import LegalShell from "../legal/LegalShell";

const heading: CSSProperties = { fontFamily: "var(--font-space), sans-serif" };
const h2: CSSProperties = { ...heading, fontWeight: 600, fontSize: "18px", margin: "36px 0 10px" };
const link: CSSProperties = { color: "var(--accent-strong)" };

export const metadata = { title: "Nutzungsbedingungen · paukr" };

export default function AgbPage() {
  return (
    <LegalShell>
      <h1 style={{ ...heading, fontWeight: 700, fontSize: "clamp(28px,3.4vw,38px)", letterSpacing: "-.02em", margin: "0 0 8px" }}>
        Nutzungsbedingungen
      </h1>
      <p style={{ margin: "0 0 24px", color: "var(--muted)", fontSize: "14px" }}>Stand: November 2026</p>

      <h2 style={{ ...h2, marginTop: 0 }}>1. Anbieter und Geltungsbereich</h2>
      <p>
        Diese Bedingungen gelten für die Lernplattform paukr (paukr.app) von Luca Wanjura, Uranusweg 18, 45770 Marl,
        E-Mail <a href="mailto:info@paukr.app" style={link}>info@paukr.app</a>.
      </p>

      <h2 style={h2}>2. Unabhängiges Angebot</h2>
      <p>
        paukr ist ein unabhängiges privates Übungsangebot. Es besteht keine Verbindung zu den Industrie- und
        Handelskammern, der DIHK, der AkA, der ZPA oder anderen Prüfungsstellen, und keine dieser Stellen hat paukr geprüft
        oder empfohlen. Alle Fragen sind eigene Übungsfragen und keine Original-Prüfungsaufgaben. Prüfungsbezeichnungen
        dienen nur der Beschreibung, worauf sich das Üben bezieht.
      </p>

      <h2 style={h2}>3. Leistungen</h2>
      <p>
        paukr bietet Übungsfragen mit Erklärungen, Wiederholung nach Lernstand, Simulationen auf Zeit und einen Blitz-Modus.
        Im Tarif <strong>Free</strong> stehen pro Prüfung 3 Lernsitzungen kostenlos zur Verfügung (Üben, Simulationen und
        Blitz-Läufe zählen zusammen). Im Tarif <strong>Pro</strong> ist die Zahl der Sitzungen unbegrenzt.
      </p>

      <h2 style={h2}>4. Kein Erfolgsversprechen</h2>
      <p>
        Die Nutzung von paukr garantiert nicht das Bestehen einer Prüfung oder eine bestimmte Note. Simulationen, Punkte,
        Noten und Fortschrittsanzeigen sind Übungswerte. Sie sind keine amtliche Bewertung und bilden Umfang, Aufbau,
        Schwierigkeit und Bewertung der echten Prüfung nicht verbindlich ab. Maßgeblich sind die Unterlagen deiner
        zuständigen Prüfungsstelle.
      </p>

      <h2 style={h2}>5. Konto und Minderjährige</h2>
      <p>
        Für die Nutzung brauchst du ein Konto mit zutreffenden Angaben. Dein Passwort musst du geheim halten. Wer unter 16
        Jahre alt ist, braucht für das Konto die Zustimmung der Erziehungsberechtigten. Wer minderjährig ist, darf Pro nur
        mit Zustimmung der Erziehungsberechtigten abschließen.
      </p>

      <h2 style={h2}>6. Vertragsschluss, Preis und Zahlung</h2>
      <p>
        Das Angebot von Pro auf der Website ist noch nicht bindend. Du gibst dein Angebot im Bezahlvorgang unseres
        Zahlungsdienstleisters Stripe mit dem zahlungspflichtigen Bestellbutton ab. Der Vertrag kommt zustande, sobald die
        Zahlung bestätigt ist und wir Pro freischalten. Die Vertragsbestätigung bekommst du per E-Mail. Der Vertragstext
        wird von uns nicht gesondert zugänglich gespeichert, diese Bedingungen findest du aber jederzeit auf dieser Seite.
        Die Vertragssprache ist Deutsch.
      </p>
      <p>
        Pro kostet 9,99 € pro Monat. Das ist der Endpreis. Der Betrag wird monatlich im Voraus über das beim Kauf gewählte
        Zahlungsmittel eingezogen. Schlägt eine Zahlung endgültig fehl, enden die Pro-Funktionen.
      </p>

      <h2 style={h2}>7. Laufzeit und Kündigung</h2>
      <p>
        Pro läuft jeweils einen Monat und verlängert sich automatisch um einen weiteren Monat, wenn du nicht kündigst. Du
        kannst jederzeit zum Ende des bezahlten Monats kündigen, online unter{" "}
        <a href="/kuendigen" style={link}>Verträge hier kündigen</a> oder per E-Mail. Das Recht zur außerordentlichen
        Kündigung aus wichtigem Grund bleibt unberührt. Dein kostenloses Konto kannst du jederzeit per E-Mail löschen lassen.
      </p>

      <h2 style={h2}>8. Widerrufsrecht</h2>
      <p>
        Verbraucher haben ein gesetzliches Widerrufsrecht. Die Einzelheiten stehen in der{" "}
        <a href="/widerruf" style={link}>Widerrufsbelehrung</a>. Dort kannst du den Vertrag auch direkt widerrufen.
      </p>

      <h2 style={h2}>9. Inhalte und Mängel</h2>
      <p>
        Wir erstellen die Inhalte sorgfältig. Trotzdem können Fragen oder Erklärungen Fehler enthalten oder nicht mehr
        aktuell sein. Bitte melde solche Fehler an <a href="mailto:info@paukr.app" style={link}>info@paukr.app</a>. Bei
        Mängeln gelten die gesetzlichen Rechte.
      </p>

      <h2 style={h2}>10. Nutzungsregeln</h2>
      <p>
        Die Inhalte sind urheberrechtlich geschützt und nur für deine eigene Vorbereitung bestimmt. Nicht erlaubt sind
        automatisierte Massenabfragen, das Kopieren oder Weiterverbreiten des Fragenpools und die Weitergabe deines Kontos.
        Bei erheblichen Verstößen können wir ein Konto sperren, in der Regel nach vorheriger Abmahnung.
      </p>

      <h2 style={h2}>11. Haftung</h2>
      <p>
        Wir haften unbeschränkt bei Vorsatz und grober Fahrlässigkeit, bei Verletzung von Leben, Körper oder Gesundheit und
        nach dem Produkthaftungsgesetz. Bei leicht fahrlässiger Verletzung wesentlicher Vertragspflichten ist die Haftung
        auf den vorhersehbaren, vertragstypischen Schaden begrenzt. Im Übrigen ist die Haftung für leichte Fahrlässigkeit
        ausgeschlossen.
      </p>

      <h2 style={h2}>12. Änderungen</h2>
      <p>
        Änderungen dieser Bedingungen oder des Preises gelten für bestehende Pro-Verträge nur, wenn du ihnen zustimmst.
        Stimmst du nicht zu, läuft der Vertrag zu den bisherigen Bedingungen weiter, bis eine Seite ihn kündigt.
      </p>

      <h2 style={h2}>13. Schlussbestimmungen</h2>
      <p>
        Es gilt deutsches Recht. Zwingende Verbraucherschutzvorschriften des Staates, in dem du deinen gewöhnlichen
        Aufenthalt hast, bleiben unberührt. Ist eine Bestimmung unwirksam, bleibt der Vertrag im Übrigen wirksam.
      </p>
    </LegalShell>
  );
}
