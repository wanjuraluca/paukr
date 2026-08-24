-- Sixth content batch: 18 more original FIAE Anwendungsentwicklung questions
-- across the same 4 topics. Written in the style of the IHK exam, NOT copied
-- from any real exam. Most are the new multiple-choice format (question_type
-- 'multiple', correct only when the picked set exactly matches). New
-- source_keys only, checked against the existing pool for topic/content
-- overlap before writing.

insert into questions (topic_id, source_key, question_text, explanation, difficulty, reviewed, question_type)
select t.id, v.source_key, v.q, v.expl, v.difficulty, true, v.question_type
from topics t
join exams e on e.id = t.exam_id and e.slug = 'fiae-ae'
join (values
  -- Datenbanken
  ('Datenbanken', 'db-multi-normalforms',
   'Welche der folgenden Aussagen zu den Normalformen treffen zu?',
   'Jede höhere Normalform setzt die vorherige voraus, ihr Ziel ist die Vermeidung von Redundanz und Anomalien, und die 3NF fordert unter anderem die Abwesenheit transitiver Abhängigkeiten.',
   3, 'multiple'),
  ('Datenbanken', 'db-multi-transaction-acid',
   'Welche der folgenden Eigenschaften gehören zu den ACID-Kriterien einer Transaktion?',
   'ACID steht fuer Atomicity, Consistency, Isolation und Durability; Performance und Skalierbarkeit gehoeren nicht dazu.',
   3, 'multiple'),
  ('Datenbanken', 'db-erm-relationship-types',
   'Welche Kardinalitaeten koennen zwischen zwei Entitaeten in einem ER-Modell auftreten?',
   'Moeglich sind 1:1, 1:n und m:n Beziehungen; eine "0:0"-Beziehung ist kein gaengiges Konzept im ER-Modell.',
   2, 'multiple'),
  ('Datenbanken', 'db-single-varchar-length',
   'Was passiert, wenn ein Wert in eine VARCHAR-Spalte mit fester Maximallaenge eingefuegt wird, der diese Laenge ueberschreitet?',
   'Die Datenbank meldet einen Fehler bzw. weist die Einfuegung zurueck, da der Wert die definierte Maximallaenge der Spalte ueberschreitet.',
   2, 'single'),
  ('Datenbanken', 'db-single-group-by',
   'Wofuer wird die SQL-Klausel GROUP BY verwendet?',
   'GROUP BY fasst Zeilen mit gleichen Werten in den angegebenen Spalten zu Gruppen zusammen, meist in Kombination mit Aggregatfunktionen wie COUNT oder SUM.',
   2, 'single'),
  -- Programmierung
  ('Programmierung', 'prog-multi-oop-pillars',
   'Welche der folgenden Konzepte zaehlen zu den zentralen Prinzipien der objektorientierten Programmierung?',
   'Kapselung, Vererbung und Polymorphie sind die klassischen OOP-Saeulen; eine feste Ausfuehrungsreihenfolge von Methoden gehoert nicht dazu.',
   2, 'multiple'),
  ('Programmierung', 'prog-multi-datastructures-fifo',
   'Welche der folgenden Datenstrukturen arbeiten nach dem FIFO-Prinzip?',
   'Eine Queue und eine Pipeline verarbeiten Elemente in der Reihenfolge ihres Eintreffens (FIFO); ein Stack arbeitet dagegen nach LIFO.',
   3, 'multiple'),
  ('Programmierung', 'prog-multi-http-idempotent',
   'Welche der folgenden HTTP-Methoden gelten laut Spezifikation als idempotent?',
   'GET, PUT und DELETE sind idempotent, da mehrfaches Ausfuehren denselben Endzustand liefert; POST ist es typischerweise nicht.',
   3, 'multiple'),
  ('Programmierung', 'prog-multi-testing-arten',
   'Welche der folgenden Begriffe bezeichnen gaengige Teststufen in der Softwareentwicklung?',
   'Unit-Test, Integrationstest und Systemtest sind etablierte Teststufen; ein "Deployment-Test" ist in dieser Form kein Standardbegriff.',
   2, 'multiple'),
  ('Programmierung', 'prog-single-garbage-collection',
   'Was ist die Aufgabe der Garbage Collection in Sprachen wie Java oder C#?',
   'Die Garbage Collection gibt automatisch den Speicher von Objekten frei, auf die zur Laufzeit kein Verweis mehr besteht.',
   2, 'single'),
  ('Programmierung', 'prog-single-regression-test',
   'Wozu dient ein Regressionstest?',
   'Ein Regressionstest prueft nach Aenderungen am Code, ob bereits funktionierende Funktionalitaet weiterhin korrekt arbeitet.',
   2, 'single'),
  -- Netzwerke
  ('Netzwerke', 'net-multi-osi-transport-layer',
   'Welche der folgenden Protokolle sind auf der Transportschicht des OSI-Modells angesiedelt?',
   'TCP und UDP arbeiten auf der Transportschicht (Schicht 4); HTTP ist ein Anwendungsschicht-Protokoll.',
   2, 'multiple'),
  ('Netzwerke', 'net-multi-private-ranges',
   'Welche der folgenden Adressbereiche zaehlen zu den privaten IPv4-Adressbereichen nach RFC 1918?',
   '10.0.0.0/8, 172.16.0.0/12 und 192.168.0.0/16 sind die drei privaten IPv4-Bereiche nach RFC 1918; 8.8.0.0/16 ist ein oeffentlicher Bereich.',
   3, 'multiple'),
  ('Netzwerke', 'net-multi-security-mechanisms',
   'Welche der folgenden Massnahmen dienen unmittelbar der Netzwerksicherheit?',
   'Firewall, VPN und Verschluesselung schuetzen Netzwerkkommunikation direkt; ein Lastausgleich (Load Balancer) dient primaer der Verfuegbarkeit, nicht der Sicherheit.',
   3, 'multiple'),
  ('Netzwerke', 'net-single-icmp-purpose',
   'Wofuer wird das Protokoll ICMP hauptsaechlich eingesetzt?',
   'ICMP dient dem Austausch von Status- und Fehlermeldungen im Netzwerk, etwa bei den Werkzeugen ping und traceroute.',
   2, 'single'),
  ('Netzwerke', 'net-single-dhcp-lease',
   'Was bezeichnet man beim DHCP-Protokoll als "Lease"?',
   'Die Lease ist die Gueltigkeitsdauer, fuer die eine per DHCP vergebene IP-Adresse einem Client zugewiesen bleibt, bevor sie erneuert oder freigegeben wird.',
   2, 'single'),
  -- Wirtschafts- & Sozialkunde
  ('Wirtschafts- & Sozialkunde', 'wiso-multi-sozialversicherungszweige',
   'Welche der folgenden Zweige gehoeren zur gesetzlichen Sozialversicherung in Deutschland?',
   'Kranken-, Renten-, Pflege-, Arbeitslosen- und Unfallversicherung bilden die fuenf Saeulen der gesetzlichen Sozialversicherung; eine "Ausbildungsversicherung" existiert nicht als eigener Zweig.',
   2, 'multiple'),
  ('Wirtschafts- & Sozialkunde', 'wiso-single-probezeit-dauer',
   'Wie lange darf die Probezeit in einem Ausbildungsverhaeltnis laut Berufsbildungsgesetz hoechstens dauern?',
   'Die Probezeit muss mindestens einen und darf hoechstens vier Monate betragen.',
   1, 'single')
) as v(topic_name, source_key, q, expl, difficulty, question_type)
on t.name = v.topic_name;

insert into answer_options (question_id, option_text, is_correct, sort_order)
select q.id, v.text, v.is_correct, v.sort_order
from questions q
join (values
  -- db-multi-normalforms
  ('db-multi-normalforms', 'Jede hoehere Normalform setzt die vorherige voraus', true, 0),
  ('db-multi-normalforms', 'Ziel der Normalisierung ist die Vermeidung von Redundanz und Anomalien', true, 1),
  ('db-multi-normalforms', 'Die 3NF fordert die Abwesenheit transitiver Abhaengigkeiten', true, 2),
  ('db-multi-normalforms', 'Eine normalisierte Datenbank benoetigt grundsaetzlich keine Fremdschluessel mehr', false, 3),
  -- db-multi-transaction-acid
  ('db-multi-transaction-acid', 'Atomicity', true, 0),
  ('db-multi-transaction-acid', 'Consistency', true, 1),
  ('db-multi-transaction-acid', 'Isolation', true, 2),
  ('db-multi-transaction-acid', 'Scalability', false, 3),
  -- db-erm-relationship-types
  ('db-erm-relationship-types', '1:1', true, 0),
  ('db-erm-relationship-types', '1:n', true, 1),
  ('db-erm-relationship-types', 'm:n', true, 2),
  ('db-erm-relationship-types', '0:0', false, 3),
  -- db-single-varchar-length
  ('db-single-varchar-length', 'Der Wert wird automatisch gekuerzt und ohne Fehler gespeichert', false, 0),
  ('db-single-varchar-length', 'Die Datenbank meldet einen Fehler und weist die Einfuegung zurueck', true, 1),
  ('db-single-varchar-length', 'Die Spaltenlaenge wird automatisch erweitert', false, 2),
  ('db-single-varchar-length', 'Der Wert wird als NULL gespeichert', false, 3),
  -- db-single-group-by
  ('db-single-group-by', 'Zeilen mit gleichen Werten zu Gruppen zusammenfassen, meist fuer Aggregatfunktionen', true, 0),
  ('db-single-group-by', 'Tabellen anhand eines gemeinsamen Schluessels verbinden', false, 1),
  ('db-single-group-by', 'Die Sortierreihenfolge des Ergebnisses festlegen', false, 2),
  ('db-single-group-by', 'Doppelte Zeilen im Ergebnis vollstaendig entfernen', false, 3),
  -- prog-multi-oop-pillars
  ('prog-multi-oop-pillars', 'Kapselung', true, 0),
  ('prog-multi-oop-pillars', 'Vererbung', true, 1),
  ('prog-multi-oop-pillars', 'Polymorphie', true, 2),
  ('prog-multi-oop-pillars', 'Eine feste Ausfuehrungsreihenfolge von Methoden', false, 3),
  -- prog-multi-datastructures-fifo
  ('prog-multi-datastructures-fifo', 'Queue', true, 0),
  ('prog-multi-datastructures-fifo', 'Pipeline', true, 1),
  ('prog-multi-datastructures-fifo', 'Stack', false, 2),
  ('prog-multi-datastructures-fifo', 'Binaerbaum', false, 3),
  -- prog-multi-http-idempotent
  ('prog-multi-http-idempotent', 'GET', true, 0),
  ('prog-multi-http-idempotent', 'PUT', true, 1),
  ('prog-multi-http-idempotent', 'DELETE', true, 2),
  ('prog-multi-http-idempotent', 'POST', false, 3),
  -- prog-multi-testing-arten
  ('prog-multi-testing-arten', 'Unit-Test', true, 0),
  ('prog-multi-testing-arten', 'Integrationstest', true, 1),
  ('prog-multi-testing-arten', 'Systemtest', true, 2),
  ('prog-multi-testing-arten', 'Deployment-Test', false, 3),
  -- prog-single-garbage-collection
  ('prog-single-garbage-collection', 'Gibt automatisch Speicher nicht mehr referenzierter Objekte frei', true, 0),
  ('prog-single-garbage-collection', 'Kompiliert den Quellcode in Maschinencode', false, 1),
  ('prog-single-garbage-collection', 'Optimiert die Datenbankabfragen zur Laufzeit', false, 2),
  ('prog-single-garbage-collection', 'Verwaltet Benutzerrechte im Betriebssystem', false, 3),
  -- prog-single-regression-test
  ('prog-single-regression-test', 'Prueft, ob bestehende Funktionalitaet nach Aenderungen weiterhin korrekt arbeitet', true, 0),
  ('prog-single-regression-test', 'Misst die Performance der Anwendung unter Last', false, 1),
  ('prog-single-regression-test', 'Prueft die Benutzeroberflaeche auf Barrierefreiheit', false, 2),
  ('prog-single-regression-test', 'Ermittelt die Testabdeckung des Codes in Prozent', false, 3),
  -- net-multi-osi-transport-layer
  ('net-multi-osi-transport-layer', 'TCP', true, 0),
  ('net-multi-osi-transport-layer', 'UDP', true, 1),
  ('net-multi-osi-transport-layer', 'HTTP', false, 2),
  ('net-multi-osi-transport-layer', 'ARP', false, 3),
  -- net-multi-private-ranges
  ('net-multi-private-ranges', '10.0.0.0/8', true, 0),
  ('net-multi-private-ranges', '172.16.0.0/12', true, 1),
  ('net-multi-private-ranges', '192.168.0.0/16', true, 2),
  ('net-multi-private-ranges', '8.8.0.0/16', false, 3),
  -- net-multi-security-mechanisms
  ('net-multi-security-mechanisms', 'Firewall', true, 0),
  ('net-multi-security-mechanisms', 'VPN', true, 1),
  ('net-multi-security-mechanisms', 'Verschluesselung', true, 2),
  ('net-multi-security-mechanisms', 'Lastausgleich (Load Balancer)', false, 3),
  -- net-single-icmp-purpose
  ('net-single-icmp-purpose', 'Austausch von Status- und Fehlermeldungen im Netzwerk', true, 0),
  ('net-single-icmp-purpose', 'Verschluesselte Uebertragung von Nutzdaten', false, 1),
  ('net-single-icmp-purpose', 'Automatische Vergabe von IP-Adressen', false, 2),
  ('net-single-icmp-purpose', 'Aufloesung von Domainnamen in IP-Adressen', false, 3),
  -- net-single-dhcp-lease
  ('net-single-dhcp-lease', 'Die Gueltigkeitsdauer einer per DHCP vergebenen IP-Adresse', true, 0),
  ('net-single-dhcp-lease', 'Die maximale Bandbreite eines Netzwerksegments', false, 1),
  ('net-single-dhcp-lease', 'Die Anzahl gleichzeitig verbundener Clients', false, 2),
  ('net-single-dhcp-lease', 'Die Verschluesselungsstaerke der WLAN-Verbindung', false, 3),
  -- wiso-multi-sozialversicherungszweige
  ('wiso-multi-sozialversicherungszweige', 'Krankenversicherung', true, 0),
  ('wiso-multi-sozialversicherungszweige', 'Rentenversicherung', true, 1),
  ('wiso-multi-sozialversicherungszweige', 'Arbeitslosenversicherung', true, 2),
  ('wiso-multi-sozialversicherungszweige', 'Ausbildungsversicherung', false, 3),
  -- wiso-single-probezeit-dauer
  ('wiso-single-probezeit-dauer', 'Mindestens einen, hoechstens vier Monate', true, 0),
  ('wiso-single-probezeit-dauer', 'Mindestens eine Woche, hoechstens ein Monat', false, 1),
  ('wiso-single-probezeit-dauer', 'Immer genau drei Monate, gesetzlich fixiert', false, 2),
  ('wiso-single-probezeit-dauer', 'Mindestens zwei, hoechstens sechs Monate', false, 3)
) as v(source_key, text, is_correct, sort_order)
on v.source_key = q.source_key;
