-- Questions come in random order, so none may refer to a previous one.
update questions
set question_text = 'Eine Anlage mit Anschaffungskosten von 40.000 Euro wird degressiv mit 25 Prozent abgeschrieben. Nach Jahr 1 beträgt der Restbuchwert 30.000 Euro. Wie hoch ist die Abschreibung im zweiten Jahr?'
where source_key = 'steuerung-sg-abschreibung-degressiv-jahr2';
