import type { FoodItem } from '$lib/types/food';

// BLS-based category enum
export enum Category {
  Getreide = 'Getreide',
  Teigwaren = 'Teigwaren',
  BrotBackwaren = 'Brot & Backwaren',
  Suessgebaeck = 'Süßgebäck',
  Obst = 'Obst',
  Gemuese = 'Gemüse',
  Kartoffeln = 'Kartoffeln',
  HuelsenfruechteNuesse = 'Hülsenfrüchte & Nüsse',
  Milchprodukte = 'Milchprodukte',
  Suesswaren = 'Süßwaren',
  Getraenke = 'Getränke',
  AlkoholischeGetraenke = 'Alkoholische Getränke',
  Fertiggerichte = 'Fertiggerichte',
  FertiggerichteSuess = 'Fertiggerichte (süß)',
}

// Ordered array of categories for sorting
export const CATEGORY_ORDER = [
  Category.Getreide,
  Category.Teigwaren,
  Category.BrotBackwaren,
  Category.Suessgebaeck,
  Category.Obst,
  Category.Gemuese,
  Category.Kartoffeln,
  Category.HuelsenfruechteNuesse,
  Category.Milchprodukte,
  Category.Suesswaren,
  Category.Getraenke,
  Category.AlkoholischeGetraenke,
  Category.Fertiggerichte,
  Category.FertiggerichteSuess,
] as const;

export interface FoodGroup {
  uberschrift: string; // Category heading
  foods: FoodItem[];
}

/**
 * Groups food items by their category (single level)
 * and sorts them according to the predefined category order.
 */
export function groupFoodsByCategories(foods: FoodItem[]): FoodGroup[] {
  // Map structure: Category -> FoodItem[]
  const groupMap = new Map<string, FoodItem[]>();

  // Group foods by categories
  for (const food of foods) {
    if (!food.categories || food.categories.length === 0) {
      continue;
    }

    // Use the first category (single level now)
    const category = food.categories[0][0];

    if (!groupMap.has(category)) {
      groupMap.set(category, []);
    }

    groupMap.get(category)!.push(food);
  }

  // Convert to array and sort by category order
  const result: FoodGroup[] = [];

  // Add categories in predefined order
  for (const category of CATEGORY_ORDER) {
    const foods = groupMap.get(category);
    if (!foods || foods.length === 0) continue;

    result.push({
      uberschrift: category,
      foods,
    });
  }

  // Add any categories not in the predefined order (e.g., custom categories)
  for (const [category, foods] of groupMap) {
    if (CATEGORY_ORDER.includes(category as Category)) continue;

    result.push({
      uberschrift: category,
      foods,
    });
  }

  return result;
}
