<script lang="ts">
  import { goto } from '$app/navigation';
  import Header from '$lib/shared/Header.svelte';
  import TabBar from '$lib/shared/TabBar.svelte';
  import SearchBar from '$lib/features/food/SearchBar.svelte';
  import FoodList from '$lib/features/food/FoodList.svelte';
  import FoodCard from '$lib/features/food/FoodCard.svelte';
  import CustomFoodsList from '$lib/features/custom-foods/CustomFoodsList.svelte';
  import MealComposer from '$lib/features/meal/MealComposer.svelte';
  import SettingsPage from '$lib/features/settings/SettingsPage.svelte';
  import Calculator from '$lib/features/food/Calculator.svelte';
  import AddCustomFoodDialog from '$lib/features/custom-foods/AddCustomFoodDialog.svelte';
  import { foodStore } from '$lib/stores/foods.svelte';
  import { disclaimerStorage } from '$lib/shared/storage';
  import { onboardingService } from '$lib/features/onboarding/service';
  import type { FoodItem } from '$lib/types/food';
  import { swStore } from '$lib/features/update/serviceWorker.svelte';

  let activeTab = $state<'search' | 'custom' | 'meal' | 'settings'>('search');
  let selectedFood = $state<FoodItem | null>(null);
  let showCustomFoodDialog = $state(false);
  let editFood = $state<FoodItem | null>(null);
  let onboardingInitialized = $state(false);

  const filteredFoods = $derived(foodStore.filteredFoods);
  const favoriteFoods = $derived(foodStore.favoriteFoods);
  const isSearching = $derived(foodStore.isSearching);
  const searchQuery = $derived(foodStore.searchQuery);
  const loading = $derived(foodStore.isLoading);

  // Check for disclaimer acceptance on mount
  $effect(() => {
    if (typeof window !== 'undefined') {
      const hasAccepted = disclaimerStorage.get();
      if (!hasAccepted) {
        goto('/legal?onboarding=true');
      } else if (!onboardingInitialized && !loading) {
        startOnboardingIfNeeded();
        onboardingInitialized = true;
      }
    }
  });

  function handleFoodSelect(food: FoodItem) {
    selectedFood = food;
  }

  function closeCalculator() {
    selectedFood = null;
  }

  function goToMeal() {
    activeTab = 'meal';
  }

  function goToHome() {
    activeTab = 'search';
  }

  function handleAddCustomFood() {
    editFood = null;
    showCustomFoodDialog = true;
  }

  function handleEditCustomFood(food: FoodItem) {
    editFood = food;
    showCustomFoodDialog = true;
  }

  function closeCustomFoodDialog() {
    showCustomFoodDialog = false;
    editFood = null;
  }

  function startOnboardingIfNeeded() {
    if (!onboardingService.shouldShow()) return;

    // Initial delay allows update notification to appear first
    setTimeout(() => {
      onboardingService.startTour({
        isBlocked: () => swStore.updateAvailable,
        onComplete: () => {
          foodStore.setSearchQuery('');
        },
        onSkip: () => {
          foodStore.setSearchQuery('');
        },
        onSearchDemo: (query) => {
          setTimeout(() => {
            const searchField: HTMLInputElement | null = document.querySelector('input[aria-label="Lebensmittel suchen"]');
            if (searchField) {
              searchField.value = query;
            }
            foodStore.setSearchQuery(query);
          }, 700);
        },
        onNavigateToCustom: () => { activeTab = 'custom'; },
        onNavigateToSettings: () => { activeTab = 'settings'; },
        onNavigateToMeal: () => { activeTab = 'meal'; },
      });
    }, 500);
  }
</script>

<div class="app-shell">
  <Header onMealClick={goToMeal} onHomeClick={goToHome} />

  <main class="app-shell__main">
    {#if activeTab === 'search'}
      <div class="app-shell__search">
        <SearchBar />

        {#if !isSearching}
          <!-- Call-to-Action Bereich -->
          <div class="card text-center app-shell__cta">
            <p class="app-shell__cta-text">
              <span class="material-symbols-outlined">search</span>
              Einfach lostippen und Lebensmittel finden
            </p>
          </div>

          <div class="divider"></div>

          <!-- Favoriten Section -->
          <div class="app-shell__favorites">
            <h3 class="app-shell__favorites-title">
              <span class="material-symbols-outlined text-favorite">star</span>
              Favoriten
            </h3>

            {#if favoriteFoods.length > 0}
              <!-- Alle Favoriten anzeigen -->
              <div class="app-shell__favorites-list">
                {#each favoriteFoods as food, index (`fav-${food.blsCode}-${index}`)}
                  <FoodCard {food} onclick={() => handleFoodSelect(food)} />
                {/each}
              </div>
            {:else}
              <!-- Empty State -->
              <div class="card text-center app-shell__favorites-empty">
                <p class="app-shell__favorites-hint">
                  Du kannst häufig verwendete Lebensmittel mit einem Stern markieren,<br/>
                  dann werden sie hier angezeigt.
                </p>
              </div>
            {/if}

            <div class="divider"></div>
          </div>
        {/if}

        {#if isSearching}
          <FoodList foods={filteredFoods} onFoodSelect={handleFoodSelect} {loading} {isSearching} {searchQuery} />
        {/if}
      </div>
    {:else if activeTab === 'custom'}
      <CustomFoodsList onFoodSelect={handleFoodSelect} onAddClick={handleAddCustomFood} onEditClick={handleEditCustomFood} />
    {:else if activeTab === 'meal'}
      <MealComposer />
    {:else if activeTab === 'settings'}
      <SettingsPage />
    {/if}
  </main>

  <TabBar bind:activeTab />

  <Calculator food={selectedFood} onClose={closeCalculator} />

  <AddCustomFoodDialog
    isOpen={showCustomFoodDialog}
    onClose={closeCustomFoodDialog}
    editFood={editFood}
  />
</div>

<style>
  .app-shell {
    min-height: 100vh;
    padding-block-end: 5rem;
  }

  .app-shell__main {
    max-width: var(--content-max-width);
    margin-inline: auto;
    padding: var(--space-lg) var(--space-md);
  }

  .app-shell__search {
    display: flex;
    flex-direction: column;
    gap: var(--space-md);
  }

  .app-shell__cta {
    padding-block: var(--space-sm);
  }

  .app-shell__cta-text {
    font-size: var(--text-sm);
    font-weight: var(--weight-medium);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-xs);
  }

  .app-shell__favorites {
    display: flex;
    flex-direction: column;
    gap: var(--space-xs);
  }

  .app-shell__favorites-title {
    font-size: var(--text-sm);
    font-weight: var(--weight-semibold);
    color: var(--color-text-secondary);
    display: flex;
    align-items: center;
    gap: var(--space-xs);
  }

  .app-shell__favorites-list {
    display: flex;
    flex-direction: column;
    gap: var(--space-xs);
  }

  .app-shell__favorites-empty {
    padding-block: var(--space-lg);
  }

  .app-shell__favorites-hint {
    color: var(--color-text-tertiary);
  }
</style>
