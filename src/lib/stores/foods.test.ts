import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { FoodItem } from '$lib/types/food';

// Mock window object
if (typeof window === 'undefined') {
	(global as any).window = {};
}

// Mock localStorage
const localStorageMock = (() => {
	let store: Record<string, string> = {};
	return {
		getItem: (key: string) => store[key] || null,
		setItem: (key: string, value: string) => {
			store[key] = value;
		},
		clear: () => {
			store = {};
		},
		removeItem: (key: string) => {
			delete store[key];
		}
	};
})();

Object.defineProperty(global.window, 'localStorage', { value: localStorageMock });

// Mock fetch for food database
global.fetch = vi.fn(() =>
	Promise.resolve({
		json: () =>
			Promise.resolve({
				lebensmittel: []
			})
	} as Response)
);

describe('FoodStore - Custom Food CRUD Operations', () => {
	let foodStore: any;

	beforeEach(async () => {
		localStorageMock.clear();
		// Clear module cache to get fresh store instance
		vi.resetModules();
		const module = await import('./foods.svelte');
		foodStore = module.foodStore;
		// Reset state
		foodStore.customFoods = [];
		foodStore.favorites.clear();
		foodStore.allFoods = [];
		foodStore.searchQuery = '';
	});

	it('adds custom food correctly', () => {
		const customFood: FoodItem = {
			name: 'Test Food',
			kh: 25,
			gBE: 48,
			gKHE: 40,
			blsCode: 'A0001',
			categories: [['Eigene Lebensmittel']],
			tags: ['custom']
		};

		foodStore.addCustomFood(customFood);

		expect(foodStore.customFoods.length).toBe(1);
		expect(foodStore.customFoods[0].name).toBe('Test Food');
		expect(foodStore.customFoods[0].blsCode).toBe('A0001');
		expect(foodStore.customFoods[0].isCustom).toBe(true);
	});

	it('updates custom food correctly', () => {
		const customFood: FoodItem = {
			name: 'Test Food',
			kh: 25,
			gBE: 48,
			gKHE: 40,
			blsCode: 'A0001',
			categories: [['Eigene Lebensmittel']],
			tags: ['custom']
		};

		foodStore.addCustomFood(customFood);

		const updatedFood: FoodItem = {
			...customFood,
			name: 'Updated Food',
			kh: 30
		};

		foodStore.updateCustomFood('A0001', updatedFood);

		expect(foodStore.customFoods.length).toBe(1);
		expect(foodStore.customFoods[0].name).toBe('Updated Food');
		expect(foodStore.customFoods[0].kh).toBe(30);
		expect(foodStore.customFoods[0].blsCode).toBe('A0001');
	});

	it('deletes custom food correctly', () => {
		const customFood: FoodItem = {
			name: 'Test Food',
			kh: 25,
			gBE: 48,
			gKHE: 40,
			blsCode: 'A0001',
			categories: [['Eigene Lebensmittel']],
			tags: ['custom']
		};

		foodStore.addCustomFood(customFood);
		expect(foodStore.customFoods.length).toBe(1);

		foodStore.deleteCustomFood('A0001');
		expect(foodStore.customFoods.length).toBe(0);
	});

	it('removes custom food from favorites when deleted', () => {
		const customFood: FoodItem = {
			name: 'Test Food',
			kh: 25,
			gBE: 48,
			gKHE: 40,
			blsCode: 'A0001',
			categories: [['Eigene Lebensmittel']],
			tags: ['custom']
		};

		foodStore.addCustomFood(customFood);
		foodStore.toggleFavorite('A0001');

		expect(foodStore.favorites.has('A0001')).toBe(true);

		foodStore.deleteCustomFood('A0001');

		expect(foodStore.favorites.has('A0001')).toBe(false);
		expect(foodStore.customFoods.length).toBe(0);
	});

	it('handles multiple custom foods', () => {
		const foods: FoodItem[] = [
			{
				name: 'Food 1',
				kh: 25,
				gBE: 48,
				gKHE: 40,
				blsCode: 'A0001',
				categories: [['Eigene Lebensmittel']],
				tags: ['custom']
			},
			{
				name: 'Food 2',
				kh: 30,
				gBE: 40,
				gKHE: 33,
				blsCode: 'A0002',
				categories: [['Eigene Lebensmittel']],
				tags: ['custom']
			},
			{
				name: 'Food 3',
				kh: 20,
				gBE: 60,
				gKHE: 50,
				blsCode: 'A0003',
				categories: [['Eigene Lebensmittel']],
				tags: ['custom']
			}
		];

		foods.forEach((food) => foodStore.addCustomFood(food));

		expect(foodStore.customFoods.length).toBe(3);

		// Delete middle one
		foodStore.deleteCustomFood('A0002');

		expect(foodStore.customFoods.length).toBe(2);
		expect(foodStore.customFoods.find((f: FoodItem) => f.blsCode === 'A0002')).toBeUndefined();
		expect(foodStore.customFoods.find((f: FoodItem) => f.blsCode === 'A0001')).toBeDefined();
		expect(foodStore.customFoods.find((f: FoodItem) => f.blsCode === 'A0003')).toBeDefined();
	});

	it('does not update non-existent food', () => {
		const customFood: FoodItem = {
			name: 'Test Food',
			kh: 25,
			gBE: 48,
			gKHE: 40,
			blsCode: 'A0001',
			categories: [['Eigene Lebensmittel']],
			tags: ['custom']
		};

		foodStore.addCustomFood(customFood);

		const updatedFood: FoodItem = {
			...customFood,
			name: 'Updated Food'
		};

		// Try to update non-existent food
		foodStore.updateCustomFood('A9999', updatedFood);

		// Original food should remain unchanged
		expect(foodStore.customFoods.length).toBe(1);
		expect(foodStore.customFoods[0].name).toBe('Test Food');
		expect(foodStore.customFoods[0].blsCode).toBe('A0001');
	});

	it('preserves optional kcal and kJ values', () => {
		const customFood: FoodItem = {
			name: 'Test Food',
			kh: 25,
			gBE: 48,
			gKHE: 40,
			blsCode: 'A0001',
			kcal: 250,
			kj: 1046,
			categories: [['Eigene Lebensmittel']],
			tags: ['custom']
		};

		foodStore.addCustomFood(customFood);

		expect(foodStore.customFoods[0].kcal).toBe(250);
		expect(foodStore.customFoods[0].kj).toBe(1046);
	});
});

describe('FoodStore - Duplicate BLS Code Handling', () => {
	let foodStore: any;

	beforeEach(async () => {
		localStorageMock.clear();
		// Mock fetch to return foods with duplicate BLS codes
		global.fetch = vi.fn(() =>
			Promise.resolve({
				json: () =>
					Promise.resolve({
						lebensmittel: [
							{
								name: 'Apple',
								kh: 11.4,
								gBE: 105,
								gKHE: 88,
								blsCode: 'B123456',
								categories: [['Obst']],
								tags: []
							},
							{
								name: 'Red Apple',
								kh: 11.4,
								gBE: 105,
								gKHE: 88,
								blsCode: 'B123456', // Duplicate!
								categories: [['Obst']],
								tags: []
							}
						]
					})
			} as Response)
		);

		vi.resetModules();
		const module = await import('./foods.svelte');
		foodStore = module.foodStore;
		await foodStore.loadFoodDatabase();
	});

	it('handles foods with duplicate BLS codes', () => {
		// Both foods should be loaded
		expect(foodStore.allFoods.length).toBe(2);
		expect(foodStore.allFoods[0].blsCode).toBe('B123456');
		expect(foodStore.allFoods[1].blsCode).toBe('B123456');
	});

	it('filteredFoods includes all foods even with duplicates', () => {
		// filteredFoods should include both duplicate entries
		const filtered = foodStore.filteredFoods;
		expect(filtered.length).toBe(2);
	});

	it('can search foods even with duplicate BLS codes', () => {
		foodStore.searchQuery = 'apple';

		const filtered = foodStore.filteredFoods;
		// Should find both apples
		expect(filtered.length).toBeGreaterThan(0);
	});

	it('can favorite foods with duplicate BLS codes', () => {
		// Toggle favorite for the duplicate BLS code
		foodStore.toggleFavorite('B123456');

		expect(foodStore.favorites.has('B123456')).toBe(true);

		// Both foods with this BLS code should appear in favorites
		const favs = foodStore.favoriteFoods;
		expect(favs.length).toBe(2);
		expect(favs.every((f: FoodItem) => f.blsCode === 'B123456')).toBe(true);
	});

	it('handles mixed regular and custom foods with potential duplicates', () => {
		// Add a custom food that happens to have same BLS code as existing food
		const customFood: FoodItem = {
			name: 'My Apple',
			kh: 12,
			gBE: 100,
			gKHE: 83,
			blsCode: 'B123456', // Same as existing foods
			categories: [['Eigene Lebensmittel']],
			tags: ['custom']
		};

		foodStore.addCustomFood(customFood);

		// Should have 2 from database + 1 custom
		const all = [...foodStore.allFoods, ...foodStore.customFoods];
		expect(all.length).toBe(3);

		// All have same BLS code
		expect(all.every((f: FoodItem) => f.blsCode === 'B123456')).toBe(true);

		// filteredFoods should handle this gracefully
		const filtered = foodStore.filteredFoods;
		expect(filtered.length).toBe(3);
	});
});
