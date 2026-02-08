<script lang="ts">
  import type { FoodItem } from '$lib/types/food';
  import FoodCard from './FoodCard.svelte';
  import PrintFoodCard from './PrintFoodCard.svelte';

  let {
    foods,
    onFoodSelect,
    loading = false,
    isSearching = false,
    searchQuery = '',
  }: {
    foods: FoodItem[];
    onFoodSelect: (food: FoodItem) => void;
    loading?: boolean;
    isSearching?: boolean;
    searchQuery?: string;
  } = $props();
</script>

<!-- Print header (hidden on screen, shown in print) -->
<div class="print-header food-list__print-header">
  {#if searchQuery}
    carb-me - Suchergebnis: {searchQuery}
  {:else}
    carb-me - Lebensmittelliste
  {/if}
</div>

<!-- Screen view (hidden in print) -->
<div class="food-list food-list--screen">
  {#if loading}
    <!-- Loading skeleton -->
    {#each Array(3) as _}
      <div class="card">
        <div class="skeleton food-list__skeleton-title"></div>
        <div class="food-list__skeleton-row">
          <div class="skeleton food-list__skeleton-badge"></div>
          <div class="skeleton food-list__skeleton-badge"></div>
        </div>
      </div>
    {/each}
  {:else if foods.length === 0 && isSearching}
    <!-- Empty search results -->
    <div class="card text-center">
      <div class="food-list__empty">
        <span class="material-symbols-outlined icon-5xl text-muted">sentiment_dissatisfied</span>
        <p class="food-list__empty-title">Keine Lebensmittel gefunden</p>
        <p class="food-list__empty-hint">Probier etwas anderes</p>
      </div>
    </div>
  {:else}
    <!-- Search results (flat list sorted by fuzzy score) -->
    {#each foods as food, index (`${food.blsCode || food.name}-${index}`)}
      <FoodCard {food} onclick={() => onFoodSelect(food)} />
    {/each}
  {/if}
</div>

<!-- Print view (hidden on screen, shown in print) - only shows search results -->
{#if isSearching && foods.length > 0}
  <div class="food-list--print print-grid">
    {#each foods as food, index (`${food.blsCode || food.name}-${index}-print`)}
      <PrintFoodCard {food} />
    {/each}
  </div>
{/if}

<style>
  .food-list {
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
  }

  .food-list--screen {
    display: flex;
  }

  .food-list--print {
    display: none;
  }

  .food-list__print-header {
    display: none;
  }

  .food-list__skeleton-title {
    height: 1.5rem;
    width: 50%;
  }

  .food-list__skeleton-row {
    display: flex;
    gap: var(--space-xs);
    margin-block-start: var(--space-xs);
  }

  .food-list__skeleton-badge {
    height: 1.5rem;
    width: 6rem;
  }

  .food-list__empty {
    padding-block: var(--space-xl);
  }

  .food-list__empty-title {
    margin-block-start: var(--space-md);
    color: var(--color-text-secondary);
  }

  .food-list__empty-hint {
    margin-block-start: var(--size-3xs);
    font-size: var(--text-sm);
    color: var(--color-text-tertiary);
  }

  @media print {
    .food-list--screen { display: none !important; }
    .food-list--print { display: block !important; }
    .food-list__print-header { display: block !important; }
  }
</style>
