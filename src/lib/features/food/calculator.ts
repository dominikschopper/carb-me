import type { FoodItem, CalculationResult } from '$lib/types/food';

/**
 * Calculate BE, KHE, and total carbs for a given amount of food
 */
export function calculateNutrition(food: FoodItem, grams: number): CalculationResult {
	// BE = grams / gBE
	const be = grams / food.gBE;

	// KHE = grams / gKHE
	const khe = grams / food.gKHE;

	// Total carbs = (grams / 100) * kh per 100g
	const carbs = (grams / 100) * food.kh;

	return {
		grams: Math.round(grams),
		be: roundToDecimal(be, 2),
		khe: roundToDecimal(khe, 2),
		carbs: roundToDecimal(carbs, 1)
	};
}

/**
 * Calculate how many grams are needed for a given BE amount
 */
export function gramsForBE(food: FoodItem, be: number): number {
	return Math.round(be * food.gBE);
}

/**
 * Calculate how many grams are needed for a given KHE amount
 */
export function gramsForKHE(food: FoodItem, khe: number): number {
	return Math.round(khe * food.gKHE);
}

/**
 * Calculate gBE and gKHE from carbs per 100g (for custom foods)
 * 1 BE = 12g carbs, 1 KHE = 10g carbs
 */
export function calculateUnitsFromCarbs(khPer100g: number): { gBE: number; gKHE: number } {
	// How many grams contain 12g carbs (1 BE)?
	const gBE = (12 / khPer100g) * 100;

	// How many grams contain 10g carbs (1 KHE)?
	const gKHE = (10 / khPer100g) * 100;

	return {
		gBE: Math.round(gBE),
		gKHE: Math.round(gKHE)
	};
}

/**
 * Konvertiert kcal zu kJ
 * 1 kcal = 4.184 kJ
 */
export function kcalToKj(kcal: number): number {
	return Math.round(kcal * 4.184);
}

/**
 * Konvertiert kJ zu kcal
 * 1 kJ = 0.239 kcal
 */
export function kjToKcal(kj: number): number {
	return Math.round(kj / 4.184);
}

/**
 * Helper for consistent rounding
 */
function roundToDecimal(value: number, decimals: number): number {
	const multiplier = Math.pow(10, decimals);
	return Math.round(value * multiplier) / multiplier;
}
