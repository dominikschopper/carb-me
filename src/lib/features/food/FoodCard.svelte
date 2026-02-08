<script lang="ts">
  import type { FoodItem } from '$lib/types/food';
  import { foodStore } from '$lib/stores/foods.svelte';
  import { settingsStore } from '$lib/stores/settings.svelte';
  import UnitDisplay from '$lib/shared/UnitDisplay.svelte';
  import GrOrMl from '$lib/shared/GrOrMl.svelte';

  let { food, onclick }: { food: FoodItem; onclick?: () => void } = $props();

  const isFavorite = $derived(foodStore.favorites.has(food.blsCode));
  const settings = $derived(settingsStore.settings);

  const energyValue = $derived(() => {
    if (settings.energyUnit === 'kcal') {
      return food.kcal ? `${Math.round(food.kcal)} kcal` : null;
    }
    return food.kj ? `${Math.round(food.kj)} kJ` : null;
  });

  function toggleFavorite(event: MouseEvent) {
    event.stopPropagation();
    foodStore.toggleFavorite(food.blsCode);
  }

  function handleCardClick() {
    onclick?.();
  }
</script>

<div
  class="card food-card"
  onclick={handleCardClick}
  role="button"
  tabindex="0"
  onkeydown={(e) => e.key === 'Enter' && handleCardClick()}
>
  <div class="food-card__header" data-onboarding="calculator-open">
    <div class="food-card__body">
      <div class="food-card__title-row">
        <hgroup>
        <h3 class="food-card__title">
          {food.name}
          {#if food.isCustom}
            <span class="food-card__custom-badge">(Eigenes)</span>
          {/if}
        </h3>
        {#if food.subtitle}
          <p class="food-card__subtitle">{food.subtitle}</p>
        {/if}
        </hgroup>
      </div>

      <div class="food-card__nutrients">
        <span class="text-success">{food.kh}grKH</span> <span class="text-secondary">/ <GrOrMl value="100" unit={food.unit}></GrOrMl></span>
        {#if settings.showEnergy && energyValue()}
          <span class="food-card__dot">·</span>
          <span class="text-warning">{energyValue()}</span>
        {/if}
      </div>

      <div class="food-card__units">
        <UnitDisplay>
          {#snippet beContent()}
            <span class="food-card__unit-badge bg-success-soft">1 BE = <GrOrMl value={food.gBE} unit={food.unit}></GrOrMl> </span>
          {/snippet}
          {#snippet kheContent()}
            <span class="food-card__unit-badge bg-accent-soft">1 KHE = <GrOrMl value={food.gKHE} unit={food.unit}></GrOrMl></span>
          {/snippet}
        </UnitDisplay>
      </div>

      {#if food.categories && food.categories.length > 0}
        <div class="food-card__categories">
          {#each food.categories as category}
            <span class="food-card__category">
              {category.join(' › ')}
            </span>
          {/each}
        </div>
      {/if}
    </div>

    <button
      onclick={toggleFavorite}
      data-onboarding="favorite-star"
      class="btn btn--ghost food-card__fav-btn"
      aria-label={isFavorite ? 'Von Favoriten entfernen' : 'Zu Favoriten hinzufügen'}
      type="button"
    >
      <span class="material-symbols-outlined {isFavorite ? 'text-favorite' : 'text-muted'}">
        {isFavorite ? 'star' : 'star_outline'}
      </span>
    </button>
  </div>
</div>

<style>
  .food-card {
    width: 100%;
    cursor: pointer;
    text-align: left;
    margin-block-end: var(--size-3xs);
    transition: box-shadow var(--transition-fast), transform var(--transition-fast);
  }

  .food-card:hover {
    box-shadow: var(--shadow-md);
  }

  .food-card:active {
    transform: scale(0.98);
  }

  .food-card__header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: var(--space-sm);
  }

  .food-card__body {
    flex: 1;
  }

  .food-card__title-row {
    display: flex;
    align-items: center;
    gap: var(--space-xs);
  }

  .food-card__title {
    font-size: var(--text-base);
    font-weight: var(--weight-semibold);
    overflow-wrap: anywhere;
  }

  @media (min-width: 640px) {
    .food-card__title {
      font-size: var(--text-lg);
    }
  }

  .food-card__custom-badge {
    margin-inline-start: var(--size-3xs);
    font-size: var(--text-xs);
    color: var(--color-primary-text);
  }

  .food-card__subtitle {
    font-size: var(--text-sm);
    color: var(--color-text-tertiary);
  }

  .food-card__nutrients {
    margin-block-start: var(--size-3xs);
    font-size: var(--text-sm);
  }

  .food-card__dot {
    margin-inline: var(--size-3xs);
  }

  .food-card__units {
    margin-block-start: var(--space-xs);
    font-size: var(--text-xs);
  }

  .food-card__unit-badge {
    display: inline-block;
    padding: var(--size-3xs) var(--space-xs);
    border-radius: var(--radius-md);
  }

  .food-card__categories {
    margin-block-start: var(--space-xs);
    display: flex;
    flex-wrap: wrap;
    gap: var(--size-3xs);
  }

  .food-card__category {
    font-size: var(--text-xs);
    color: var(--color-text-tertiary);
  }

  .food-card__fav-btn {
    flex-shrink: 0;
  }
</style>
