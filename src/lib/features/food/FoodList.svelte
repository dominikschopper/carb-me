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
<div class="print-header hidden print:block">
  {#if searchQuery}
    carb-me - Suchergebnis: {searchQuery}
  {:else}
    carb-me - Lebensmittelliste
  {/if}
</div>

<!-- Screen view (hidden in print) -->
<div class="space-y-3 print:hidden">
  {#if loading}
    <!-- Loading skeleton -->
    {#each Array(3) as _}
      <div class="card">
        <div class="skeleton h-6 w-1/2 rounded"></div>
        <div class="mt-2 flex gap-2">
          <div class="skeleton h-6 w-24 rounded"></div>
          <div class="skeleton h-6 w-24 rounded"></div>
        </div>
      </div>
    {/each}
  {:else if foods.length === 0 && isSearching}
    <!-- Empty search results -->
    <div class="card text-center">
      <div class="py-8">
        <span class="material-symbols-outlined mx-auto block text-5xl text-gray-400">sentiment_dissatisfied</span>
        <p class="mt-4 text-gray-600 dark:text-gray-400">Keine Lebensmittel gefunden</p>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-500">Probier etwas anderes</p>
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
  <div class="hidden print:block print-grid">
    {#each foods as food, index (`${food.blsCode || food.name}-${index}-print`)}
      <PrintFoodCard {food} />
    {/each}
  </div>
{/if}
