# Aufbau

Persönliche Fitness-App: Training pro Studio, Ernährung, Gewicht, Schlaf und Apple-Health-Werte.
Läuft als Web-App auf dem iPhone-Home-Bildschirm (Vollbild, offline-fähig) und am Mac.

**Öffnen:** <https://haonsnoah.github.io/aufbau/>

- `index.html` — die ganze App
- `sw.js` — Offline-Speicher für die App-Hülle
- `manifest.webmanifest`, `icons/` — Name und Icon auf dem Home-Bildschirm
- `KURZBEFEHL.md` — Apple Health über einen iOS-Kurzbefehl anbinden

Daten liegen in Supabase (Tabelle `docs`, ein JSON-Dokument pro Pfad, nur mit Login lesbar).
Der Schlüssel im Code ist der öffentliche Supabase-Schlüssel, ohne Login gibt die Datenbank nichts heraus.
