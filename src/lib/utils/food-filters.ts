import type { FoodItem } from '$lib/types/food';

/**
 * Check if a food item is a prepared/ready meal based on BLS code.
 * BLS codes starting with 'X' or 'Y' are prepared meals.
 */
export function isPreparedMeal(food: FoodItem): boolean {
  return food.blsCode.startsWith('X') || food.blsCode.startsWith('Y');
}
