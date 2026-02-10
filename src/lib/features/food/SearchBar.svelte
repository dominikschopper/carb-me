<script lang="ts">
  import { foodStore } from '$lib/stores/foods.svelte';

  let { autofocus = true }: { autofocus?: boolean } = $props();

  // Local input state for immediate feedback
  let inputValue = $state(foodStore.searchQuery);
  let debounceTimer: ReturnType<typeof setTimeout> | null = null;

  const DEBOUNCE_MS = 300;

  // Debounced update to the store
  function updateSearch(value: string) {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
    debounceTimer = setTimeout(() => {
      foodStore.searchQuery = value;
    }, DEBOUNCE_MS);
  }

  function handleInput(event: Event) {
    const target = event.target as HTMLInputElement;
    inputValue = target.value;
    updateSearch(target.value);
  }

  function clearSearch() {
    inputValue = '';
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
    foodStore.searchQuery = '';
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      clearSearch();
    }
  }
</script>

<div class="search-bar" data-onboarding="search-bar">
  <div class="search-bar__wrapper">
    <span class="material-symbols-outlined icon-xl search-bar__icon">search</span>
    <input
      type="text"
      autocomplete="off"
      value={inputValue}
      oninput={handleInput}
      onkeydown={handleKeyDown}
      {autofocus}
      placeholder="Lebensmittel suchen..."
      class="input search-bar__input"
      aria-label="Lebensmittel suchen"
    />
    {#if inputValue}
      <button
        onclick={clearSearch}
        class="btn btn--ghost search-bar__clear"
        aria-label="Suche löschen"
      >
        <span class="material-symbols-outlined text-tertiary">close</span>
      </button>
    {/if}
  </div>
</div>

<style>
  .search-bar {
    width: 100%;
  }

  .search-bar__wrapper {
    position: relative;
  }

  .search-bar__icon {
    position: absolute;
    left: var(--space-sm);
    top: 50%;
    transform: translateY(-50%);
    color: var(--color-text-muted);
  }

  .search-bar__input {
    padding-inline-start: 2.75rem;
    padding-inline-end: 2.5rem;
  }

  .search-bar__clear {
    position: absolute;
    right: var(--space-xs);
    top: 50%;
    transform: translateY(-50%);
    padding: var(--size-2xs);
    min-height: auto;
  }
</style>
