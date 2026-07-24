-- Pilot content batch: 20 original FIAE Anwendungsentwicklung questions
-- across 4 topics. Written in the style of the IHK exam, NOT copied from any
-- real exam. Seeded as drafts (reviewed = false) pending expert review.

-- Remove the earlier UI placeholder exam.
delete from exams where slug = 'fiae-platzhalter';

insert into exams (slug, name, description, sort_order)
values (
  'fiae-ae',
  'IHK Anwendungsentwicklung',
  'Fachinformatiker/in — Abschlussprüfung Teil 2.',
  0
);

insert into topics (exam_id, slug, name, sort_order)
select e.id, x.slug, x.name, x.sort_order
from exams e,
  (values
    ('datenbanken', 'Datenbanken', 0),
    ('programmierung', 'Programmierung', 1),
    ('netzwerke', 'Netzwerke', 2),
    ('wiso', 'Wirtschafts- & Sozialkunde', 3)
  ) as x(slug, name, sort_order)
where e.slug = 'fiae-ae';

-- Questions (drafts).
insert into questions (topic_id, source_key, question_text, explanation, difficulty, reviewed)
select t.id, v.source_key, v.q, v.expl, v.difficulty, false
from topics t
join exams e on e.id = t.exam_id and e.slug = 'fiae-ae'
join (values
  -- Datenbanken
  ('Datenbanken', 'db-2nf',
   'Welche Bedingung muss zusätzlich zur 1. Normalform erfüllt sein, damit eine Relation in der 2. Normalform (2NF) vorliegt?',
   'Die 2NF verlangt, dass jedes Nichtschlüsselattribut voll funktional vom gesamten Primärschlüssel abhängt — sie beseitigt partielle Abhängigkeiten. Atomarität gehört zur 1NF, transitive Abhängigkeiten zur 3NF.',
   2),
  ('Datenbanken', 'db-3nf',
   'Welche Art von Abhängigkeit wird durch die Überführung in die 3. Normalform (3NF) beseitigt?',
   'Die 3NF beseitigt transitive Abhängigkeiten von Nichtschlüsselattributen, also Abhängigkeiten über ein anderes Nichtschlüsselattribut.',
   2),
  ('Datenbanken', 'db-join',
   'Welcher JOIN-Typ liefert alle Zeilen der linken Tabelle, auch wenn es rechts keine passende Zeile gibt?',
   'Der LEFT (OUTER) JOIN behält alle Zeilen der linken Tabelle; fehlende Werte aus der rechten Tabelle werden mit NULL aufgefüllt.',
   1),
  ('Datenbanken', 'db-having',
   'Mit welcher SQL-Klausel filtert man das Ergebnis einer Gruppierung anhand von Aggregatwerten?',
   'HAVING filtert nach GROUP BY auf Basis von Aggregatwerten. WHERE filtert dagegen einzelne Zeilen vor der Gruppierung.',
   2),
  ('Datenbanken', 'db-fk',
   'Welche Aufgabe erfüllt ein Fremdschlüssel (Foreign Key) in einer relationalen Datenbank?',
   'Ein Fremdschlüssel verweist auf den Primärschlüssel einer anderen Tabelle und sichert damit die referenzielle Integrität zwischen den Tabellen.',
   1),
  ('Datenbanken', 'db-acid-i',
   'Wofür steht das "I" in den ACID-Eigenschaften einer Datenbanktransaktion?',
   'ACID steht für Atomicity, Consistency, Isolation und Durability. Isolation bedeutet, dass sich nebenläufige Transaktionen nicht gegenseitig beeinflussen.',
   2),
  -- Programmierung
  ('Programmierung', 'prog-binary-search',
   'Welche Zeitkomplexität hat die binäre Suche in einem sortierten Array im schlechtesten Fall?',
   'Der Suchraum halbiert sich mit jedem Schritt, daraus ergibt sich eine logarithmische Laufzeit von O(log n).',
   2),
  ('Programmierung', 'prog-encapsulation',
   'Welches Prinzip der objektorientierten Programmierung beschreibt das Verbergen des internen Zustands hinter definierten Schnittstellen?',
   'Die Kapselung (Encapsulation) verbirgt den internen Zustand eines Objekts; der Zugriff erfolgt nur über definierte Methoden bzw. Schnittstellen.',
   2),
  ('Programmierung', 'prog-stack-lifo',
   'Nach welchem Prinzip verwaltet ein Stack (Stapel) seine Elemente?',
   'Ein Stack arbeitet nach dem LIFO-Prinzip (Last In, First Out): Das zuletzt abgelegte Element wird zuerst wieder entnommen.',
   1),
  ('Programmierung', 'prog-finally',
   'Was gilt für einen finally-Block in der strukturierten Ausnahmebehandlung?',
   'Der finally-Block wird unabhängig davon ausgeführt, ob eine Exception auftrat oder nicht — typischerweise für Aufräumarbeiten wie das Schließen von Ressourcen.',
   2),
  ('Programmierung', 'prog-recursion',
   'Was passiert typischerweise bei einer rekursiven Funktion ohne erreichbare Abbruchbedingung?',
   'Ohne Basisfall wächst der Aufrufstapel unbegrenzt weiter, bis der Speicher erschöpft ist — es kommt zu einem Stack Overflow.',
   2),
  ('Programmierung', 'prog-boolean',
   'Welchen Wahrheitswert liefert der Ausdruck !(true && false)?',
   'true && false ergibt false; die Negation davon ist true.',
   1),
  -- Netzwerke
  ('Netzwerke', 'net-osi-router',
   'Auf welcher OSI-Schicht arbeitet ein Router primär?',
   'Ein Router trifft Weiterleitungsentscheidungen anhand von IP-Adressen und arbeitet damit auf der Vermittlungsschicht (Layer 3).',
   2),
  ('Netzwerke', 'net-tcp',
   'Welche Aussage über TCP im Vergleich zu UDP ist zutreffend?',
   'TCP ist verbindungsorientiert und stellt eine zuverlässige, geordnete Zustellung sicher. UDP ist verbindungslos, leichtgewichtiger und ohne diese Garantien.',
   2),
  ('Netzwerke', 'net-private-ip',
   'Welcher der folgenden Adressbereiche ist ein privater IPv4-Bereich nach RFC 1918?',
   'RFC 1918 definiert die privaten Bereiche 10.0.0.0/8, 172.16.0.0/12 und 192.168.0.0/16. 172.8.0.0 und 100.64.0.0/10 (CGNAT) gehören nicht dazu.',
   3),
  ('Netzwerke', 'net-dns',
   'Welche Aufgabe hat das Domain Name System (DNS)?',
   'DNS löst Domainnamen (z. B. example.com) in IP-Adressen auf. Die Adressvergabe übernimmt DHCP, die Verschlüsselung von Webverkehr TLS.',
   1),
  ('Netzwerke', 'net-subnet-29',
   'Wie viele nutzbare Hostadressen bietet ein IPv4-Subnetz mit der Präfixlänge /29?',
   'Ein /29-Netz umfasst 2^(32-29) = 8 Adressen. Abzüglich Netz- und Broadcast-Adresse bleiben 6 nutzbare Hostadressen.',
   3),
  -- Wirtschafts- & Sozialkunde
  ('Wirtschafts- & Sozialkunde', 'wiso-probezeit',
   'Wie lange darf die Probezeit in einem Berufsausbildungsverhältnis nach dem Berufsbildungsgesetz (BBiG) höchstens dauern?',
   'Nach § 20 BBiG beträgt die Probezeit im Ausbildungsverhältnis mindestens einen und höchstens vier Monate.',
   2),
  ('Wirtschafts- & Sozialkunde', 'wiso-jav',
   'Welche Aufgabe hat die Jugend- und Auszubildendenvertretung (JAV) in einem Betrieb?',
   'Die JAV vertritt die Interessen der jugendlichen Beschäftigten und der Auszubildenden gegenüber Arbeitgeber und Betriebsrat.',
   2),
  ('Wirtschafts- & Sozialkunde', 'wiso-gmbh',
   'Welche Aussage zur Rechtsform GmbH ist zutreffend?',
   'Die GmbH ist eine Kapitalgesellschaft; die Haftung ist grundsätzlich auf das Gesellschaftsvermögen beschränkt. Das Mindeststammkapital beträgt 25.000 €.',
   2)
) as v(topic_name, source_key, q, expl, difficulty) on t.name = v.topic_name;

-- Answer options (option 0 sort first). is_correct marks the right answer.
insert into answer_options (question_id, option_text, is_correct, sort_order)
select q.id, v.text, v.is_correct, v.sort_order
from questions q
join (values
  -- db-2nf
  ('db-2nf', 'Jedes Nichtschlüsselattribut hängt voll funktional vom gesamten Primärschlüssel ab', true, 0),
  ('db-2nf', 'Alle Attributwerte sind atomar', false, 1),
  ('db-2nf', 'Es existieren keine transitiven Abhängigkeiten', false, 2),
  ('db-2nf', 'Jede Determinante ist ein Schlüsselkandidat', false, 3),
  -- db-3nf
  ('db-3nf', 'Transitive Abhängigkeiten von Nichtschlüsselattributen', true, 0),
  ('db-3nf', 'Partielle Abhängigkeiten vom Primärschlüssel', false, 1),
  ('db-3nf', 'Nicht-atomare Attributwerte', false, 2),
  ('db-3nf', 'Fehlende Primärschlüssel', false, 3),
  -- db-join
  ('db-join', 'INNER JOIN', false, 0),
  ('db-join', 'LEFT (OUTER) JOIN', true, 1),
  ('db-join', 'CROSS JOIN', false, 2),
  ('db-join', 'RIGHT (OUTER) JOIN', false, 3),
  -- db-having
  ('db-having', 'WHERE', false, 0),
  ('db-having', 'HAVING', true, 1),
  ('db-having', 'GROUP BY', false, 2),
  ('db-having', 'ORDER BY', false, 3),
  -- db-fk
  ('db-fk', 'Er sichert die referenzielle Integrität zwischen zwei Tabellen', true, 0),
  ('db-fk', 'Er indiziert automatisch alle Spalten der Tabelle', false, 1),
  ('db-fk', 'Er verschlüsselt die Primärschlüsselspalte', false, 2),
  ('db-fk', 'Er erzwingt atomare Attributwerte', false, 3),
  -- db-acid-i
  ('db-acid-i', 'Isolation', true, 0),
  ('db-acid-i', 'Integrität', false, 1),
  ('db-acid-i', 'Index', false, 2),
  ('db-acid-i', 'Instanz', false, 3),
  -- prog-binary-search
  ('prog-binary-search', 'O(log n)', true, 0),
  ('prog-binary-search', 'O(n)', false, 1),
  ('prog-binary-search', 'O(1)', false, 2),
  ('prog-binary-search', 'O(n²)', false, 3),
  -- prog-encapsulation
  ('prog-encapsulation', 'Kapselung', true, 0),
  ('prog-encapsulation', 'Vererbung', false, 1),
  ('prog-encapsulation', 'Polymorphie', false, 2),
  ('prog-encapsulation', 'Abstraktion', false, 3),
  -- prog-stack-lifo
  ('prog-stack-lifo', 'LIFO — Last In, First Out', true, 0),
  ('prog-stack-lifo', 'FIFO — First In, First Out', false, 1),
  ('prog-stack-lifo', 'Round Robin', false, 2),
  ('prog-stack-lifo', 'Priority First', false, 3),
  -- prog-finally
  ('prog-finally', 'Er wird ausgeführt, egal ob eine Exception auftrat oder nicht', true, 0),
  ('prog-finally', 'Er wird nur ausgeführt, wenn eine Exception auftrat', false, 1),
  ('prog-finally', 'Er unterdrückt alle auftretenden Exceptions', false, 2),
  ('prog-finally', 'Er ersetzt den catch-Block', false, 3),
  -- prog-recursion
  ('prog-recursion', 'Es kommt zu einem Stack Overflow', true, 0),
  ('prog-recursion', 'Die Funktion liefert immer den Wert 0', false, 1),
  ('prog-recursion', 'Der Compiler entfernt die Funktion automatisch', false, 2),
  ('prog-recursion', 'Die Funktion läuft in konstanter Zeit', false, 3),
  -- prog-boolean
  ('prog-boolean', 'true', true, 0),
  ('prog-boolean', 'false', false, 1),
  ('prog-boolean', 'null', false, 2),
  ('prog-boolean', 'Es entsteht ein Laufzeitfehler', false, 3),
  -- net-osi-router
  ('net-osi-router', 'Layer 3 — Vermittlungsschicht', true, 0),
  ('net-osi-router', 'Layer 2 — Sicherungsschicht', false, 1),
  ('net-osi-router', 'Layer 4 — Transportschicht', false, 2),
  ('net-osi-router', 'Layer 7 — Anwendungsschicht', false, 3),
  -- net-tcp
  ('net-tcp', 'TCP stellt eine zuverlässige, geordnete Zustellung sicher', true, 0),
  ('net-tcp', 'TCP ist verbindungslos', false, 1),
  ('net-tcp', 'TCP hat weniger Overhead als UDP', false, 2),
  ('net-tcp', 'TCP eignet sich nicht für Dateiübertragungen', false, 3),
  -- net-private-ip
  ('net-private-ip', '192.168.0.0/16', true, 0),
  ('net-private-ip', '8.8.8.0/24', false, 1),
  ('net-private-ip', '172.8.0.0/16', false, 2),
  ('net-private-ip', '100.64.0.0/10', false, 3),
  -- net-dns
  ('net-dns', 'Auflösung von Domainnamen in IP-Adressen', true, 0),
  ('net-dns', 'Vergabe von IP-Adressen an Clients', false, 1),
  ('net-dns', 'Verschlüsselung des Webverkehrs', false, 2),
  ('net-dns', 'Routing zwischen verschiedenen Netzen', false, 3),
  -- net-subnet-29
  ('net-subnet-29', '6', true, 0),
  ('net-subnet-29', '8', false, 1),
  ('net-subnet-29', '4', false, 2),
  ('net-subnet-29', '14', false, 3),
  -- wiso-probezeit
  ('wiso-probezeit', 'Höchstens 4 Monate', true, 0),
  ('wiso-probezeit', 'Höchstens 1 Monat', false, 1),
  ('wiso-probezeit', 'Höchstens 6 Monate', false, 2),
  ('wiso-probezeit', 'Höchstens 12 Monate', false, 3),
  -- wiso-jav
  ('wiso-jav', 'Sie vertritt die Interessen der jugendlichen Beschäftigten und Auszubildenden', true, 0),
  ('wiso-jav', 'Sie schließt Tarifverträge mit dem Arbeitgeber ab', false, 1),
  ('wiso-jav', 'Sie zahlt die Ausbildungsvergütung aus', false, 2),
  ('wiso-jav', 'Sie erstellt den Ausbildungsrahmenplan', false, 3),
  -- wiso-gmbh
  ('wiso-gmbh', 'Die Haftung ist grundsätzlich auf das Gesellschaftsvermögen beschränkt', true, 0),
  ('wiso-gmbh', 'Die Gesellschafter haften unbeschränkt mit ihrem Privatvermögen', false, 1),
  ('wiso-gmbh', 'Sie benötigt kein Mindeststammkapital', false, 2),
  ('wiso-gmbh', 'Sie ist eine Personengesellschaft', false, 3)
) as v(source_key, text, is_correct, sort_order) on v.source_key = q.source_key;
