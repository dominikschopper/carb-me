<script lang="ts">
  import { mealStore } from '$lib/stores/meal.svelte';
  import { formatNumber } from '$lib/shared/formatting';
  import UnitDisplay from '$lib/shared/UnitDisplay.svelte';

  let { onMealClick, onHomeClick }: { onMealClick?: () => void; onHomeClick?: () => void } = $props();

  const hasMealItems = $derived(mealStore.items.length > 0);
  const totalCarbs = $derived(mealStore.items.reduce((sum, item) => sum + (item.grams / 100) * item.food.kh, 0));

  function handleMealClick() {
    onMealClick?.();
  }

  function handleHomeClick() {
    onHomeClick?.();
  }
</script>

<header class="header">
  <div class="header__inner">
    <div class="header__content">
      <button onclick={handleHomeClick} class="header__brand" aria-label="Zur Startseite" type="button" role="link" data-onboarding="start">
        carb-me
      </button>

      {#if hasMealItems}
        <button
          onclick={handleMealClick}
          class="header__meal-btn"
          aria-label="Zur Mahlzeit wechseln"
          type="button"
        >
          <div class="header__meal-info" data-onboarding="meal-list-header">
            <UnitDisplay>
              {#snippet beContent()}
                <div class="header__meal-unit text-primary">{formatNumber(mealStore.totalBE)} BE</div>
              {/snippet}
              {#snippet kheContent()}
                <div class="header__meal-unit text-accent">{formatNumber(mealStore.totalKHE)} KHE</div>
              {/snippet}
            </UnitDisplay>
            <div class="header__meal-carbs">{formatNumber(totalCarbs)}g KH</div>
          </div>
          <div class="header__meal-badge">
            {mealStore.items.length}
          </div>
        </button>
      {/if}
    </div>
  </div>
</header>

<style>
  .header {
    position: sticky;
    top: 0;
    z-index: 40;
    border-block-end: 1px solid var(--color-border);
    background-color: color-mix(in srgb, var(--color-bg-elevated) 95%, transparent);
    backdrop-filter: blur(8px);
  }

  .header__inner {
    max-width: var(--content-max-width);
    margin-inline: auto;
    padding: var(--space-md);
  }

  .header__content {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .header__brand {
    background: none;
    border: none;
    cursor: pointer;
    font: inherit;
    font-size: var(--text-2xl);
    font-weight: var(--weight-bold);
    color: var(--color-primary-text);
    transition: opacity var(--transition-fast);
  }

  .header__brand:hover { opacity: 0.75; }
  .header__brand:active { transform: scale(0.95); }

  .header__meal-btn {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    background: none;
    border: none;
    cursor: pointer;
    font: inherit;
    font-size: var(--text-sm);
    transition: opacity var(--transition-fast);
  }

  .header__meal-btn:hover { opacity: 0.75; }
  .header__meal-btn:active { transform: scale(0.95); }

  .header__meal-info {
    text-align: right;
  }

  .header__meal-unit {
    font-weight: var(--weight-semibold);
  }

  .header__meal-carbs {
    font-size: var(--text-xs);
    color: var(--color-text-tertiary);
  }

  .header__meal-badge {
    display: flex;
    height: 2rem;
    width: 2rem;
    align-items: center;
    justify-content: center;
    border-radius: var(--radius-full);
    background-color: var(--color-primary-soft);
    font-size: var(--text-sm);
    font-weight: var(--weight-bold);
    color: var(--color-primary-text);
  }
</style>
