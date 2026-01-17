# carb-me 🍞🍎🧮

Eine kostenlose Web-App zur Berechnung von Broteinheiten (BE) und Kohlenhydrateinheiten (KHE) für Menschen mit Diabetes.

**Live:** [carb-me.de](https://carb-me.de)

## Features

- Umfangreiche Lebensmittel-Datenbank mit BE/KHE-Werten
- Schnelle Suche mit Fuzzy-Matching
- Mahlzeiten zusammenstellen und Gesamtwerte berechnen
- Favoriten speichern für häufig genutzte Lebensmittel
- Wahl zwischen BE (12g KH) und KHE (10g KH) als Anzeigeeinheit
- Offline-fähig als Progressive Web App (PWA)
- Keine Registrierung, keine Datenübertragung - alles bleibt lokal auf deinem Gerät

## Technologie

- SvelteKit mit Svelte 5
- Tailwind CSS 4
- TypeScript
- Statisches Hosting auf GitHub Pages

## Haftungsausschluss

**Diese App dient ausschließlich zu Informationszwecken und stellt keine medizinische Beratung, Diagnose oder Behandlung dar.**

Die bereitgestellten Informationen zu Kohlenhydraten, Broteinheiten (BE) und Kohlenhydrateinheiten (KHE) ersetzen nicht die professionelle Beratung durch qualifiziertes medizinisches Fachpersonal.

- Die Nutzung dieser App erfolgt auf eigene Verantwortung
- Trotz sorgfältiger Recherche können die Nährwertangaben Fehler enthalten
- Änderungen an der Diabetes-Therapie sollten nur nach Rücksprache mit dem behandelnden Arzt erfolgen
- Im Notfall: Notruf 112

## Datenschutz

Diese App wurde nach dem Prinzip "Privacy by Design" entwickelt:

- Keine Datenübertragung an Server
- Keine Cookies
- Kein Tracking
- Alle Daten bleiben ausschließlich auf deinem Gerät (localStorage)

## Entwicklung

```bash
# Abhängigkeiten installieren
pnpm install

# Entwicklungsserver starten
pnpm dev

# Produktions-Build erstellen
pnpm build
```

## Lizenz

MIT
