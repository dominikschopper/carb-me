# Onboarding Feature Plan

## Overview

A spotlight-style onboarding tutorial using **Driver.js** - an open-source library (MIT license) with no tracking, zero dependencies, and ~5kb gzipped.

## Why Driver.js?

- **MIT License** - Free for commercial use, no restrictions
- **No Tracking** - Privacy-first, no analytics or user tracking
- **Tiny** - ~5kb gzipped, zero dependencies
- **Framework-agnostic** - Works with Svelte
- **Active** - 20.4k GitHub stars, actively maintained

## User Flow

1. User visits app for first time
2. Redirected to `/legal?onboarding=true`
3. User accepts disclaimer ("Dies ist keine medizinische Beratungs-App")
4. Redirected to home (`/`) with onboarding triggered
5. Driver.js spotlight overlay appears
6. User navigates with "Weiter" (Next) or "Überspringen" (Skip)
7. Onboarding state saved to localStorage
8. Settings: shows status + button to restart

## Onboarding Steps

### Step 1: Search (Suche)
- **Element**: `[data-onboarding="search"]`
- **Text**: "Suche nach Lebensmitteln - Tippe einen Namen ein und finde BE/KHE Werte für über 240 Lebensmittel."

### Step 2: Favorites - Adding
- **Element**: `[data-onboarding="favorite-star"]`
- **Text**: "Tippe auf den Stern, um ein Lebensmittel zu deinen Favoriten hinzuzufügen."

### Step 3: Favorites Tab
- **Element**: `[data-onboarding="tab-favorites"]`
- **Text**: "Deine Favoriten findest du hier - schneller Zugriff auf häufig verwendete Lebensmittel."

### Step 4: Meals Tab (Mahlzeiten)
- **Element**: `[data-onboarding="tab-meal"]`
- **Text**: "Stelle Mahlzeiten zusammen und berechne die Summe der Kohlenhydrate."

### Step 5: Settings - Units
- **Element**: `[data-onboarding="unit-selection"]`
- **Text**: "Wähle deine bevorzugte Einheit: BE (Broteinheiten) oder KHE (Kohlenhydrateinheiten)."

### Step 6: Settings - Energy
- **Element**: `[data-onboarding="energy-toggle"]`
- **Text**: "Zeige Brennwerte an und wähle zwischen kcal und kJ."

### Step 7: Settings - Onboarding
- **Element**: `[data-onboarding="onboarding-restart"]`
- **Text**: "Hier kannst du die Einführung jederzeit erneut starten."

## Technical Implementation

### 1. Install Driver.js

```bash
pnpm add driver.js
```

### 2. Storage

Add to `src/lib/utils/storage.ts`:

```typescript
ONBOARDING_COMPLETED: 'carbme_onboarding_completed',

interface OnboardingState {
  completed: boolean;
  skipped: boolean;
  completedAt: string | null;
}

export const onboardingStorage = new Storage<OnboardingState>(
  STORAGE_KEYS.ONBOARDING_COMPLETED,
  { completed: false, skipped: false, completedAt: null }
);
```

### 3. Onboarding Module

Create `src/lib/utils/onboarding.ts`:

```typescript
import { driver, type DriveStep } from 'driver.js';
import 'driver.js/dist/driver.css';
import { onboardingStorage } from './storage';

const steps: DriveStep[] = [
  {
    element: '[data-onboarding="search"]',
    popover: {
      title: 'Suche',
      description: 'Suche nach Lebensmitteln - Tippe einen Namen ein und finde BE/KHE Werte für über 240 Lebensmittel.',
      side: 'bottom',
      align: 'center',
    },
  },
  {
    element: '[data-onboarding="favorite-star"]',
    popover: {
      title: 'Favoriten hinzufügen',
      description: 'Tippe auf den Stern, um ein Lebensmittel zu deinen Favoriten hinzuzufügen.',
      side: 'left',
      align: 'center',
    },
  },
  {
    element: '[data-onboarding="tab-favorites"]',
    popover: {
      title: 'Favoriten',
      description: 'Deine Favoriten findest du hier - schneller Zugriff auf häufig verwendete Lebensmittel.',
      side: 'top',
      align: 'center',
    },
  },
  {
    element: '[data-onboarding="tab-meal"]',
    popover: {
      title: 'Mahlzeiten',
      description: 'Stelle Mahlzeiten zusammen und berechne die Summe der Kohlenhydrate.',
      side: 'top',
      align: 'center',
    },
  },
  {
    element: '[data-onboarding="unit-selection"]',
    popover: {
      title: 'Einheiten',
      description: 'Wähle deine bevorzugte Einheit: BE (Broteinheiten) oder KHE (Kohlenhydrateinheiten).',
      side: 'bottom',
      align: 'center',
    },
    onHighlightStarted: () => {
      // Switch to settings tab
      document.querySelector<HTMLButtonElement>('[data-onboarding="tab-settings"]')?.click();
    },
  },
  {
    element: '[data-onboarding="energy-toggle"]',
    popover: {
      title: 'Brennwerte',
      description: 'Zeige Brennwerte an und wähle zwischen kcal und kJ.',
      side: 'bottom',
      align: 'center',
    },
  },
  {
    element: '[data-onboarding="onboarding-restart"]',
    popover: {
      title: 'Einführung',
      description: 'Hier kannst du die Einführung jederzeit erneut starten.',
      side: 'top',
      align: 'center',
    },
  },
];

export function startOnboarding(onComplete?: () => void) {
  const driverObj = driver({
    showProgress: true,
    progressText: '{{current}} von {{total}}',
    nextBtnText: 'Weiter',
    prevBtnText: 'Zurück',
    doneBtnText: 'Fertig',
    popoverClass: 'carb-me-popover',
    steps,
    onDestroyStarted: () => {
      // User clicked outside or pressed escape
      if (!driverObj.hasNextStep()) {
        // Completed all steps
        onboardingStorage.set({
          completed: true,
          skipped: false,
          completedAt: new Date().toISOString(),
        });
      } else {
        // Skipped
        onboardingStorage.set({
          completed: false,
          skipped: true,
          completedAt: null,
        });
      }
      driverObj.destroy();
      onComplete?.();
    },
  });

  driverObj.drive();
}

export function getOnboardingState() {
  return onboardingStorage.get();
}

export function shouldShowOnboarding(): boolean {
  const state = onboardingStorage.get();
  return !state.completed && !state.skipped;
}
```

### 4. Custom CSS (optional)

Add to `src/lib/styles/onboarding.css`:

```css
/* Override Driver.js styles to match app theme */
.carb-me-popover {
  --driver-bg: theme('colors.white');
  --driver-text: theme('colors.gray.900');
}

.dark .carb-me-popover {
  --driver-bg: theme('colors.gray.800');
  --driver-text: theme('colors.gray.100');
}
```

### 5. Add data attributes

**SearchBar.svelte**:
```svelte
<input data-onboarding="search" ... />
```

**FoodCard.svelte** (first card or template):
```svelte
<button data-onboarding="favorite-star" ... >
```

**+page.svelte** (tabs):
```svelte
<button data-onboarding="tab-search" ...>Suche</button>
<button data-onboarding="tab-favorites" ...>Favoriten</button>
<button data-onboarding="tab-meal" ...>Mahlzeit</button>
<button data-onboarding="tab-settings" ...>Einstellungen</button>
```

**SettingsPage.svelte**:
```svelte
<div data-onboarding="unit-selection">...</div>
<div data-onboarding="energy-toggle">...</div>
<div data-onboarding="onboarding-restart">...</div>
```

### 6. Trigger onboarding

**+page.svelte**:

```typescript
import { startOnboarding, shouldShowOnboarding } from '$lib/utils/onboarding';

onMount(() => {
  // After disclaimer accepted, check if onboarding needed
  if (shouldShowOnboarding()) {
    // Small delay to let page render
    setTimeout(() => startOnboarding(), 500);
  }
});
```

### 7. Settings section

**SettingsPage.svelte**:

```svelte
<script>
  import { getOnboardingState, startOnboarding } from '$lib/utils/onboarding';

  let onboardingState = getOnboardingState();

  function restartOnboarding() {
    startOnboarding(() => {
      onboardingState = getOnboardingState();
    });
  }
</script>

<!-- Onboarding Section -->
<div class="card" data-onboarding="onboarding-restart">
  <h3 class="font-semibold mb-3">Einführung</h3>

  {#if onboardingState.completed}
    <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">
      Einführung abgeschlossen
    </p>
  {:else if onboardingState.skipped}
    <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">
      Einführung übersprungen
    </p>
  {:else}
    <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">
      Einführung noch nicht durchgeführt
    </p>
  {/if}

  <button
    class="btn-touch bg-blue-600 text-white w-full"
    onclick={restartOnboarding}
  >
    Einführung starten
  </button>
</div>
```

## Files to Create/Modify

### New Files
- `src/lib/utils/onboarding.ts` - Driver.js wrapper
- `src/lib/styles/onboarding.css` - Custom styling (optional)

### Modified Files
- `src/lib/utils/storage.ts` - Add onboarding storage
- `src/lib/components/SearchBar.svelte` - Add data attribute
- `src/lib/components/FoodCard.svelte` - Add data attribute to star
- `src/routes/+page.svelte` - Add data attributes to tabs, trigger onboarding
- `src/lib/components/SettingsPage.svelte` - Add data attributes, onboarding section

## Implementation Order

1. `pnpm add driver.js`
2. Add `onboardingStorage` to storage.ts
3. Create `onboarding.ts` with Driver.js setup
4. Add `data-onboarding` attributes to components
5. Add onboarding section to SettingsPage
6. Wire up trigger in +page.svelte after disclaimer
7. Test flow end-to-end
8. (Optional) Add custom CSS for dark mode

## Testing Checklist

- [ ] First-time user sees onboarding after disclaimer
- [ ] Spotlight highlights correct elements
- [ ] Tab switching works (search → settings)
- [ ] "Weiter" advances steps
- [ ] "Überspringen" (close/escape) marks as skipped
- [ ] Completing all steps marks as completed
- [ ] State persists in localStorage
- [ ] Settings shows correct status
- [ ] Restart button works
- [ ] Works in dark mode
- [ ] Works on mobile

## Sources

- [Driver.js Documentation](https://driverjs.com/)
- [Best Open-Source Product Tour Libraries](https://userorbit.com/blog/best-open-source-product-tour-libraries)
- [10 Best JavaScript Onboarding Libraries](https://www.chameleon.io/blog/javascript-product-tours)
