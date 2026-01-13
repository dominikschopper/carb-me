<script lang="ts">
  import type { FoodItem } from '$lib/types/food';
  import FoodCard from './FoodCard.svelte';
  import { groupFoodsByCategories } from '$lib/utils/grouping';

  let { foods, onFoodSelect, loading = false, isSearching = false }: { foods: FoodItem[]; onFoodSelect: (food: FoodItem) => void; loading?: boolean; isSearching?: boolean } = $props();

  const groupedFoods = $derived(groupFoodsByCategories(foods));
</script>

<div class="space-y-3">
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
  {:else if foods.length === 0}
    <!-- Empty state -->
    <div class="card text-center">
      <div class="py-8">
        <span class="material-symbols-outlined mx-auto block text-5xl text-gray-400">sentiment_dissatisfied</span>
        <p class="mt-4 text-gray-600 dark:text-gray-400">Keine Lebensmittel gefunden</p>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-500">Versuche einen anderen Suchbegriff</p>
      </div>
    </div>
  {:else if isSearching}
    <!-- Flat list when searching (sorted by fuzzy score) -->
    {#each foods as food (food.name)}
      <FoodCard {food} onclick={() => onFoodSelect(food)} />
    {/each}
  {:else}
    <!-- Grouped food cards when not searching -->
    {#each groupedFoods as group, groupIndex (group.uberschrift + ':' + (group.unteruberschrift ?? 'null'))}
      <!-- Show Überschrift header only when it changes -->
      {#if groupIndex === 0 || groupedFoods[groupIndex - 1].uberschrift !== group.uberschrift}
        <div class="mt-6">
          <h2 class="text-sm font-semibold uppercase tracking-wide text-gray-700 dark:text-gray-300">
            {group.uberschrift}
          </h2>
        </div>
      {/if}

      <!-- Show Unterüberschrift header if it exists -->
      {#if group.unteruberschrift}
        <div class="mt-4 flex items-center gap-2">
          <h3 class="text-xs font-medium text-gray-600 dark:text-gray-400">
            {group.unteruberschrift}
          </h3>
          <div class="h-px flex-1 bg-gray-300 dark:bg-gray-600"></div>
        </div>
      {/if}

      <!-- Foods in this group -->
      <div class="space-y-3">
        {#each group.foods as food (food.name)}
          <FoodCard {food} onclick={() => onFoodSelect(food)} />
        {/each}
      </div>
    {/each}
  {/if}
</div>
