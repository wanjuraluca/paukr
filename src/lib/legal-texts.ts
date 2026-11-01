// Wording follows the statutory model in Anlage 1 to Art. 246a EGBGB (version
// valid since 19.06.2026). Keep it close to the model, deviations can cost the
// legal protection of using it.
export const OPERATOR_CONTACT = "Luca Wanjura, Uranusweg 18, 45770 Marl, E-Mail: info@paukr.app";

export const WITHDRAWAL_SECTIONS: { title: string; paragraphs: string[] }[] = [
  {
    title: "Widerrufsrecht",
    paragraphs: [
      "Sie haben das Recht, binnen vierzehn Tagen ohne Angabe von Gründen diesen Vertrag zu widerrufen.",
      "Die Widerrufsfrist beträgt vierzehn Tage ab dem Tag des Vertragsabschlusses.",
      `Um Ihr Widerrufsrecht auszuüben, müssen Sie uns (${OPERATOR_CONTACT}) mittels einer eindeutigen Erklärung (z.B. ein mit der Post versandter Brief oder eine E-Mail) über Ihren Entschluss, diesen Vertrag zu widerrufen, informieren. Sie können dafür das beigefügte Muster-Widerrufsformular verwenden, das jedoch nicht vorgeschrieben ist. Sie können Ihr Widerrufsrecht auch online unter https://www.paukr.app/widerruf ausüben. Wenn Sie diese Online-Funktion nutzen, übermitteln wir Ihnen auf einem dauerhaften Datenträger (z. B. durch eine E-Mail) unverzüglich eine Eingangsbestätigung mit Informationen zum Inhalt der Widerrufserklärung sowie dem Datum und der Uhrzeit ihres Eingangs.`,
      "Zur Wahrung der Widerrufsfrist reicht es aus, dass Sie die Mitteilung über die Ausübung des Widerrufsrechts vor Ablauf der Widerrufsfrist absenden.",
    ],
  },
  {
    title: "Folgen des Widerrufs",
    paragraphs: [
      "Wenn Sie diesen Vertrag widerrufen, haben wir Ihnen alle Zahlungen, die wir von Ihnen erhalten haben, einschließlich der Lieferkosten (mit Ausnahme der zusätzlichen Kosten, die sich daraus ergeben, dass Sie eine andere Art der Lieferung als die von uns angebotene, günstigste Standardlieferung gewählt haben), unverzüglich und spätestens binnen vierzehn Tagen ab dem Tag zurückzuzahlen, an dem die Mitteilung über Ihren Widerruf dieses Vertrags bei uns eingegangen ist. Für diese Rückzahlung verwenden wir dasselbe Zahlungsmittel, das Sie bei der ursprünglichen Transaktion eingesetzt haben, es sei denn, mit Ihnen wurde ausdrücklich etwas anderes vereinbart; in keinem Fall werden Ihnen wegen dieser Rückzahlung Entgelte berechnet.",
      "Haben Sie verlangt, dass die Dienstleistungen während der Widerrufsfrist beginnen soll, so haben Sie uns einen angemessenen Betrag zu zahlen, der dem Anteil der bis zu dem Zeitpunkt, zu dem Sie uns von der Ausübung des Widerrufsrechts hinsichtlich dieses Vertrags unterrichten, bereits erbrachten Dienstleistungen im Vergleich zum Gesamtumfang der im Vertrag vorgesehenen Dienstleistungen entspricht.",
    ],
  },
];

export const MODEL_FORM_LINES = [
  "Muster-Widerrufsformular",
  "(Wenn Sie den Vertrag widerrufen wollen, dann füllen Sie bitte dieses Formular aus und senden Sie es zurück.)",
  `An: ${OPERATOR_CONTACT}`,
  "Hiermit widerrufe(n) ich/wir (*) den von mir/uns (*) abgeschlossenen Vertrag über die Erbringung der folgenden Dienstleistung: paukr Pro",
  "Bestellt am (*):",
  "Name des/der Verbraucher(s):",
  "Anschrift des/der Verbraucher(s):",
  "Unterschrift des/der Verbraucher(s) (nur bei Mitteilung auf Papier):",
  "Datum:",
  "(*) Unzutreffendes streichen.",
];

export const EARLY_START_CONSENT =
  "Ich verlange ausdrücklich, dass paukr mit der Leistung schon vor Ablauf der Widerrufsfrist beginnt. Mir ist bekannt, dass ich bei einem Widerruf einen anteiligen Betrag für die bis dahin erbrachte Leistung zahlen muss.";

export function contractConfirmationText(consentAt: string): string {
  const withdrawal = WITHDRAWAL_SECTIONS.flatMap((s) => [s.title, "", ...s.paragraphs.flatMap((p) => [p, ""])]);
  return [
    "Hallo,",
    "",
    "danke für deine Bestellung. Dies ist deine Vertragsbestätigung.",
    "",
    "Vertrag: paukr Pro, unbegrenzte Lernsitzungen, Simulationen und Blitz-Läufe",
    "Preis: 9,99 Euro pro Monat (Endpreis), monatlich im Voraus",
    "Laufzeit: ein Monat, verlängert sich automatisch um je einen Monat",
    "Kündigung: jederzeit zum Ende des bezahlten Monats, online unter https://www.paukr.app/kuendigen",
    `Anbieter: ${OPERATOR_CONTACT}`,
    "",
    `Deine Erklärung beim Kauf (${consentAt}):`,
    EARLY_START_CONSENT,
    "",
    "Es gelten die Nutzungsbedingungen: https://www.paukr.app/agb",
    "",
    "Widerrufsbelehrung",
    "",
    ...withdrawal,
    "Viele Grüße",
    "paukr",
  ].join("\n");
}
