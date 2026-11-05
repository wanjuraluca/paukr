// Facts follow the Fachinformatikerausbildungsverordnung (FIAusbV), sections 7 to 17.
export const FIAE_PATH = "/fachinformatiker-anwendungsentwicklung";
export const FIAE_SLUG = "fiae-ae";
export const LAW_URL = "https://www.gesetze-im-internet.de/fiausbv/BJNR025000020.html";

export const EXAM_PARTS = [
  { part: "AP1 (Teil 1)", area: "Einrichten eines IT-gestützten Arbeitsplatzes", form: "schriftlich", time: "90 Minuten", weight: "20 %", path: `${FIAE_PATH}/ap1` },
  { part: "AP2 (Teil 2)", area: "Planen und Umsetzen eines Softwareprojektes", form: "Projektarbeit, Präsentation, Fachgespräch", time: "höchstens 80 Stunden und 30 Minuten", weight: "50 %", path: "/ratgeber/betriebliche-projektarbeit" },
  { part: "AP2 (Teil 2)", area: "Planen eines Softwareproduktes", form: "schriftlich", time: "90 Minuten", weight: "10 %", path: `${FIAE_PATH}/ap2/planen-eines-softwareproduktes` },
  { part: "AP2 (Teil 2)", area: "Entwicklung und Umsetzung von Algorithmen", form: "schriftlich", time: "90 Minuten", weight: "10 %", path: `${FIAE_PATH}/ap2/entwicklung-und-umsetzung-von-algorithmen` },
  { part: "AP2 (Teil 2)", area: "Wirtschafts- und Sozialkunde", form: "schriftlich", time: "60 Minuten", weight: "10 %", path: `${FIAE_PATH}/ap2/wirtschafts-und-sozialkunde` },
];

export interface ExamArea {
  slug: string;
  title: string;
  description: string;
  heading: string;
  lead: string;
  facts: string;
  skillsIntro: string;
  skills: string[];
  tipsHeading: string;
  tips: { title: string; text: string }[];
  samplesIntro: string;
  samples: { topic: string; keys: string[] }[];
  ctaTitle: string;
  ctaText: string;
}

export const EXAM_AREAS: ExamArea[] = [
  {
    slug: "planen-eines-softwareproduktes",
    title: "Planen eines Softwareproduktes: AP2 üben | paukr",
    description: "Was der AP2-Bereich Planen eines Softwareproduktes verlangt, wie viel er zählt und wie du dich gezielt darauf vorbereitest. Mit Beispielfragen.",
    heading: "Planen eines Softwareproduktes in der AP2",
    lead: "In diesem Prüfungsbereich zeigst du, dass du eine Anwendung durchdenken kannst, bevor die erste Zeile Code entsteht.",
    facts: "Schriftliche Prüfung mit praxisbezogenen Aufgaben, 90 Minuten, 10 % der Gesamtnote.",
    skillsIntro: "Laut Verordnung sollst du nachweisen, dass du",
    skills: [
      "Entwicklungsumgebungen und Bibliotheken auswählen und einsetzen kannst,",
      "Programmspezifikationen passend zur Anwendung festlegen kannst,",
      "Bedienoberflächen funktional und ergonomisch konzipieren kannst,",
      "Maßnahmen zur Qualitätskontrolle planen und durchführen kannst.",
    ],
    tipsHeading: "So bereitest du dich vor",
    tips: [
      { title: "Entscheidungen begründen", text: "Überlege bei Werkzeugen aus deinem Betrieb, warum gerade dieses Framework oder diese Bibliothek gewählt wurde. Eine Auswahl mit nachvollziehbaren Kriterien ist mehr wert als ein auswendig gelernter Name." },
      { title: "Spezifikationen selbst schreiben", text: "Nimm eine kleine Funktion aus deinem Alltag und beschreibe Eingaben, Ausgaben und Fehlerfälle. So merkst du schnell, wo eine Anforderung noch ungenau ist." },
      { title: "Oberflächen skizzieren", text: "Zeichne eine Maske auf Papier und frag dich, ob jemand ohne Erklärung damit zurechtkommt. Achte auf klare Beschriftungen, sinnvolle Reihenfolge und verständliche Fehlermeldungen." },
      { title: "Qualität mitplanen", text: "Überlege zu jeder Anforderung, woran du erkennst, dass sie erfüllt ist. Daraus entstehen fast von selbst Testfälle und Abnahmekriterien." },
    ],
    samplesIntro: "Passend zu Qualitätskontrolle und Modellierung haben wir diese Fragen ausgewählt. Sie bilden nicht die Aufgabenform der Prüfung ab, helfen aber beim Festigen der Grundlagen.",
    samples: [{ topic: "Programmierung", keys: ["prog-code-review", "prog-unit-test", "prog-single-regression-test", "prog-single-uml-vererbung-notation"] }],
    ctaTitle: "Grundlagen für die AP2 festigen",
    ctaText: "Übe die Programmierfragen in deinem Tempo. Was du falsch beantwortest, kommt später wieder.",
  },
  {
    slug: "entwicklung-und-umsetzung-von-algorithmen",
    title: "Entwicklung und Umsetzung von Algorithmen: AP2 | paukr",
    description: "Algorithmen, Testdaten und SQL in der AP2 für Fachinformatiker Anwendungsentwicklung: Anforderungen, Gewichtung, Lerntipps und Beispielfragen.",
    heading: "Entwicklung und Umsetzung von Algorithmen in der AP2",
    lead: "Hier geht es ans Handwerk: Code lesen, Lösungen formulieren, Abläufe darstellen, Tests planen und Daten abfragen.",
    facts: "Schriftliche Prüfung mit praxisbezogenen Aufgaben, 90 Minuten, 10 % der Gesamtnote.",
    skillsIntro: "Laut Verordnung sollst du nachweisen, dass du",
    skills: [
      "Programmcode interpretieren und eine Lösung in einer Programmiersprache erstellen kannst,",
      "Algorithmen in eine Programmierlogik übertragen und grafisch darstellen kannst,",
      "Testszenarien auswählen und Testdaten erzeugen kannst,",
      "Abfragen zur Gewinnung und Änderung von Daten erstellen kannst.",
    ],
    tipsHeading: "So bereitest du dich vor",
    tips: [
      { title: "Code von Hand durchspielen", text: "Schreib dir für eine Schleife die Werte aller Variablen in eine Tabelle, Durchlauf für Durchlauf. Das trainiert genau das Lesen von Code ohne Entwicklungsumgebung, das eine schriftliche Prüfung verlangt." },
      { title: "Abläufe zeichnen", text: "Übertrage einen kurzen Algorithmus in ein Diagramm, etwa ein Struktogramm oder Aktivitätsdiagramm, und danach wieder zurück in Code. Welche Darstellung erwartet wird, steht in der jeweiligen Aufgabe." },
      { title: "An Grenzfälle denken", text: "Teste gedanklich leere Listen, Nullwerte und Werte genau an einer Grenze. Gute Testdaten decken genau diese Fälle ab." },
      { title: "SQL ohne Hilfe schreiben", text: "Übe SELECT mit JOIN und GROUP BY sowie INSERT, UPDATE und DELETE auf Papier. Ohne Autovervollständigung fallen Lücken sofort auf." },
    ],
    samplesIntro: "Diese Fragen zu Abläufen, Tests und SQL stammen aus unseren Themenbereichen Programmierung und Datenbanken. Eigenen Code schreiben und Diagramme zeichnen solltest du zusätzlich auf Papier üben.",
    samples: [
      { topic: "Programmierung", keys: ["prog-single-struktogramm", "prog-single-do-while", "prog-single-mock-objekt"] },
      { topic: "Datenbanken", keys: ["db-single-group-by", "db-having"] },
    ],
    ctaTitle: "Datenbanken und Programmierung üben",
    ctaText: "Starte mit dem Thema, das dir am schwersten fällt. Jede Frage hat eine Erklärung.",
  },
  {
    slug: "wirtschafts-und-sozialkunde",
    title: "WiSo-Prüfung Fachinformatiker: AP2 üben | paukr",
    description: "Die WiSo-Prüfung in der AP2 für Fachinformatiker: 60 Minuten, 10 % der Note. Typische Themen, Lerntipps und kostenlose Beispielfragen mit Lösung.",
    heading: "Wirtschafts- und Sozialkunde in der AP2",
    lead: "WiSo ist kein IT-Fach, zählt aber genauso viel wie die beiden anderen schriftlichen Bereiche der AP2. Mit regelmäßigen kurzen Einheiten kommst du gut durch den Stoff.",
    facts: "Schriftliche Prüfung mit praxisbezogenen Aufgaben, 60 Minuten, 10 % der Gesamtnote.",
    skillsIntro: "Laut Verordnung sollst du allgemeine wirtschaftliche und gesellschaftliche Zusammenhänge der Berufs- und Arbeitswelt darstellen und beurteilen können. Dazu passen zum Beispiel diese Themen:",
    skills: [
      "Ausbildungsvertrag, Rechte und Pflichten in der Ausbildung,",
      "Arbeitsrecht, Kündigung und Tarifverträge,",
      "Sozialversicherung und Mitbestimmung im Betrieb,",
      "Rechtsformen von Unternehmen und Grundbegriffe der Wirtschaft.",
    ],
    tipsHeading: "So bereitest du dich vor",
    tips: [
      { title: "Früh und in kleinen Portionen", text: "Viele WiSo-Inhalte sind Fakten und Begriffe. Die behältst du besser, wenn du über Wochen immer wieder kurz übst, statt alles am letzten Wochenende zu lernen." },
      { title: "Mit dem eigenen Betrieb verknüpfen", text: "Schau in deinen Ausbildungsvertrag, deine Gehaltsabrechnung und frag nach Betriebsrat oder Jugendvertretung. Was du im Alltag wiederfindest, vergisst du seltener." },
      { title: "Einen Rettungsanker kennen", text: "In WiSo ist unter bestimmten Bedingungen eine mündliche Ergänzungsprüfung möglich. Das ist aber kein Plan, sondern eine Absicherung. Die genauen Regeln stehen in der Verordnung." },
    ],
    samplesIntro: "Diese Fragen stammen direkt aus unserem Themenbereich Wirtschafts- und Sozialkunde.",
    samples: [{ topic: "Wirtschafts- & Sozialkunde", keys: ["wiso-kuendigungsfrist", "wiso-jav", "wiso-marktwirtschaft", "wiso-s-ruhepause", "wiso-gmbh"] }],
    ctaTitle: "WiSo in kurzen Einheiten üben",
    ctaText: "Übe Wirtschafts- und Sozialkunde mit Erklärungen zu jeder Frage. Falsche Antworten kommen automatisch wieder.",
  },
];
