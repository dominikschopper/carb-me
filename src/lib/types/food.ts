// Unit types as const enum
export const UNIT_TYPES = {
  BE: 'BE',
  KHE: 'KHE',
} as const;

export type UnitType = (typeof UNIT_TYPES)[keyof typeof UNIT_TYPES];

// Energy unit types
export const ENERGY_UNIT_TYPES = {
  KCAL: 'kcal',
  KJ: 'kJ',
} as const;

export type EnergyUnitType = (typeof ENERGY_UNIT_TYPES)[keyof typeof ENERGY_UNIT_TYPES];

// BLS Categories - Complete enum for all food categories in the BLS database
export const BLS_CATEGORIES = {
  BROT_BACKWAREN: 'B',
  GETREIDE: 'C',
  SUESSGEBAECK: 'D',
  TEIGWAREN: 'E',
  OBST: 'F',
  GEMUESE: 'G',
  HUELSENFRUECHTE_NUESSE: 'H',
  KARTOFFELN: 'K',
  MILCHPRODUKTE: 'M',
  GETRAENKE: 'N',
  ALKOHOLISCHE_GETRAENKE: 'P',
  FETTE_OELE: 'Q',
  GEWUERZE_SAUCEN: 'R',
  SUESSWAREN: 'S',
  FISCH_MEERESFRUECHTE: 'T',
  FLEISCH: 'U',
  GEFLUEGEL_WILD: 'V',
  WURSTWAREN: 'W',
  FERTIGGERICHTE: 'X',
  FERTIGGERICHTE_SUESS: 'Y',
} as const;

export type BlsCategory = (typeof BLS_CATEGORIES)[keyof typeof BLS_CATEGORIES];

export interface FoodItem {
  name: string;
  subtitle?: string; // Variant details (e.g., "Type 405, 550, Vollkorn")
  kh: number; // Carbohydrates per 100g
  gBE: number; // Grams per Bread Unit
  gKHE: number; // Grams per Carb Unit
  categories: string[][];
  tags: string[];
  unit?: string; // Optional for beverages (ml)
  isCustom?: boolean; // For user-created foods
  kcal?: number; // Kilocalories per 100g
  kj?: number; // Kilojoules per 100g
  blsCode: string; // BLS reference code
}

export interface MealItem {
  food: FoodItem;
  grams: number;
  be: number;
  khe: number;
}

export interface HistoryEntry {
  timestamp: number;
  items: MealItem[];
  totalBE: number;
  totalKHE: number;
}

export interface CalculationResult {
  grams: number;
  be: number;
  khe: number;
  carbs: number; // Total carbs in grams
}

export interface AppSettings {
  preferredUnit: UnitType;
  showCategories: boolean;
  showTags: boolean;
  itemsPerPage: number;
  showEnergy: boolean;
  energyUnit: EnergyUnitType;
  hiddenCategories: BlsCategory[];
}
