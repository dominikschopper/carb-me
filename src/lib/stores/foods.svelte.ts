import { fuzzySearch, initializeSearch } from '$lib/utils/search';
import { customFoodsStorage, favoritesStorage } from '$lib/utils/storage';
import { isInCategories } from '$lib/utils/food-filters';
import type { FoodItem } from '$lib/types/food';
import { SvelteSet } from 'svelte/reactivity';
import { settingsStore } from '$lib/stores/settings.svelte';

class FoodStore {
  allFoods = $state<FoodItem[]>([]);
  customFoods = $state<FoodItem[]>([]);
  favorites = $state<SvelteSet<string>>(new SvelteSet());
  searchQuery = $state('');
  isLoading = $state(true);

  // Derived states
  isSearching = $derived(this.searchQuery.trim().length > 0);

  filteredFoods = $derived.by(() => {
    let foods = [...this.allFoods, ...this.customFoods];

    // BLS-Kategorie-Filter anwenden (Single Pass!)
    const hiddenCats = settingsStore.settings.hiddenCategories;
    if (hiddenCats.length > 0) {
      foods = foods.filter((food) => !isInCategories(food, hiddenCats));
    }

    if (!this.searchQuery.trim()) {
      return foods;
    }

    return fuzzySearch(foods, this.searchQuery);
  });

  favoriteFoods = $derived.by(() => {
    return [...this.allFoods, ...this.customFoods].filter((f) => this.favorites.has(f.blsCode));
  });

  constructor() {
    // Load data on initialization
    if (typeof window !== 'undefined') {
      this.loadFromStorage();
      this.loadFoodDatabase();
    }
  }

  async loadFoodDatabase() {
    try {
      const response = await fetch('/lebensmittel-daten.json');
      const data = await response.json();
      this.allFoods = data.lebensmittel;

      // Initialize search with all foods
      initializeSearch([...this.allFoods, ...this.customFoods]);
      this.isLoading = false;
    } catch (error) {
      console.error('Error loading food database:', error);
      this.isLoading = false;
    }
  }

  loadFromStorage() {
    this.customFoods = customFoodsStorage.get();
    const favoritesArray = favoritesStorage.get();
    this.favorites = new SvelteSet(favoritesArray);
  }

  toggleFavorite(blsCode: string) {
    // Create new Set to trigger reactivity in Svelte 5
    const newFavorites = new SvelteSet(this.favorites);
    if (newFavorites.has(blsCode)) {
      newFavorites.delete(blsCode);
    } else {
      newFavorites.add(blsCode);
    }
    this.favorites = newFavorites;
    this.saveFavorites();
  }

  addCustomFood(food: FoodItem) {
    const customFood = { ...food, isCustom: true };
    this.customFoods.push(customFood);
    this.saveCustomFoods();

    // Reinitialize search with updated foods
    initializeSearch([...this.allFoods, ...this.customFoods]);
  }

  removeCustomFood(name: string) {
    this.customFoods = this.customFoods.filter((f) => f.name !== name);
    this.saveCustomFoods();

    // Reinitialize search
    initializeSearch([...this.allFoods, ...this.customFoods]);
  }

  setSearchQuery(query: string) {
    this.searchQuery = query;
  }

  private saveCustomFoods() {
    customFoodsStorage.set(this.customFoods);
  }

  private saveFavorites() {
    favoritesStorage.set([...this.favorites]);
  }
}

// Export singleton instance
export const foodStore = new FoodStore();
