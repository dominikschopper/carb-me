import { describe, it, expect } from 'vitest';
import {
  calculateNutrition,
  gramsForBE,
  gramsForKHE,
  calculateUnitsFromCarbs,
  kcalToKj,
  kjToKcal,
} from './calculator';
import type { FoodItem } from '$lib/types/food';

// Test fixture: A typical food item (white bread)
const whiteBread: FoodItem = {
  name: 'Weißbrot',
  kh: 48, // 48g KH per 100g
  gBE: 25, // 25g = 1 BE (12g KH)
  gKHE: 21, // 21g = 1 KHE (10g KH)
  categories: [['Brot & Backwaren']],
  tags: ['vieleKH'],
  blsCode: 'B123456',
};

// Test fixture: Apple (lower carbs)
const apple: FoodItem = {
  name: 'Apfel',
  kh: 11.4,
  gBE: 105,
  gKHE: 88,
  categories: [['Obst']],
  tags: ['wenigeKH'],
  blsCode: 'O123456',
};

describe('calculateNutrition', () => {
  it('calculates correct values for 100g', () => {
    const result = calculateNutrition(whiteBread, 100);

    expect(result.grams).toBe(100);
    expect(result.be).toBe(4); // 100 / 25 = 4 BE
    expect(result.khe).toBeCloseTo(4.76, 1); // 100 / 21 ≈ 4.76 KHE
    expect(result.carbs).toBe(48); // 48g KH
  });

  it('calculates correct values for 50g', () => {
    const result = calculateNutrition(whiteBread, 50);

    expect(result.grams).toBe(50);
    expect(result.be).toBe(2); // 50 / 25 = 2 BE
    expect(result.khe).toBeCloseTo(2.38, 1); // 50 / 21 ≈ 2.38 KHE
    expect(result.carbs).toBe(24); // 24g KH
  });

  it('calculates correct values for apple', () => {
    const result = calculateNutrition(apple, 150);

    expect(result.grams).toBe(150);
    expect(result.be).toBeCloseTo(1.43, 1); // 150 / 105 ≈ 1.43 BE
    expect(result.khe).toBeCloseTo(1.7, 1); // 150 / 88 ≈ 1.7 KHE
    expect(result.carbs).toBeCloseTo(17.1, 0); // (150 / 100) * 11.4 = 17.1g
  });

  it('rounds grams to whole numbers', () => {
    const result = calculateNutrition(whiteBread, 123.7);
    expect(result.grams).toBe(124);
  });

  it('handles zero grams', () => {
    const result = calculateNutrition(whiteBread, 0);

    expect(result.grams).toBe(0);
    expect(result.be).toBe(0);
    expect(result.khe).toBe(0);
    expect(result.carbs).toBe(0);
  });
});

describe('gramsForBE', () => {
  it('calculates grams needed for 1 BE', () => {
    expect(gramsForBE(whiteBread, 1)).toBe(25);
  });

  it('calculates grams needed for 2 BE', () => {
    expect(gramsForBE(whiteBread, 2)).toBe(50);
  });

  it('calculates grams needed for 0.5 BE', () => {
    expect(gramsForBE(whiteBread, 0.5)).toBe(13); // 12.5 rounded
  });

  it('works with different foods', () => {
    expect(gramsForBE(apple, 1)).toBe(105);
  });
});

describe('gramsForKHE', () => {
  it('calculates grams needed for 1 KHE', () => {
    expect(gramsForKHE(whiteBread, 1)).toBe(21);
  });

  it('calculates grams needed for 3 KHE', () => {
    expect(gramsForKHE(whiteBread, 3)).toBe(63);
  });

  it('works with different foods', () => {
    expect(gramsForKHE(apple, 1)).toBe(88);
  });
});

describe('calculateUnitsFromCarbs', () => {
  it('calculates gBE and gKHE from carbs per 100g', () => {
    // 48g KH per 100g (like white bread)
    const result = calculateUnitsFromCarbs(48);

    // 1 BE = 12g KH, so need (12/48)*100 = 25g for 1 BE
    expect(result.gBE).toBe(25);

    // 1 KHE = 10g KH, so need (10/48)*100 ≈ 20.83g for 1 KHE
    expect(result.gKHE).toBe(21);
  });

  it('calculates for low-carb food', () => {
    // 11.4g KH per 100g (like apple)
    const result = calculateUnitsFromCarbs(11.4);

    // (12/11.4)*100 ≈ 105g for 1 BE
    expect(result.gBE).toBe(105);

    // (10/11.4)*100 ≈ 88g for 1 KHE
    expect(result.gKHE).toBe(88);
  });

  it('calculates for high-carb food', () => {
    // 80g KH per 100g (like sugar)
    const result = calculateUnitsFromCarbs(80);

    expect(result.gBE).toBe(15); // (12/80)*100 = 15g
    expect(result.gKHE).toBe(13); // (10/80)*100 = 12.5g, rounded to 13
  });
});

describe('Energy Conversion', () => {
  describe('kcalToKj', () => {
    it('converts kcal to kJ correctly', () => {
      expect(kcalToKj(100)).toBe(418); // 100 * 4.184 = 418.4, rounded to 418
    });

    it('converts typical food energy values', () => {
      expect(kcalToKj(250)).toBe(1046); // 250 * 4.184 = 1046
    });

    it('handles zero', () => {
      expect(kcalToKj(0)).toBe(0);
    });

    it('rounds to whole numbers', () => {
      expect(kcalToKj(123)).toBe(515); // 123 * 4.184 = 514.632, rounded to 515
    });

    it('handles decimal input', () => {
      expect(kcalToKj(100.5)).toBe(420); // 100.5 * 4.184 = 420.492, rounded to 420
    });
  });

  describe('kjToKcal', () => {
    it('converts kJ to kcal correctly', () => {
      expect(kjToKcal(418)).toBe(100); // 418 / 4.184 = 99.9, rounded to 100
    });

    it('converts typical food energy values', () => {
      expect(kjToKcal(1046)).toBe(250); // 1046 / 4.184 = 250
    });

    it('handles zero', () => {
      expect(kjToKcal(0)).toBe(0);
    });

    it('rounds to whole numbers', () => {
      expect(kjToKcal(515)).toBe(123); // 515 / 4.184 = 123.08, rounded to 123
    });

    it('handles decimal input', () => {
      expect(kjToKcal(420.5)).toBe(101); // 420.5 / 4.184 = 100.5, rounded to 101
    });
  });

  describe('Bidirectional conversion', () => {
    it('converts back and forth maintains approximate values', () => {
      const original = 250;
      const kj = kcalToKj(original);
      const backToKcal = kjToKcal(kj);

      // Should be approximately equal (rounding may cause small differences)
      expect(backToKcal).toBe(original);
    });

    it('handles edge cases', () => {
      // Very small values
      expect(kjToKcal(kcalToKj(1))).toBe(1);

      // Large values
      expect(kjToKcal(kcalToKj(1000))).toBe(1000);
    });
  });
});
