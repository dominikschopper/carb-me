import { settingsStorage, STORAGE_KEYS } from '$lib/utils/storage';
import type { AppSettings, EnergyUnitType, BlsCategory } from '$lib/types/food';
import { UNIT_TYPES, ENERGY_UNIT_TYPES } from '$lib/types/food';

class SettingsStore {
  settings = $state<AppSettings>({
    preferredUnit: UNIT_TYPES.BE,
    showCategories: true,
    showTags: true,
    itemsPerPage: 20,
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
      // Kategorie hinzufügen
      this.settings = {
        ...this.settings,
        hiddenCategories: [...current, category],
      };
    } else if (!hide && current.includes(category)) {
      // Kategorie entfernen
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
      showCategories: true,
      showTags: true,
      itemsPerPage: 20,
      showEnergy: false,
      energyUnit: ENERGY_UNIT_TYPES.KCAL,
      hiddenCategories: [],
    };

    // Reload page to reset all stores
    window.location.reload();
  }

  private saveToStorage() {
    settingsStorage.set(this.settings);
  }
}

export const settingsStore = new SettingsStore();
