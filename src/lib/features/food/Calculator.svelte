<script lang="ts">
  import type { FoodItem } from '$lib/types/food';
  import { calculateNutrition } from './calculator';
  import { formatNumber } from '$lib/shared/formatting';
  import { mealStore } from '$lib/stores/meal.svelte';
  import { settingsStore } from '$lib/stores/settings.svelte';
  import UnitDisplay from '$lib/shared/UnitDisplay.svelte';

  let { food, onClose }: { food: FoodItem | null; onClose: () => void } = $props();

  let dialog = $state<HTMLDialogElement | null>(null);
  let inputElement = $state<HTMLInputElement | null>(null);
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
  class="dialog calculator"
>
  {#if food}
    <div class="calculator__body">
      <!-- Header -->
      <div class="calculator__header">
        <div>
          <h2 class="calculator__title">
            {food.name}
          </h2>
          <p class="calculator__subtitle"><span class="text-success">{food.kh}g KH</span> <span class="text-tertiary">/ 100{food.unit || 'g'}</span></p>
        </div>
        <button
          onclick={handleClose}
          class="btn btn--ghost"
          aria-label="Schließen"
          type="button"
        >
          <span class="material-symbols-outlined text-tertiary">close</span>
        </button>
      </div>

      <!-- Gram/ml input -->
      <div class="calculator__input-group">
        <label for="grams-input" class="calculator__label">
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
          class="input w-full"
          autofocus
        />
      </div>

      <!-- Quick presets -->
      <div class="calculator__presets">
        {#each [50, 150, 200, 250] as amount}
          <button
            onclick={() => setQuickAmount(amount)}
            class="btn btn--secondary calculator__preset-btn"
            type="button"
          >
            {amount}{food.unit || 'gr'}
          </button>
        {/each}
      </div>

      <!-- Results -->
      {#if result}
        <div class="calculator__results info-box">
          <UnitDisplay>
            {#snippet beContent()}
              <div class="calculator__result-row">
                <span class="calculator__result-label">
                  <span class="text-success">{formatNumber(result.carbs)}g KH</span> =
                </span>
                <span class="calculator__result-value text-primary font-bold">{formatNumber(result.be)} BE</span>
              </div>
            {/snippet}
            {#snippet kheContent()}
              <div class="calculator__result-row">
                <span class="calculator__result-label">
                  <span class="text-success">{formatNumber(result.carbs)}g KH</span> =
                </span>
                <span class="calculator__result-value text-accent font-bold">{formatNumber(result.khe)} KHE</span>
              </div>
            {/snippet}
          </UnitDisplay>
          {#if settings.showEnergy && energyForGrams !== null}
            <div class="calculator__energy-row">
              <span class="calculator__energy-label">Brennwert</span>
              <span class="calculator__energy-value">{energyForGrams} {settings.energyUnit}</span>
            </div>
          {/if}
        </div>
      {/if}

      <!-- Actions -->
      <div class="calculator__actions">
        <button
          onclick={handleClose}
          class="btn btn--outline calculator__action-btn"
          type="button"
        >
          Abbrechen
        </button>
        <button
          onclick={addToMeal}
          class="btn btn--primary calculator__action-btn"
          type="button"
        >
          Zu Mahlzeit hinzufügen
        </button>
      </div>
    </div>
  {/if}
</dialog>

<style>
  .calculator {
    max-width: 32rem;
  }

  .calculator__body {
    padding: var(--space-lg);
  }

  .calculator__header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-block-end: var(--space-md);
  }

  .calculator__title {
    font-size: var(--text-lg);
    font-weight: var(--weight-bold);
    overflow-wrap: anywhere;
  }

  @media (min-width: 640px) {
    .calculator__title {
      font-size: var(--text-xl);
    }
  }

  .calculator__subtitle {
    font-size: var(--text-sm);
  }

  .calculator__input-group {
    margin-block-end: var(--space-md);
  }

  .calculator__label {
    display: block;
    margin-block-end: var(--space-xs);
    font-size: var(--text-sm);
    font-weight: var(--weight-medium);
    color: var(--color-text-secondary);
  }

  .calculator__presets {
    display: flex;
    gap: var(--space-xs);
    margin-block-end: var(--space-lg);
  }

  .calculator__preset-btn {
    flex: 1;
    padding-inline: var(--space-xs);
  }

  .calculator__results {
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
    margin-block-end: var(--space-lg);
  }

  .calculator__result-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .calculator__result-label {
    font-weight: var(--weight-medium);
    color: var(--color-text-secondary);
  }

  .calculator__result-value {
    font-size: var(--text-base);
  }

  .calculator__energy-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-block-start: 1px solid var(--color-border);
    padding-block-start: var(--space-sm);
  }

  .calculator__energy-label {
    font-size: var(--text-sm);
    color: var(--color-text-secondary);
  }

  .calculator__energy-value {
    font-size: var(--text-lg);
    font-weight: var(--weight-semibold);
    color: var(--color-warning-text);
  }

  .calculator__actions {
    display: flex;
    gap: var(--space-sm);
  }

  .calculator__action-btn {
    flex: 1;
  }
</style>
