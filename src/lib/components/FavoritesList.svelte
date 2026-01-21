<script lang="ts">
  import type { FoodItem } from '$lib/types/food';
  import FoodCard from './FoodCard.svelte';
  import { foodStore } from '$lib/stores/foods.svelte';

  let { onFoodSelect }: { onFoodSelect: (food: FoodItem) => void } = $props();

  const favoriteFoods = $derived(foodStore.favoriteFoods);
</script>

<div class="space-y-4">
  <h2 class="text-xl font-bold text-gray-900 dark:text-gray-100">Favoriten</h2>

  {#if favoriteFoods.length === 0}
    <!-- Empty state -->
    <div class="card text-center">
      <div class="py-8">
        <span class="material-symbols-outlined mx-auto block text-5xl text-gray-400">star_outline</span>
        <p class="mt-4 text-gray-600 dark:text-gray-400">Noch keine Favoriten</p>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-500">
          Markiere Lebensmittel mit einem Stern, um sie hier schnell wiederzufinden
        </p>
      </div>
    </div>
  {:else}
    <!-- Favorites list -->
    <div class="space-y-2">
      {#each favoriteFoods as food (food.blsCode)}
        <FoodCard {food} onclick={() => onFoodSelect(food)} />
      {/each}
    </div>
  {/if}
</div>
