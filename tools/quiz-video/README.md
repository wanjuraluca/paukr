# Quizvideos

Erzeugt Hochformat-Videos (1080x1920, ohne Ton) aus freigegebenen Fragen. Braucht eine verlinkte Supabase-CLI im Hauptordner.

```
npm install
npm run generate -- --list
npm run generate -- --exam fiae-ae --count 5
```

Weitere Optionen: `--topic <text>` für ein Thema, `--stills` für Vorschaubilder statt Videos.

Videos landen in `out/<prüfung>/`, dazu eine Übersicht mit Frage, Lösung und Text zum Posten. Vor dem Hochladen die Übersicht fachlich prüfen. Schon gerenderte Fragen stehen in `verwendet.json` und kommen beim nächsten Lauf nicht wieder.
