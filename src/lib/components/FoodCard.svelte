<script lang="ts">
  import type { FoodItem } from '$lib/types/food';
  import { foodStore } from '$lib/stores/foods.svelte';
  import UnitDisplay from './UnitDisplay.svelte';

  let { food, onclick }: { food: FoodItem; onclick?: () => void } = $props();

  const isFavorite = $derived(foodStore.favorites.has(food.blsCode));

  function toggleFavorite(event: MouseEvent) {
    event.stopPropagation();
    foodStore.toggleFavorite(food.blsCode);
  }

  function handleCardClick() {
    onclick?.();
  }
</script>

<div
  class="card w-full cursor-pointer text-left transition-all mb-1 hover:shadow-md active:scale-[0.98]"
  onclick={handleCardClick}
  role="button"
  tabindex="0"
  onkeydown={(e) => e.key === 'Enter' && handleCardClick()}
>
  <div class="flex items-start justify-between gap-3">
    <div class="flex-1">
      <div class="flex items-center gap-2">
        <hgroup>
        <h3 class="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 wrap-anywhere">
          {food.name}
          {#if food.isCustom}
            <span class="ml-1 text-xs text-blue-600 dark:text-blue-400">(Eigenes)</span>
          {/if}
        </h3>
        {#if food.subtitle}
          <p class="text-sm text-gray-500 dark:text-gray-400">{food.subtitle}</p>
        {/if}
        </hgroup>
      </div>

      <div class="mt-1 text-sm text-gray-600 dark:text-gray-400">
        {food.kh}g KH / 100{food.unit || 'g'}
      </div>

      <div class="mt-2 text-xs">
        <UnitDisplay>
          {#snippet beContent()}
            <span class="rounded-md bg-green-50 px-2 py-1 dark:bg-green-900/30">1 BE = {food.gBE}g</span>
          {/snippet}
          {#snippet kheContent()}
            <span class="rounded-md bg-purple-50 px-2 py-1 dark:bg-purple-900/30">1 KHE = {food.gKHE}g</span>
          {/snippet}
        </UnitDisplay>
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
      class="flex flex-shrink-0 items-center justify-center rounded-full p-2 hover:bg-gray-100 active:scale-95 dark:hover:bg-gray-700"
      aria-label={isFavorite ? 'Von Favoriten entfernen' : 'Zu Favoriten hinzufügen'}
      type="button"
    >
      <span class="material-symbols-outlined leading-none {isFavorite ? 'text-yellow-500' : 'text-gray-400'}">
        {isFavorite ? 'star' : 'star_outline'}
      </span>
    </button>
  </div>
</div>
