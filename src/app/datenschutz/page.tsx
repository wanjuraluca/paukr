import type { CSSProperties } from "react";
import LegalShell from "../legal/LegalShell";
import { pageMetadata } from "@/lib/seo";

const heading: CSSProperties = { fontFamily: "var(--font-space), sans-serif" };
const h2: CSSProperties = { ...heading, fontWeight: 600, fontSize: "18px", margin: "36px 0 10px" };
const strong: CSSProperties = { color: "var(--text)" };
const mail = <a href="mailto:info@paukr.app" style={{ color: "var(--accent-strong)" }}>info@paukr.app</a>;

export const metadata = pageMetadata({
  title: "Datenschutzerklärung | paukr",
  description: "Welche Daten paukr verarbeitet, warum und wie lange, welche Dienstleister beteiligt sind und welche Rechte du hast.",
  path: "/datenschutz",
});

export default function DatenschutzPage() {
  return (
    <LegalShell>
      <h1 style={{ ...heading, fontWeight: 700, fontSize: "clamp(28px,3.4vw,38px)", letterSpacing: "-.02em", margin: "0 0 8px" }}>
        Datenschutzerklärung
      </h1>
      <p style={{ margin: "0 0 24px", color: "var(--muted)", fontSize: "14px" }}>Stand: November 2026</p>

      <h2 style={{ ...h2, marginTop: 0 }}>1. Verantwortlicher</h2>
      <p>
        Luca Wanjura, Uranusweg 18, 45770 Marl, Deutschland
        <br />
        E-Mail: {mail}
      </p>

      <h2 style={h2}>2. Welche Daten wir verarbeiten und warum</h2>
      <p>
        <strong style={strong}>Konto und Login.</strong> Wir speichern deine E-Mail-Adresse, deinen Anzeigenamen und bei
        Anmeldung mit Passwort dieses in gehashter Form. Meldest du dich mit Google an, erhalten wir von Google deine
        E-Mail-Adresse und deinen Namen. Rechtsgrundlage ist die Vertragserfüllung (Art. 6 Abs. 1 lit. b DSGVO).
      </p>
      <p>
        <strong style={strong}>Lernfortschritt.</strong> Wir speichern, welche Fragen du wann und wie beantwortet hast, wie
        lange du gebraucht hast, deine XP, deine Serie sowie Ergebnisse von Simulationen und Blitz-Läufen. Daraus berechnen
        wir, welche Fragen du wiederholen solltest. Das hat keine rechtliche Wirkung für dich. Rechtsgrundlage ist die
        Vertragserfüllung.
      </p>
      <p>
        <strong style={strong}>Zahlungen.</strong> Pro wird über Stripe abgewickelt. Zahlungsdaten gibst du direkt bei
        Stripe ein, wir sehen sie nicht. Wir erhalten und speichern eine Kunden- und Abo-Kennung, den Abo-Status, die
        Laufzeit sowie deine Erklärung zum vorzeitigen Leistungsbeginn. Rechtsgrundlagen sind die Vertragserfüllung und
        gesetzliche Pflichten (Art. 6 Abs. 1 lit. b und c DSGVO).
      </p>
      <p>
        <strong style={strong}>Widerruf und Kündigung.</strong> Nutzt du diese Formulare, verarbeiten wir Name, E-Mail,
        Vertragsangaben, deine Angaben zur Kündigung sowie Datum und Uhrzeit des Eingangs. So bearbeiten und belegen wir
        deine Erklärung und senden dir die Eingangsbestätigung (Art. 6 Abs. 1 lit. c DSGVO).
      </p>
      <p>
        <strong style={strong}>Fehlermeldungen zu Fragen.</strong> Meldest du einen Fehler in einer Frage, speichern wir
        deinen Text, die Frage und dein Konto, um den Fehler zu prüfen (Art. 6 Abs. 1 lit. f DSGVO).
      </p>
      <p>
        <strong style={strong}>Herkunft der Anmeldung.</strong> Kommst du über einen markierten Link, zum Beispiel aus einer
        Anzeige oder von einer unserer öffentlichen Seiten, und legst ein Konto an, speichern wir bei deinem Konto die Quelle aus
        dem Link. So sehen wir, welche Werbung sich lohnt. Dafür setzen wir kein Cookie und geben nichts an Werbeplattformen
        weiter (Art. 6 Abs. 1 lit. f DSGVO).
      </p>
      <p>
        <strong style={strong}>Reichweitenmessung.</strong> Wir nutzen Vercel Web Analytics, um zu sehen, welche Seiten wie oft
        aufgerufen werden. Dafür werden beim Seitenaufruf Nutzungsdaten wie die aufgerufene Seite und die vorherige Seite an
        Vercel übermittelt. Es werden keine Cookies gesetzt. Besucher werden nur über einen aus der Anfrage gebildeten Hashwert
        unterschieden, der nach 24 Stunden verworfen wird. Rechtsgrundlage ist unser berechtigtes Interesse daran, das Angebot
        zu verbessern (Art. 6 Abs. 1 lit. f DSGVO).
      </p>
      <p>
        <strong style={strong}>E-Mails.</strong> Wir senden dir nur Mails, die zum Konto oder Vertrag gehören, zum Beispiel
        Kontobestätigung, Passwort zurücksetzen, Vertragsbestätigung oder Eingangsbestätigungen. Werbung versenden wir nicht.
      </p>
      <p>
        <strong style={strong}>Technische Daten.</strong> Beim Aufruf der Seite verarbeitet unser Hosting-Anbieter
        Verbindungsdaten wie IP-Adresse und Zeitpunkt, um die Seite auszuliefern und abzusichern. Rechtsgrundlage ist unser
        berechtigtes Interesse an einem sicheren Betrieb (Art. 6 Abs. 1 lit. f DSGVO).
      </p>

      <h2 style={h2}>3. Eingesetzte Dienstleister</h2>
      <ul style={{ paddingLeft: "22px", margin: "0 0 16px" }}>
        <li><strong style={strong}>Supabase, Inc. (USA):</strong> Datenbank, Nutzerkonten und Anmeldung.</li>
        <li><strong style={strong}>Vercel Inc. (USA):</strong> Hosting der Website und Reichweitenmessung.</li>
        <li><strong style={strong}>Resend (USA):</strong> Versand der oben genannten E-Mails.</li>
        <li><strong style={strong}>Stripe Payments Europe, Ltd. (Irland):</strong> Zahlungsabwicklung. Stripe verarbeitet Zahlungsdaten teilweise in eigener Verantwortung, etwa zur Betrugsabwehr.</li>
        <li><strong style={strong}>Google Ireland Limited (Irland):</strong> nur wenn du dich mit Google anmeldest.</li>
      </ul>
      <p>
        Dabei können Daten in die USA übermittelt werden. Wir stützen uns dafür auf den Angemessenheitsbeschluss zum EU-US
        Data Privacy Framework, soweit der Anbieter zertifiziert ist, und sonst auf EU-Standardvertragsklauseln. Eine Kopie
        der Garantien bekommst du auf Anfrage.
      </p>

      <h2 style={h2}>4. Cookies und Speicherung auf deinem Gerät</h2>
      <p>
        Wir setzen nur technisch notwendige Cookies ein, die dich nach dem Login angemeldet halten. Rechtsgrundlage ist
        § 25 Abs. 2 Nr. 2 TDDDG, eine Einwilligung ist dafür nicht nötig. Die Reichweitenmessung kommt ohne Cookies aus. Es gibt keine
        Tracking-Pixel und keine Werbe-Cookies, deshalb auch kein Cookie-Banner. Schriftarten liefern wir von unserem eigenen Server aus. Auf
        den Seiten von Stripe gelten beim Bezahlen die Regeln von Stripe.
      </p>

      <h2 style={h2}>5. Speicherdauer</h2>
      <p>
        Kontodaten und Lernfortschritt speichern wir, solange dein Konto besteht. Löschen kannst du das Konto selbst unter{" "}
        <a href="/konto" style={{ color: "var(--accent-strong)" }}>Dein Konto</a> oder mit einer Mail an {mail}. Rechnungs- und Buchungsbelege müssen wir nach den gesetzlichen Fristen aufbewahren, in der Regel bis zu 8
        oder 10 Jahre. Erklärungen zu Widerruf und Kündigung bewahren wir bis zum Ablauf der Verjährungsfristen auf.
      </p>

      <h2 style={h2}>6. Pflicht zur Angabe</h2>
      <p>
        Ohne E-Mail-Adresse können wir kein Konto anlegen, und ohne Zahlungsdaten kein Pro-Abo abschließen. Darüber hinaus bist
        du nicht verpflichtet, Daten anzugeben.
      </p>

      <h2 style={h2}>7. Deine Rechte</h2>
      <p>
        Du hast das Recht auf Auskunft (Art. 15 DSGVO), Berichtigung (Art. 16), Löschung (Art. 17), Einschränkung (Art. 18)
        und Datenübertragbarkeit (Art. 20). Verarbeitungen auf Grundlage berechtigter Interessen kannst du aus Gründen, die
        sich aus deiner besonderen Situation ergeben, widersprechen (Art. 21). Schreib dafür an {mail}. Außerdem kannst du
        dich bei einer Aufsichtsbehörde beschweren, zuständig für uns ist die Landesbeauftragte für Datenschutz und
        Informationsfreiheit Nordrhein-Westfalen.
      </p>

      <h2 style={h2}>8. Minderjährige</h2>
      <p>
        paukr richtet sich auch an Auszubildende, die noch nicht volljährig sind. Wer unter 16 Jahre alt ist, braucht für
        das Konto die Zustimmung der Erziehungsberechtigten.
      </p>
    </LegalShell>
  );
}
