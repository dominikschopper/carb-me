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

<div class="relative w-full" data-onboarding="search-bar">
  <div class="relative">
    <span class="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-xl text-gray-400">search</span>
    <input
      type="text"
      value={inputValue}
      oninput={handleInput}
      onkeydown={handleKeyDown}
      {autofocus}
      placeholder="Lebensmittel suchen..."
      class="w-full border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 pl-11 pr-10 py-2 text-base focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/50"
      aria-label="Lebensmittel suchen"
    />
    {#if inputValue}
      <button
        onclick={clearSearch}
        class="absolute right-2 top-1/2 flex -translate-y-1/2 items-center justify-center rounded-full p-1.5 hover:bg-gray-100 active:scale-95 dark:hover:bg-gray-700"
        aria-label="Suche löschen"
      >
        <span class="material-symbols-outlined leading-none text-base text-gray-500">close</span>
      </button>
    {/if}
  </div>
</div>
