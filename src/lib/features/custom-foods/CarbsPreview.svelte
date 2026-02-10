<script lang="ts">
  let { calculatedUnits, kh, unit }: {
    calculatedUnits: { gBE: number; gKHE: number } | null;
    kh: number | '';
    unit: 'gr' | 'ml';
  } = $props();
</script>

{#if calculatedUnits}
  <div class="info-box carbs-preview">
    <p class="carbs-preview__title">
      Berechnete Werte
    </p>
    <div class="carbs-preview__values">
      <div class="carbs-preview__item">
        <div class="carbs-preview__label">1 BE</div>
        <div class="carbs-preview__number text-primary">
          {calculatedUnits.gBE}{unit}
        </div>
      </div>
      <div class="text-muted">•</div>
      <div class="carbs-preview__item">
        <div class="carbs-preview__label">1 KHE</div>
        <div class="carbs-preview__number text-accent">
          {calculatedUnits.gKHE}{unit}
        </div>
      </div>
    </div>
  </div>
{:else if typeof kh === 'number' && kh === 0}
  <div class="info-box info-box--warning carbs-preview">
    <p class="carbs-preview__caution-text">
      ⚠ Achtung: Bei 0 KH können keine BE/KHE berechnet werden.
    </p>
  </div>
{/if}

<style>
  .carbs-preview {
    margin-block-end: var(--space-lg);
  }

  .carbs-preview__title {
    margin-block-end: var(--space-xs);
    font-size: var(--text-sm);
    font-weight: var(--weight-medium);
    color: var(--color-text-secondary);
  }

  .carbs-preview__values {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-md);
    text-align: center;
  }

  .carbs-preview__label {
    font-size: var(--text-xs);
    color: var(--color-text-secondary);
  }

  .carbs-preview__number {
    font-size: var(--text-lg);
    font-weight: var(--weight-bold);
  }

  .carbs-preview__caution-text {
    font-size: var(--text-sm);
    color: var(--color-caution-text);
  }
</style>
