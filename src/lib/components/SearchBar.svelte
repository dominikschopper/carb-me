<script lang="ts">
  import { foodStore } from '$lib/stores/foods.svelte';

  let { autofocus = true }: { autofocus?: boolean } = $props();

  function clearSearch() {
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
      bind:value={foodStore.searchQuery}
      onkeydown={handleKeyDown}
      {autofocus}
      placeholder="Lebensmittel suchen..."
      class="input-touch w-full pr-10"
      aria-label="Lebensmittel suchen"
    />
    {#if foodStore.searchQuery}
      <button
        onclick={clearSearch}
        class="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-2 hover:bg-gray-100 active:scale-95 dark:hover:bg-gray-700"
        aria-label="Suche löschen"
      >
        <span class="material-symbols-outlined text-gray-500">close</span>
      </button>
    {/if}
  </div>
</div>
