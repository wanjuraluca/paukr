-- Fix ASCII transliteration in the batch 6 content. Those rows were seeded
-- with "ae/oe/ue" instead of real umlauts, which reads wrong in the UI. Only
-- the affected strings are rewritten, the questions themselves stay the same.
-- Words that legitimately contain those letter pairs (Quellcode, Queue,
-- dauern, erneuert) are left untouched.

update questions set question_text = 'Welche der folgenden Eigenschaften gehören zu den ACID-Kriterien einer Transaktion?', explanation = 'ACID steht für Atomicity, Consistency, Isolation und Durability; Performance und Skalierbarkeit gehören nicht dazu.'
  where source_key = 'db-multi-transaction-acid';

update questions set question_text = 'Welche Kardinalitäten können zwischen zwei Entitäten in einem ER-Modell auftreten?', explanation = 'Möglich sind 1:1, 1:n und m:n Beziehungen; eine "0:0"-Beziehung ist kein gängiges Konzept im ER-Modell.'
  where source_key = 'db-erm-relationship-types';

update questions set question_text = 'Was passiert, wenn ein Wert in eine VARCHAR-Spalte mit fester Maximallänge eingefügt wird, der diese Länge überschreitet?', explanation = 'Die Datenbank meldet einen Fehler bzw. weist die Einfügung zurück, da der Wert die definierte Maximallänge der Spalte überschreitet.'
  where source_key = 'db-single-varchar-length';

update questions set question_text = 'Wofür wird die SQL-Klausel GROUP BY verwendet?', explanation = 'GROUP BY fasst Zeilen mit gleichen Werten in den angegebenen Spalten zu Gruppen zusammen, meist in Kombination mit Aggregatfunktionen wie COUNT oder SUM.'
  where source_key = 'db-single-group-by';

update questions set question_text = 'Welche der folgenden Konzepte zählen zu den zentralen Prinzipien der objektorientierten Programmierung?', explanation = 'Kapselung, Vererbung und Polymorphie sind die klassischen OOP-Säulen; eine feste Ausführungsreihenfolge von Methoden gehört nicht dazu.'
  where source_key = 'prog-multi-oop-pillars';

update questions set question_text = 'Welche der folgenden HTTP-Methoden gelten laut Spezifikation als idempotent?', explanation = 'GET, PUT und DELETE sind idempotent, da mehrfaches Ausführen denselben Endzustand liefert; POST ist es typischerweise nicht.'
  where source_key = 'prog-multi-http-idempotent';

update questions set question_text = 'Welche der folgenden Begriffe bezeichnen gängige Teststufen in der Softwareentwicklung?', explanation = 'Unit-Test, Integrationstest und Systemtest sind etablierte Teststufen; ein "Deployment-Test" ist in dieser Form kein Standardbegriff.'
  where source_key = 'prog-multi-testing-arten';

update questions set question_text = 'Wozu dient ein Regressionstest?', explanation = 'Ein Regressionstest prüft nach Änderungen am Code, ob bereits funktionierende Funktionalität weiterhin korrekt arbeitet.'
  where source_key = 'prog-single-regression-test';

update questions set question_text = 'Welche der folgenden Adressbereiche zählen zu den privaten IPv4-Adressbereichen nach RFC 1918?', explanation = '10.0.0.0/8, 172.16.0.0/12 und 192.168.0.0/16 sind die drei privaten IPv4-Bereiche nach RFC 1918; 8.8.0.0/16 ist ein öffentlicher Bereich.'
  where source_key = 'net-multi-private-ranges';

update questions set question_text = 'Welche der folgenden Massnahmen dienen unmittelbar der Netzwerksicherheit?', explanation = 'Firewall, VPN und Verschlüsselung schützen Netzwerkkommunikation direkt; ein Lastausgleich (Load Balancer) dient primär der Verfügbarkeit, nicht der Sicherheit.'
  where source_key = 'net-multi-security-mechanisms';

update questions set question_text = 'Wofür wird das Protokoll ICMP hauptsächlich eingesetzt?', explanation = 'ICMP dient dem Austausch von Status- und Fehlermeldungen im Netzwerk, etwa bei den Werkzeugen ping und traceroute.'
  where source_key = 'net-single-icmp-purpose';

update questions set question_text = 'Was bezeichnet man beim DHCP-Protokoll als "Lease"?', explanation = 'Die Lease ist die Gültigkeitsdauer, für die eine per DHCP vergebene IP-Adresse einem Client zugewiesen bleibt, bevor sie erneuert oder freigegeben wird.'
  where source_key = 'net-single-dhcp-lease';

update questions set question_text = 'Welche der folgenden Zweige gehören zur gesetzlichen Sozialversicherung in Deutschland?', explanation = 'Kranken-, Renten-, Pflege-, Arbeitslosen- und Unfallversicherung bilden die fünf Säulen der gesetzlichen Sozialversicherung; eine "Ausbildungsversicherung" existiert nicht als eigener Zweig.'
  where source_key = 'wiso-multi-sozialversicherungszweige';

update questions set question_text = 'Wie lange darf die Probezeit in einem Ausbildungsverhältnis laut Berufsbildungsgesetz höchstens dauern?', explanation = 'Die Probezeit muss mindestens einen und darf höchstens vier Monate betragen.'
  where source_key = 'wiso-single-probezeit-dauer';

update answer_options set option_text = 'Eine normalisierte Datenbank benötigt grundsätzlich keine Fremdschlüssel mehr'
  where id = 'f7f242ca-af16-418e-85d0-6121b8621d44';

update answer_options set option_text = 'Die 3NF fordert die Abwesenheit transitiver Abhängigkeiten'
  where id = '9bf1d7bd-2367-4364-8540-c55e83019a47';

update answer_options set option_text = 'Jede höhere Normalform setzt die vorherige voraus'
  where id = '579278a0-3be8-4fde-946e-84495c37b586';

update answer_options set option_text = 'Die Spaltenlänge wird automatisch erweitert'
  where id = 'ade8b94d-911f-4905-a3cb-de663b96897f';

update answer_options set option_text = 'Die Datenbank meldet einen Fehler und weist die Einfügung zurück'
  where id = '2c379d5d-1629-46e1-824f-8e23e4a8b4cb';

update answer_options set option_text = 'Der Wert wird automatisch gekürzt und ohne Fehler gespeichert'
  where id = '5ff06ff9-6aa7-4d2b-a9dd-a843848710c3';

update answer_options set option_text = 'Doppelte Zeilen im Ergebnis vollständig entfernen'
  where id = 'd7b10316-b308-4fbe-ad88-879fe7e20451';

update answer_options set option_text = 'Tabellen anhand eines gemeinsamen Schlüssels verbinden'
  where id = '43535c55-e67e-4605-bf85-1c292ebe54a0';

update answer_options set option_text = 'Zeilen mit gleichen Werten zu Gruppen zusammenfassen, meist für Aggregatfunktionen'
  where id = '0a05ed80-0054-4a32-88d3-2eb4a8f7737b';

update answer_options set option_text = 'Eine feste Ausführungsreihenfolge von Methoden'
  where id = 'cded004f-c231-4249-be26-698401128503';

update answer_options set option_text = 'Binärbaum'
  where id = '8e6ec8d9-6025-4fcf-8a48-407a161b6ef5';

update answer_options set option_text = 'Prüft die Benutzeroberfläche auf Barrierefreiheit'
  where id = '71651bed-e7af-4e47-b253-f5735d25d56f';

update answer_options set option_text = 'Prüft, ob bestehende Funktionalität nach Änderungen weiterhin korrekt arbeitet'
  where id = '38497fda-33d2-4a5d-8892-24a709929540';

update answer_options set option_text = 'Verschlüsselung'
  where id = '85272036-9fd1-4475-9383-c82910aa0dc7';

update answer_options set option_text = 'Auflösung von Domainnamen in IP-Adressen'
  where id = '4ad59105-49e1-4526-9c69-ca1248de5d82';

update answer_options set option_text = 'Verschlüsselte Übertragung von Nutzdaten'
  where id = 'b453c8c7-883c-4089-85ac-b8e02b1a8c04';

update answer_options set option_text = 'Die Verschlüsselungsstärke der WLAN-Verbindung'
  where id = 'b57645aa-e2fe-47df-bbaa-91336380f311';

update answer_options set option_text = 'Die Gültigkeitsdauer einer per DHCP vergebenen IP-Adresse'
  where id = '41c13790-39db-4048-93c4-002c05426be8';

update answer_options set option_text = 'Mindestens zwei, höchstens sechs Monate'
  where id = '1ed50b4e-5439-406d-997d-f38ea1dcc098';

update answer_options set option_text = 'Mindestens eine Woche, höchstens ein Monat'
  where id = '122bd805-9b48-48fc-a8fd-5bbec09b9bba';

update answer_options set option_text = 'Mindestens einen, höchstens vier Monate'
  where id = '10906c33-cca9-484c-a687-097fc3f742e0';

