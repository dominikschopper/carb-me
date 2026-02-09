# Code Review: carb-me

Date: 2026-02-08

---

## Bug in UpdateDialog Service

`/src/lib/features/update/serviceWorker.svelte.ts`

i changed this code

```typescript
          setInterval(() => {
            console.log('[SW] Checking for updates...');
            registration.update();
          }, 60 * 60 * 1000);
```
to

```
          setInterval(() => {
            console.log('[SW] Checking for updates...');
            registration.update();
          }, 2 * 2 * 1000);

```
and could never see the console.log message and when i changed the LocalStorage key `carbme_last_seen_version` to an older
version it didnt show the updateDialog, i had to lock the screen and unlock it and then the UpdateDialog hit, the setInterval
doesnt seem to be working

## Bug on `pnpm dev` console

after changing the serviceworker registration i now get the message

```
[404] GET /sw.js
```

in the console regularily

## 4. Summary

|Done|Priority | Finding                                       | Location |
|----|---------|-----------------------------------------------|-------------------------------------------------|
|yes |High     | Double `loadFoodDatabase()` call              | `+page.svelte:46–50` + `foods.svelte.ts:43`     |
|yes |High     | Manual SW registration conflicts with VitePWA | `serviceWorker.svelte.ts:29`                    |
|yes |High     | `inputElement` not reactive (build warning)   | `Calculator.svelte:12`                          |
|yes |High     | Dead demo data in production                  | `+page.svelte:83–104`                           |
|yes |Medium   | PWA devOptions always enabled                 | `vite.config.ts:58–61`                          |
|yes |Medium   | Onboarding orchestration too complex in page  | `+page.svelte:106–157`                          |
|yes |Medium   | No CSP headers                                | `app.html`                                      |
|yes |Medium   | No input bounds on custom food form           | `AddCustomFoodDialog.svelte`                    |
|yes |Medium   | `window.location.reload()` in store           | `settings.svelte.ts:85`                         |
|yes |Medium   | Deprecated `removeCustomFood()` still exists  | `foods.svelte.ts:116–123`                       |
|yes |Medium   | Unused settings fields (`showCategories`, `showTags`, `itemsPerPage`) | `storage.ts`, `food.ts` |
|yes |Medium   | Unused `STORAGE_KEYS.THEME`                   | `storage.ts:10`                                 |
|yes |Low      | Repeated `initializeSearch()` calls           | `foods.svelte.ts`                               |
|yes |Low      | Module-level mutable state in `search.ts`     | `search.ts:18–19`                               |
|yes |Low      | Mixed German/English code comments            | various                                         |
|yes |Low      | Overly broad runtime caching pattern          | `vite.config.ts:26`                             |
|    |Low      | `AddCustomFoodDialog` could be split          | `AddCustomFoodDialog.svelte` (569 lines)        |
|    |Low      | No localStorage schema validation             | `storage.ts:36–54`                              |
