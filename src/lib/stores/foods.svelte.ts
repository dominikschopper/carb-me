import type Fuse from 'fuse.js';
import { fuzzySearch, createSearchIndex } from '$lib/features/food/search';
import { customFoodsStorage, favoritesStorage } from '$lib/shared/storage';
import { isInCategories } from '$lib/features/food/filters';
import type { FoodItem } from '$lib/types/food';
import { SvelteSet } from 'svelte/reactivity';
import { settingsStore } from '$lib/stores/settings.svelte';

class FoodStore {
  allFoods = $state<FoodItem[]>([]);
  customFoods = $state<FoodItem[]>([]);
  favorites = $state<SvelteSet<string>>(new SvelteSet());
  searchQuery = $state('');
  isLoading = $state(true);

  private searchIndex: Fuse<FoodItem> | null = null;

  // Derived states
  isSearching = $derived(this.searchQuery.trim().length > 0);

  filteredFoods = $derived.by(() => {
    let foods = [...this.allFoods, ...this.customFoods];

    // Apply BLS category filter (single pass)
    const hiddenCats = settingsStore.settings.hiddenCategories;
    if (hiddenCats.length > 0) {
      foods = foods.filter((food) => !isInCategories(food, hiddenCats));
    }

    if (!this.searchQuery.trim()) {
      return foods;
    }

    if (!this.searchIndex) {
      return foods;
    }

    // Get search results and filter out hidden categories
    const searchResults = fuzzySearch(this.searchIndex, this.searchQuery);
    if (hiddenCats.length > 0) {
      return searchResults.filter((food) => !isInCategories(food, hiddenCats));
    }
    return searchResults;
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
      this.rebuildSearchIndex();
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
    this.rebuildSearchIndex();
  }

  updateCustomFood(blsCode: string, updatedFood: FoodItem) {
    const index = this.customFoods.findIndex((f) => f.blsCode === blsCode);
    if (index !== -1) {
      this.customFoods[index] = { ...updatedFood, isCustom: true };
      this.saveCustomFoods();
      this.rebuildSearchIndex();
    }
  }

  deleteCustomFood(blsCode: string) {
    this.customFoods = this.customFoods.filter((f) => f.blsCode !== blsCode);

    // Also remove from favorites if it was favorited
    if (this.favorites.has(blsCode)) {
      const newFavorites = new SvelteSet(this.favorites);
      newFavorites.delete(blsCode);
      this.favorites = newFavorites;
      this.saveFavorites();
    }

    this.saveCustomFoods();
    this.rebuildSearchIndex();
  }

  setSearchQuery(query: string) {
    this.searchQuery = query;
  }

  private rebuildSearchIndex() {
    this.searchIndex = createSearchIndex([...this.allFoods, ...this.customFoods]);
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
