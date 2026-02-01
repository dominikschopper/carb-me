# Implementierungsplan: Onboarding Feature mit Driver.js

## Überblick

Implementierung einer 10-stufigen geführten Tour mit Driver.js (MIT-Lizenz, ~5kb, keine Abhängigkeiten) für die carb-me-Anwendung unter Verwendung von Svelte 5 Runes und bestehenden Codebase-Konventionen.

## Installation

```bash
pnpm add driver.js
```

## Dateien

### Neu zu erstellen (2 Dateien)
1. **`src/lib/utils/onboarding.ts`** - Haupt-Onboarding-Service mit Driver.js Wrapper
2. **`src/lib/styles/driver-theme.css`** - Optionales Custom Theme für Dark Mode

### Zu modifizieren (8 Dateien)
1. **`src/lib/utils/storage.ts`** - STORAGE_KEYS.ONBOARDING und onboardingStorage hinzufügen
2. **`src/lib/components/SearchBar.svelte`** - data-onboarding Attribut hinzufügen
3. **`src/lib/components/FoodCard.svelte`** - data-onboarding zum Stern-Button
4. **`src/lib/components/TabBar.svelte`** - data-onboarding zu allen Tabs
5. **`src/lib/components/CustomFoodsList.svelte`** - data-onboarding zum Hinzufügen-Button
6. **`src/lib/components/SettingsPage.svelte`** - data-onboarding + Neustart-Sektion
7. **`src/routes/+page.svelte`** - Onboarding nach Disclaimer-Akzeptanz triggern + Demo-Suche
8. **`src/lib/styles/app.css`** - Driver.js CSS importieren

## Onboarding-Schritte

Die Tour umfasst 10 Schritte:

1. **Lebensmittel suchen** - Zeigt die Suchleiste und triggert automatisch eine Demo-Suche nach "Apfel"
2. **Favoriten markieren** - Zeigt den Stern-Button auf einem Lebensmittel
3. **Favoriten-Ansicht** - Zeigt wo Favoriten im Suche-Tab zu finden sind
4. **Eigene Lebensmittel** - Navigiert zum "Eigene" Tab
5. **Lebensmittel hinzufügen** - Zeigt den Button zum Hinzufügen eigener Lebensmittel
6. **Mahlzeiten zusammenstellen** - Zeigt den Mahlzeiten-Tab
7. **Einstellungen** - Navigiert zu den Einstellungen
8. **Bevorzugte Einheit** - Zeigt die BE/KHE Auswahl
9. **Brennwert-Anzeige** - Zeigt die Energieanzeige-Option (kcal/kJ)
10. **Suchergebnisse filtern** - Zeigt die Kategoriefilter

## Implementierungsschritte

### 1. Storage Layer (`src/lib/utils/storage.ts`)

```typescript
// STORAGE_KEYS erweitern
export const STORAGE_KEYS = {
  // ... existing keys ...
  ONBOARDING: 'carbme_onboarding',
} as const;

// Interface hinzufügen
export interface OnboardingState {
  completed: boolean;
  skipped: boolean;
  lastShown?: number;
}

// Storage-Instanz erstellen
export const onboardingStorage = new Storage<OnboardingState>(
  STORAGE_KEYS.ONBOARDING,
  { completed: false, skipped: false }
);
```

### 2. Onboarding Service (`src/lib/utils/onboarding.ts` - NEU)

Der Service ist vollständig implementiert mit:
- 10 Driver.js Steps mit deutschen Texten
- Auto-Search Demo für "Apfel" im ersten Schritt
- Tab-Navigation zu "Eigene" und "Einstellungen"
- Cleanup der Suchquery nach Abschluss/Abbruch
- State Management via localStorage

### 3. CSS Import

In `src/lib/styles/app.css`:
```css
@import 'driver.js/dist/driver.css';
```

### 4. Component Modifications

Alle relevanten Komponenten haben `data-onboarding` Attribute:
- SearchBar: `search-bar`
- FoodCard: `favorite-star` (auf dem Stern-Button)
- TabBar: `tab-search`, `tab-custom`, `tab-meal`, `tab-settings`
- CustomFoodsList: `add-custom-food`
- SettingsPage: `settings-unit`, `settings-energy`, `settings-categories`

### 5. Main Page Integration

In `+page.svelte`:
- Onboarding wird nach Disclaimer-Akzeptanz automatisch gestartet
- Demo-Suche nach "Apfel" beim ersten Schritt
- Tab-Navigation zu Custom und Settings
- Cleanup der Suchquery nach Tour-Ende

### 6. Settings Restart Button

In SettingsPage wurde ein "App-Tour erneut starten" Button hinzugefügt, der:
- Den Onboarding-State zurücksetzt
- Optionaler Page-Reload triggert

## Edge Cases

1. **Tab-Navigation während Tour**:
   - Step 4 navigiert zu `activeTab = 'custom'`
   - Step 7 navigiert zu `activeTab = 'settings'`

2. **Auto-Search Demo**:
   - Step 1 triggert automatisch `foodStore.setSearchQuery('Apfel')`
   - Zeigt Food Cards für Favoriten-Stern Demo in Step 2
   - Suchquery wird bei onComplete/onSkip geleert

3. **Keine Custom Foods vorhanden**: Tour funktioniert auch im Empty State

4. **SSR Safety**: Alle Onboarding-Funktionen sind mit `typeof window !== 'undefined'` geschützt

5. **User schließt Browser während Tour**: `onDestroyed` setzt `skipped: true`

## Verifikation

### Funktionstests
- ✅ Onboarding startet automatisch nach erster Disclaimer-Akzeptanz
- ✅ Alle 10 Schritte mit Element-Highlighting
- ✅ Auto-Search Demo triggert Suche nach "Apfel"
- ✅ Tab-Navigation funktioniert korrekt
- ✅ Neustart-Button in Settings
- ✅ Suchquery wird nach Tour geleert

### Storage Tests
- ✅ `carbme_onboarding` Key in localStorage
- ✅ State bleibt über Page-Reloads bestehen
- ✅ State wird mit "Alle Daten löschen" entfernt

### UI/UX Tests
- ✅ Fortschrittsanzeige zeigt "X von 10"
- ✅ Deutscher Text korrekt
- ✅ Alle data-Attribute vorhanden

## Technische Details

- **Driver.js**: ~5kb gzipped, MIT-Lizenz, keine Dependencies
- **Svelte 5**: Nutzung von $effect() (client-side only, kein onMount nötig)
- **Accessibility**: Driver.js beinhaltet ARIA labels
- **Keyboard**: Tastatur-Navigation (Tab, Escape) unterstützt
- **Mobile**: Automatische responsive Positionierung
- **Dark Mode**: CSS custom properties mit `.dark` Selector

## Implementierungsstatus

✅ Alle Schritte abgeschlossen:
1. ✅ Driver.js installiert
2. ✅ Storage erweitert
3. ✅ Onboarding Service erstellt
4. ✅ Data-Attribute hinzugefügt
5. ✅ CSS import hinzugefügt
6. ✅ Main-Page Integration
7. ✅ Neustart-Button in Settings
