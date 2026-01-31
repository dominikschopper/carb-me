<script lang="ts">
  import { settingsStore } from '$lib/stores/settings.svelte';
  import type { EnergyUnitType, BlsCategory } from '$lib/types/food';
  import { BLS_CATEGORIES } from '$lib/types/food';

  const settings = $derived(settingsStore.settings);

  function handleUnitChange(unit: 'BE' | 'KHE') {
    settingsStore.setPreferredUnit(unit);
  }

  function handleShowEnergyChange(show: boolean) {
    settingsStore.setShowEnergy(show);
  }

  function handleEnergyUnitChange(unit: EnergyUnitType) {
    settingsStore.setEnergyUnit(unit);
  }

  function handleCategoryToggle(category: BlsCategory, hide: boolean) {
    settingsStore.toggleHiddenCategory(category, hide);
  }

  const CATEGORY_CONFIG = [
    {
      key: BLS_CATEGORIES.FERTIGGERICHTE,
      label: 'Fertiggerichte (vorw. pflanzlich)',
      description: 'Industriell hergestellte Fertiggerichte.',
    },
    {
      key: BLS_CATEGORIES.FERTIGGERICHTE_SUESS,
      label: 'Fertiggerichte (vorw. tierisch)',
      description: 'Süße Fertiggerichte aus (Pudding, Desserts, etc.).',
    },
    {
      key: BLS_CATEGORIES.ALKOHOLISCHE_GETRAENKE,
      label: 'Getränke (mit Alkohol)',
      description: 'Bier, Wein, Cocktails und Spirituosen.',
    },
    {
      key: BLS_CATEGORIES.GETRAENKE,
      label: 'Getränke (alkoholfrei)',
      description: 'Säfte, Softdrinks, Wasser und Tee.',
    },
    {
      key: BLS_CATEGORIES.GEWUERZE_SAUCEN,
      label: 'Gewürze + Saucen',
      description: 'Gewürze, Ketchup, Mayonnaise und Dressings.',
    },
  ] as const;

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

  <!-- Energy Display -->
  <div class="card">
    <h3 class="mb-3 font-semibold text-gray-900 dark:text-gray-100">Brennwert-Anzeige</h3>
    <p class="mb-4 text-sm text-gray-600 dark:text-gray-400">
      Zeige zusätzlich den Brennwert (Kalorien) bei Lebensmitteln an.
    </p>

    <label class="flex cursor-pointer items-center gap-3 rounded-lg border-2 p-3 transition-colors {settings.showEnergy
      ? 'border-blue-600 bg-blue-50 dark:border-blue-500 dark:bg-blue-900/30'
      : 'border-gray-300 hover:border-gray-400 dark:border-gray-600 dark:hover:border-gray-500'}">
      <input
        type="checkbox"
        checked={settings.showEnergy}
        onchange={(e) => handleShowEnergyChange(e.currentTarget.checked)}
        class="h-5 w-5 flex-shrink-0 rounded text-blue-600 focus:ring-2 focus:ring-blue-500"
      />
      <div class="flex-1 min-w-0">
        <div class="font-medium text-gray-900 dark:text-gray-100">Brennwerte anzeigen</div>
        <div class="text-sm text-gray-600 dark:text-gray-400">kcal oder kJ pro 100g</div>
      </div>
    </label>

    {#if settings.showEnergy}
      <div class="mt-3 space-y-2">
        <p class="text-sm font-medium text-gray-700 dark:text-gray-300">Einheit</p>
        <div class="flex gap-3">
          <label class="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border-2 p-3 transition-colors {settings.energyUnit === 'kcal'
            ? 'border-blue-600 bg-blue-50 dark:border-blue-500 dark:bg-blue-900/30'
            : 'border-gray-300 hover:border-gray-400 dark:border-gray-600 dark:hover:border-gray-500'}">
            <input
              type="radio"
              name="energyUnit"
              value="kcal"
              checked={settings.energyUnit === 'kcal'}
              onchange={() => handleEnergyUnitChange('kcal')}
              class="h-4 w-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
            />
            <span class="font-medium text-gray-900 dark:text-gray-100">kcal</span>
          </label>
          <label class="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border-2 p-3 transition-colors {settings.energyUnit === 'kJ'
            ? 'border-blue-600 bg-blue-50 dark:border-blue-500 dark:bg-blue-900/30'
            : 'border-gray-300 hover:border-gray-400 dark:border-gray-600 dark:hover:border-gray-500'}">
            <input
              type="radio"
              name="energyUnit"
              value="kJ"
              checked={settings.energyUnit === 'kJ'}
              onchange={() => handleEnergyUnitChange('kJ')}
              class="h-4 w-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
            />
            <span class="font-medium text-gray-900 dark:text-gray-100">kJ</span>
          </label>
        </div>
      </div>
    {/if}
  </div>

  <!-- Search Results Filter -->
  <div class="card">
    <h3 class="mb-3 font-semibold text-gray-900 dark:text-gray-100">Suchergebnisse</h3>
    <p class="mb-4 text-sm text-gray-600 dark:text-gray-400">
      Passe an, welche Lebensmittel in den Suchergebnissen angezeigt werden.
    </p>

    <div class="space-y-3">
      {#each CATEGORY_CONFIG as category}
        <label class="flex cursor-pointer items-center gap-3 rounded-lg border-2 p-3 transition-colors {settingsStore.isCategoryHidden(category.key)
          ? 'border-blue-600 bg-blue-50 dark:border-blue-500 dark:bg-blue-900/30'
          : 'border-gray-300 hover:border-gray-400 dark:border-gray-600 dark:hover:border-gray-500'}">
          <input
            type="checkbox"
            checked={settingsStore.isCategoryHidden(category.key)}
            onchange={(e) => handleCategoryToggle(category.key, e.currentTarget.checked)}
            class="h-5 w-5 flex-shrink-0 rounded text-blue-600 focus:ring-2 focus:ring-blue-500"
          />
          <div class="flex-1 min-w-0">
            <div class="font-medium text-blue-600 dark:text-gray-100">{category.label} ausblenden</div>
            <div class="text-sm text-gray-600 dark:text-gray-400">
              <span class="text-gray-200">BLS Code {category.key}:</span>
              {category.description}
            </div>
          </div>
        </label>
      {/each}
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
    <p class="text-sm text-gray-600 dark:text-gray-400">carb-me v1.7.0</p>
    <p class="mt-1 text-xs text-gray-500 dark:text-gray-500">
      Open Source auf <a rel="noopener noreferrer" href="https://github.com/dominikschopper/carb-me" class="text-blue-600 hover:underline dark:text-blue-400">github.com/dominikschopper</a>
    </p>
  </div>
</div>
