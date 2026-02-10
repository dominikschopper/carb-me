<script lang="ts">
  import { settingsStore } from '$lib/stores/settings.svelte';
  import type { EnergyUnitType, BlsCategory } from '$lib/types/food';
  import { BLS_CATEGORIES } from '$lib/types/food';
  import { onboardingService } from '$lib/features/onboarding/service';
  import { APP_VERSION, CHANGELOG_URL } from '$lib/version';

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
      key: BLS_CATEGORIES.FERTIGGERICHTE_PFLANZLICH,
      label: 'Fertiggerichte (vorw. pflanzlich)',
      description: 'Fertiggerichte (Salate, Suppen, ...)',
    },
    {
      key: BLS_CATEGORIES.FERTIGGERICHTE_TIERISCH,
      label: 'Fertiggerichte (vorw. tierisch)',
      description: 'Fertiggerichte (Frikadelle, Ragout ...)',
    },
    {
      key: BLS_CATEGORIES.ALKOHOLISCHE_GETRAENKE,
      label: 'Getränke (mit Alkohol)',
      description: 'Bier, Wein, Cocktails und Spirituosen.',
    },
    {
      key: BLS_CATEGORIES.GETRAENKE,
      label: 'Getränke (alkoholfrei)',
      description: 'Softdrinks, ... (Säfte sind unter Obst).',
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
      window.location.reload();
    }
  }

  function handleRestartOnboarding() {
    onboardingService.reset();
    if (confirm('Die Tour wird beim nächsten Laden der App automatisch gestartet. Möchtest du die Seite jetzt neu laden?')) {
      window.location.reload();
    }
  }
</script>

<div class="settings">
  <h2 class="settings__page-title">Einstellungen</h2>

  <!-- feedback -->
  <div class="card settings__section">
    <h3 class="settings__title">Feedback zur App</h3>
    <p class="settings__text">
      Wenn Du mir Feedback geben willst oder ein Problem melden möchtest, kannst Du das derzeit über
      <a href="https://github.com/dominikschopper/carb-me/discussions/1" target="_blank" rel="noreferrer" class="settings__link">Github Discussions</a> oder
      <a href="https://github.com/dominikschopper/carb-me/issues" target="_blank" rel="noreferrer" class="settings__link">Github Issues</a>
      machen. Du musst Dir vorher allerdings einen (kostenfreien) Github Account anlegen.
    </p>
  </div>

  <!-- Preferred Unit -->
  <div class="card settings__section">
    <h3 class="settings__title" data-onboarding="settings-unit">Einheit</h3>
    <p class="settings__description">
      Willst Du BE (Broteinheiten) oder KHE (Kohlenhydrateinheiten) angezeigt bekommen?
      Die App rechhnet die gKH dann in Deine bevorzugte Einheit um.
    </p>

    <div class="settings__options">
      <label class="selection-card {settings.preferredUnit === 'BE' ? 'selection-card--selected' : ''}">
        <input
          type="radio"
          name="unit"
          value="BE"
          checked={settings.preferredUnit === 'BE'}
          onchange={() => handleUnitChange('BE')}
          class="settings__radio"
        />
        <div class="settings__option-content">
          <div class="settings__option-label">BE (Broteinheiten)</div>
          <div class="settings__option-hint">1 BE = 12g Kohlenhydrate</div>
        </div>
      </label>

      <label class="selection-card {settings.preferredUnit === 'KHE' ? 'selection-card--selected' : ''}">
        <input
          type="radio"
          name="unit"
          value="KHE"
          checked={settings.preferredUnit === 'KHE'}
          onchange={() => handleUnitChange('KHE')}
          class="settings__radio"
        />
        <div class="settings__option-content">
          <div class="settings__option-label">KHE (Kohlenhydrateinheiten)</div>
          <div class="settings__option-hint">1 KHE = 10g Kohlenhydrate</div>
        </div>
      </label>
    </div>
  </div>

  <!-- Energy Display -->
  <div class="card settings__section">
    <h3 class="settings__title" data-onboarding="settings-energy">Brennwert-Anzeige</h3>
    <p class="settings__description">
      Zeige zusätzlich den Brennwert (Kalorien) bei Lebensmitteln an.
    </p>

    <label class="selection-card {settings.showEnergy ? 'selection-card--selected' : ''}">
      <input
        type="checkbox"
        checked={settings.showEnergy}
        onchange={(e) => handleShowEnergyChange(e.currentTarget.checked)}
        class="settings__checkbox"
      />
      <div class="settings__option-content">
        <div class="settings__option-label">Brennwerte anzeigen</div>
        <div class="settings__option-hint">kcal oder kJ pro 100g</div>
      </div>
    </label>

    {#if settings.showEnergy}
      <div class="settings__sub-options">
        <p class="settings__sub-label">Einheit</p>
        <div class="settings__energy-units">
          <label class="selection-card settings__energy-unit {settings.energyUnit === 'kcal' ? 'selection-card--selected' : ''}">
            <input
              type="radio"
              name="energyUnit"
              value="kcal"
              checked={settings.energyUnit === 'kcal'}
              onchange={() => handleEnergyUnitChange('kcal')}
              class="settings__radio settings__radio--sm"
            />
            <span class="settings__option-label">kcal</span>
          </label>
          <label class="selection-card settings__energy-unit {settings.energyUnit === 'kJ' ? 'selection-card--selected' : ''}">
            <input
              type="radio"
              name="energyUnit"
              value="kJ"
              checked={settings.energyUnit === 'kJ'}
              onchange={() => handleEnergyUnitChange('kJ')}
              class="settings__radio settings__radio--sm"
            />
            <span class="settings__option-label">kJ</span>
          </label>
        </div>
      </div>
    {/if}
  </div>

  <!-- Search Results Filter -->
  <div class="card settings__section">
    <h3 class="settings__title" data-onboarding="settings-categories">Suchergebnisse</h3>
    <p class="settings__description">
      Passe an, welche Lebensmittel in den Suchergebnissen angezeigt werden.
    </p>

    <div class="settings__options">
      {#each CATEGORY_CONFIG as category}
        <label class="selection-card {settingsStore.isCategoryHidden(category.key) ? 'selection-card--selected' : ''}">
          <input
            type="checkbox"
            checked={settingsStore.isCategoryHidden(category.key)}
            onchange={(e) => handleCategoryToggle(category.key, e.currentTarget.checked)}
            class="settings__checkbox"
          />
          <div class="settings__option-content">
            <div class="settings__option-label text-primary">{category.label} ausblenden</div>
            <div class="settings__option-hint">
              {category.description}
              <span class="settings__category-code">&middot; BLS Code {category.key}</span>
            </div>
          </div>
        </label>
      {/each}
    </div>
  </div>

  <!-- App-Tour -->
  <div class="card settings__section">
    <h3 class="settings__title">App-Tour</h3>
    <p class="settings__description">
      Zeige die Einführung nochmal an, um die wichtigsten Funktionen kennenzulernen.
    </p>

    <button
      onclick={handleRestartOnboarding}
      class="btn btn--outline-primary settings__action-btn"
      type="button"
    >
      <span class="material-symbols-outlined">school</span>
      App-Tour erneut starten
    </button>
  </div>

  <!-- Data Management -->
  <div class="card settings__section">
    <h3 class="settings__title">Datenverwaltung</h3>
    <p class="settings__description">
      Lösche alle lokal gespeicherten Daten, um die App zurückzusetzen.
    </p>

    <button
      onclick={handleClearData}
      class="btn btn--outline-danger settings__action-btn"
      type="button"
    >
      <span class="material-symbols-outlined">delete_forever</span>
      Alle Daten löschen
    </button>
  </div>

  <!-- Legal Links -->
  <div class="card settings__section">
    <h3 class="settings__title">Rechtliches</h3>

    <a href="/legal" class="settings__nav-link">
      <span class="material-symbols-outlined">gavel</span>
      <span>Haftungsausschluss & Datenschutz</span>
      <span class="material-symbols-outlined settings__nav-chevron">chevron_right</span>
    </a>
  </div>

  <!-- App Info -->
  <div class="card text-center settings__info">
    <p class="settings__version">carb-me v{APP_VERSION}</p>
    <p class="settings__source">
      Open Source auf
      <a rel="noopener noreferrer"
        target="_blank"
        href="https://github.com/dominikschopper/carb-me"
        class="settings__link"
        >
        github.com/dominikschopper/carb-me
      </a>
    </p>
    <a
      href={CHANGELOG_URL}
      target="_blank"
      rel="noopener noreferrer"
      class="settings__changelog-link"
    >
      Changelog ansehen
    </a>
  </div>
</div>

<style>
  .settings {
    display: flex;
    flex-direction: column;
    gap: var(--space-lg);
  }

  .settings__page-title {
    font-size: var(--text-xl);
    font-weight: var(--weight-bold);
    color: var(--color-text);
  }

  .settings__section {
    display: flex;
    flex-direction: column;
  }

  .settings__title {
    margin-block-end: var(--space-sm);
    font-weight: var(--weight-semibold);
    color: var(--color-text);
  }

  .settings__text {
    color: var(--color-text);
  }

  .settings__description {
    margin-block-end: var(--space-md);
    font-size: var(--text-sm);
    color: var(--color-text-secondary);
  }

  .settings__options {
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
  }

  .settings__option-content {
    flex: 1;
    min-width: 0;
  }

  .settings__option-label {
    font-weight: var(--weight-medium);
    color: var(--color-text);
    hyphens: auto;
    overflow-wrap: anywhere;
  }

  .settings__option-hint {
    font-size: var(--text-sm);
    color: var(--color-text-secondary);
    hyphens: auto;
    overflow-wrap: anywhere;
  }

  .settings__radio,
  .settings__checkbox {
    flex-shrink: 0;
    width: 1.25rem;
    height: 1.25rem;
    margin-block-start: 2px;
    accent-color: var(--color-primary);
  }

  .settings__radio--sm {
    width: 1rem;
    height: 1rem;
    margin-block-start: 0;
  }

  .settings__sub-options {
    margin-block-start: var(--space-sm);
    display: flex;
    flex-direction: column;
    gap: var(--space-xs);
  }

  .settings__sub-label {
    font-size: var(--text-sm);
    font-weight: var(--weight-medium);
    color: var(--color-text-secondary);
  }

  .settings__energy-units {
    display: flex;
    gap: var(--space-sm);
  }

  .settings__energy-unit {
    flex: 1;
    justify-content: center;
  }

  .settings__category-code {
    color: var(--color-text-muted);
    font-size: var(--text-xs);
  }

  .settings__action-btn {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-xs);
  }

  .settings__nav-link {
    display: flex;
    align-items: center;
    gap: var(--space-xs);
    padding: var(--space-sm);
    border-radius: var(--radius-lg);
    color: var(--color-text-secondary);
    text-decoration: none;
    transition: background-color var(--transition-fast);
  }

  .settings__nav-link:hover {
    background-color: var(--color-bg-inset);
  }

  .settings__nav-chevron {
    margin-inline-start: auto;
  }

  .settings__info {
    padding: var(--space-md);
  }

  .settings__version {
    font-size: var(--text-sm);
    color: var(--color-text-secondary);
  }

  .settings__source {
    margin-block-start: var(--size-3xs);
    font-size: var(--text-xs);
    color: var(--color-text-tertiary);
  }

  .settings__link {
    color: var(--color-primary-text);
    text-decoration: none;
  }

  .settings__link:hover {
    text-decoration: underline;
  }

  .settings__changelog-link {
    display: inline-block;
    margin-block-start: var(--space-xs);
    font-size: var(--text-xs);
    color: var(--color-primary-text);
    text-decoration: none;
  }

  .settings__changelog-link:hover {
    text-decoration: underline;
  }
</style>
