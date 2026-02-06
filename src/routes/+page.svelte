<script lang="ts">
  import { goto } from '$app/navigation';
  import Header from '$lib/components/Header.svelte';
  import TabBar from '$lib/components/TabBar.svelte';
  import SearchBar from '$lib/components/SearchBar.svelte';
  import FoodList from '$lib/components/FoodList.svelte';
  import FoodCard from '$lib/components/FoodCard.svelte';
  import CustomFoodsList from '$lib/components/CustomFoodsList.svelte';
  import MealComposer from '$lib/components/MealComposer.svelte';
  import SettingsPage from '$lib/components/SettingsPage.svelte';
  import Calculator from '$lib/components/Calculator.svelte';
  import AddCustomFoodDialog from '$lib/components/AddCustomFoodDialog.svelte';
  import { foodStore } from '$lib/stores/foods.svelte';
  import { disclaimerStorage } from '$lib/utils/storage';
  import { onboardingService } from '$lib/utils/onboarding';
  import type { FoodItem } from '$lib/types/food';
  import { mealStore } from '$lib/stores/meal.svelte';

  let activeTab = $state<'search' | 'custom' | 'meal' | 'settings'>('search');
  let selectedFood = $state<FoodItem | null>(null);
  let showCustomFoodDialog = $state(false);
  let editFood = $state<FoodItem | null>(null);
  let loading = $state(true);
  let onboardingInitialized = $state(false);

  const filteredFoods = $derived(foodStore.filteredFoods);
  const favoriteFoods = $derived(foodStore.favoriteFoods);
  const isSearching = $derived(foodStore.isSearching);
  const searchQuery = $derived(foodStore.searchQuery);

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

  // Initialize food store
  $effect(() => {
    foodStore.loadFoodDatabase().then(() => {
      loading = false;
    });
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

  function addToMeal() {
    const foodApple: FoodItem = {
      blsCode: 'F110100',
      name: 'Apfel roh',
      "kh": 11.7,
      "gBE": 103,
      "gKHE": 85,
      "categories": [
        [
          "Früchte + Obst"
        ]
      ],
      "tags": [
        "mittlereKH"
      ],
    };
    mealStore.addItem(foodApple, 100, .97, 1.17);
  }

  function deleteFromMeal() {
    mealStore.clear();
  }

  function startOnboardingIfNeeded() {
    if (!onboardingService.shouldShow()) return;

    setTimeout(() => {
      onboardingService.startTour({
        onComplete: () => {
          console.log('Onboarding completed');
          // Clear demo search
          foodStore.setSearchQuery('');
        },
        onSkip: () => {
          console.log('Onboarding skipped');
          // Clear demo search
          foodStore.setSearchQuery('');
        },
        onSearchDemo: (query) => {
          setTimeout(async () => {
            // Trigger search for demo (shows food cards for favorite star step)
            const searchField: HTMLInputElement|null = document.querySelector('input[aria-label="Lebensmittel suchen"]');
            console.log('the search', searchField);
            if (searchField) {
              searchField.value = query;
            }
            foodStore.setSearchQuery(query);
          }, 700)
        },
        onNavigateToCustom: () => {
          deleteFromMeal();
          activeTab = 'custom';
        },
        onNavigateToSettings: () => {
          activeTab = 'settings';
        },
        onNavigateToMeal: () => {
          activeTab = 'meal';
          addToMeal();
        },
      });
    }, 500);
  }
</script>

<div class="min-h-screen pb-20">
  <Header onMealClick={goToMeal} onHomeClick={goToHome} />

  <main class="container mx-auto max-w-[720px] px-4 py-6">
    {#if activeTab === 'search'}
      <div class="space-y-4">
        <SearchBar />

        {#if !isSearching}
          <!-- Call-to-Action Bereich -->
          <div class="card text-center py-3">
            <p class="text-sm font-medium text-gray-900 dark:text-gray-100 flex items-center justify-center gap-2">
              <span class="material-symbols-outlined text-base">search</span>
              Einfach lostippen und Lebensmittel finden
            </p>
          </div>

          <div class="border-t border-gray-200 dark:border-gray-700"></div>

          <!-- Favoriten Section -->
          <div class="space-y-2">
            <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <span class="material-symbols-outlined text-base text-yellow-500">star</span>
              Favoriten
            </h3>

            {#if favoriteFoods.length > 0}
              <!-- Alle Favoriten anzeigen -->
              <div class="space-y-2">
                {#each favoriteFoods as food, index (`fav-${food.blsCode}-${index}`)}
                  <FoodCard {food} onclick={() => handleFoodSelect(food)} />
                {/each}
              </div>
            {:else}
              <!-- Empty State -->
              <div class="card text-center py-6">
                <p class="text-md text-gray-500 dark:text-gray-400">
                  Du kannst häufig verwendete Lebensmittel mit einem Stern markieren,<br/>
                  dann werden sie hier angezeigt.
                </p>
              </div>
            {/if}

            <div class="border-t border-gray-200 dark:border-gray-700 my-4"></div>
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
