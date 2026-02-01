import type { FoodItem } from '$lib/types/food';

/**
 * Generiert die nächste verfügbare BLS-ID für eigene Lebensmittel
 * Format: A + 4-stellige Nummer (A0001, A0002, etc.)
 */
export function generateCustomFoodId(customFoods: FoodItem[]): string {
	// Alle Nummern aus den Custom Food IDs extrahieren
	const customNumbers = customFoods
		.map((f) => f.blsCode)
		.filter((code) => code.startsWith('A'))
		.map((code) => {
			const num = parseInt(code.substring(1), 10);
			return isNaN(num) ? 0 : num;
		});

	// Höchste Nummer finden
	const maxNum = customNumbers.length > 0 ? Math.max(...customNumbers) : 0;

	// Nächste ID generieren
	const nextNum = maxNum + 1;
	return `A${nextNum.toString().padStart(4, '0')}`;
}
