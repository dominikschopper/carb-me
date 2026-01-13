import { fuzzySearch, initializeSearch } from '$lib/utils/search';
import { customFoodsStorage, favoritesStorage } from '$lib/utils/storage';
import type { FoodItem } from '$lib/types/food';

class FoodStore {
  allFoods = $state<FoodItem[]>([]);
  customFoods = $state<FoodItem[]>([]);
  favorites = $state<Set<string>>(new Set());
  searchQuery = $state('');
  isLoading = $state(true);

  // Derived states
  isSearching = $derived(this.searchQuery.trim().length > 0);

  filteredFoods = $derived.by(() => {
    const allAvailableFoods = [...this.allFoods, ...this.customFoods];

    if (!this.searchQuery.trim()) {
      return allAvailableFoods;
    }

    return fuzzySearch(allAvailableFoods, this.searchQuery);
  });

  favoriteFoods = $derived.by(() => {
    return [...this.allFoods, ...this.customFoods].filter((f) => this.favorites.has(f.name));
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
    this.favorites = new Set(favoritesArray);
  }

  toggleFavorite(name: string) {
    // Create new Set to trigger reactivity in Svelte 5
    const newFavorites = new Set(this.favorites);
    if (newFavorites.has(name)) {
      newFavorites.delete(name);
    } else {
      newFavorites.add(name);
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
