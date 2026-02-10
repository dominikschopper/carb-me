<script lang="ts">
  import { kcalToKj, kjToKcal } from '$lib/features/food/calculator';

  let { kcal = $bindable<number | ''>(''), kj = $bindable<number | ''>('') }: { kcal: number | ''; kj: number | '' } = $props();

  let lastModifiedEnergy: 'kcal' | 'kj' | null = $state(null);

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
</script>

<div class="energy-input__field">
  <p class="energy-input__label">
    Brennwert <span class="text-tertiary">(optional)</span>
  </p>
  <div class="energy-input__row">
    <div class="energy-input__wrap">
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
      <span class="energy-input__suffix">kcal</span>
    </div>
    <span class="text-muted">↔</span>
    <div class="energy-input__wrap">
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
      <span class="energy-input__suffix">kJ</span>
    </div>
  </div>
</div>

<style>
  .energy-input__field {
    margin-block-end: var(--space-lg);
  }

  .energy-input__label {
    display: block;
    margin-block-end: var(--space-xs);
    font-size: var(--text-sm);
    font-weight: var(--weight-medium);
    color: var(--color-text-secondary);
  }

  .energy-input__row {
    display: flex;
    align-items: center;
    gap: var(--space-xs);
  }

  .energy-input__wrap {
    flex: 1;
    position: relative;
  }

  .energy-input__suffix {
    position: absolute;
    right: var(--space-sm);
    top: 50%;
    transform: translateY(-50%);
    font-size: var(--text-sm);
    color: var(--color-text-tertiary);
  }
</style>
