<script lang="ts">
  import type { FoodItem } from '$lib/types/food';
  import { calculateNutrition } from './calculator';
  import { formatNumber } from '$lib/shared/formatting';
  import { mealStore } from '$lib/stores/meal.svelte';
  import { settingsStore } from '$lib/stores/settings.svelte';
  import UnitDisplay from '$lib/shared/UnitDisplay.svelte';

  let { food, onClose }: { food: FoodItem | null; onClose: () => void } = $props();

  let dialog: HTMLDialogElement;
  let inputElement: HTMLInputElement;
  let grams = $state(100);

  const settings = $derived(settingsStore.settings);

  const result = $derived.by(() => {
    if (!food) return null;
    return calculateNutrition(food, grams);
  });

  const energyForGrams = $derived.by(() => {
    if (!food) return null;
    if (settings.energyUnit === 'kcal' && food.kcal) {
      return Math.round((food.kcal * grams) / 100);
    }
    if (settings.energyUnit === 'kJ' && food.kj) {
      return Math.round((food.kj * grams) / 100);
    }
    return null;
  });

  function setQuickAmount(amount: number) {
    grams = amount;
    // Select the text after updating
    setTimeout(() => inputElement?.select(), 0);
  }

  function addToMeal() {
    if (!food || !result) return;
    mealStore.addItem(food, result.grams, result.be, result.khe);
    handleClose();
  }

  function handleClose() {
    dialog?.close();
    onClose();
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      handleClose();
    } else if (event.key === 'Enter') {
      addToMeal();
    }
  }

  // Reset grams to 100 whenever food changes
  $effect(() => {
    if (food) {
      grams = 100;
    }
  });

  $effect(() => {
    if (food && dialog) {
      dialog.showModal();
      // Focus and select the input after dialog opens
      setTimeout(() => {
        inputElement?.focus();
        inputElement?.select();
      }, 0);
    }
  });
</script>

<dialog
  bind:this={dialog}
  onclose={handleClose}
  data-onboarding="calculator"
  class="w-full max-w-lg rounded-2xl bg-white p-0 backdrop:bg-black/50 dark:bg-gray-800 sm:rounded-2xl"
>
  {#if food}
    <div class="p-6">
      <!-- Header -->
      <div class="mb-4 flex items-start justify-between">
        <div>
          <h2 class="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 wrap-anywhere">
            {food.name}
          </h2>
          <p class="text-sm"><span class="text-green-600 dark:text-green-400">{food.kh}g KH</span> <span class="text-gray-500 dark:text-gray-400">/ 100{food.unit || 'g'}</span></p>
        </div>
        <button
          onclick={handleClose}
          class="flex items-center justify-center rounded-full p-2 hover:bg-gray-100 active:scale-95 dark:hover:bg-gray-700"
          aria-label="Schließen"
          type="button"
        >
          <span class="material-symbols-outlined leading-none text-gray-500">close</span>
        </button>
      </div>

      <!-- Gram/ml input -->
      <div class="mb-4">
        <label for="grams-input" class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Menge in {food.unit === 'ml' ? 'ml' : 'gr'}
        </label>
        <input
          id="grams-input"
          bind:this={inputElement}
          type="number"
          bind:value={grams}
          onkeydown={handleKeyDown}
          onfocus={(e) => e.currentTarget.select()}
          min="1"
          step="1"
          inputmode="numeric"
          class="input-touch w-full"
          autofocus
        />
      </div>

      <!-- Quick presets -->
      <div class="mb-6 flex gap-2">
        {#each [50, 150, 200, 250] as amount}
          <button
            onclick={() => setQuickAmount(amount)}
            class="btn-touch flex-1 bg-gray-100 px-2 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            type="button"
          >
            {amount}{food.unit || 'gr'}
          </button>
        {/each}
      </div>

      <!-- Results -->
      {#if result}
        <div class="mb-6 space-y-3 rounded-lg bg-blue-50 p-4 dark:bg-blue-900/30">
          <UnitDisplay>
            {#snippet beContent()}
              <div class="flex items-center justify-between">
                <span class="font-medium text-gray-700 dark:text-gray-300">
                  <span class="text-green-600 dark:text-green-400">{formatNumber(result.carbs)}g KH</span> =
                </span>
                <span class="font-bold text-blue-600 dark:text-blue-400">{formatNumber(result.be)} BE</span>
              </div>
            {/snippet}
            {#snippet kheContent()}
              <div class="flex items-center justify-between">
                <span class="font-medium text-gray-700 dark:text-gray-300">
                  <span class="text-green-600 dark:text-green-400">{formatNumber(result.carbs)}g KH</span> =
                </span>
                <span class="font-bold text-purple-600 dark:text-purple-400">{formatNumber(result.khe)} KHE</span>
              </div>
            {/snippet}
          </UnitDisplay>
          {#if settings.showEnergy && energyForGrams !== null}
            <div class="flex items-center justify-between border-t border-blue-200 pt-3 dark:border-blue-800">
              <span class="text-sm text-gray-600 dark:text-gray-400">Brennwert</span>
              <span class="text-lg font-semibold text-amber-600 dark:text-amber-400">{energyForGrams} {settings.energyUnit}</span>
            </div>
          {/if}
        </div>
      {/if}

      <!-- Actions -->
      <div class="flex gap-3">
        <button
          onclick={handleClose}
          class="btn-touch flex-1 border-2 border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          type="button"
        >
          Abbrechen
        </button>
        <button
          onclick={addToMeal}
          class="btn-touch flex-1 bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
          type="button"
        >
          Zu Mahlzeit hinzufügen
        </button>
      </div>
    </div>
  {/if}
</dialog>

<style>
  dialog {
    margin: auto;
  }

  dialog::backdrop {
    background-color: rgba(0, 0, 0, 0.5);
  }
</style>
