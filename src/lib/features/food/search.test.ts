import { describe, it, expect } from 'vitest';
import { fuzzySearch, createSearchIndex } from './search';
import type { FoodItem } from '$lib/types/food';

// Test fixtures
const testFoods: FoodItem[] = [
  {
    name: 'Apfel',
    kh: 11.4,
    gBE: 105,
    gKHE: 88,
    categories: [['Obst']],
    tags: ['wenigeKH'],
    blsCode: 'O001',
  },
  {
    name: 'Apfel roh',
    kh: 11.4,
    gBE: 105,
    gKHE: 88,
    categories: [['Obst']],
    tags: ['wenigeKH'],
    blsCode: 'O002',
  },
  {
    name: 'Apfelkorn',
    kh: 25,
    gBE: 48,
    gKHE: 40,
    categories: [['Alkoholische Getränke']],
    tags: ['mittlereKH'],
    blsCode: 'G001',
  },
  {
    name: 'Roter Apfel Gala',
    kh: 12,
    gBE: 100,
    gKHE: 83,
    categories: [['Obst']],
    tags: ['wenigeKH'],
    blsCode: 'O003',
  },
  {
    name: 'Birne',
    kh: 12.4,
    gBE: 97,
    gKHE: 81,
    categories: [['Obst']],
    tags: ['wenigeKH'],
    blsCode: 'O004',
  },
  {
    name: 'Pizza Margherita',
    kh: 28,
    gBE: 43,
    gKHE: 36,
    categories: [['Fertiggerichte']],
    tags: ['mittlereKH'],
    blsCode: 'X001',
  },
];

describe('fuzzySearch', () => {
  const index = createSearchIndex(testFoods);

  it('returns empty array for empty query', () => {
    const results = fuzzySearch(index, '');
    expect(results).toEqual([]);
  });

  it('returns empty array for whitespace query', () => {
    const results = fuzzySearch(index, '   ');
    expect(results).toEqual([]);
  });

  it('finds exact matches', () => {
    const results = fuzzySearch(index, 'Apfel');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].name).toBe('Apfel');
  });

  it('prioritizes exact matches over partial matches', () => {
    const results = fuzzySearch(index, 'apfel');

    // "Apfel" should come first (exact match)
    expect(results[0].name).toBe('Apfel');

    // "Apfel roh" should come second (word boundary match)
    expect(results[1].name).toBe('Apfel roh');

    // "Apfelkorn" should come after (prefix match)
    expect(results[2].name).toBe('Apfelkorn');
  });

  it('finds items by partial match', () => {
    const results = fuzzySearch(index, 'pfel');
    expect(results.some((r) => r.name.includes('Apfel'))).toBe(true);
  });

  it('is case insensitive', () => {
    const results = fuzzySearch(index, 'APFEL');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].name.toLowerCase()).toContain('apfel');
  });

  it('finds items with spaces in query', () => {
    const results = fuzzySearch(index, 'apfel roh');
    expect(results.some((r) => r.name === 'Apfel roh')).toBe(true);
  });

  it('finds items not in query', () => {
    const results = fuzzySearch(index, 'Birne');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].name).toBe('Birne');
  });

  it('returns empty array when no match found', () => {
    const results = fuzzySearch(index, 'xyznotfound');
    expect(results).toEqual([]);
  });

  it('handles fuzzy matching', () => {
    // "Pizz" should match "Pizza Margherita"
    const results = fuzzySearch(index, 'Pizz');
    expect(results.some((r) => r.name.includes('Pizza'))).toBe(true);
  });

  it('limits results to 100', () => {
    // Create a large array of foods
    const manyFoods: FoodItem[] = Array.from({ length: 200 }, (_, i) => ({
      name: `Test Food ${i}`,
      kh: 10,
      gBE: 120,
      gKHE: 100,
      categories: [['Test']],
      tags: [],
      blsCode: `T${i.toString().padStart(6, '0')}`,
    }));

    const largeIndex = createSearchIndex(manyFoods);
    const results = fuzzySearch(largeIndex, 'Test');
    expect(results.length).toBeLessThanOrEqual(100);
  });
});

describe('createSearchIndex', () => {
  it('creates index without throwing', () => {
    expect(() => createSearchIndex(testFoods)).not.toThrow();
  });

  it('handles empty array', () => {
    expect(() => createSearchIndex([])).not.toThrow();
  });

  it('works after recreation with different data', () => {
    const smallIndex = createSearchIndex(testFoods.slice(0, 2));
    const results = fuzzySearch(smallIndex, 'Apfel');
    expect(results.length).toBeGreaterThan(0);
  });
});
