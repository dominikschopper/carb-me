<script lang="ts">
  import { settingsStore } from '$lib/stores/settings.svelte';

  const settings = $derived(settingsStore.settings);

  function handleUnitChange(unit: 'BE' | 'KHE') {
    settingsStore.setPreferredUnit(unit);
  }

  function handleClearData() {
    if (
      confirm(
        'Möchtest du wirklich alle Daten löschen? Das umfasst Favoriten, eigene Lebensmittel, Mahlzeiten und Einstellungen. Diese Aktion kann nicht rückgängig gemacht werden.'
      )
    ) {
      settingsStore.clearAllData();
    }
  }
</script>

<div class="space-y-6">
  <h2 class="text-xl font-bold text-gray-900 dark:text-gray-100">Einstellungen</h2>

  <!-- Preferred Unit -->
  <div class="card">
    <h3 class="mb-3 font-semibold text-gray-900 dark:text-gray-100">Bevorzugte Einheit</h3>
    <p class="mb-4 text-sm text-gray-600 dark:text-gray-400">
      Wähle, ob du BE (Broteinheiten) oder KHE (Kohlenhydrateinheiten) bevorzugst. Die App zeigt dann nur deine bevorzugte
      Einheit an.
    </p>

    <div class="space-y-3">
      <label class="flex cursor-pointer items-start gap-3 rounded-lg border-2 p-3 transition-colors {settings.preferredUnit === 'BE'
        ? 'border-blue-600 bg-blue-50 dark:border-blue-500 dark:bg-blue-900/30'
        : 'border-gray-300 hover:border-gray-400 dark:border-gray-600 dark:hover:border-gray-500'}">
        <input
          type="radio"
          name="unit"
          value="BE"
          checked={settings.preferredUnit === 'BE'}
          onchange={() => handleUnitChange('BE')}
          class="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600 focus:ring-2 focus:ring-blue-500"
        />
        <div class="flex-1 min-w-0">
          <div class="font-medium text-gray-900 dark:text-gray-100 hyphens-auto break-words" lang="de">BE (Broteinheiten)</div>
          <div class="text-sm text-gray-600 dark:text-gray-400 hyphens-auto break-words" lang="de">1 BE = 12g Kohlenhydrate</div>
        </div>
      </label>

      <label class="flex cursor-pointer items-start gap-3 rounded-lg border-2 p-3 transition-colors {settings.preferredUnit === 'KHE'
        ? 'border-blue-600 bg-blue-50 dark:border-blue-500 dark:bg-blue-900/30'
        : 'border-gray-300 hover:border-gray-400 dark:border-gray-600 dark:hover:border-gray-500'}">
        <input
          type="radio"
          name="unit"
          value="KHE"
          checked={settings.preferredUnit === 'KHE'}
          onchange={() => handleUnitChange('KHE')}
          class="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600 focus:ring-2 focus:ring-blue-500"
        />
        <div class="flex-1 min-w-0">
          <div class="font-medium text-gray-900 dark:text-gray-100 hyphens-auto break-words" lang="de">KHE (Kohlenhydrateinheiten)</div>
          <div class="text-sm text-gray-600 dark:text-gray-400 hyphens-auto break-words" lang="de">1 KHE = 10g Kohlenhydrate</div>
        </div>
      </label>
    </div>
  </div>

  <!-- Data Management -->
  <div class="card">
    <h3 class="mb-3 font-semibold text-gray-900 dark:text-gray-100">Datenverwaltung</h3>
    <p class="mb-4 text-sm text-gray-600 dark:text-gray-400">
      Lösche alle lokal gespeicherten Daten, um die App zurückzusetzen.
    </p>

    <button
      onclick={handleClearData}
      class="btn-touch w-full border-2 border-red-500 bg-white text-red-600 hover:bg-red-50 dark:bg-gray-800 dark:hover:bg-red-900/30"
      type="button"
    >
      <span class="material-symbols-outlined mr-2 inline-block align-middle leading-none">delete_forever</span>
      Alle Daten löschen
    </button>
  </div>

  <!-- Legal Links -->
  <div class="card">
    <h3 class="mb-3 font-semibold text-gray-900 dark:text-gray-100">Rechtliches</h3>

    <a
      href="/legal"
      class="flex items-center gap-2 rounded-lg p-3 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
    >
      <span class="material-symbols-outlined leading-none">gavel</span>
      <span>Haftungsausschluss & Datenschutz</span>
      <span class="material-symbols-outlined ml-auto leading-none">chevron_right</span>
    </a>
  </div>

  <!-- App Info -->
  <div class="card text-center">
    <p class="text-sm text-gray-600 dark:text-gray-400">carb-me v1.1.0</p>
    <p class="mt-1 text-xs text-gray-500 dark:text-gray-500">
      Open Source auf <a href="https://github.com" class="text-blue-600 hover:underline dark:text-blue-400">GitHub</a>
    </p>
  </div>
</div>
