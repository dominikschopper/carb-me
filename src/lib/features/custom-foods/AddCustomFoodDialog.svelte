<script lang="ts">
  import type { FoodItem } from '$lib/types/food';
  import { calculateUnitsFromCarbs, kcalToKj, kjToKcal } from '$lib/features/food/calculator';
  import { generateCustomFoodId } from './id-generator';
  import { foodStore } from '$lib/stores/foods.svelte';

  let { isOpen, onClose, editFood }: { isOpen: boolean; onClose: () => void; editFood?: FoodItem | null } = $props();

  let dialog: HTMLDialogElement;
  let nameInput: HTMLInputElement;

  // Form state
  let name = $state('');
  let kh = $state<number | ''>('');
  let unit = $state<'gr' | 'ml'>('gr');
  let kcal = $state<number | ''>('');
  let kj = $state<number | ''>('');
  let subtitle = $state('');

  // Track which energy field was last modified
  let lastModifiedEnergy: 'kcal' | 'kj' | null = $state(null);

  // Touch state for validation
  let touched = $state({
    name: false,
    kh: false
  });

  // Success toast
  let successMessage = $state('');

  // Validation
  const isNameValid = $derived(name.trim().length > 0);
  const isKhValid = $derived(typeof kh === 'number' && kh > 0);
  const canSubmit = $derived(isNameValid && isKhValid);

  // Auto-calculated values
  const calculatedUnits = $derived.by(() => {
    if (typeof kh === 'number' && kh > 0) {
      return calculateUnitsFromCarbs(kh);
    }
    return null;
  });

  // Generated ID preview (nur im Create-Modus)
  const generatedId = $derived(
    editFood ? editFood.blsCode : generateCustomFoodId(foodStore.customFoods)
  );

  // Show validation errors
  const showNameError = $derived(touched.name && !isNameValid);
  const showKhError = $derived(touched.kh && !isKhValid);

  // Initialize form with editFood values when in edit mode
  $effect(() => {
    if (editFood) {
      name = editFood.name;
      kh = editFood.kh;
      unit = editFood.unit === 'ml' ? 'ml' : 'gr';
      kcal = editFood.kcal ?? '';
      kj = editFood.kj ?? '';
      subtitle = editFood.subtitle ?? '';
    }
  });

  function handleNameBlur() {
    touched.name = true;
  }

  function handleKhBlur() {
    touched.kh = true;
  }

  function handleKcalInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    const numValue = value === '' ? '' : parseFloat(value);
    kcal = numValue;

    if (typeof numValue === 'number' && numValue > 0) {
      lastModifiedEnergy = 'kcal';
      kj = kcalToKj(numValue);
    } else if (value === '') {
      kj = '';
      lastModifiedEnergy = null;
    }
  }

  function handleKjInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    const numValue = value === '' ? '' : parseFloat(value);
    kj = numValue;

    if (typeof numValue === 'number' && numValue > 0) {
      lastModifiedEnergy = 'kj';
      kcal = kjToKcal(numValue);
    } else if (value === '') {
      kcal = '';
      lastModifiedEnergy = null;
    }
  }

  function handleSubmit() {
    if (!canSubmit) return;

    const blsCode = generatedId;
    const { gBE, gKHE } = calculateUnitsFromCarbs(kh as number);

    const foodData: FoodItem = {
      name: name.trim(),
      subtitle: subtitle.trim() || undefined,
      kh: kh as number,
      gBE,
      gKHE,
      blsCode,
      unit: unit === 'ml' ? 'ml' : undefined,
      categories: [['Eigene Lebensmittel']],
      tags: ['custom']
    };

    // Optionale Energiewerte nur hinzufügen wenn vorhanden
    if (typeof kcal === 'number' && kcal > 0) {
      foodData.kcal = Math.round(kcal);
    }
    if (typeof kj === 'number' && kj > 0) {
      foodData.kj = Math.round(kj);
    }

    if (editFood) {
      foodStore.updateCustomFood(editFood.blsCode, foodData);
      showSuccessToast('Lebensmittel erfolgreich aktualisiert');
    } else {
      foodStore.addCustomFood(foodData);
      showSuccessToast('Lebensmittel erfolgreich hinzugefügt');
    }

    resetForm();
    handleClose();
  }

  function handleClose() {
    dialog?.close();
    onClose();
  }

  function resetForm() {
    name = '';
    kh = '';
    unit = 'gr';
    kcal = '';
    kj = '';
    subtitle = '';
    touched = { name: false, kh: false };
    lastModifiedEnergy = null;
  }

  function showSuccessToast(message: string) {
    successMessage = message;
    setTimeout(() => (successMessage = ''), 3000);
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      handleClose();
    } else if (event.key === 'Enter') {
      event.preventDefault();
      handleSubmit();
    }
  }

  // Open dialog when isOpen changes
  $effect(() => {
    if (isOpen && dialog) {
      dialog.showModal();
      // Focus name input after dialog opens
      setTimeout(() => {
        nameInput?.focus();
      }, 0);
    }
  });
</script>

<dialog
  bind:this={dialog}
  onclose={handleClose}
  class="w-full max-w-lg rounded-2xl bg-white p-0 backdrop:bg-black/50 dark:bg-gray-800 sm:rounded-2xl"
>
  <div class="p-6">
    <!-- Header -->
    <div class="mb-6 flex items-start justify-between">
      <div class="flex flex-wrap items-baseline gap-3">
        <h2 class="text-lg font-bold text-gray-900 dark:text-gray-100 sm:text-lg justify-self-start whitespace-pre-line">
          {editFood ? 'Lebensmittel bearbeiten' : 'Lebensmittel hinzufügen'}
        </h2>
        <code class="text-xs font-mono text-gray-400 dark:text-gray-500 justify-self-end">
          ID: {generatedId}
        </code>
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

    <form onsubmit={(e) => { e.preventDefault(); handleSubmit(); }} onkeydown={handleKeyDown}>
      <!-- Name (Required) -->
      <div class="mb-4">
        <label for="name-input" class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Name <span class="text-red-500">*</span>
        </label>
        <input
          id="name-input"
          bind:this={nameInput}
          type="text"
          bind:value={name}
          onblur={handleNameBlur}
          placeholder="z.B. Hausgemachte Marmelade"
          class="input-touch w-full {showNameError ? 'border-red-500 dark:border-red-400' : ''}"
          required
        />
        {#if showNameError}
          <p class="mt-1 text-sm text-red-600 dark:text-red-400" role="alert">
            Bitte gib einen Namen ein
          </p>
        {/if}
      </div>

<div class="flex gap-3">
      <!-- KH (Required) -->
      <div class="mb-4 width:50">
        <label for="kh-input" class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Kohlenhydrate (KH) pro 100{unit} <span class="text-red-500">*</span>
        </label>
        <div class="relative">
          <input
            id="kh-input"
            type="number"
            bind:value={kh}
            onblur={handleKhBlur}
            min="0"
            step="0.1"
            inputmode="decimal"
            placeholder="z.B. 25.5"
            class="input-touch w-full number-to-text {showKhError ? 'border-red-500 dark:border-red-400' : ''}"
            required

          />
          <span class="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 dark:text-gray-400">
            grKH
          </span>
        </div>
        {#if showKhError}
          <p class="mt-1 text-sm text-red-600 dark:text-red-400" role="alert">
            Kohlenhydrate müssen größer als 0 sein
          </p>
        {:else}
          <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Kohlenhydrate pro 100{unit} des Lebensmittels
          </p>
        {/if}
      </div>

      <!-- Unit Selection -->
      <div class="mb-4 width:50">
        <p class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Einheit</p>
        <div class="flex gap-2 pt-1">
          <label
            class="flex items-center gap-2 cursor-pointer rounded-lg border-2 px-3 py-1.5 transition-colors {unit === 'gr'
              ? 'border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-900/30'
              : 'border-gray-300 bg-white hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700'}"
          >
            <input
              type="radio"
              name="unit"
              value="gr"
              checked={unit === 'gr'}
              onchange={() => (unit = 'gr')}
              class="sr-only"
            />
            <span class="text-sm font-medium text-gray-900 dark:text-gray-100">Gramm</span>
          </label>
          <label
            class="flex items-center gap-2 cursor-pointer rounded-lg border-2 px-3 py-1.5 transition-colors {unit === 'ml'
              ? 'border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-900/30'
              : 'border-gray-300 bg-white hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700'}"
          >
            <input
              type="radio"
              name="unit"
              value="ml"
              checked={unit === 'ml'}
              onchange={() => (unit = 'ml')}
              class="sr-only"
            />
            <span class="text-sm font-medium text-gray-900 dark:text-gray-100">Milliliter</span>
          </label>
        </div>
      </div>
</div>
      <!-- Calculated Units -->
      {#if calculatedUnits}
        <div class="mb-6 rounded-lg bg-blue-50 p-4 dark:bg-blue-900/30">
          <p class="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            Berechnete Werte
          </p>
          <div class="flex items-center justify-center gap-4 text-center">
            <div>
              <div class="text-xs text-gray-600 dark:text-gray-400">1 BE</div>
              <div class="text-lg font-bold text-blue-600 dark:text-blue-400">
                {calculatedUnits.gBE}{unit}
              </div>
            </div>
            <div class="text-gray-400">•</div>
            <div>
              <div class="text-xs text-gray-600 dark:text-gray-400">1 KHE</div>
              <div class="text-lg font-bold text-purple-600 dark:text-purple-400">
                {calculatedUnits.gKHE}{unit}
              </div>
            </div>
          </div>
        </div>
      {:else if typeof kh === 'number' && kh === 0}
        <div class="mb-6 rounded-lg bg-amber-50 p-4 dark:bg-amber-900/30">
          <p class="text-sm text-amber-800 dark:text-amber-200">
            ⚠ Achtung: Bei 0 KH können keine BE/KHE berechnet werden.
          </p>
        </div>
      {/if}

      <!-- Energy (Optional) -->
      <div class="mb-6">
        <p class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Brennwert <span class="text-gray-500">(optional)</span>
        </p>
        <div class="flex items-center gap-2">
          <div class="flex-1 relative">
            <input
              id="kcal-input"
              type="number"
              value={kcal}
              oninput={handleKcalInput}
              min="0"
              step="1"
              inputmode="numeric"
              placeholder="z.B. 250"
              class="input-touch w-full number-to-text"
            />
            <span class="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 dark:text-gray-400">
              kcal
            </span>
          </div>
          <span class="text-gray-400 dark:text-gray-500">↔</span>
          <div class="flex-1 relative">
            <input
              id="kj-input"
              type="number"
              value={kj}
              oninput={handleKjInput}
              min="0"
              step="1"
              inputmode="numeric"
              placeholder="z.B. 1046"
              class="input-touch w-full number-to-text"
            />
            <span class="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 dark:text-gray-400">
              kJ
            </span>
          </div>
        </div>
      </div>

      <!-- Subtitle (Optional) -->
      <div class="mb-6">
        <label for="subtitle-input" class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Zusatzinfo <span class="text-gray-500">(optional)</span>
        </label>
        <input
          id="subtitle-input"
          type="text"
          bind:value={subtitle}
          placeholder="z.B. Erdbeer, Omas Rezept"
          class="input-touch w-full"
        />
      </div>

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
          type="submit"
          disabled={!canSubmit}
          class="btn-touch flex-1 bg-blue-600 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          {editFood ? 'Speichern' : 'Hinzufügen'}
        </button>
      </div>
    </form>
  </div>
</dialog>

<!-- Success Toast -->
{#if successMessage}
  <div
    class="fixed bottom-20 left-1/2 z-50 -translate-x-1/2 rounded-lg bg-green-600 px-4 py-2 text-white shadow-lg"
  >
    ✓ {successMessage}
  </div>
{/if}

<style>
  dialog {
    margin: auto;
  }

  dialog::backdrop {
    background-color: rgba(0, 0, 0, 0.5);
  }
</style>
