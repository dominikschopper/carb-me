# Code Review: carb-me

Date: 2026-02-08

---

## 1. Refactoring Candidates

### 1.1 `+page.svelte` — Dead demo code (lines 83–104)

`addToMeal()` and `deleteFromMeal()` contain a hardcoded apple `FoodItem` and are only called from the onboarding flow. This is test/demo data living in production code.

```ts
function addToMeal() {
  const foodApple: FoodItem = {
    blsCode: 'F110100',
    name: 'Apfel roh',
    // ...hardcoded values
  };
  mealStore.addItem(foodApple, 100, .97, 1.17);
}
```

**Recommendation:** Move the demo food item to the onboarding service. The onboarding service already receives callback hooks (`onNavigateToMeal`), so it can own the demo data instead of leaking it into the page shell.

---

### 1.2 `+page.svelte` — Onboarding orchestration (lines 106–157)

`startOnboardingIfNeeded()` is 50 lines of nested callbacks, `setTimeout` polling (every 2.5s checking `swStore.updateAvailable`), and navigation side effects. This logic belongs in the onboarding service, not the page component.

**Recommendation:** Move the "wait for update notification to dismiss" logic into `onboardingService.startTour()` itself. The page should only call `onboardingService.startTour(callbacks)` — the service decides when to actually begin.

---

### 1.3 `+page.svelte` — Double `$effect` for loading + food database

Two separate `$effect` blocks (lines 33–43 and 46–50) both run on mount, with one depending on the `loading` state the other sets. This creates an implicit timing dependency.

```ts
$effect(() => {
  foodStore.loadFoodDatabase().then(() => { loading = false; });
});
```

Meanwhile `foodStore` constructor (line 43 of `foods.svelte.ts`) also calls `loadFoodDatabase()` — so it gets called twice.

**Recommendation:** Remove the duplicate call. The store constructor already loads the database. Use `foodStore.isLoading` directly instead of a local `loading` state.

---

### 1.4 `foods.svelte.ts` — Deprecated `removeCustomFood()` (lines 116–123)

Dead method that searches by `name` instead of `blsCode`. It's marked deprecated but still exists.

```ts
removeCustomFood(name: string) {
  // Deprecated: use deleteCustomFood instead
```

**Recommendation:** Delete it. `deleteCustomFood(blsCode)` is the only caller path.

---

### 1.5 `foods.svelte.ts` — Repeated `initializeSearch()` calls

Every mutation (`addCustomFood`, `updateCustomFood`, `deleteCustomFood`, `loadFoodDatabase`) rebuilds the entire Fuse.js index by calling `initializeSearch([...this.allFoods, ...this.customFoods])`. This creates a new array and a new Fuse instance each time.

**Recommendation:** Centralize via a single reactive derivation or a `rebuildIndex()` method that debounces or defers rebuilds if multiple mutations happen in quick succession.

---

### 1.6 `settings.svelte.ts` — `window.location.reload()` side effect (line 85)

`clearAllData()` in the store triggers a hard page reload. Stores should not cause navigation side effects — that's a component concern.

**Recommendation:** Return a signal or let the component call `window.location.reload()` after `clearAllData()` completes.

---

### 1.7 `AddCustomFoodDialog.svelte` — 569 lines

Largest component. Handles form state, validation, energy unit conversion (kcal/kJ), edit mode, create mode, and dialog lifecycle. The script section alone is ~180 lines.

**Recommendation:** Extract the form validation and energy conversion logic into a utility (e.g. `custom-foods/form.ts`). The component should focus on rendering; the utility owns the rules.

---

### 1.8 `Calculator.svelte` — Build warning: non-reactive `inputElement`

```
`inputElement` is updated, but is not declared with `$state(...)`.
Changing its value will not correctly trigger updates.
```

Line 12: `let inputElement: HTMLInputElement;` should use `$state`.

**Fix:** `let inputElement = $state<HTMLInputElement | null>(null);`

---

## 2. Design Pattern Issues

### 2.1 Service worker manual registration conflicts with VitePWA

`serviceWorker.svelte.ts` line 29 manually registers `/sw.js`:

```ts
navigator.serviceWorker.register(`${basePath}/sw.js`)
```

But VitePWA already handles service worker registration via its own virtual module (`virtual:pwa-register`). This causes:
- **`[404] GET /sw.js`** in dev mode (VitePWA serves the dev SW at a different path)
- Double registration in production (VitePWA registers its own, then this code registers again)

**Recommendation:** Use VitePWA's `registerSW` from `virtual:pwa-register` instead of manual `navigator.serviceWorker.register()`. The update detection and `registration.waiting` logic can still work with the registration object VitePWA provides.

---

### 2.2 `STORAGE_KEYS.THEME` is unused

`storage.ts` line 10 defines `THEME: 'carbme_theme'` but no storage instance uses it. Dark mode is now handled via `prefers-color-scheme` (no JS theme toggle).

**Recommendation:** Remove the unused key.

---

### 2.3 Unused settings properties

`AppSettings` includes `showCategories`, `showTags`, and `itemsPerPage` but none of these are read or set anywhere in the UI. They are default values that get persisted but never used.

**Recommendation:** Remove unused fields from `AppSettings` type and `DEFAULT_SETTINGS`.

---

### 2.4 Mixed language in code comments

Most of the codebase uses English for code comments, but some German comments remain:
- `settings.svelte.ts:45` — `// Kategorie hinzufügen`
- `settings.svelte.ts:51` — `// Kategorie entfernen`
- `calculator.ts:56-57` — `// Konvertiert kcal zu kJ`
- `foods.svelte.ts:21` — `// BLS-Kategorie-Filter anwenden (Single Pass!)`

**Recommendation:** Pick one language for code comments and be consistent. (UI strings are German — that's fine and separate from code comments.)

---

### 2.5 `search.ts` — Module-level mutable state

```ts
let fuseInstance: Fuse<FoodItem> | null = null;
let lastFoodsLength = 0;
```

These module-level variables create implicit shared state. The staleness check (`foods.length !== lastFoodsLength`) is fragile — adding then removing a food would pass the length check but have a different dataset.

**Recommendation:** Either make the Fuse instance part of the `FoodStore` class, or use a hash/reference check instead of length comparison.

---

## 3. Security

### 3.1 No Content-Security-Policy headers

The app has no CSP headers. No `hooks.server.ts` exists, and `app.html` has no meta CSP tags. While the app has no XSS vectors today (no `{@html}`, no `innerHTML`), CSP provides defense-in-depth.

**Recommendation:** Since this is a static SPA on GitHub Pages, add a CSP `<meta>` tag to `app.html`:

```html
<meta http-equiv="Content-Security-Policy"
  content="default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; font-src 'self'; img-src 'self' data:; connect-src 'self';">
```

Note: `'unsafe-inline'` for styles is needed because Svelte injects scoped styles at runtime.

---

### 3.2 Custom food input — no max length or max value validation

`AddCustomFoodDialog` validates that `name.trim().length > 0` and `kh > 0`, but:
- No max length on the name field (could create oversized localStorage entries)
- No upper bound on numeric values (e.g., `kh = 999999` would produce nonsense calculations)
- No validation on energy values beyond `parseFloat()`

**Recommendation:** Add reasonable bounds:
- Name: max 100 characters
- kh per 100g: 0–100 (carbs cannot exceed 100g per 100g)
- kcal per 100g: 0–900 (fat is 9 kcal/g, so theoretical max is ~900)
- kJ per 100g: 0–3800

---

### 3.3 PWA `devOptions.enabled: true` in production config

`vite.config.ts` line 58–61:

```ts
devOptions: {
  enabled: true,
  type: 'module'
}
```

This enables the service worker in dev mode, which can cause caching issues during development and the `sw.js` 404 error.

**Recommendation:** Guard with an environment check:
```ts
devOptions: {
  enabled: process.env.NODE_ENV !== 'production',
  type: 'module'
}
```

Or simply set `enabled: false` if you don't need SW during development.

---

### 3.4 Runtime caching pattern is overly broad

`vite.config.ts` line 26:

```ts
urlPattern: /^https:\/\/.*\.(?:png|jpg|jpeg|svg|gif|webp)$/
```

This caches images from *any* HTTPS domain. Since the app doesn't load external images, this rule is unnecessary.

**Recommendation:** Remove the runtime caching rule entirely, or scope it to your own domain.

---

### 3.5 localStorage data is unvalidated on read

`Storage.get()` parses whatever JSON is in localStorage and merges it with defaults. If a user (or browser extension) injects malformed data, the app would use it without validation.

```ts
get(): T {
  const parsed = JSON.parse(item);
  return { ...this.defaultValue, ...parsed };
}
```

For example, setting `carbme_settings` to `{"preferredUnit": "<script>alert(1)</script>"}` would propagate through the app. Svelte's template escaping prevents XSS here, but the data would still be semantically invalid.

**Recommendation:** Add a schema validation step (e.g. a `validate` callback in the `Storage` constructor) for critical storage keys like settings and custom foods.

---

## 4. Summary

| Priority | Finding | Location |
|----------|---------|----------|
| High | Double `loadFoodDatabase()` call | `+page.svelte:46–50` + `foods.svelte.ts:43` |
| High | Manual SW registration conflicts with VitePWA | `serviceWorker.svelte.ts:29` |
| High | `inputElement` not reactive (build warning) | `Calculator.svelte:12` |
| High | Dead demo data in production | `+page.svelte:83–104` |
| Medium | PWA devOptions always enabled | `vite.config.ts:58–61` |
| Medium | Onboarding orchestration too complex in page | `+page.svelte:106–157` |
| Medium | No CSP headers | `app.html` |
| Medium | No input bounds on custom food form | `AddCustomFoodDialog.svelte` |
| Medium | `window.location.reload()` in store | `settings.svelte.ts:85` |
| Medium | Deprecated `removeCustomFood()` still exists | `foods.svelte.ts:116–123` |
| Medium | Unused settings fields (`showCategories`, `showTags`, `itemsPerPage`) | `storage.ts`, `food.ts` |
| Medium | Unused `STORAGE_KEYS.THEME` | `storage.ts:10` |
| Low | Repeated `initializeSearch()` calls | `foods.svelte.ts` |
| Low | `AddCustomFoodDialog` could be split | `AddCustomFoodDialog.svelte` (569 lines) |
| Low | Module-level mutable state in `search.ts` | `search.ts:18–19` |
| Low | Mixed German/English code comments | various |
| Low | Overly broad runtime caching pattern | `vite.config.ts:26` |
| Low | No localStorage schema validation | `storage.ts:36–54` |
