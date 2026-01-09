<script lang="ts">
  import { mealStore } from '$lib/stores/meal.svelte';
  import { formatNumber } from '$lib/utils/formatting';
  import UnitDisplay from './UnitDisplay.svelte';

  let { onMealClick }: { onMealClick?: () => void } = $props();

  const hasMealItems = $derived(mealStore.items.length > 0);
  const totalCarbs = $derived(mealStore.items.reduce((sum, item) => sum + (item.grams / 100) * item.food.kh, 0));

  function handleMealClick() {
    onMealClick?.();
  }
</script>

<header class="sticky top-0 z-40 border-b border-gray-200 bg-white/95 backdrop-blur dark:border-gray-700 dark:bg-gray-900/95">
  <div class="mx-auto max-w-4xl px-4 py-4">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-blue-600 dark:text-blue-400">carb-me</h1>

      {#if hasMealItems}
        <button
          onclick={handleMealClick}
          class="flex items-center gap-3 text-sm transition-opacity hover:opacity-75 active:scale-95"
          aria-label="Zur Mahlzeit wechseln"
          type="button"
        >
          <div class="text-right">
            <UnitDisplay>
              {#snippet beContent()}
                <div class="font-semibold text-blue-600 dark:text-blue-400">{formatNumber(mealStore.totalBE)} BE</div>
              {/snippet}
              {#snippet kheContent()}
                <div class="font-semibold text-purple-600 dark:text-purple-400">{formatNumber(mealStore.totalKHE)} KHE</div>
              {/snippet}
            </UnitDisplay>
            <div class="text-xs text-gray-500 dark:text-gray-400">{formatNumber(totalCarbs)}g KH</div>
          </div>
          <div class="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
            {mealStore.items.length}
          </div>
        </button>
      {/if}
    </div>
  </div>
</header>
