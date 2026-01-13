import type { FoodItem } from '$lib/types/food';

// String enum for all main categories
export enum CategoryEnum {
	Getreide = 'Getreide',
	Brotaufstriche = 'Brotaufstriche',
	Obst = 'Obst',
	Trockenobst = 'Trockenobst',
	Gemuese = 'Gemüse',
	NuesseSamen = 'Nüsse & Samen',
	MilchMilchprodukte = 'Milch & Milchprodukte',
	Getraenke = 'Getränke',
	Backwaren = 'Backwaren',
	SuessigkeitenSnacks = 'Süßigkeiten & Snacks'
}

// Ordered array of categories for sorting
export const CATEGORY_ORDER = [
	CategoryEnum.Getreide,
	CategoryEnum.Brotaufstriche,
	CategoryEnum.Obst,
	CategoryEnum.Trockenobst,
	CategoryEnum.Gemuese,
	CategoryEnum.NuesseSamen,
	CategoryEnum.MilchMilchprodukte,
	CategoryEnum.Getraenke,
	CategoryEnum.Backwaren,
	CategoryEnum.SuessigkeitenSnacks
] as const;

export interface FoodGroup {
	uberschrift: string; // Main heading (e.g., "Getreide")
	unteruberschrift: string | null; // Sub-heading (e.g., "gekocht") or null
	foods: FoodItem[];
}

/**
 * Groups food items by their categories (Überschrift and Unterüberschrift)
 * and sorts them according to the predefined category order.
 */
export function groupFoodsByCategories(foods: FoodItem[]): FoodGroup[] {
	// Map structure: Überschrift -> Unterüberschrift -> FoodItem[]
	const groupMap = new Map<string, Map<string | null, FoodItem[]>>();

	// Group foods by categories
	for (const food of foods) {
		if (!food.categories || food.categories.length === 0) {
			continue;
		}

		// Use the first category path
		const [uberschrift, unteruberschrift = null] = food.categories[0];

		if (!groupMap.has(uberschrift)) {
			groupMap.set(uberschrift, new Map());
		}

		const subMap = groupMap.get(uberschrift)!;
		if (!subMap.has(unteruberschrift)) {
			subMap.set(unteruberschrift, []);
		}

		subMap.get(unteruberschrift)!.push(food);
	}

	// Convert to flat array and sort by category order
	const result: FoodGroup[] = [];

	for (const categoryValue of CATEGORY_ORDER) {
		const subMap = groupMap.get(categoryValue);
		if (!subMap) continue;

		for (const [unteruberschrift, foods] of subMap) {
			result.push({
				uberschrift: categoryValue,
				unteruberschrift,
				foods
			});
		}
	}

	// Add any categories not in the predefined order (e.g., custom categories)
	for (const [uberschrift, subMap] of groupMap) {
		if (CATEGORY_ORDER.includes(uberschrift as CategoryEnum)) continue;

		for (const [unteruberschrift, foods] of subMap) {
			result.push({
				uberschrift,
				unteruberschrift,
				foods
			});
		}
	}

	return result;
}
