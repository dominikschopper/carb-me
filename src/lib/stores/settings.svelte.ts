import { settingsStorage, STORAGE_KEYS } from '$lib/utils/storage';
import type { AppSettings } from '$lib/types/food';
import { UNIT_TYPES } from '$lib/types/food';

class SettingsStore {
  settings = $state<AppSettings>({
    preferredUnit: UNIT_TYPES.BE,
    showCategories: true,
    showTags: true,
    itemsPerPage: 20,
  });

  constructor() {
    if (typeof window !== 'undefined') {
      this.loadFromStorage();
    }
  }

  loadFromStorage() {
    this.settings = settingsStorage.get();
  }

  setPreferredUnit(unit: 'BE' | 'KHE') {
    this.settings = { ...this.settings, preferredUnit: unit };
    this.saveToStorage();
  }

  clearAllData() {
    // Clear all localStorage data
    Object.values(STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key);
    });

    // Reset to defaults
    this.settings = {
      preferredUnit: UNIT_TYPES.BE,
      showCategories: true,
      showTags: true,
      itemsPerPage: 20,
    };

    // Reload page to reset all stores
    window.location.reload();
  }

  private saveToStorage() {
    settingsStorage.set(this.settings);
  }
}

export const settingsStore = new SettingsStore();
