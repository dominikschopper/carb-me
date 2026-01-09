<script lang="ts">
  import type { FoodItem } from '$lib/types/food';
  import FoodCard from './FoodCard.svelte';

  let { foods, onFoodSelect, loading = false }: { foods: FoodItem[]; onFoodSelect: (food: FoodItem) => void; loading?: boolean } = $props();
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
  {:else}
    <!-- Food cards -->
    {#each foods as food (food.name)}
      <FoodCard {food} onclick={() => onFoodSelect(food)} />
    {/each}
  {/if}
</div>
