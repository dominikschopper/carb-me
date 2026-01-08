# Baue eine Kohlenhydrate App

Erstelle eine SvelteKit PWA für Diabetiker die carb.me heißt, mit den Features aus docs/features.md. Nutze die Daten aus static/lebensmittel-daten.json.

Ich habe mit claude schon darüber diskutiert und
einiges vorbesprochen und vorbereitet. [Chat mit Claude Web](https://claude.ai/chat/45852900-088b-4ed5-83d6-ad13509b79bf)

Implementiere: Suche mit Fuzzy-Search, BE/KHE-Rechner, Favoriten mit localStorage. Mobile-First Design. Static Site für GitHub Pages."

Starte mit +page.svelte (Suche) und LebensmittelKarte.svelte

## Feature-Liste: Diabetiker Lebensmittel-App

### Prio 1 - Absolut essentiell

- **Schnelle Suche** - kritisch im Alltag, muss sofort Ergebnisse liefern
- **Offline verfügbar** - muss funktionieren ohne Internet
- **Mobile first** - beim Einkaufen/Kochen/Essen nutzt man's am Smartphone
- **Rechner** - "Ich habe 150g Apfel, wieviel BE/KHE?" (DAS Killer-Feature!)
- **Favoriten** - die 20-30 Lebensmittel, die man täglich nutzt, schnell finden

### Prio 2 - Sehr nützlich

- **Übersichtliche Darstellung** - klar strukturiert, gut lesbar
- **Tippfehlertoleranz** - Fuzzy-Search, verzeiht Schreibfehler
- **Mahlzeiten-Zusammenstellung** - mehrere Lebensmittel addieren (180g Kartoffeln + 100g Erbsen = ? BE)
- **Eigene Lebensmittel** hinzufügen - lokal gespeichert (z.B. "Omas Apfelkuchen")

### Prio 3 - Nice-to-have

- **Vergleichsfunktion** - "Was hat weniger KH: Apfel oder Birne?"
- **Feedback-Möglichkeit** - Korrekturen/Ergänzungen mitteilen (per Email außerhalb der App)
- **Ausdruckbar** - ggf. nur Auszüge aus Kategorien
- **Dark Mode** - wenn man nachts was isst und nachschaut
- **History** - letzte Berechnungen/Suchen

---

### Technische Umsetzung (kostenfrei)

- **PWA** (Progressive Web App) → offline-fähig + auf Homescreen installierbar
- **GitHub Pages** → kostenloses Hosting
- **localStorage** → Favoriten, eigene Einträge, Einstellungen clientseitig speichern
- **Static JSON** → keine Datenbank nötig, alle Daten im Browser
- **Service Worker** → für Offline-Funktionalität

---

### Budget-Einschränkung

Max. 5€/Monat → komplett kostenlos umsetzbar mit obiger Tech-Stack
