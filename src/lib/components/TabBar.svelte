<script lang="ts">
  type Tab = 'search' | 'favorites' | 'meal';

  let { activeTab = $bindable('search') }: { activeTab?: Tab } = $props();

  function setTab(tab: Tab) {
    activeTab = tab;
  }
</script>

<nav class="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
  <div class="mx-auto flex max-w-4xl">
    <button
      onclick={() => setTab('search')}
      class="flex flex-1 flex-col items-center gap-1 py-3 text-xs transition-colors {activeTab === 'search'
        ? 'text-blue-600 dark:text-blue-400'
        : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'}"
      aria-label="Suche"
      type="button"
    >
      <span class="material-symbols-outlined">search</span>
      <span>Suche</span>
    </button>

    <button
      onclick={() => setTab('favorites')}
      class="flex flex-1 flex-col items-center gap-1 py-3 text-xs transition-colors {activeTab === 'favorites'
        ? 'text-blue-600 dark:text-blue-400'
        : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'}"
      aria-label="Favoriten"
      type="button"
    >
      <span class="material-symbols-outlined">{activeTab === 'favorites' ? 'star' : 'star_outline'}</span>
      <span>Favoriten</span>
    </button>

    <button
      onclick={() => setTab('meal')}
      class="flex flex-1 flex-col items-center gap-1 py-3 text-xs transition-colors {activeTab === 'meal'
        ? 'text-blue-600 dark:text-blue-400'
        : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'}"
      aria-label="Mahlzeit"
      type="button"
    >
      <span class="material-symbols-outlined">restaurant</span>
      <span>Mahlzeit</span>
    </button>
  </div>
</nav>
