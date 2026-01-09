<script lang="ts">
  import { mealStore } from '$lib/stores/meal.svelte';
  import { formatNumber } from '$lib/utils/formatting';

  const items = $derived(mealStore.items);
  const totalBE = $derived(mealStore.totalBE);
  const totalKHE = $derived(mealStore.totalKHE);

  function removeItem(index: number) {
    mealStore.removeItem(index);
  }

  function clearAll() {
    if (confirm('Möchtest du wirklich alle Einträge löschen?')) {
      mealStore.clear();
    }
  }
</script>

<div class="space-y-4">
  <div class="flex items-center justify-between">
    <h2 class="text-xl font-bold text-gray-900 dark:text-gray-100">Meine Mahlzeit</h2>
    {#if items.length > 0}
      <button
        onclick={clearAll}
        class="text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
        type="button"
      >
        Alles löschen
      </button>
    {/if}
  </div>

  {#if items.length === 0}
    <!-- Empty state -->
    <div class="card text-center">
      <div class="py-8">
        <span class="material-symbols-outlined mx-auto block text-5xl text-gray-400">restaurant</span>
        <p class="mt-4 text-gray-600 dark:text-gray-400">Noch keine Lebensmittel hinzugefügt</p>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-500">
          Suche nach Lebensmitteln und füge sie zur Mahlzeit hinzu
        </p>
      </div>
    </div>
  {:else}
    <!-- Meal items -->
    <div class="space-y-3">
      {#each items as item, index (index)}
        <div class="card flex items-start justify-between gap-3">
          <div class="flex-1">
            <h3 class="font-semibold text-gray-900 dark:text-gray-100">{item.food.name}</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">{item.grams}g</p>
            <div class="mt-2 flex gap-3 text-sm">
              <span class="text-blue-600 dark:text-blue-400">{formatNumber(item.be)} BE</span>
              <span class="text-purple-600 dark:text-purple-400">{formatNumber(item.khe)} KHE</span>
            </div>
          </div>
          <button
            onclick={() => removeItem(index)}
            class="rounded-full p-2 hover:bg-red-50 active:scale-95 dark:hover:bg-red-900/30"
            aria-label="Entfernen"
            type="button"
          >
            <span class="material-symbols-outlined text-red-600 dark:text-red-400">delete</span>
          </button>
        </div>
      {/each}
    </div>

    <!-- Total summary (sticky footer) -->
    <div class="sticky bottom-16 rounded-xl bg-blue-600 p-4 text-white shadow-lg dark:bg-blue-500">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm opacity-90">Gesamt</p>
          <p class="text-2xl font-bold">{formatNumber(totalBE)} BE</p>
        </div>
        <div class="text-right">
          <p class="text-sm opacity-90">oder</p>
          <p class="text-2xl font-bold">{formatNumber(totalKHE)} KHE</p>
        </div>
      </div>
      <div class="mt-2 text-center text-sm opacity-75">{items.length} Lebensmittel</div>
    </div>
  {/if}
</div>
