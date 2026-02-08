<script lang="ts">
  import type { FoodItem } from '$lib/types/food';
  import FoodCard from './FoodCard.svelte';
  import { foodStore } from '$lib/stores/foods.svelte';

  let { onFoodSelect }: { onFoodSelect: (food: FoodItem) => void } = $props();

  const favoriteFoods = $derived(foodStore.favoriteFoods);
</script>

<div class="favorites">
  <h2 class="favorites__title">Favoriten</h2>

  {#if favoriteFoods.length === 0}
    <!-- Empty state -->
    <div class="card text-center">
      <div class="favorites__empty">
        <span class="material-symbols-outlined icon-5xl text-muted">star_outline</span>
        <p class="favorites__empty-title">Noch keine Favoriten</p>
        <p class="favorites__empty-hint">
          Markiere Lebensmittel mit einem Stern, um sie hier schnell wiederzufinden
        </p>
      </div>
    </div>
  {:else}
    <!-- Favorites list -->
    <div class="favorites__list">
      {#each favoriteFoods as food (food.blsCode)}
        <FoodCard {food} onclick={() => onFoodSelect(food)} />
      {/each}
    </div>
  {/if}
</div>

<style>
  .favorites {
    display: flex;
    flex-direction: column;
    gap: var(--space-md);
  }

  .favorites__title {
    font-size: var(--text-xl);
    font-weight: var(--weight-bold);
  }

  .favorites__list {
    display: flex;
    flex-direction: column;
    gap: var(--space-xs);
  }

  .favorites__empty {
    padding-block: var(--space-xl);
  }

  .favorites__empty-title {
    margin-block-start: var(--space-md);
    color: var(--color-text-secondary);
  }

  .favorites__empty-hint {
    margin-block-start: var(--size-3xs);
    font-size: var(--text-sm);
    color: var(--color-text-tertiary);
  }
</style>
