# Implementation Plan: carb.me - Diabetiker PWA

## Überblick

Entwicklung einer SvelteKit Progressive Web App (PWA) für Diabetiker zur schnellen Berechnung von Broteinheiten (BE) und Kohlenhydrateinheiten (KHE). Die App nutzt 246 vordefinierte deutsche Lebensmittel aus einer statischen JSON-Datei und funktioniert vollständig offline.

---

## Phase 1: Core Foundation (Prio 1 - Essentiell)

### ✅ 1. Type Definitions & Utilities
- [ ] `src/lib/types/food.ts` - TypeScript Interfaces
- [ ] `src/lib/utils/calculator.ts` - BE/KHE Berechnungslogik
- [ ] `src/lib/utils/storage.ts` - Type-safe localStorage Wrapper
- [ ] `src/lib/utils/formatting.ts` - Deutsche Zahlen-/Datumsformatierung

### ✅ 2. Search Implementation
- [ ] `pnpm install fuse.js` ausführen
- [ ] `src/lib/utils/search.ts` - Fuzzy-Search mit Fuse.js

### ✅ 3. State Management
- [ ] `src/lib/stores/foods.svelte.ts` - FoodStore mit Svelte 5 runes
- [ ] `src/lib/stores/meal.svelte.ts` - MealStore

### ✅ 4. Core Components
- [ ] `src/lib/components/SearchBar.svelte`
- [ ] `src/lib/components/FoodCard.svelte`
- [ ] `src/lib/components/FoodList.svelte`
- [ ] `src/lib/components/Calculator.svelte`
- [ ] `src/lib/components/FavoritesList.svelte`

### ✅ 5. Layout Components
- [ ] `src/lib/components/Header.svelte`
- [ ] `src/lib/components/TabBar.svelte`

### ✅ 6. Styling System
- [ ] `src/lib/styles/design-tokens.css`
- [ ] Import in `src/routes/layout.css`

### ✅ 7. Main App
- [ ] `src/routes/+page.svelte` - Integration aller Components

---

## Phase 2: Enhanced Features (Prio 2)

### ✅ 8. Meal Composition
- [ ] `src/lib/components/MealComposer.svelte`

### ✅ 9. Custom Foods
- [ ] `src/lib/components/CustomFoodForm.svelte`
- [ ] `addCustomFood()` Methode im foodStore

### ✅ 10. PWA Configuration
- [ ] `vite.config.ts` - SvelteKitPWA Plugin konfigurieren
- [ ] `static/icon-192.png` - PWA Icon erstellen
- [ ] `static/icon-512.png` - PWA Icon erstellen
- [ ] `src/app.html` - PWA Meta-Tags hinzufügen
- [ ] `src/routes/+layout.svelte` - Service Worker registrieren

### ✅ 11. Offline Indicator
- [ ] `src/lib/components/OfflineIndicator.svelte`

---

## Phase 3: Nice-to-Have (Prio 3)

### ✅ 12. Dark Mode
- [ ] `src/lib/stores/theme.svelte.ts`
- [ ] `src/lib/components/ThemeToggle.svelte`
- [ ] Dark mode CSS Varianten

### ✅ 13. History
- [ ] `src/lib/stores/history.svelte.ts`
- [ ] `src/lib/components/HistoryList.svelte`

### ✅ 14. Comparison View
- [ ] `src/lib/components/ComparisonView.svelte`

---

## Verifizierung

### Essential Features (Must Work)
- [ ] **Suche:** "apfel" eingeben → Apfel als Ergebnis
- [ ] **Fuzzy Search:** "birn" eingeben → Birne gefunden
- [ ] **Calculator:** Apfel auswählen, 150g eingeben → BE und KHE anzeigen
- [ ] **Favoriten:** Apfel favorisieren → Nach Reload noch in Favoriten
- [ ] **Offline:** DevTools Network offline → App funktioniert weiter
- [ ] **PWA Install:** Install-Banner erscheint, App installierbar

### Enhanced Features
- [ ] **Mahlzeit:** Apfel 150g + Birne 100g → Gesamt-BE/KHE korrekt
- [ ] **Custom Food:** "Omas Kuchen" mit 50g KH/100g → gBE/gKHE auto-berechnet
- [ ] **Persistent Meal:** Mahlzeit erstellen → Browser schließen → Wiederherstellen

### Nice-to-Have
- [ ] **Dark Mode:** Toggle → Farben wechseln → Preference gespeichert
- [ ] **History:** 3 Berechnungen → History zeigt alle → Altes Ergebnis laden
- [ ] **Comparison:** Apfel vs. Birne → Unterschiede sichtbar

---

## Notizen

**Entwicklungsumgebung:**
- fish shell mit nvm (vor pnpm: `nvm use --lts`)
- Package Manager: `pnpm`

**Verfügbare Kommandos:**
```bash
pnpm dev          # Development Server
pnpm build        # Production Build
pnpm preview      # Preview Build
pnpm check        # Type Checking
pnpm lint         # Linting & Formatting Check
pnpm format       # Code formatieren
pnpm test         # Tests ausführen
```
