<script lang="ts">
  type Tab = 'search' | 'custom' | 'meal' | 'settings';

  let { activeTab = $bindable('search') }: { activeTab?: Tab } = $props();

  function setTab(tab: Tab) {
    activeTab = tab;
  }
</script>

<nav class="tab-bar safe-area-inset">
  <div class="tab-bar__inner">
    <button
      onclick={() => setTab('search')}
      data-onboarding="tab-search"
      class="tab-bar__item {activeTab === 'search' ? 'tab-bar__item--active' : ''}"
      aria-label="Suche"
      type="button"
    >
      <span class="material-symbols-outlined icon-xl">search</span>
      <span class="tab-bar__label">Suche</span>
    </button>

    <button
      onclick={() => setTab('custom')}
      data-onboarding="tab-custom"
      class="tab-bar__item {activeTab === 'custom' ? 'tab-bar__item--active' : ''}"
      aria-label="Eigene Lebensmittel hinzufügen"
      type="button"
    >
      <span class="material-symbols-outlined icon-xl">add_circle</span>
      <span class="tab-bar__label">Eigene</span>
    </button>

    <button
      onclick={() => setTab('meal')}
      data-onboarding="tab-meal"
      class="tab-bar__item {activeTab === 'meal' ? 'tab-bar__item--active' : ''}"
      aria-label="Mahlzeit"
      type="button"
    >
      <span class="material-symbols-outlined icon-xl">restaurant</span>
      <span class="tab-bar__label">Mahlzeit</span>
    </button>

    <button
      onclick={() => setTab('settings')}
      data-onboarding="tab-settings"
      class="tab-bar__item {activeTab === 'settings' ? 'tab-bar__item--active' : ''}"
      aria-label="Einstellungen"
      type="button"
    >
      <span class="material-symbols-outlined icon-xl">settings</span>
      <span class="tab-bar__label">Mehr</span>
    </button>
  </div>
</nav>

<style>
  .tab-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 40;
    border-block-start: 1px solid var(--color-border);
    background-color: var(--color-bg-elevated);
  }

  .tab-bar__inner {
    display: flex;
    max-width: var(--content-max-width);
    margin-inline: auto;
  }

  .tab-bar__item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    padding-block: var(--space-xs);
    background: none;
    border: none;
    cursor: pointer;
    font: inherit;
    font-size: var(--text-2xs);
    color: var(--color-text-secondary);
    transition: color var(--transition-fast);
  }

  @media (min-width: 640px) {
    .tab-bar__item {
      gap: var(--size-3xs);
      font-size: var(--text-xs);
    }
  }

  .tab-bar__item:hover {
    color: var(--color-text);
  }

  .tab-bar__item--active {
    color: var(--color-primary-text);
  }

  .tab-bar__label {
    font-weight: var(--weight-medium);
  }
</style>
