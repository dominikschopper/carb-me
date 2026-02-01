import { describe, it, expect } from 'vitest';
import { generateCustomFoodId } from './id-generator';
import type { FoodItem } from '$lib/types/food';

describe('generateCustomFoodId', () => {
	it('generates A0001 for empty array', () => {
		const result = generateCustomFoodId([]);
		expect(result).toBe('A0001');
	});

	it('generates sequential IDs', () => {
		const foods: FoodItem[] = [
			{
				name: 'Test 1',
				kh: 10,
				gBE: 120,
				gKHE: 100,
				blsCode: 'A0001',
				categories: [['Eigene Lebensmittel']],
				tags: ['custom']
			}
		];

		const result = generateCustomFoodId(foods);
		expect(result).toBe('A0002');
	});

	it('generates correct ID when there are gaps', () => {
		const foods: FoodItem[] = [
			{
				name: 'Test 1',
				kh: 10,
				gBE: 120,
				gKHE: 100,
				blsCode: 'A0001',
				categories: [['Eigene Lebensmittel']],
				tags: ['custom']
			},
			{
				name: 'Test 3',
				kh: 10,
				gBE: 120,
				gKHE: 100,
				blsCode: 'A0003',
				categories: [['Eigene Lebensmittel']],
				tags: ['custom']
			}
		];

		// Should generate A0004 (next after highest, not filling gap)
		const result = generateCustomFoodId(foods);
		expect(result).toBe('A0004');
	});

	it('handles non-A prefix codes', () => {
		const foods: FoodItem[] = [
			{
				name: 'Test BLS',
				kh: 10,
				gBE: 120,
				gKHE: 100,
				blsCode: 'B123456', // Regular BLS code
				categories: [['Eigene Lebensmittel']],
				tags: ['custom']
			},
			{
				name: 'Test Custom',
				kh: 10,
				gBE: 120,
				gKHE: 100,
				blsCode: 'A0005',
				categories: [['Eigene Lebensmittel']],
				tags: ['custom']
			}
		];

		// Should ignore B123456 and generate next after A0005
		const result = generateCustomFoodId(foods);
		expect(result).toBe('A0006');
	});

	it('handles invalid number formats gracefully', () => {
		const foods: FoodItem[] = [
			{
				name: 'Test',
				kh: 10,
				gBE: 120,
				gKHE: 100,
				blsCode: 'AINVALID',
				categories: [['Eigene Lebensmittel']],
				tags: ['custom']
			}
		];

		// Should treat invalid as 0 and generate A0001
		const result = generateCustomFoodId(foods);
		expect(result).toBe('A0001');
	});

	it('pads numbers with leading zeros', () => {
		const foods: FoodItem[] = [];

		for (let i = 1; i <= 9; i++) {
			const result = generateCustomFoodId(foods);
			expect(result).toBe(`A000${i}`);
			expect(result.length).toBe(5); // A + 4 digits

			foods.push({
				name: `Test ${i}`,
				kh: 10,
				gBE: 120,
				gKHE: 100,
				blsCode: result,
				categories: [['Eigene Lebensmittel']],
				tags: ['custom']
			});
		}
	});

	it('handles large numbers correctly', () => {
		const foods: FoodItem[] = [
			{
				name: 'Test',
				kh: 10,
				gBE: 120,
				gKHE: 100,
				blsCode: 'A9999',
				categories: [['Eigene Lebensmittel']],
				tags: ['custom']
			}
		];

		const result = generateCustomFoodId(foods);
		expect(result).toBe('A10000'); // No padding needed beyond 4 digits
	});
});
