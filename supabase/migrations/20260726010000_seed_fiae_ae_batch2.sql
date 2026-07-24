-- Second content batch: 20 more original FIAE Anwendungsentwicklung questions
-- across the same 4 topics. Written in the style of the IHK exam, NOT copied
-- from any real exam. Seeded as drafts (reviewed = false) pending expert
-- review, same as the pilot batch.

insert into questions (topic_id, source_key, question_text, explanation, difficulty, reviewed)
select t.id, v.source_key, v.q, v.expl, v.difficulty, false
from topics t
join exams e on e.id = t.exam_id and e.slug = 'fiae-ae'
join (values
  -- Datenbanken
  ('Datenbanken', 'db-normalization-goal',
   'Was ist das Hauptziel der Normalisierung einer relationalen Datenbank?',
   'Normalisierung soll Redundanzen vermeiden und Anomalien beim Einfügen, Ändern und Löschen von Daten verhindern.',
   2),
  ('Datenbanken', 'db-primary-key',
   'Welche Eigenschaft muss ein Primärschlüssel in einer relationalen Tabelle erfüllen?',
   'Ein Primärschlüssel identifiziert jede Zeile eindeutig und darf keinen NULL-Wert enthalten.',
   1),
  ('Datenbanken', 'db-transaction-atomicity',
   'Wofür steht das "A" in den ACID-Eigenschaften einer Datenbanktransaktion?',
   'Atomicity bedeutet, dass eine Transaktion entweder vollständig oder gar nicht ausgeführt wird.',
   1),
  ('Datenbanken', 'db-index',
   'Welchen Zweck erfüllt ein Index in einer Datenbanktabelle primär?',
   'Ein Index beschleunigt das Suchen und Filtern von Datensätzen, kostet dafür aber zusätzlichen Speicherplatz und etwas Schreibaufwand.',
   2),
  ('Datenbanken', 'db-sql-injection',
   'Wie schützt sich eine Anwendung wirksam vor SQL-Injection?',
   'Parametrisierte Abfragen (Prepared Statements) trennen SQL-Code und Nutzereingabe strikt, sodass Eingaben nicht als Code interpretiert werden.',
   3),
  -- Programmierung
  ('Programmierung', 'prog-oop-inheritance',
   'Was ermöglicht das Prinzip der Vererbung in der objektorientierten Programmierung?',
   'Eine Klasse (Unterklasse) übernimmt Eigenschaften und Methoden einer anderen Klasse (Oberklasse) und kann sie erweitern oder überschreiben.',
   1),
  ('Programmierung', 'prog-oop-polymorphism',
   'Was beschreibt das Prinzip der Polymorphie in der objektorientierten Programmierung?',
   'Ein und derselbe Methodenaufruf verhält sich je nach tatsächlichem Objekttyp unterschiedlich.',
   2),
  ('Programmierung', 'prog-queue-fifo',
   'Nach welchem Prinzip verwaltet eine Warteschlange (Queue) ihre Elemente?',
   'Eine Queue arbeitet nach dem FIFO-Prinzip (First In, First Out): Das zuerst eingefügte Element wird zuerst entnommen.',
   1),
  ('Programmierung', 'prog-bigo-nested-loop',
   'Welche Zeitkomplexität hat ein Algorithmus mit zwei ineinander verschachtelten Schleifen, die jeweils vollständig über n Elemente laufen?',
   'Für jedes der n Elemente der äußeren Schleife läuft die innere Schleife nochmal über n Elemente, macht in Summe n·n Schritte, also O(n²).',
   2),
  ('Programmierung', 'prog-nullpointer',
   'Was verursacht typischerweise einen NullPointerException-artigen Laufzeitfehler?',
   'Der Zugriff auf eine Methode oder Eigenschaft über eine Objektreferenz, die auf nichts (null) verweist.',
   2),
  -- Netzwerke
  ('Netzwerke', 'net-http-status',
   'Welche HTTP-Statuscode-Klasse zeigt einen clientseitigen Fehler an?',
   '4xx-Statuscodes (z. B. 404 Not Found) signalisieren einen Fehler auf Seiten des Clients. 5xx steht für Serverfehler.',
   1),
  ('Netzwerke', 'net-mac-layer',
   'Auf welcher OSI-Schicht wird die MAC-Adresse zur Adressierung verwendet?',
   'Die MAC-Adresse wird auf Schicht 2, der Sicherungsschicht (Data Link Layer), zur Adressierung innerhalb eines lokalen Netzsegments genutzt.',
   2),
  ('Netzwerke', 'net-firewall',
   'Welche Hauptaufgabe hat eine Firewall in einem Netzwerk?',
   'Eine Firewall filtert ein- und ausgehenden Netzwerkverkehr anhand definierter Regeln und blockiert unerwünschte Verbindungen.',
   1),
  ('Netzwerke', 'net-vpn',
   'Welchen Zweck erfüllt ein VPN (Virtual Private Network) primär?',
   'Ein VPN baut eine verschlüsselte Verbindung über ein öffentliches Netz auf, sodass die Kommunikation wie in einem privaten Netz geschützt ist.',
   2),
  ('Netzwerke', 'net-ping-icmp',
   'Welches Protokoll nutzt der Befehl "ping" zur Erreichbarkeitsprüfung?',
   'ping basiert auf ICMP (Internet Control Message Protocol) und sendet Echo-Request-/Echo-Reply-Nachrichten.',
   1),
  -- Wirtschafts- & Sozialkunde
  ('Wirtschafts- & Sozialkunde', 'wiso-kuendigungsfrist',
   'Welche Kündigungsfrist gilt während der Probezeit im Berufsausbildungsverhältnis?',
   'Während der Probezeit kann das Ausbildungsverhältnis nach § 22 BBiG ohne Einhaltung einer Frist gekündigt werden.',
   2),
  ('Wirtschafts- & Sozialkunde', 'wiso-tarifvertrag',
   'Wer schließt einen Tarifvertrag ab?',
   'Tarifverträge werden zwischen Gewerkschaften und einzelnen Arbeitgebern oder Arbeitgeberverbänden ausgehandelt.',
   2),
  ('Wirtschafts- & Sozialkunde', 'wiso-betriebsrat',
   'Wodurch wird ein Betriebsrat in einem Betrieb gebildet?',
   'Der Betriebsrat wird von den Arbeitnehmerinnen und Arbeitnehmern des Betriebs gewählt (ab der gesetzlich vorgesehenen Mindestbetriebsgröße).',
   2),
  ('Wirtschafts- & Sozialkunde', 'wiso-sozialversicherung',
   'Welche der folgenden Versicherungen zählt zu den Zweigen der gesetzlichen Sozialversicherung in Deutschland?',
   'Die gesetzliche Sozialversicherung umfasst Kranken-, Renten-, Pflege-, Unfall- und Arbeitslosenversicherung. Kasko-, Hausrat- und Rechtsschutzversicherung sind private Versicherungen.',
   2),
  ('Wirtschafts- & Sozialkunde', 'wiso-berufsschulpflicht',
   'Wie werden Berufsschulzeiten während der dualen Ausbildung behandelt?',
   'Berufsschulzeiten gelten als Arbeitszeit und werden auf die Ausbildung angerechnet; Auszubildende werden dafür freigestellt.',
   2)
) as v(topic_name, source_key, q, expl, difficulty) on t.name = v.topic_name;

-- Answer options (option 0 sort first). is_correct marks the right answer.
insert into answer_options (question_id, option_text, is_correct, sort_order)
select q.id, v.text, v.is_correct, v.sort_order
from questions q
join (values
  -- db-normalization-goal
  ('db-normalization-goal', 'Redundanzen vermeiden und Anomalien verhindern', true, 0),
  ('db-normalization-goal', 'Abfragen durch gezielte Duplizierung beschleunigen', false, 1),
  ('db-normalization-goal', 'Die Anzahl der Tabellen minimieren', false, 2),
  ('db-normalization-goal', 'Indizes überflüssig machen', false, 3),
  -- db-primary-key
  ('db-primary-key', 'Er identifiziert jede Zeile eindeutig und darf nicht NULL sein', true, 0),
  ('db-primary-key', 'Er darf in mehreren Zeilen denselben Wert haben', false, 1),
  ('db-primary-key', 'Er muss aus einer anderen Tabelle stammen', false, 2),
  ('db-primary-key', 'Er muss zugleich ein Fremdschlüssel sein', false, 3),
  -- db-transaction-atomicity
  ('db-transaction-atomicity', 'Atomicity, Alles-oder-nichts-Ausführung', true, 0),
  ('db-transaction-atomicity', 'Access, kontrollierter Zugriff', false, 1),
  ('db-transaction-atomicity', 'Aggregation von Werten', false, 2),
  ('db-transaction-atomicity', 'Architecture der Datenbank', false, 3),
  -- db-index
  ('db-index', 'Er beschleunigt das Suchen und Filtern von Datensätzen', true, 0),
  ('db-index', 'Er erzwingt referenzielle Integrität zwischen Tabellen', false, 1),
  ('db-index', 'Er verschlüsselt die gespeicherten Daten', false, 2),
  ('db-index', 'Er verhindert automatisch alle doppelten Werte', false, 3),
  -- db-sql-injection
  ('db-sql-injection', 'Durch parametrisierte Abfragen (Prepared Statements)', true, 0),
  ('db-sql-injection', 'Durch direktes Verketten von Nutzereingaben im SQL-String', false, 1),
  ('db-sql-injection', 'Durch längere Verbindungs-Timeouts', false, 2),
  ('db-sql-injection', 'Durch Verschlüsselung der Datenbankdatei', false, 3),
  -- prog-oop-inheritance
  ('prog-oop-inheritance', 'Eine Klasse übernimmt Eigenschaften und Methoden einer anderen Klasse', true, 0),
  ('prog-oop-inheritance', 'Mehrere Methoden mit gleichem Namen, aber unterschiedlichen Parametern', false, 1),
  ('prog-oop-inheritance', 'Das Verbergen des internen Zustands eines Objekts', false, 2),
  ('prog-oop-inheritance', 'Die gleichzeitige Ausführung mehrerer Threads', false, 3),
  -- prog-oop-polymorphism
  ('prog-oop-polymorphism', 'Ein Methodenaufruf verhält sich je nach tatsächlichem Objekttyp unterschiedlich', true, 0),
  ('prog-oop-polymorphism', 'Das Verbergen der internen Implementierung eines Objekts', false, 1),
  ('prog-oop-polymorphism', 'Die Wiederverwendung von Code durch Vererbung', false, 2),
  ('prog-oop-polymorphism', 'Die Aufteilung eines Programms in mehrere Klassen', false, 3),
  -- prog-queue-fifo
  ('prog-queue-fifo', 'FIFO, First In, First Out', true, 0),
  ('prog-queue-fifo', 'LIFO, Last In, First Out', false, 1),
  ('prog-queue-fifo', 'Zufällige Reihenfolge', false, 2),
  ('prog-queue-fifo', 'Priorität nach Wichtigkeit', false, 3),
  -- prog-bigo-nested-loop
  ('prog-bigo-nested-loop', 'O(n²)', true, 0),
  ('prog-bigo-nested-loop', 'O(n log n)', false, 1),
  ('prog-bigo-nested-loop', 'O(2n)', false, 2),
  ('prog-bigo-nested-loop', 'O(log n)', false, 3),
  -- prog-nullpointer
  ('prog-nullpointer', 'Der Zugriff über eine Referenz, die auf null verweist', true, 0),
  ('prog-nullpointer', 'Eine Division durch eine positive Zahl', false, 1),
  ('prog-nullpointer', 'Eine Variable ohne Initialisierung in derselben Zeile', false, 2),
  ('prog-nullpointer', 'Ein zu kurzer Variablenname', false, 3),
  -- net-http-status
  ('net-http-status', '4xx', true, 0),
  ('net-http-status', '2xx', false, 1),
  ('net-http-status', '3xx', false, 2),
  ('net-http-status', '5xx', false, 3),
  -- net-mac-layer
  ('net-mac-layer', 'Schicht 2, Sicherungsschicht', true, 0),
  ('net-mac-layer', 'Schicht 3, Vermittlungsschicht', false, 1),
  ('net-mac-layer', 'Schicht 4, Transportschicht', false, 2),
  ('net-mac-layer', 'Schicht 1, Bitübertragungsschicht', false, 3),
  -- net-firewall
  ('net-firewall', 'Sie filtert Netzwerkverkehr anhand definierter Regeln', true, 0),
  ('net-firewall', 'Sie löst Domainnamen in IP-Adressen auf', false, 1),
  ('net-firewall', 'Sie vergibt automatisch IP-Adressen an Clients', false, 2),
  ('net-firewall', 'Sie komprimiert übertragene Daten', false, 3),
  -- net-vpn
  ('net-vpn', 'Es stellt eine verschlüsselte Verbindung über ein öffentliches Netz her', true, 0),
  ('net-vpn', 'Es beschleunigt DNS-Anfragen', false, 1),
  ('net-vpn', 'Es ersetzt die Notwendigkeit einer Firewall', false, 2),
  ('net-vpn', 'Es vergibt statische MAC-Adressen', false, 3),
  -- net-ping-icmp
  ('net-ping-icmp', 'ICMP', true, 0),
  ('net-ping-icmp', 'TCP', false, 1),
  ('net-ping-icmp', 'FTP', false, 2),
  ('net-ping-icmp', 'SMTP', false, 3),
  -- wiso-kuendigungsfrist
  ('wiso-kuendigungsfrist', 'Fristlose Kündigung ist jederzeit möglich', true, 0),
  ('wiso-kuendigungsfrist', 'Es gilt eine Frist von 4 Wochen', false, 1),
  ('wiso-kuendigungsfrist', 'Es gilt eine Frist von 3 Monaten', false, 2),
  ('wiso-kuendigungsfrist', 'Eine Kündigung ist während der Probezeit ausgeschlossen', false, 3),
  -- wiso-tarifvertrag
  ('wiso-tarifvertrag', 'Gewerkschaften und Arbeitgeber bzw. Arbeitgeberverbände', true, 0),
  ('wiso-tarifvertrag', 'Der Betriebsrat und die Geschäftsführung', false, 1),
  ('wiso-tarifvertrag', 'Der einzelne Arbeitnehmer und sein Vorgesetzter', false, 2),
  ('wiso-tarifvertrag', 'Die IHK und das Bundesministerium', false, 3),
  -- wiso-betriebsrat
  ('wiso-betriebsrat', 'Durch Wahl der Arbeitnehmerinnen und Arbeitnehmer des Betriebs', true, 0),
  ('wiso-betriebsrat', 'Durch Ernennung des Arbeitgebers', false, 1),
  ('wiso-betriebsrat', 'Durch Beschluss der zuständigen IHK', false, 2),
  ('wiso-betriebsrat', 'Durch das Finanzamt', false, 3),
  -- wiso-sozialversicherung
  ('wiso-sozialversicherung', 'Pflegeversicherung', true, 0),
  ('wiso-sozialversicherung', 'Kaskoversicherung', false, 1),
  ('wiso-sozialversicherung', 'Hausratversicherung', false, 2),
  ('wiso-sozialversicherung', 'Rechtsschutzversicherung', false, 3),
  -- wiso-berufsschulpflicht
  ('wiso-berufsschulpflicht', 'Sie gelten als Arbeitszeit und werden angerechnet', true, 0),
  ('wiso-berufsschulpflicht', 'Sie müssen in der Freizeit nachgeholt werden', false, 1),
  ('wiso-berufsschulpflicht', 'Sie werden nicht vergütet', false, 2),
  ('wiso-berufsschulpflicht', 'Sie zählen nicht zur Ausbildungszeit', false, 3)
) as v(source_key, text, is_correct, sort_order) on v.source_key = q.source_key;
