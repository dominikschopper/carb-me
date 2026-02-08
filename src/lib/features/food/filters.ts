import type { FoodItem, BlsCategory } from '$lib/types/food';

/**
 * Creates a filter function for a specific BLS category.
 * @param category - The BLS category prefix (e.g., 'X', 'Y', 'P')
 * @returns A function that checks if a food belongs to the category
 */
export function createCategoryFilter(category: BlsCategory) {
  return (food: FoodItem): boolean => {
    return food.blsCode.startsWith(category);
  };
}

/**
 * Checks if a food item belongs to any of the given categories.
 * @param food - The food item to check
 * @param categories - Array of category prefixes to check against
 * @returns true if the food belongs to any of the categories
 */
export function isInCategories(food: FoodItem, categories: BlsCategory[]): boolean {
  return categories.some(category => food.blsCode.startsWith(category));
}
