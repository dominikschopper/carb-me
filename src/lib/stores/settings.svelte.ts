import { settingsStorage, STORAGE_KEYS } from '$lib/utils/storage';
import type { AppSettings, EnergyUnitType } from '$lib/types/food';
import { UNIT_TYPES, ENERGY_UNIT_TYPES } from '$lib/types/food';

class SettingsStore {
  settings = $state<AppSettings>({
    preferredUnit: UNIT_TYPES.BE,
    showCategories: true,
    showTags: true,
    itemsPerPage: 20,
    showEnergy: false,
    energyUnit: ENERGY_UNIT_TYPES.KCAL,
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
      showEnergy: false,
      energyUnit: ENERGY_UNIT_TYPES.KCAL,
    };

    // Reload page to reset all stores
    window.location.reload();
  }

  private saveToStorage() {
    settingsStorage.set(this.settings);
  }
}

export const settingsStore = new SettingsStore();
