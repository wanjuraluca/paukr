-- Third content batch: 20 more original FIAE Anwendungsentwicklung questions
-- across the same 4 topics. Written in the style of the IHK exam, NOT copied
-- from any real exam. Seeded as drafts (reviewed = false) pending expert
-- review, same as the earlier batches. New source_keys only, checked against
-- the existing 40-question pool for topic/content overlap before writing.

insert into questions (topic_id, source_key, question_text, explanation, difficulty, reviewed)
select t.id, v.source_key, v.q, v.expl, v.difficulty, false
from topics t
join exams e on e.id = t.exam_id and e.slug = 'fiae-ae'
join (values
  -- Datenbanken
  ('Datenbanken', 'db-view',
   'Was ist der Zweck einer Datenbank-View?',
   'Eine View ist eine virtuelle Tabelle, die auf einer gespeicherten Abfrage basiert. Sie vereinfacht wiederkehrende, komplexe Abfragen, ohne die zugrunde liegenden Daten zu duplizieren.',
   2),
  ('Datenbanken', 'db-normalization-1nf',
   'Welche Bedingung muss erfüllt sein, damit eine Relation in der 1. Normalform (1NF) vorliegt?',
   'Die 1NF verlangt atomare, unteilbare Attributwerte und keine Wiederholungsgruppen innerhalb einer Zeile.',
   1),
  ('Datenbanken', 'db-deadlock',
   'Was versteht man unter einem Deadlock bei Datenbanktransaktionen?',
   'Ein Deadlock entsteht, wenn zwei oder mehr Transaktionen sich gegenseitig blockieren, weil jede auf eine Sperre wartet, die eine andere hält.',
   3),
  ('Datenbanken', 'db-er-cardinality',
   'Was beschreibt die Kardinalität in einem Entity-Relationship-Modell?',
   'Die Kardinalität gibt an, in welcher Anzahl Beziehung eine Entität mit einer anderen stehen kann, z. B. 1:1, 1:n oder m:n.',
   2),
  ('Datenbanken', 'db-backup-incremental',
   'Was zeichnet ein inkrementelles Backup gegenüber einem Vollbackup aus?',
   'Ein inkrementelles Backup sichert nur die Änderungen seit dem letzten Backup, nicht den kompletten Datenbestand, und spart dadurch Zeit und Speicherplatz.',
   2),
  -- Programmierung
  ('Programmierung', 'prog-abstraction',
   'Was beschreibt das Prinzip der Abstraktion in der objektorientierten Programmierung?',
   'Abstraktion reduziert ein Objekt auf seine wesentlichen Eigenschaften und sein wesentliches Verhalten und blendet nicht relevante Details aus.',
   2),
  ('Programmierung', 'prog-interface',
   'Welchen Zweck erfüllt ein Interface in der objektorientierten Programmierung?',
   'Ein Interface definiert einen Vertrag aus Methoden, die implementierende Klassen bereitstellen müssen, ohne selbst eine Implementierung vorzugeben.',
   2),
  ('Programmierung', 'prog-unit-test',
   'Was ist das Ziel eines Unit-Tests?',
   'Ein Unit-Test prüft die kleinste testbare Einheit eines Programms, meist eine einzelne Funktion oder Methode, isoliert auf korrektes Verhalten.',
   1),
  ('Programmierung', 'prog-git-branch',
   'Wozu dient ein Branch (Zweig) in einem Versionskontrollsystem wie Git?',
   'Ein Branch ermöglicht parallele, isolierte Entwicklung, ohne den Hauptentwicklungsstand (z. B. main) zu beeinflussen, bis die Änderungen zusammengeführt werden.',
   1),
  ('Programmierung', 'prog-arraylist-index',
   'Bei welchem Index beginnt die Zählung in den meisten array-basierten Datenstrukturen wie Java-Arrays?',
   'Die Indizierung beginnt bei 0, das erste Element hat also den Index 0.',
   1),
  -- Netzwerke
  ('Netzwerke', 'net-dhcp',
   'Welche Aufgabe hat DHCP in einem Netzwerk?',
   'DHCP (Dynamic Host Configuration Protocol) vergibt automatisch IP-Adressen und weitere Netzwerkkonfiguration an Clients.',
   1),
  ('Netzwerke', 'net-https-port',
   'Welchen Standardport nutzt HTTPS?',
   'HTTPS nutzt standardmäßig Port 443. HTTP nutzt Port 80.',
   1),
  ('Netzwerke', 'net-switch-layer',
   'Auf welcher OSI-Schicht arbeitet ein klassischer, nicht verwalteter Switch primär?',
   'Ein einfacher Switch trifft Weiterleitungsentscheidungen anhand von MAC-Adressen und arbeitet damit auf Schicht 2, der Sicherungsschicht.',
   2),
  ('Netzwerke', 'net-nat',
   'Welche Aufgabe erfüllt NAT (Network Address Translation)?',
   'NAT übersetzt private IP-Adressen eines lokalen Netzes in eine öffentliche IP-Adresse für die Kommunikation im Internet.',
   2),
  ('Netzwerke', 'net-wlan-standard',
   'Welche Familie von Standards definiert die Übertragungstechniken für WLAN?',
   'WLAN-Übertragungstechniken sind in der Standardfamilie IEEE 802.11 definiert.',
   1),
  -- Wirtschafts- & Sozialkunde
  ('Wirtschafts- & Sozialkunde', 'wiso-ausbildungsvertrag',
   'Wer sind die Vertragsparteien eines Berufsausbildungsvertrags?',
   'Vertragsparteien sind der Ausbildungsbetrieb und der oder die Auszubildende; bei Minderjährigen unterschreibt zusätzlich der gesetzliche Vertreter.',
   2),
  ('Wirtschafts- & Sozialkunde', 'wiso-ihk-pruefungsausschuss',
   'Wer nimmt die Abschlussprüfung bei der IHK ab?',
   'Ein von der IHK berufener, paritätisch mit Arbeitgeber- und Arbeitnehmervertretern sowie einer Lehrkraft besetzter Prüfungsausschuss.',
   2),
  ('Wirtschafts- & Sozialkunde', 'wiso-ug',
   'Welche Aussage zur Unternehmergesellschaft (UG, haftungsbeschränkt) ist zutreffend?',
   'Die UG kann bereits mit einem Stammkapital ab 1 Euro gegründet werden, muss aber einen Teil des Jahresgewinns als Rücklage bilden, bis das GmbH-Mindestkapital erreicht ist.',
   3),
  ('Wirtschafts- & Sozialkunde', 'wiso-kuendigung-schriftform',
   'In welcher Form muss die Kündigung eines Arbeitsverhältnisses erfolgen?',
   'Nach § 623 BGB ist für eine Kündigung die Schriftform erforderlich; eine mündliche oder rein elektronische Kündigung ist unwirksam.',
   2),
  ('Wirtschafts- & Sozialkunde', 'wiso-mitbestimmung-brg',
   'Auf welcher gesetzlichen Grundlage basiert die betriebliche Mitbestimmung des Betriebsrats?',
   'Die Mitbestimmungsrechte des Betriebsrats sind im Betriebsverfassungsgesetz (BetrVG) geregelt.',
   2)
) as v(topic_name, source_key, q, expl, difficulty) on t.name = v.topic_name;

-- Answer options (option 0 sort first). is_correct marks the right answer.
insert into answer_options (question_id, option_text, is_correct, sort_order)
select q.id, v.text, v.is_correct, v.sort_order
from questions q
join (values
  -- db-view
  ('db-view', 'Eine virtuelle Tabelle auf Basis einer gespeicherten Abfrage', true, 0),
  ('db-view', 'Eine physische Kopie einer Tabelle', false, 1),
  ('db-view', 'Ein Index zur Beschleunigung von Abfragen', false, 2),
  ('db-view', 'Ein Backup-Mechanismus für Tabellen', false, 3),
  -- db-normalization-1nf
  ('db-normalization-1nf', 'Atomare Attributwerte, keine Wiederholungsgruppen', true, 0),
  ('db-normalization-1nf', 'Keine transitiven Abhängigkeiten', false, 1),
  ('db-normalization-1nf', 'Volle funktionale Abhängigkeit vom Primärschlüssel', false, 2),
  ('db-normalization-1nf', 'Jede Determinante ist ein Schlüsselkandidat', false, 3),
  -- db-deadlock
  ('db-deadlock', 'Transaktionen blockieren sich gegenseitig durch wechselseitig gehaltene Sperren', true, 0),
  ('db-deadlock', 'Eine Transaktion wird ohne Grund abgebrochen', false, 1),
  ('db-deadlock', 'Zwei Transaktionen schreiben gleichzeitig denselben Wert', false, 2),
  ('db-deadlock', 'Eine Tabelle wird versehentlich gelöscht', false, 3),
  -- db-er-cardinality
  ('db-er-cardinality', 'Die Anzahl möglicher Beziehungen zwischen zwei Entitäten', true, 0),
  ('db-er-cardinality', 'Die Anzahl der Attribute einer Entität', false, 1),
  ('db-er-cardinality', 'Die Anzahl der Zeilen einer Tabelle', false, 2),
  ('db-er-cardinality', 'Die Anzahl der Indizes einer Tabelle', false, 3),
  -- db-backup-incremental
  ('db-backup-incremental', 'Es sichert nur die Änderungen seit dem letzten Backup', true, 0),
  ('db-backup-incremental', 'Es sichert immer den kompletten Datenbestand', false, 1),
  ('db-backup-incremental', 'Es läuft nur einmal im Jahr', false, 2),
  ('db-backup-incremental', 'Es ersetzt die Notwendigkeit von Transaktionen', false, 3),
  -- prog-abstraction
  ('prog-abstraction', 'Reduktion auf wesentliche Eigenschaften, Ausblendung von Details', true, 0),
  ('prog-abstraction', 'Verbergen des internen Zustands hinter Methoden', false, 1),
  ('prog-abstraction', 'Übernahme von Eigenschaften einer anderen Klasse', false, 2),
  ('prog-abstraction', 'Gleichzeitige Ausführung mehrerer Methoden', false, 3),
  -- prog-interface
  ('prog-interface', 'Es definiert einen Methoden-Vertrag ohne eigene Implementierung', true, 0),
  ('prog-interface', 'Es speichert den Zustand eines Objekts', false, 1),
  ('prog-interface', 'Es ersetzt die Notwendigkeit von Klassen', false, 2),
  ('prog-interface', 'Es führt Code automatisch parallel aus', false, 3),
  -- prog-unit-test
  ('prog-unit-test', 'Die kleinste testbare Einheit isoliert auf korrektes Verhalten prüfen', true, 0),
  ('prog-unit-test', 'Die gesamte Anwendung im Zusammenspiel testen', false, 1),
  ('prog-unit-test', 'Die Benutzeroberfläche auf Design prüfen', false, 2),
  ('prog-unit-test', 'Die Performance unter Volllast messen', false, 3),
  -- prog-git-branch
  ('prog-git-branch', 'Parallele, isolierte Entwicklung ohne den Hauptstand zu beeinflussen', true, 0),
  ('prog-git-branch', 'Automatisches Backup des gesamten Repositorys', false, 1),
  ('prog-git-branch', 'Verschlüsselung des Quellcodes', false, 2),
  ('prog-git-branch', 'Löschen alter Commits', false, 3),
  -- prog-arraylist-index
  ('prog-arraylist-index', '0', true, 0),
  ('prog-arraylist-index', '1', false, 1),
  ('prog-arraylist-index', '-1', false, 2),
  ('prog-arraylist-index', 'Beliebig, je nach Sprache', false, 3),
  -- net-dhcp
  ('net-dhcp', 'Automatische Vergabe von IP-Adressen und Netzwerkkonfiguration', true, 0),
  ('net-dhcp', 'Auflösung von Domainnamen in IP-Adressen', false, 1),
  ('net-dhcp', 'Verschlüsselung des Datenverkehrs', false, 2),
  ('net-dhcp', 'Filterung von Netzwerkverkehr nach Regeln', false, 3),
  -- net-https-port
  ('net-https-port', '443', true, 0),
  ('net-https-port', '80', false, 1),
  ('net-https-port', '21', false, 2),
  ('net-https-port', '25', false, 3),
  -- net-switch-layer
  ('net-switch-layer', 'Schicht 2, Sicherungsschicht', true, 0),
  ('net-switch-layer', 'Schicht 3, Vermittlungsschicht', false, 1),
  ('net-switch-layer', 'Schicht 4, Transportschicht', false, 2),
  ('net-switch-layer', 'Schicht 7, Anwendungsschicht', false, 3),
  -- net-nat
  ('net-nat', 'Es übersetzt private IP-Adressen in eine öffentliche IP-Adresse', true, 0),
  ('net-nat', 'Es vergibt automatisch IP-Adressen an Clients', false, 1),
  ('net-nat', 'Es löst Domainnamen in IP-Adressen auf', false, 2),
  ('net-nat', 'Es verschlüsselt den gesamten Netzwerkverkehr', false, 3),
  -- net-wlan-standard
  ('net-wlan-standard', 'IEEE 802.11', true, 0),
  ('net-wlan-standard', 'IEEE 802.3', false, 1),
  ('net-wlan-standard', 'IEEE 802.1Q', false, 2),
  ('net-wlan-standard', 'RFC 1918', false, 3),
  -- wiso-ausbildungsvertrag
  ('wiso-ausbildungsvertrag', 'Ausbildungsbetrieb und Auszubildende(r)', true, 0),
  ('wiso-ausbildungsvertrag', 'Nur die Berufsschule und der Betrieb', false, 1),
  ('wiso-ausbildungsvertrag', 'Die IHK und der Auszubildende', false, 2),
  ('wiso-ausbildungsvertrag', 'Der Betriebsrat und der Betrieb', false, 3),
  -- wiso-ihk-pruefungsausschuss
  ('wiso-ihk-pruefungsausschuss', 'Ein paritätisch besetzter Prüfungsausschuss der IHK', true, 0),
  ('wiso-ihk-pruefungsausschuss', 'Der Ausbildungsbetrieb allein', false, 1),
  ('wiso-ihk-pruefungsausschuss', 'Das zuständige Bundesministerium', false, 2),
  ('wiso-ihk-pruefungsausschuss', 'Die Berufsschule allein', false, 3),
  -- wiso-ug
  ('wiso-ug', 'Gründung ab 1 Euro Stammkapital, mit Pflicht zur Rücklagenbildung', true, 0),
  ('wiso-ug', 'Mindeststammkapital von 25.000 Euro wie bei der GmbH', false, 1),
  ('wiso-ug', 'Unbeschränkte persönliche Haftung der Gründer', false, 2),
  ('wiso-ug', 'Keine Eintragung ins Handelsregister nötig', false, 3),
  -- wiso-kuendigung-schriftform
  ('wiso-kuendigung-schriftform', 'Schriftform nach § 623 BGB', true, 0),
  ('wiso-kuendigung-schriftform', 'Mündliche Kündigung reicht aus', false, 1),
  ('wiso-kuendigung-schriftform', 'Kündigung per E-Mail ist ausreichend', false, 2),
  ('wiso-kuendigung-schriftform', 'Es gibt keine Formvorschrift', false, 3),
  -- wiso-mitbestimmung-brg
  ('wiso-mitbestimmung-brg', 'Betriebsverfassungsgesetz (BetrVG)', true, 0),
  ('wiso-mitbestimmung-brg', 'Berufsbildungsgesetz (BBiG)', false, 1),
  ('wiso-mitbestimmung-brg', 'Bürgerliches Gesetzbuch (BGB)', false, 2),
  ('wiso-mitbestimmung-brg', 'Gewerbeordnung (GewO)', false, 3)
) as v(source_key, text, is_correct, sort_order) on v.source_key = q.source_key;
