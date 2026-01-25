import { describe, it, expect } from 'vitest';
import { isPreparedMeal } from './food-filters';
import type { FoodItem } from '$lib/types/food';

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

describe('isPreparedMeal', () => {
  describe('returns true for prepared meals', () => {
    it('identifies foods with X prefix as prepared meals', () => {
      expect(isPreparedMeal(createFood('X123456'))).toBe(true);
      expect(isPreparedMeal(createFood('X000001'))).toBe(true);
      expect(isPreparedMeal(createFood('XABCDEF'))).toBe(true);
    });

    it('identifies foods with Y prefix as prepared meals (sweet)', () => {
      expect(isPreparedMeal(createFood('Y123456'))).toBe(true);
      expect(isPreparedMeal(createFood('Y000001'))).toBe(true);
      expect(isPreparedMeal(createFood('YABCDEF'))).toBe(true);
    });
  });

  describe('returns false for non-prepared meals', () => {
    it('returns false for fruits (O prefix)', () => {
      expect(isPreparedMeal(createFood('O123456', 'Apfel'))).toBe(false);
    });

    it('returns false for vegetables (G prefix)', () => {
      expect(isPreparedMeal(createFood('G123456', 'Karotte'))).toBe(false);
    });

    it('returns false for bread (B prefix)', () => {
      expect(isPreparedMeal(createFood('B123456', 'Weißbrot'))).toBe(false);
    });

    it('returns false for dairy (M prefix)', () => {
      expect(isPreparedMeal(createFood('M123456', 'Milch'))).toBe(false);
    });

    it('returns false for beverages (N prefix)', () => {
      expect(isPreparedMeal(createFood('N123456', 'Orangensaft'))).toBe(false);
    });
  });

  describe('edge cases', () => {
    it('handles lowercase x/y (should not match)', () => {
      expect(isPreparedMeal(createFood('x123456'))).toBe(false);
      expect(isPreparedMeal(createFood('y123456'))).toBe(false);
    });

    it('handles X or Y not at start (should not match)', () => {
      expect(isPreparedMeal(createFood('AX12345'))).toBe(false);
      expect(isPreparedMeal(createFood('1X23456'))).toBe(false);
    });

    it('handles empty blsCode', () => {
      expect(isPreparedMeal(createFood(''))).toBe(false);
    });

    it('handles single character codes', () => {
      expect(isPreparedMeal(createFood('X'))).toBe(true);
      expect(isPreparedMeal(createFood('Y'))).toBe(true);
      expect(isPreparedMeal(createFood('A'))).toBe(false);
    });
  });
});