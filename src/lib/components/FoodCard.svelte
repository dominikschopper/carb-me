<script lang="ts">
  import type { FoodItem } from '$lib/types/food';
  import { foodStore } from '$lib/stores/foods.svelte';

  let { food, onclick }: { food: FoodItem; onclick?: () => void } = $props();

  const isFavorite = $derived(foodStore.favorites.has(food.name));

  function toggleFavorite(event: MouseEvent) {
    event.stopPropagation();
    foodStore.toggleFavorite(food.name);
  }

  function handleCardClick() {
    onclick?.();
  }
</script>

<div
  class="card w-full cursor-pointer text-left transition-all hover:shadow-md active:scale-[0.98]"
  onclick={handleCardClick}
  role="button"
  tabindex="0"
  onkeydown={(e) => e.key === 'Enter' && handleCardClick()}
>
  <div class="flex items-start justify-between gap-3">
    <div class="flex-1">
      <div class="flex items-center gap-2">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {food.name}
          {#if food.isCustom}
            <span class="ml-1 text-xs text-blue-600 dark:text-blue-400">(Eigenes)</span>
          {/if}
        </h3>
      </div>

      <div class="mt-2 flex flex-wrap gap-2 text-sm text-gray-600 dark:text-gray-300">
        <span class="rounded-md bg-blue-50 px-2 py-1 dark:bg-blue-900/30">
          {food.kh}g KH / 100{food.unit || 'g'}
        </span>
        <span class="rounded-md bg-green-50 px-2 py-1 dark:bg-green-900/30">1 BE = {food.gBE}g</span>
        <span class="rounded-md bg-purple-50 px-2 py-1 dark:bg-purple-900/30">1 KHE = {food.gKHE}g</span>
      </div>

      {#if food.categories && food.categories.length > 0}
        <div class="mt-2 flex flex-wrap gap-1">
          {#each food.categories as category}
            <span class="text-xs text-gray-500 dark:text-gray-400">
              {category.join(' › ')}
            </span>
          {/each}
        </div>
      {/if}
    </div>

    <button
      onclick={toggleFavorite}
      class="flex-shrink-0 rounded-full p-2 hover:bg-gray-100 active:scale-95 dark:hover:bg-gray-700"
      aria-label={isFavorite ? 'Von Favoriten entfernen' : 'Zu Favoriten hinzufügen'}
      type="button"
    >
      <span class="material-symbols-outlined {isFavorite ? 'text-yellow-500' : 'text-gray-400'}">
        {isFavorite ? 'star' : 'star_outline'}
      </span>
    </button>
  </div>
</div>
