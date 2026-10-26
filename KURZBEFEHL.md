# Apple Health → Aufbau: der Kurzbefehl

Webseiten dürfen auf dem iPhone nicht auf Apple Health zugreifen. Ein Kurzbefehl darf es. Er liest deine
Werte und schickt sie an deine Aufbau-Datenbank. Einmal einrichten, danach läuft er von selbst.

**Was er schickt:** Gewicht (letzte Messung), Schlaf (letzte Nacht), Schritte und aktive Kalorien (heute bis jetzt),
Ruhepuls. Er läuft morgens und abends, damit Schritte und Kalorien am Ende des Tages vollständig sind.

Die Namen der Aktionen können je nach iOS-Version leicht abweichen. Tipp im Kurzbefehl unten auf
**Aktion suchen** und gib das fett gedruckte Stichwort ein.

## 1. Den Schlüssel holen

App öffnen → **Heute** → Zahnrad → **Kurzbefehl einrichten** → **Kopieren**.

## 2. Den Kurzbefehl bauen

Kurzbefehle-App → **+** → oben Namen setzen: `Aufbau Health`. Dann diese Aktionen der Reihe nach:

1. **Text** → den kopierten Schlüssel einfügen.
   *Tippe danach auf das Ergebnis „Text“ und benenne die Variable in `Schlüssel` um.*
2. **Health** → „Health-Proben suchen“ (englisch *Find Health Samples*)
   - Typ: **Gewicht**
   - Startdatum: **in den letzten 3 Tage**
   - Sortieren nach: **Startdatum**, **Neueste zuerst**, Limit **1**
   → Variable `Gewicht` nennen.
3. **Health-Proben suchen**
   - Typ: **Schlafanalyse**
   - Startdatum: **in den letzten 1 Tage**
   - Filter hinzufügen: **Wert** ist nicht **Im Bett** · **Wert** ist nicht **Wach**
4. **Details von Health-Probe abrufen** → **Dauer**
5. **Statistik berechnen** → **Summe** → Variable `Schlaf` nennen.
6. **Health-Proben suchen** → Typ **Schritte**, Startdatum **ist heute**
7. **Statistik berechnen** → **Summe** → Variable `Schritte` nennen.
8. **Health-Proben suchen** → Typ **Aktive Energie**, Startdatum **ist heute**
9. **Statistik berechnen** → **Summe** → Variable `Aktiv` nennen.
10. **Health-Proben suchen** → Typ **Ruheherzfrequenz**, Sortieren **Neueste zuerst**, Limit **1** → Variable `Ruhepuls`.
11. **Datum formatieren** → Datum: **Aktuelles Datum** → Format: **Eigenes** → `yyyy-MM-dd` → Variable `Tag`.
12. **Inhalte von URL abrufen**
    - URL: `https://vbliwrhpriclglpdigac.supabase.co/rest/v1/rpc/ingest_health`
    - Auf **Mehr anzeigen** tippen. Methode: **POST**
    - Header:
      - `apikey` → `sb_publishable_oXBrXamWdd2sFIenRz9hZQ_twfBeTe4`
      - `Content-Type` → `application/json`
    - Anfragetext: **JSON**, diese Felder:

      | Schlüssel | Typ | Wert |
      |---|---|---|
      | `p_token` | Text | Variable `Schlüssel` |
      | `p_date` | Text | Variable `Tag` |
      | `p_weight` | Zahl | Variable `Gewicht` |
      | `p_sleep` | Zahl | Variable `Schlaf` |
      | `p_steps` | Zahl | Variable `Schritte` |
      | `p_active_kcal` | Zahl | Variable `Aktiv` |
      | `p_resting_hr` | Zahl | Variable `Ruhepuls` |

Einmal oben auf **▶︎** tippen. Beim ersten Lauf fragt das iPhone, ob der Kurzbefehl Health-Daten lesen darf:
alles erlauben. Als Ergebnis sollte `ok` erscheinen. In der App stehen die Werte dann auf **Heute** unter
„Apple Health“.

## 3. Automatisch laufen lassen

Kurzbefehle-App → **Automation** → **+** → **Tageszeit** → **08:00**, täglich → **Sofort ausführen** →
Kurzbefehl `Aufbau Health`. Dasselbe noch einmal für **22:00**.

## Wenn etwas nicht klappt

| Meldung | Ursache |
|---|---|
| `ungültiger Schlüssel` | Schlüssel in Schritt 1 falsch kopiert. In der App neu kopieren. |
| `Could not find the function` | Das Datenbank-Skript ist noch nicht in der neuen Fassung gelaufen. |
| Werte fehlen in der App | Gibt es den Wert in Apple Health? Ohne Waage steht z. B. kein Gewicht drin. |

Der Schlüssel erlaubt nur, Health-Werte für dich einzutragen. Lesen kann man damit nichts.
