-- Fifth content batch: 20 more original FIAE Anwendungsentwicklung questions
-- across the same 4 topics. Written in the style of the IHK exam, NOT copied
-- from any real exam. Seeded as live (reviewed = true) per user request, but
-- still visible in full in /review so they can be pulled (unapprove/reject)
-- at any time. New source_keys only, checked against the existing
-- 92-question pool for topic/content overlap before writing.

insert into questions (topic_id, source_key, question_text, explanation, difficulty, reviewed)
select t.id, v.source_key, v.q, v.expl, v.difficulty, true
from topics t
join exams e on e.id = t.exam_id and e.slug = 'fiae-ae'
join (values
  -- Datenbanken
  ('Datenbanken', 'db-outer-join',
   'Was liefert ein LEFT OUTER JOIN im Unterschied zu einem INNER JOIN?',
   'Ein LEFT OUTER JOIN gibt alle Zeilen der linken Tabelle zurück, auch wenn kein passender Datensatz in der rechten Tabelle existiert; fehlende Werte werden mit NULL aufgefüllt.',
   2),
  ('Datenbanken', 'db-stored-procedure',
   'Wozu dient eine Stored Procedure in einer relationalen Datenbank?',
   'Eine Stored Procedure kapselt eine Folge von SQL-Anweisungen serverseitig, sodass sie wiederholt aufgerufen werden kann, ohne den Code jedes Mal neu zu übertragen.',
   2),
  ('Datenbanken', 'db-trigger',
   'Was ist ein Trigger in einer Datenbank?',
   'Ein Trigger ist eine Prozedur, die automatisch bei einem bestimmten Ereignis (z. B. INSERT, UPDATE, DELETE) auf einer Tabelle ausgeführt wird.',
   2),
  ('Datenbanken', 'db-cascade-delete',
   'Was bewirkt die Fremdschlüssel-Option ON DELETE CASCADE?',
   'Wird der referenzierte Datensatz gelöscht, werden alle darauf verweisenden Zeilen in der Kindtabelle automatisch mitgelöscht.',
   2),
  ('Datenbanken', 'db-datatype-decimal',
   'Warum wird für Geldbeträge in der Datenbank meist DECIMAL statt FLOAT verwendet?',
   'DECIMAL speichert Werte exakt in Festkommadarstellung, während FLOAT als Gleitkommazahl Rundungsfehler verursachen kann, die bei Geldbeträgen problematisch sind.',
   3),
  -- Programmierung
  ('Programmierung', 'prog-array-vs-list',
   'Was ist der wesentliche Unterschied zwischen einem klassischen Array und einer dynamischen Liste (z. B. ArrayList)?',
   'Ein Array hat eine bei der Erstellung festgelegte, feste Größe, während eine dynamische Liste zur Laufzeit wachsen und schrumpfen kann.',
   1),
  ('Programmierung', 'prog-exception-try-catch',
   'Welchem Zweck dient ein try-catch-Block?',
   'Er fängt zur Laufzeit auftretende Fehler (Exceptions) ab und ermöglicht eine kontrollierte Fehlerbehandlung, statt dass das Programm abstürzt.',
   1),
  ('Programmierung', 'prog-version-semver',
   'Wofür steht die zweite Ziffer in einer Versionsnummer nach Semantic Versioning (MAJOR.MINOR.PATCH)?',
   'Die MINOR-Ziffer wird erhöht, wenn abwärtskompatible neue Funktionalität hinzugefügt wurde.',
   2),
  ('Programmierung', 'prog-code-review',
   'Welchen Hauptnutzen hat ein Code-Review im Entwicklungsprozess?',
   'Ein Code-Review deckt Fehler, Sicherheitsprobleme und Verstöße gegen Konventionen frühzeitig auf und verbessert die Wissensverteilung im Team.',
   1),
  ('Programmierung', 'prog-clean-code-naming',
   'Warum sind sprechende Bezeichner (Variablen-, Methodennamen) ein zentrales Prinzip von Clean Code?',
   'Sprechende Namen machen den Zweck von Code direkt verständlich und reduzieren den Bedarf an erklärenden Kommentaren.',
   1),
  -- Netzwerke
  ('Netzwerke', 'net-dns-a-record',
   'Wofür wird ein A-Record in einer DNS-Zone verwendet?',
   'Ein A-Record ordnet einem Domainnamen eine IPv4-Adresse zu.',
   1),
  ('Netzwerke', 'net-proxy-server',
   'Welche Funktion erfüllt ein Proxy-Server?',
   'Ein Proxy-Server leitet Anfragen zwischen Client und Zielserver stellvertretend weiter, z. B. für Caching, Filterung oder Anonymisierung.',
   2),
  ('Netzwerke', 'net-vlan',
   'Welchen Zweck erfüllt ein VLAN (Virtual LAN)?',
   'Ein VLAN unterteilt ein physisches Netzwerk logisch in mehrere getrennte Broadcast-Domänen, ohne dass dafür separate physische Verkabelung nötig ist.',
   2),
  ('Netzwerke', 'net-ipv6-purpose',
   'Was ist der zentrale Grund für die Einführung von IPv6?',
   'IPv6 löst die Erschöpfung des IPv4-Adressraums durch einen deutlich größeren, 128 Bit langen Adressraum.',
   2),
  ('Netzwerke', 'net-ssh-purpose',
   'Wofür wird SSH (Secure Shell) typischerweise eingesetzt?',
   'SSH ermöglicht eine verschlüsselte Remote-Anmeldung und Fernsteuerung von Systemen über ein unsicheres Netzwerk.',
   1),
  -- Wirtschafts- & Sozialkunde
  ('Wirtschafts- & Sozialkunde', 'wiso-mutterschutz',
   'Innerhalb welchen Zeitraums vor und nach der Geburt gilt grundsätzlich die Mutterschutzfrist?',
   'Die Mutterschutzfrist beginnt in der Regel 6 Wochen vor und endet 8 Wochen nach der Geburt; in dieser Zeit besteht ein grundsätzliches Beschäftigungsverbot.',
   2),
  ('Wirtschafts- & Sozialkunde', 'wiso-betriebsvereinbarung',
   'Was ist eine Betriebsvereinbarung?',
   'Eine Betriebsvereinbarung ist eine schriftliche Abrede zwischen Arbeitgeber und Betriebsrat, die betriebliche Angelegenheiten verbindlich für alle Beschäftigten regelt.',
   2),
  ('Wirtschafts- & Sozialkunde', 'wiso-lohnsteuerklasse',
   'Wonach richtet sich in Deutschland die Einordnung in eine Lohnsteuerklasse in erster Linie?',
   'Die Lohnsteuerklasse richtet sich vor allem nach dem Familienstand, z. B. ledig, verheiratet oder alleinerziehend.',
   2),
  ('Wirtschafts- & Sozialkunde', 'wiso-ausbildungsordnung',
   'Was regelt eine Ausbildungsordnung?',
   'Die Ausbildungsordnung legt bundesweit einheitlich Ausbildungsberuf, -dauer, -inhalte und Prüfungsanforderungen für einen anerkannten Ausbildungsberuf fest.',
   2),
  ('Wirtschafts- & Sozialkunde', 'wiso-abfindung',
   'Worauf bezieht sich eine Abfindung im arbeitsrechtlichen Kontext meist?',
   'Eine Abfindung ist eine einmalige Zahlung des Arbeitgebers an den Arbeitnehmer, häufig als Ausgleich beim Verlust des Arbeitsplatzes, ohne dass darauf grundsätzlich ein gesetzlicher Anspruch besteht.',
   3)
) as v(topic_name, source_key, q, expl, difficulty) on t.name = v.topic_name;

-- Answer options (option 0 sort first). is_correct marks the right answer.
insert into answer_options (question_id, option_text, is_correct, sort_order)
select q.id, v.text, v.is_correct, v.sort_order
from questions q
join (values
  -- db-outer-join
  ('db-outer-join', 'Alle Zeilen der linken Tabelle, fehlende rechte Werte werden NULL', true, 0),
  ('db-outer-join', 'Nur Zeilen, die in beiden Tabellen übereinstimmen', false, 1),
  ('db-outer-join', 'Nur Zeilen der rechten Tabelle', false, 2),
  ('db-outer-join', 'Ein kartesisches Produkt beider Tabellen', false, 3),
  -- db-stored-procedure
  ('db-stored-procedure', 'Serverseitige Kapselung wiederverwendbarer SQL-Anweisungen', true, 0),
  ('db-stored-procedure', 'Eine automatische Sicherungskopie der Datenbank', false, 1),
  ('db-stored-procedure', 'Ein Index zur Beschleunigung von Abfragen', false, 2),
  ('db-stored-procedure', 'Eine clientseitige Zwischenspeicherung von Ergebnissen', false, 3),
  -- db-trigger
  ('db-trigger', 'Automatische Ausführung bei einem bestimmten Tabellenereignis', true, 0),
  ('db-trigger', 'Ein manuell gestarteter Wartungsjob', false, 1),
  ('db-trigger', 'Eine Beschränkung des Wertebereichs einer Spalte', false, 2),
  ('db-trigger', 'Ein Verfahren zur Datenverschlüsselung', false, 3),
  -- db-cascade-delete
  ('db-cascade-delete', 'Abhängige Zeilen in der Kindtabelle werden automatisch mitgelöscht', true, 0),
  ('db-cascade-delete', 'Das Löschen wird verhindert, solange abhängige Zeilen existieren', false, 1),
  ('db-cascade-delete', 'Abhängige Zeilen werden auf NULL gesetzt', false, 2),
  ('db-cascade-delete', 'Es wird lediglich eine Warnung protokolliert', false, 3),
  -- db-datatype-decimal
  ('db-datatype-decimal', 'DECIMAL speichert exakt, FLOAT kann Rundungsfehler verursachen', true, 0),
  ('db-datatype-decimal', 'DECIMAL ist immer schneller als FLOAT', false, 1),
  ('db-datatype-decimal', 'FLOAT unterstützt keine Nachkommastellen', false, 2),
  ('db-datatype-decimal', 'DECIMAL benötigt weniger Speicherplatz als FLOAT', false, 3),
  -- prog-array-vs-list
  ('prog-array-vs-list', 'Ein Array hat feste Größe, eine dynamische Liste kann wachsen', true, 0),
  ('prog-array-vs-list', 'Ein Array kann beliebige Datentypen mischen, eine Liste nicht', false, 1),
  ('prog-array-vs-list', 'Eine dynamische Liste ist immer schneller im Zugriff', false, 2),
  ('prog-array-vs-list', 'Arrays existieren nur in funktionalen Sprachen', false, 3),
  -- prog-exception-try-catch
  ('prog-exception-try-catch', 'Kontrollierte Behandlung von Laufzeitfehlern statt Programmabsturz', true, 0),
  ('prog-exception-try-catch', 'Beschleunigung der Programmausführung', false, 1),
  ('prog-exception-try-catch', 'Automatische Speicherbereinigung', false, 2),
  ('prog-exception-try-catch', 'Parallele Ausführung mehrerer Threads', false, 3),
  -- prog-version-semver
  ('prog-version-semver', 'Neue, abwärtskompatible Funktionalität', true, 0),
  ('prog-version-semver', 'Ein inkompatibler Breaking Change', false, 1),
  ('prog-version-semver', 'Ein reiner Bugfix ohne neue Funktionen', false, 2),
  ('prog-version-semver', 'Eine rein interne Build-Nummer', false, 3),
  -- prog-code-review
  ('prog-code-review', 'Frühes Aufdecken von Fehlern und Wissensverteilung im Team', true, 0),
  ('prog-code-review', 'Automatisches Deployment in die Produktion', false, 1),
  ('prog-code-review', 'Ersatz für automatisierte Tests', false, 2),
  ('prog-code-review', 'Messung der Ausführungsgeschwindigkeit', false, 3),
  -- prog-clean-code-naming
  ('prog-clean-code-naming', 'Der Zweck des Codes wird direkt verständlich, weniger Kommentarbedarf', true, 0),
  ('prog-clean-code-naming', 'Kürzere Namen machen Code automatisch schneller', false, 1),
  ('prog-clean-code-naming', 'Es reduziert den Speicherverbrauch des Programms', false, 2),
  ('prog-clean-code-naming', 'Es ist nur für die Kompilierung notwendig', false, 3),
  -- net-dns-a-record
  ('net-dns-a-record', 'Zuordnung eines Domainnamens zu einer IPv4-Adresse', true, 0),
  ('net-dns-a-record', 'Zuordnung eines Domainnamens zu einer MAC-Adresse', false, 1),
  ('net-dns-a-record', 'Verschlüsselung von DNS-Anfragen', false, 2),
  ('net-dns-a-record', 'Zuweisung eines Ports an einen Dienst', false, 3),
  -- net-proxy-server
  ('net-proxy-server', 'Stellvertretende Weiterleitung von Anfragen, z. B. für Caching oder Filterung', true, 0),
  ('net-proxy-server', 'Automatische Vergabe von IP-Adressen', false, 1),
  ('net-proxy-server', 'Physische Verbindung zweier Netzwerksegmente', false, 2),
  ('net-proxy-server', 'Auflösung von Domainnamen in IP-Adressen', false, 3),
  -- net-vlan
  ('net-vlan', 'Logische Unterteilung in mehrere Broadcast-Domänen ohne separate Verkabelung', true, 0),
  ('net-vlan', 'Automatische Vergabe von IP-Adressen an Clients', false, 1),
  ('net-vlan', 'Verschlüsselung des gesamten Netzwerkverkehrs', false, 2),
  ('net-vlan', 'Physische Trennung durch zusätzliche Netzwerkkabel', false, 3),
  -- net-ipv6-purpose
  ('net-ipv6-purpose', 'Ein deutlich größerer Adressraum gegen die Erschöpfung von IPv4', true, 0),
  ('net-ipv6-purpose', 'Höhere Übertragungsgeschwindigkeit gegenüber IPv4', false, 1),
  ('net-ipv6-purpose', 'Ersatz von TCP durch ein neues Protokoll', false, 2),
  ('net-ipv6-purpose', 'Verschlüsselung auf der Vermittlungsschicht als Pflichtfunktion', false, 3),
  -- net-ssh-purpose
  ('net-ssh-purpose', 'Verschlüsselte Remote-Anmeldung und Fernsteuerung von Systemen', true, 0),
  ('net-ssh-purpose', 'Verteilung von IP-Adressen im lokalen Netz', false, 1),
  ('net-ssh-purpose', 'Übertragung von Streaming-Medien in Echtzeit', false, 2),
  ('net-ssh-purpose', 'Auflösung von Domainnamen', false, 3),
  -- wiso-mutterschutz
  ('wiso-mutterschutz', '6 Wochen vor und 8 Wochen nach der Geburt', true, 0),
  ('wiso-mutterschutz', '2 Wochen vor und 2 Wochen nach der Geburt', false, 1),
  ('wiso-mutterschutz', 'Nur nach der Geburt, keine Frist davor', false, 2),
  ('wiso-mutterschutz', '12 Monate vor und nach der Geburt', false, 3),
  -- wiso-betriebsvereinbarung
  ('wiso-betriebsvereinbarung', 'Verbindliche Abrede zwischen Arbeitgeber und Betriebsrat', true, 0),
  ('wiso-betriebsvereinbarung', 'Ein Vertrag zwischen zwei einzelnen Arbeitnehmern', false, 1),
  ('wiso-betriebsvereinbarung', 'Eine Vereinbarung zwischen Gewerkschaft und Arbeitgeberverband', false, 2),
  ('wiso-betriebsvereinbarung', 'Eine rein unverbindliche Empfehlung des Betriebsrats', false, 3),
  -- wiso-lohnsteuerklasse
  ('wiso-lohnsteuerklasse', 'Nach dem Familienstand', true, 0),
  ('wiso-lohnsteuerklasse', 'Nach der Betriebszugehörigkeit', false, 1),
  ('wiso-lohnsteuerklasse', 'Nach der Berufsbezeichnung', false, 2),
  ('wiso-lohnsteuerklasse', 'Nach dem Bundesland des Arbeitgebers', false, 3),
  -- wiso-ausbildungsordnung
  ('wiso-ausbildungsordnung', 'Beruf, Dauer, Inhalte und Prüfungsanforderungen bundeseinheitlich', true, 0),
  ('wiso-ausbildungsordnung', 'Nur die Höhe der Ausbildungsvergütung', false, 1),
  ('wiso-ausbildungsordnung', 'Nur die Urlaubstage der Auszubildenden', false, 2),
  ('wiso-ausbildungsordnung', 'Ausschließlich betriebsinterne Regelungen ohne bundesweite Gültigkeit', false, 3),
  -- wiso-abfindung
  ('wiso-abfindung', 'Einmalige Zahlung, häufig als Ausgleich bei Arbeitsplatzverlust, ohne generellen Rechtsanspruch', true, 0),
  ('wiso-abfindung', 'Ein gesetzlich garantierter Anspruch bei jeder Kündigung', false, 1),
  ('wiso-abfindung', 'Eine monatliche Zusatzzahlung während der Ausbildung', false, 2),
  ('wiso-abfindung', 'Ein Zuschuss des Staates zur Berufsausbildung', false, 3)
) as v(source_key, text, is_correct, sort_order) on v.source_key = q.source_key;
