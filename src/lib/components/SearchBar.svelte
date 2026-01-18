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

<div class="relative w-full">
  <div class="relative">
    <input
      type="text"
      value={inputValue}
      oninput={handleInput}
      onkeydown={handleKeyDown}
      {autofocus}
      placeholder="Lebensmittel suchen..."
      class="input-touch w-full pr-10"
      aria-label="Lebensmittel suchen"
    />
    {#if inputValue}
      <button
        onclick={clearSearch}
        class="absolute right-2 top-1/2 -translate-y-1/2 rounded-full leading-none p-2 hover:bg-gray-100 active:scale-95 dark:hover:bg-gray-700"
        aria-label="Suche löschen"
      >
        <span class="material-symbols-outlined text-gray-500">close</span>
      </button>
    {/if}
  </div>
</div>
