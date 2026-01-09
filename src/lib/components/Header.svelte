<script lang="ts">
  import { mealStore } from '$lib/stores/meal.svelte';
  import { formatNumber } from '$lib/utils/formatting';

  const hasMealItems = $derived(mealStore.items.length > 0);
</script>

<header class="sticky top-0 z-40 border-b border-gray-200 bg-white/95 backdrop-blur dark:border-gray-700 dark:bg-gray-900/95">
  <div class="mx-auto max-w-4xl px-4 py-4">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-blue-600 dark:text-blue-400">carb.me</h1>

      {#if hasMealItems}
        <div class="flex items-center gap-3 text-sm">
          <div class="text-right">
            <div class="font-semibold text-blue-600 dark:text-blue-400">{formatNumber(mealStore.totalBE)} BE</div>
            <div class="text-xs text-gray-500 dark:text-gray-400">{formatNumber(mealStore.totalKHE)} KHE</div>
          </div>
          <div class="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
            {mealStore.items.length}
          </div>
        </div>
      {/if}
    </div>
  </div>
</header>
