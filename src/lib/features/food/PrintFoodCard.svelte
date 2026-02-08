<script lang="ts">
  import type { FoodItem } from '$lib/types/food';
  import { settingsStore } from '$lib/stores/settings.svelte';

  let { food }: { food: FoodItem } = $props();

  const preferredUnit = $derived(settingsStore.settings.preferredUnit);
</script>

<div class="print-card">
  <div class="print-card-name">{food.name}</div>
  {#if food.subtitle}
    <div class="print-card-subtitle">{food.subtitle}</div>
  {/if}
  <div class="print-card-info">
    {food.kh}g KH / 100{food.unit || 'g'}
  </div>
  <div class="print-card-info">
    {#if preferredUnit === 'BE'}
      1 BE = {food.gBE}g
    {:else}
      1 KHE = {food.gKHE}g
    {/if}
  </div>
</div>
