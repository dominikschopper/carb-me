import type { FoodItem, MealItem, HistoryEntry, AppSettings } from '$lib/types/food';
import { UNIT_TYPES } from '$lib/types/food';

export const STORAGE_KEYS = {
  CUSTOM_FOODS: 'carbme_custom_foods',
  FAVORITES: 'carbme_favorites',
  CURRENT_MEAL: 'carbme_current_meal',
  HISTORY: 'carbme_history',
  THEME: 'carbme_theme',
  SETTINGS: 'carbme_settings',
} as const;

export const DEFAULT_SETTINGS: AppSettings = {
  preferredUnit: UNIT_TYPES.BE,
  showCategories: true,
  showTags: true,
  itemsPerPage: 20,
};

/**
 * Type-safe storage wrapper for localStorage
 */
export class Storage<T> {
  constructor(
    private key: string,
    private defaultValue: T,
  ) {}

  get(): T {
    try {
      const item = localStorage.getItem(this.key);
      return item ? JSON.parse(item) : this.defaultValue;
    } catch (error) {
      console.error(`Error reading ${this.key}:`, error);
      return this.defaultValue;
    }
  }

  set(value: T): void {
    try {
      localStorage.setItem(this.key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error writing ${this.key}:`, error);
      // Handle quota exceeded
      if (error instanceof Error && error.name === 'QuotaExceededError') {
        this.clearOldData();
      }
    }
  }

  clear(): void {
    localStorage.removeItem(this.key);
  }

  private clearOldData(): void {
    // Clear old history entries if storage is full
    const history = new Storage(STORAGE_KEYS.HISTORY, []);
    const entries = history.get();
    if (Array.isArray(entries)) {
      history.set(entries.slice(0, 10)); // Keep only 10 most recent
    }
  }
}

// Export storage instances
export const customFoodsStorage = new Storage<FoodItem[]>(STORAGE_KEYS.CUSTOM_FOODS, []);

export const favoritesStorage = new Storage<string[]>(STORAGE_KEYS.FAVORITES, []);

export const mealStorage = new Storage<MealItem[]>(STORAGE_KEYS.CURRENT_MEAL, []);

export const historyStorage = new Storage<HistoryEntry[]>(STORAGE_KEYS.HISTORY, []);

export const settingsStorage = new Storage<AppSettings>(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
