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
  const isKhValid = $derived(typeof kh === 'number' && kh > 0 && kh <= 100);
  const canSubmit = $derived(isNameValid && isKhValid);

  // Auto-calculated values
  const calculatedUnits = $derived.by(() => {
    if (typeof kh === 'number' && kh > 0) {
      return calculateUnitsFromCarbs(kh);
    }
    return null;
  });

  // Generated ID preview (create mode only)
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

    // Only add optional energy values if present
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
  class="dialog custom-food-form"
>
  <div class="custom-food-form__body">
    <!-- Header -->
    <div class="custom-food-form__header">
      <div class="custom-food-form__header-text">
        <h2 class="custom-food-form__title">
          {editFood ? 'Bearbeiten' : 'Hinzufügen'}
        </h2>
        <code class="custom-food-form__id">
          ID: {generatedId}
        </code>
        <button
          onclick={handleClose}
          class="btn btn--ghost"
          aria-label="Schließen"
          type="button"
        >
          <span class="material-symbols-outlined text-tertiary">close</span>
        </button>
      </div>
    </div>

    <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
    <form onsubmit={(e) => { e.preventDefault(); handleSubmit(); }} onkeydown={handleKeyDown}>
      <!-- Name (Required) -->
      <div class="custom-food-form__field">
        <label for="name-input" class="custom-food-form__label">
          Name <span class="text-danger">*</span>
        </label>
        <input
          id="name-input"
          bind:this={nameInput}
          type="text"
          bind:value={name}
          onblur={handleNameBlur}
          maxlength={100}
          placeholder="z.B. Hausgemachte Marmelade"
          class="input w-full {showNameError ? 'input--error' : ''}"
          required
        />
        {#if showNameError}
          <p class="custom-food-form__error" role="alert">
            Bitte gib einen Namen ein
          </p>
        {/if}
      </div>

      <div class="custom-food-form__row">
        <!-- KH (Required) -->
        <div class="custom-food-form__field custom-food-form__field--half">
          <label for="kh-input" class="custom-food-form__label">
            KH pro 100{unit} <span class="text-danger">*</span>
          </label>
          <div class="custom-food-form__input-wrap">
            <input
              id="kh-input"
              type="number"
              bind:value={kh}
              onblur={handleKhBlur}
              min="0"
              max="100"
              step="0.1"
              inputmode="decimal"
              placeholder="z.B. 25.5"
              class="input w-full number-to-text {showKhError ? 'input--error' : ''}"
              required
            />
            <span class="custom-food-form__suffix">grKH</span>
          </div>
          {#if showKhError}
            <p class="custom-food-form__error" role="alert">
              KH müssen größer als 0 sein!
            </p>
          {/if}
        </div>

        <!-- Unit Selection -->
        <div class="custom-food-form__field custom-food-form__field--half">
          <p class="custom-food-form__label">Einheit</p>
          <div class="custom-food-form__unit-options">
            <label
              class="selection-card {unit === 'gr' ? 'selection-card--selected' : ''}"
            >
              <input
                type="radio"
                name="unit"
                value="gr"
                checked={unit === 'gr'}
                onchange={() => (unit = 'gr')}
                class="sr-only"
              />
              <span class="custom-food-form__unit-label">Gramm</span>
            </label>
            <label
              class="selection-card {unit === 'ml' ? 'selection-card--selected' : ''}"
            >
              <input
                type="radio"
                name="unit"
                value="ml"
                checked={unit === 'ml'}
                onchange={() => (unit = 'ml')}
                class="sr-only"
              />
              <span class="custom-food-form__unit-label">Milliliter</span>
            </label>
          </div>
        </div>
      </div>

      <!-- Calculated Units -->
      {#if calculatedUnits}
        <div class="info-box custom-food-form__preview">
          <p class="custom-food-form__preview-title">
            Berechnete Werte
          </p>
          <div class="custom-food-form__preview-values">
            <div class="custom-food-form__preview-item">
              <div class="custom-food-form__preview-label">1 BE</div>
              <div class="custom-food-form__preview-number text-primary">
                {calculatedUnits.gBE}{unit}
              </div>
            </div>
            <div class="text-muted">•</div>
            <div class="custom-food-form__preview-item">
              <div class="custom-food-form__preview-label">1 KHE</div>
              <div class="custom-food-form__preview-number text-accent">
                {calculatedUnits.gKHE}{unit}
              </div>
            </div>
          </div>
        </div>
      {:else if typeof kh === 'number' && kh === 0}
        <div class="info-box info-box--warning custom-food-form__preview">
          <p class="custom-food-form__caution-text">
            ⚠ Achtung: Bei 0 KH können keine BE/KHE berechnet werden.
          </p>
        </div>
      {/if}

      <!-- Energy (Optional) -->
      <div class="custom-food-form__field custom-food-form__field--large">
        <p class="custom-food-form__label">
          Brennwert <span class="text-tertiary">(optional)</span>
        </p>
        <div class="custom-food-form__energy-row">
          <div class="custom-food-form__energy-input">
            <input
              id="kcal-input"
              type="number"
              value={kcal}
              oninput={handleKcalInput}
              min="0"
              max="900"
              step="1"
              inputmode="numeric"
              placeholder="z.B. 250"
              class="input w-full number-to-text"
            />
            <span class="custom-food-form__suffix">kcal</span>
          </div>
          <span class="text-muted">↔</span>
          <div class="custom-food-form__energy-input">
            <input
              id="kj-input"
              type="number"
              value={kj}
              oninput={handleKjInput}
              min="0"
              max="3800"
              step="1"
              inputmode="numeric"
              placeholder="z.B. 1046"
              class="input w-full number-to-text"
            />
            <span class="custom-food-form__suffix">kJ</span>
          </div>
        </div>
      </div>

      <!-- Subtitle (Optional) -->
      <div class="custom-food-form__field custom-food-form__field--large">
        <label for="subtitle-input" class="custom-food-form__label">
          Zusatzinfo <span class="text-tertiary">(optional)</span>
        </label>
        <input
          id="subtitle-input"
          type="text"
          bind:value={subtitle}
          placeholder="z.B. Erdbeer, Omas Rezept"
          class="input w-full"
        />
      </div>

      <!-- Actions -->
      <div class="custom-food-form__actions">
        <button
          onclick={handleClose}
          class="btn btn--outline custom-food-form__action-btn"
          type="button"
        >
          Abbrechen
        </button>
        <button
          type="submit"
          disabled={!canSubmit}
          class="btn btn--primary custom-food-form__action-btn"
        >
          {editFood ? 'Speichern' : 'Hinzufügen'}
        </button>
      </div>
    </form>
  </div>
</dialog>

<!-- Success Toast -->
{#if successMessage}
  <div class="custom-food-form__toast">
    ✓ {successMessage}
  </div>
{/if}

<style>
  .custom-food-form {
    max-width: 32rem;
  }

  .custom-food-form__body {
    padding: var(--space-lg);
  }

  .custom-food-form__header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-block-end: var(--space-lg);
  }

  .custom-food-form__header-text {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-sm);
    width: 100%;
  }

  .custom-food-form__title {
    font-size: var(--text-lg);
    font-weight: var(--weight-bold);
    white-space: pre-line;
    color:var(--color-text);
  }

  .custom-food-form__id {
    font-size: var(--text-xs);
    font-family: monospace;
    color: var(--color-text-muted);
  }

  .custom-food-form__field {
    margin-block-end: var(--space-md);
  }

  .custom-food-form__field--large {
    margin-block-end: var(--space-lg);
  }

  .custom-food-form__label {
    display: block;
    margin-block-end: var(--space-xs);
    font-size: var(--text-sm);
    font-weight: var(--weight-medium);
    color: var(--color-text-secondary);
  }

  .custom-food-form__input-wrap {
    position: relative;
  }

  .custom-food-form__suffix {
    position: absolute;
    right: var(--space-sm);
    top: 50%;
    transform: translateY(-50%);
    font-size: var(--text-sm);
    color: var(--color-text-tertiary);
  }

  .custom-food-form__error {
    margin-block-start: var(--size-3xs);
    font-size: var(--text-sm);
    color: var(--color-danger-text);
  }

  .custom-food-form__hint {
    margin-block-start: var(--size-3xs);
    font-size: var(--text-xs);
    color: var(--color-text-tertiary);
  }

  .custom-food-form__row {
    display: flex;
    gap: var(--space-sm);
    align-items: center;
  }

  .custom-food-form__field--half {
    flex: 1;
  }

  .custom-food-form__unit-options {
    display: flex;
    gap: var(--space-xs);
    padding-block-start: var(--size-3xs);
  }

  .custom-food-form__unit-label {
    font-size: var(--text-sm);
    font-weight: var(--weight-medium);
    color: var(--color-text-muted);
  }

  .custom-food-form__preview {
    margin-block-end: var(--space-lg);
  }

  .custom-food-form__preview-title {
    margin-block-end: var(--space-xs);
    font-size: var(--text-sm);
    font-weight: var(--weight-medium);
    color: var(--color-text-secondary);
  }

  .custom-food-form__preview-values {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-md);
    text-align: center;
  }

  .custom-food-form__preview-label {
    font-size: var(--text-xs);
    color: var(--color-text-secondary);
  }

  .custom-food-form__preview-number {
    font-size: var(--text-lg);
    font-weight: var(--weight-bold);
  }

  .custom-food-form__caution-text {
    font-size: var(--text-sm);
    color: var(--color-caution-text);
  }

  .custom-food-form__energy-row {
    display: flex;
    align-items: center;
    gap: var(--space-xs);
  }

  .custom-food-form__energy-input {
    flex: 1;
    position: relative;
  }

  .custom-food-form__actions {
    display: flex;
    gap: var(--space-sm);
  }

  .custom-food-form__action-btn {
    flex: 1;
  }

  .custom-food-form__toast {
    position: fixed;
    bottom: 5rem;
    left: 50%;
    transform: translateX(-50%);
    z-index: 50;
    border-radius: var(--radius-lg);
    background-color: var(--color-success);
    padding: var(--space-xs) var(--space-md);
    color: var(--color-text-inverse);
    box-shadow: var(--shadow-lg);
  }
</style>
