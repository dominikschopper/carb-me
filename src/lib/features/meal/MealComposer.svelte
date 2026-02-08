<script lang="ts">
  import { mealStore } from '$lib/stores/meal.svelte';
  import { settingsStore } from '$lib/stores/settings.svelte';
  import { formatNumber } from '$lib/shared/formatting';
  import UnitDisplay from '$lib/shared/UnitDisplay.svelte';

  const items = $derived(mealStore.items);
  const totalBE = $derived(mealStore.totalBE);
  const totalKHE = $derived(mealStore.totalKHE);
  const totalCarbs = $derived(mealStore.totalCarbs);
  const settings = $derived(settingsStore.settings);

  // Calculate energy for a single item
  function getItemEnergy(item: typeof items[0]): number | null {
    if (settings.energyUnit === 'kcal' && item.food.kcal) {
      return Math.round((item.food.kcal * item.grams) / 100);
    }
    if (settings.energyUnit === 'kJ' && item.food.kj) {
      return Math.round((item.food.kj * item.grams) / 100);
    }
    return null;
  }

  // Calculate total energy for the meal
  const totalEnergy = $derived.by(() => {
    return items.reduce((sum, item) => {
      const energy = getItemEnergy(item);
      return sum + (energy ?? 0);
    }, 0);
  });

  function removeItem(index: number) {
    mealStore.removeItem(index);
  }

  function clearAll() {
    mealStore.clear();
  }
</script>

<div class="meal">
  <div class="meal__header">
    <h2 class="meal__title" data-onboarding="meal-list">Meine Mahlzeit</h2>
    {#if items.length > 0}
      <button
        onclick={clearAll}
        class="meal__clear-btn"
        type="button"
      >
        Alles löschen
      </button>
    {/if}
  </div>

  {#if items.length === 0}
    <!-- Empty state -->
    <div class="card text-center">
      <div class="meal__empty">
        <span class="material-symbols-outlined icon-5xl text-muted">restaurant</span>
        <p class="meal__empty-title">Noch keine Lebensmittel hinzugefügt</p>
        <p class="meal__empty-hint">
          Suche nach Lebensmitteln und füge sie zur Mahlzeit hinzu
        </p>
      </div>
    </div>
  {:else}
    <!-- Meal items -->
    <div class="meal__list">
      {#each items as item, index (index)}
        <div class="card meal__item">
          <div class="meal__item-body">
            <h3 class="meal__item-name">{item.food.name}</h3>
            <p class="meal__item-amount">{item.grams}g</p>
            <div class="meal__item-values">
              <UnitDisplay>
                {#snippet beContent()}
                  <span class="text-primary">{formatNumber(item.be)} BE</span>
                {/snippet}
                {#snippet kheContent()}
                  <span class="text-accent">{formatNumber(item.khe)} KHE</span>
                {/snippet}
              </UnitDisplay>
              {#if settings.showEnergy && getItemEnergy(item) !== null}
                <span class="meal__item-dot">·</span>
                <span class="text-warning">{getItemEnergy(item)} {settings.energyUnit}</span>
              {/if}
            </div>
          </div>
          <button
            onclick={() => removeItem(index)}
            class="btn btn--ghost meal__item-delete"
            aria-label="Entfernen"
            type="button"
          >
            <span class="material-symbols-outlined text-danger">delete</span>
          </button>
        </div>
      {/each}
    </div>

    <!-- Total summary (sticky footer) -->
    <div class="meal__total">
      <div class="meal__total-inner">
        <p class="meal__total-label">Gesamt</p>
        <UnitDisplay>
          {#snippet beContent()}
            <p class="meal__total-value">
              <span class="meal__total-carbs">{formatNumber(totalCarbs)}g KH</span>
              <span class="meal__total-eq">=</span>
              <span class="font-bold">{formatNumber(totalBE)} BE</span>
            </p>
          {/snippet}
          {#snippet kheContent()}
            <p class="meal__total-value">
              <span class="meal__total-carbs">{formatNumber(totalCarbs)}g KH</span>
              <span class="meal__total-eq">=</span>
              <span class="font-bold">{formatNumber(totalKHE)} KHE</span>
            </p>
          {/snippet}
        </UnitDisplay>
        {#if settings.showEnergy && totalEnergy > 0}
          <p class="meal__total-energy">{totalEnergy} {settings.energyUnit}</p>
        {/if}
        <p class="meal__total-count">{items.length} Lebensmittel</p>
      </div>
    </div>
  {/if}
</div>

<style>
  .meal {
    display: flex;
    flex-direction: column;
    gap: var(--space-md);
  }

  .meal__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .meal__title {
    font-size: var(--text-xl);
    font-weight: var(--weight-bold);
  }

  .meal__clear-btn {
    background: none;
    border: none;
    cursor: pointer;
    font: inherit;
    font-size: var(--text-sm);
    color: var(--color-danger-text);
  }

  .meal__clear-btn:hover {
    color: var(--color-danger-hover);
  }

  .meal__empty {
    padding-block: var(--space-xl);
  }

  .meal__empty-title {
    margin-block-start: var(--space-md);
    color: var(--color-text-secondary);
  }

  .meal__empty-hint {
    margin-block-start: var(--size-3xs);
    font-size: var(--text-sm);
    color: var(--color-text-tertiary);
  }

  .meal__list {
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
  }

  .meal__item {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: var(--space-sm);
  }

  .meal__item-body {
    flex: 1;
  }

  .meal__item-name {
    font-weight: var(--weight-semibold);
  }

  .meal__item-amount {
    font-size: var(--text-sm);
    color: var(--color-text-secondary);
  }

  .meal__item-values {
    margin-block-start: var(--space-xs);
    font-size: var(--text-sm);
  }

  .meal__item-dot {
    margin-inline: var(--size-3xs);
  }

  .meal__item-delete {
    flex-shrink: 0;
  }

  .meal__item-delete:hover {
    background-color: var(--color-danger-soft);
  }

  .meal__total {
    position: sticky;
    bottom: 4rem;
    border-radius: var(--radius-xl);
    background-color: var(--color-primary);
    padding: var(--space-md);
    color: var(--color-text-inverse);
    box-shadow: var(--shadow-lg);
  }

  .meal__total-inner {
    text-align: center;
  }

  .meal__total-label {
    font-size: var(--text-sm);
    opacity: 0.9;
  }

  .meal__total-value {
    font-size: var(--text-lg);
  }

  .meal__total-carbs {
    color: var(--color-success-light);
  }

  .meal__total-eq {
    opacity: 0.75;
  }

  .meal__total-energy {
    margin-block-start: var(--size-3xs);
    font-size: var(--text-lg);
    font-weight: var(--weight-semibold);
    color: var(--color-warning-light);
  }

  .meal__total-count {
    margin-block-start: var(--space-xs);
    font-size: var(--text-sm);
    opacity: 0.75;
  }
</style>
