import { settingsStorage, STORAGE_KEYS } from '$lib/shared/storage';
import type { AppSettings, EnergyUnitType, BlsCategory } from '$lib/types/food';
import { UNIT_TYPES, ENERGY_UNIT_TYPES } from '$lib/types/food';

class SettingsStore {
  settings = $state<AppSettings>({
    preferredUnit: UNIT_TYPES.BE,
    showEnergy: false,
    energyUnit: ENERGY_UNIT_TYPES.KCAL,
    hiddenCategories: [],
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

  setShowEnergy(show: boolean) {
    this.settings = { ...this.settings, showEnergy: show };
    this.saveToStorage();
  }

  setEnergyUnit(unit: EnergyUnitType) {
    this.settings = { ...this.settings, energyUnit: unit };
    this.saveToStorage();
  }

  toggleHiddenCategory(category: BlsCategory, hide: boolean) {
    const current = this.settings.hiddenCategories;

    if (hide && !current.includes(category)) {
      // Add category
      this.settings = {
        ...this.settings,
        hiddenCategories: [...current, category],
      };
    } else if (!hide && current.includes(category)) {
      // Remove category
      this.settings = {
        ...this.settings,
        hiddenCategories: current.filter(c => c !== category),
      };
    }

    this.saveToStorage();
  }

  isCategoryHidden(category: BlsCategory): boolean {
    return this.settings.hiddenCategories.includes(category);
  }

  clearAllData() {
    // Clear all localStorage data EXCEPT lastSeenVersion
    Object.values(STORAGE_KEYS)
      .filter((key) => key !== STORAGE_KEYS.LAST_SEEN_VERSION)
      .forEach((key) => {
        localStorage.removeItem(key);
      });

    // Reset to defaults
    this.settings = {
      preferredUnit: UNIT_TYPES.BE,
      showEnergy: false,
      energyUnit: ENERGY_UNIT_TYPES.KCAL,
      hiddenCategories: [],
    };
  }

  private saveToStorage() {
    settingsStorage.set(this.settings);
  }
}

export const settingsStore = new SettingsStore();
