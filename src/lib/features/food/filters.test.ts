import { describe, it, expect } from 'vitest';
import { createCategoryFilter, isInCategories } from './filters';
import type { FoodItem } from '$lib/types/food';
import { BLS_CATEGORIES } from '$lib/types/food';

// Helper to create a minimal FoodItem for testing
function createFood(blsCode: string, name: string = 'Test Food'): FoodItem {
  return {
    name,
    kh: 10,
    gBE: 120,
    gKHE: 100,
    categories: [['Test']],
    tags: [],
    blsCode,
  };
}

describe('createCategoryFilter', () => {
  it('creates filter that identifies foods with matching prefix', () => {
    const filterX = createCategoryFilter(BLS_CATEGORIES.FERTIGGERICHTE_PFLANZLICH);
    expect(filterX(createFood('X123456'))).toBe(true);
    expect(filterX(createFood('X000001'))).toBe(true);
    expect(filterX(createFood('XABCDEF'))).toBe(true);
  });

  it('creates filter that rejects foods with different prefix', () => {
    const filterX = createCategoryFilter(BLS_CATEGORIES.FERTIGGERICHTE_PFLANZLICH);
    expect(filterX(createFood('Y123456'))).toBe(false);
    expect(filterX(createFood('P123456'))).toBe(false);
    expect(filterX(createFood('N123456'))).toBe(false);
  });

  it('works for all BLS categories', () => {
    const filterP = createCategoryFilter(BLS_CATEGORIES.ALKOHOLISCHE_GETRAENKE);
    expect(filterP(createFood('P123456', 'Bier'))).toBe(true);
    expect(filterP(createFood('N123456'))).toBe(false);

    const filterN = createCategoryFilter(BLS_CATEGORIES.GETRAENKE);
    expect(filterN(createFood('N123456', 'Saft'))).toBe(true);
    expect(filterN(createFood('P123456'))).toBe(false);

    const filterR = createCategoryFilter(BLS_CATEGORIES.GEWUERZE_SAUCEN);
    expect(filterR(createFood('R123456', 'Ketchup'))).toBe(true);
    expect(filterR(createFood('X123456'))).toBe(false);
  });

  describe('edge cases', () => {
    it('handles lowercase prefix (should not match)', () => {
      const filter = createCategoryFilter('P' as any);
      expect(filter(createFood('p123456'))).toBe(false);
    });

    it('handles prefix not at start (should not match)', () => {
      const filter = createCategoryFilter('P' as any);
      expect(filter(createFood('AP12345'))).toBe(false);
    });

    it('handles empty blsCode', () => {
      const filter = createCategoryFilter('X' as any);
      expect(filter(createFood(''))).toBe(false);
    });

    it('handles single character codes', () => {
      const filter = createCategoryFilter('X' as any);
      expect(filter(createFood('X'))).toBe(true);
      expect(filter(createFood('Y'))).toBe(false);
    });
  });
});

describe('isInCategories', () => {
  it('returns true if food belongs to any of the given categories', () => {
    expect(isInCategories(createFood('X123456'), ['X', 'Y'])).toBe(true);
    expect(isInCategories(createFood('Y123456'), ['X', 'Y'])).toBe(true);
    expect(isInCategories(createFood('P123456'), ['P', 'N'])).toBe(true);
  });

  it('returns false if food does not belong to any category', () => {
    expect(isInCategories(createFood('X123456'), ['P', 'N'])).toBe(false);
    expect(isInCategories(createFood('B123456'), ['X', 'Y', 'P'])).toBe(false);
  });

  it('handles empty category array', () => {
    expect(isInCategories(createFood('X123456'), [])).toBe(false);
  });

  it('handles single category', () => {
    expect(isInCategories(createFood('X123456'), ['X'])).toBe(true);
    expect(isInCategories(createFood('X123456'), ['Y'])).toBe(false);
  });

  it('works with all BLS category constants', () => {
    expect(
      isInCategories(
        createFood('X123456'),
        [BLS_CATEGORIES.FERTIGGERICHTE_PFLANZLICH, BLS_CATEGORIES.FERTIGGERICHTE_TIERISCH]
      )
    ).toBe(true);

    expect(
      isInCategories(
        createFood('P123456'),
        [BLS_CATEGORIES.ALKOHOLISCHE_GETRAENKE, BLS_CATEGORIES.GETRAENKE]
      )
    ).toBe(true);
  });

  describe('edge cases', () => {
    it('handles composite BLS codes (e.g., R9A2000+R9A2200+R9A2100)', () => {
      expect(isInCategories(createFood('R9A2000+R9A2200+R9A2100'), ['R'])).toBe(true);
      expect(isInCategories(createFood('X123+Y456'), ['X', 'Y'])).toBe(true);
    });

    it('handles lowercase codes (should not match)', () => {
      expect(isInCategories(createFood('x123456'), ['X'])).toBe(false);
    });

    it('handles empty blsCode', () => {
      expect(isInCategories(createFood(''), ['X', 'Y', 'P'])).toBe(false);
    });
  });
});
