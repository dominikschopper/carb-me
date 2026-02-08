<script lang="ts">
  import { mealStore } from '$lib/stores/meal.svelte';
  import { settingsStore } from '$lib/stores/settings.svelte';
  import { formatNumber } from '$lib/shared/formatting';
  import UnitDisplay from '$lib/shared/UnitDisplay.svelte';

  const items = $derived(mealStore.items);
  const totalBE = $derived(mealStore.totalBE);
  const totalKHE = $derived(mealStore.totalKHE);
  const totalCarbs = $derived(mealStore.totalCarbs);
  const settings = $derived(settingsStore.settings);

  // Calculate energy for a single item
  function getItemEnergy(item: typeof items[0]): number | null {
    if (settings.energyUnit === 'kcal' && item.food.kcal) {
      return Math.round((item.food.kcal * item.grams) / 100);
    }
    if (settings.energyUnit === 'kJ' && item.food.kj) {
      return Math.round((item.food.kj * item.grams) / 100);
    }
    return null;
  }

  // Calculate total energy for the meal
  const totalEnergy = $derived.by(() => {
    return items.reduce((sum, item) => {
      const energy = getItemEnergy(item);
      return sum + (energy ?? 0);
    }, 0);
  });

  function removeItem(index: number) {
    mealStore.removeItem(index);
  }

  function clearAll() {
    mealStore.clear();
  }
</script>

<div class="space-y-4">
  <div class="flex items-center justify-between">
    <h2 class="text-xl font-bold text-gray-900 dark:text-gray-100" data-onboarding="meal-list">Meine Mahlzeit</h2>
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
            <div class="mt-2 text-sm">
              <UnitDisplay>
                {#snippet beContent()}
                  <span class="text-blue-600 dark:text-blue-400">{formatNumber(item.be)} BE</span>
                {/snippet}
                {#snippet kheContent()}
                  <span class="text-purple-600 dark:text-purple-400">{formatNumber(item.khe)} KHE</span>
                {/snippet}
              </UnitDisplay>
              {#if settings.showEnergy && getItemEnergy(item) !== null}
                <span class="mx-1">·</span>
                <span class="text-amber-600 dark:text-amber-400">{getItemEnergy(item)} {settings.energyUnit}</span>
              {/if}
            </div>
          </div>
          <button
            onclick={() => removeItem(index)}
            class="flex items-center justify-center rounded-full p-2 hover:bg-red-50 active:scale-95 dark:hover:bg-red-900/30"
            aria-label="Entfernen"
            type="button"
          >
            <span class="material-symbols-outlined leading-none text-red-600 dark:text-red-400">delete</span>
          </button>
        </div>
      {/each}
    </div>

    <!-- Total summary (sticky footer) -->
    <div class="sticky bottom-16 rounded-xl bg-blue-600 p-4 text-white shadow-lg dark:bg-blue-500">
      <div class="text-center">
        <p class="text-sm opacity-90">Gesamt</p>
        <UnitDisplay>
          {#snippet beContent()}
            <p class="text-lg">
              <span class="text-green-200">{formatNumber(totalCarbs)}g KH</span>
              <span class="opacity-75">=</span>
              <span class="font-bold">{formatNumber(totalBE)} BE</span>
            </p>
          {/snippet}
          {#snippet kheContent()}
            <p class="text-lg">
              <span class="text-green-200">{formatNumber(totalCarbs)}g KH</span>
              <span class="opacity-75">=</span>
              <span class="font-bold">{formatNumber(totalKHE)} KHE</span>
            </p>
          {/snippet}
        </UnitDisplay>
        {#if settings.showEnergy && totalEnergy > 0}
          <p class="mt-1 text-lg font-semibold text-amber-200">{totalEnergy} {settings.energyUnit}</p>
        {/if}
        <p class="mt-2 text-sm opacity-75">{items.length} Lebensmittel</p>
      </div>
    </div>
  {/if}
</div>
