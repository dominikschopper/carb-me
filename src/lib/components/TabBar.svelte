<script lang="ts">
  type Tab = 'search' | 'favorites' | 'meal' | 'settings';

  let { activeTab = $bindable('search') }: { activeTab?: Tab } = $props();

  function setTab(tab: Tab) {
    activeTab = tab;
  }
</script>

<nav class="safe-area-inset fixed bottom-0 left-0 right-0 z-40 border-t border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
  <div class="container mx-auto flex max-w-[720px]">
    <button
      onclick={() => setTab('search')}
      class="flex flex-1 flex-col items-center gap-0.5 py-2 text-[10px] transition-colors sm:gap-1 sm:text-xs {activeTab === 'search'
        ? 'text-blue-600 dark:text-blue-400'
        : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'}"
      aria-label="Suche"
      type="button"
    >
      <span class="material-symbols-outlined text-xl">search</span>
      <span class="font-medium">Suche</span>
    </button>

    <button
      onclick={() => setTab('favorites')}
      class="flex flex-1 flex-col items-center gap-0.5 py-2 text-[10px] transition-colors sm:gap-1 sm:text-xs {activeTab === 'favorites'
        ? 'text-blue-600 dark:text-blue-400'
        : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'}"
      aria-label="Favoriten"
      type="button"
    >
      <span class="material-symbols-outlined text-xl">{activeTab === 'favorites' ? 'star' : 'star_outline'}</span>
      <span class="font-medium">Favoriten</span>
    </button>

    <button
      onclick={() => setTab('meal')}
      class="flex flex-1 flex-col items-center gap-0.5 py-2 text-[10px] transition-colors sm:gap-1 sm:text-xs {activeTab === 'meal'
        ? 'text-blue-600 dark:text-blue-400'
        : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'}"
      aria-label="Mahlzeit"
      type="button"
    >
      <span class="material-symbols-outlined text-xl">restaurant</span>
      <span class="font-medium">Mahlzeit</span>
    </button>

    <button
      onclick={() => setTab('settings')}
      class="flex flex-1 flex-col items-center gap-0.5 py-2 text-[10px] transition-colors sm:gap-1 sm:text-xs {activeTab === 'settings'
        ? 'text-blue-600 dark:text-blue-400'
        : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'}"
      aria-label="Einstellungen"
      type="button"
    >
      <span class="material-symbols-outlined text-xl">settings</span>
      <span class="font-medium">Mehr</span>
    </button>
  </div>
</nav>
