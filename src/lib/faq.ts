import { FREE_TRY_LIMIT, PROBE_SIM_QUESTIONS, PROBE_SIM_SECONDS } from "./limits";

export const FAQ_GROUPS: { title: string; items: { question: string; answer: string }[] }[] = [
  {
    title: "Zu paukr",
    items: [
      {
        question: "Was ist paukr?",
        answer: "paukr ist eine Lernplattform mit Übungsfragen für Abschlussprüfungen in der Ausbildung. Du übst nach Themen, wiederholst falsch beantwortete Fragen, testest dich in Simulationen mit Zeitlimit und sammelst dabei XP.",
      },
      {
        question: "Für welche Berufe gibt es Übungsfragen?",
        answer: "Aktuell für neun Berufe, darunter Fachinformatiker Anwendungsentwicklung, Fachinformatiker Systemintegration, Industriekaufleute, Kaufleute für Büromanagement und Bankkaufleute. Die vollständige Liste steht auf der Seite Prüfungen.",
      },
      {
        question: "Sind das echte Prüfungsfragen?",
        answer: "Nein. Alle Fragen sind eigene Übungsfragen zu den Themen der Prüfung, keine Kopien von Original-Prüfungsaufgaben. Die Aufgaben in deiner Prüfung sehen anders aus.",
      },
      {
        question: "Gehört paukr zur IHK?",
        answer: "Nein. paukr ist ein unabhängiges Übungsangebot und hat keine Verbindung zu den Industrie- und Handelskammern, der DIHK, der AkA oder der ZPA.",
      },
      {
        question: "Reicht paukr als einzige Vorbereitung?",
        answer: "Darauf solltest du dich nicht verlassen. Mit paukr festigst du Wissen in Auswahlfragen. Offene Aufgaben, eigenen Code, Projektarbeit und Fachgespräch musst du zusätzlich üben. Eine Garantie zum Bestehen gibt es nicht.",
      },
    ],
  },
  {
    title: "Kosten und Vertrag",
    items: [
      {
        question: "Was kostet paukr?",
        answer: `Der Einstieg ist kostenlos und ohne Kreditkarte möglich, mit ${FREE_TRY_LIMIT} Lernsitzungen pro Prüfung. Pro kostet 9,99 Euro im Monat und hebt diese Grenze auf. Die Fragen sind in beiden Tarifen dieselben.`,
      },
      {
        question: "Kann ich Pro jederzeit kündigen?",
        answer: "Ja, Pro verlängert sich monatlich und ist jederzeit zum Monatsende kündbar. Das geht auch ohne Anmeldung über die Seite Verträge hier kündigen.",
      },
    ],
  },
  {
    title: "Zur Prüfung für Fachinformatiker Anwendungsentwicklung",
    items: [
      {
        question: "Was bedeuten AP1 und AP2?",
        answer: "So werden Teil 1 und Teil 2 der gestreckten Abschlussprüfung meist genannt. Teil 1 findet im vierten Ausbildungshalbjahr statt und zählt 20 Prozent, Teil 2 liegt am Ende der Ausbildung und zählt 80 Prozent.",
      },
      {
        question: "Welche Bereiche gehören zur AP2?",
        answer: "Planen und Umsetzen eines Softwareprojektes mit 50 Prozent, Planen eines Softwareproduktes, Entwicklung und Umsetzung von Algorithmen sowie Wirtschafts- und Sozialkunde mit jeweils 10 Prozent.",
      },
      {
        question: "Wie läuft die Simulation bei paukr ab?",
        answer: `In der Probe-Simulation beantwortest du ${PROBE_SIM_QUESTIONS} Fragen in ${PROBE_SIM_SECONDS / 60} Minuten und siehst das Ergebnis erst am Ende. Umfang und Zeit legen wir selbst fest, sie entsprechen nicht der echten Prüfung.`,
      },
    ],
  },
];
