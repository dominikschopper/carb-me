import type { FoodItem, MealItem, HistoryEntry, AppSettings } from '$lib/types/food';
import { UNIT_TYPES, ENERGY_UNIT_TYPES } from '$lib/types/food';
import { DEFAULT_VERSION } from '../version';

export const STORAGE_KEYS = {
  CUSTOM_FOODS: 'carbme_custom_foods',
  FAVORITES: 'carbme_favorites',
  CURRENT_MEAL: 'carbme_current_meal',
  HISTORY: 'carbme_history',
  THEME: 'carbme_theme',
  SETTINGS: 'carbme_settings',
  DISCLAIMER_ACCEPTED: 'carbme_disclaimer_accepted',
  ONBOARDING: 'carbme_onboarding',
  LAST_SEEN_VERSION: 'carbme_last_seen_version',
} as const;

export const DEFAULT_SETTINGS: AppSettings = {
  preferredUnit: UNIT_TYPES.BE,
  showCategories: true,
  showTags: true,
  itemsPerPage: 20,
  showEnergy: false,
  energyUnit: ENERGY_UNIT_TYPES.KCAL,
  hiddenCategories: [],
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
      if (!item) return this.defaultValue;
      const parsed = JSON.parse(item);
      // Merge with defaults to handle new properties (only for plain objects, not arrays)
      if (
        typeof this.defaultValue === 'object' &&
        this.defaultValue !== null &&
        !Array.isArray(this.defaultValue)
      ) {
        return { ...this.defaultValue, ...parsed };
      }
      return parsed;
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

export const disclaimerStorage = new Storage<boolean>(STORAGE_KEYS.DISCLAIMER_ACCEPTED, false);

export interface OnboardingState {
  completed: boolean;
  skipped: boolean;
  lastShown?: number;
}

export const onboardingStorage = new Storage<OnboardingState>(
  STORAGE_KEYS.ONBOARDING,
  { completed: false, skipped: false }
);

export const lastSeenVersionStorage = new Storage<string>(
  STORAGE_KEYS.LAST_SEEN_VERSION,
  DEFAULT_VERSION
);
