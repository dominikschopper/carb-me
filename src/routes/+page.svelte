<script lang="ts">
  import Header from '$lib/components/Header.svelte';
  import TabBar from '$lib/components/TabBar.svelte';
  import SearchBar from '$lib/components/SearchBar.svelte';
  import FoodList from '$lib/components/FoodList.svelte';
  import FavoritesList from '$lib/components/FavoritesList.svelte';
  import MealComposer from '$lib/components/MealComposer.svelte';
  import SettingsPage from '$lib/components/SettingsPage.svelte';
  import Calculator from '$lib/components/Calculator.svelte';
  import { foodStore } from '$lib/stores/foods.svelte';
  import type { FoodItem } from '$lib/types/food';

  let activeTab = $state<'search' | 'favorites' | 'meal' | 'settings'>('search');
  let selectedFood = $state<FoodItem | null>(null);
  let loading = $state(true);

  const filteredFoods = $derived(foodStore.filteredFoods);

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
</script>

<div class="min-h-screen pb-20">
  <Header onMealClick={goToMeal} />

  <main class="mx-auto max-w-4xl px-4 py-6">
    {#if activeTab === 'search'}
      <div class="space-y-4">
        <SearchBar />
        <FoodList foods={filteredFoods} onFoodSelect={handleFoodSelect} {loading} />
      </div>
    {:else if activeTab === 'favorites'}
      <FavoritesList onFoodSelect={handleFoodSelect} />
    {:else if activeTab === 'meal'}
      <MealComposer />
    {:else if activeTab === 'settings'}
      <SettingsPage />
    {/if}
  </main>

  <TabBar bind:activeTab />

  <Calculator food={selectedFood} onClose={closeCalculator} />
</div>
