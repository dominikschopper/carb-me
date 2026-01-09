import { mealStorage } from '$lib/utils/storage';
import type { MealItem, FoodItem } from '$lib/types/food';

class MealStore {
  items = $state<MealItem[]>([]);

  // Derived totals
  totalBE = $derived.by(() => {
    return this.items.reduce((sum, item) => sum + item.be, 0);
  });

  totalKHE = $derived.by(() => {
    return this.items.reduce((sum, item) => sum + item.khe, 0);
  });

  totalCarbs = $derived.by(() => {
    return this.items.reduce((sum, item) => {
      const carbs = (item.grams / 100) * item.food.kh;
      return sum + carbs;
    }, 0);
  });

  constructor() {
    if (typeof window !== 'undefined') {
      this.loadFromStorage();
    }
  }

  addItem(food: FoodItem, grams: number, be: number, khe: number) {
    const mealItem: MealItem = {
      food,
      grams,
      be,
      khe,
    };

    this.items.push(mealItem);
    this.saveToStorage();
  }

  removeItem(index: number) {
    this.items.splice(index, 1);
    this.saveToStorage();
  }

  clear() {
    this.items = [];
    this.saveToStorage();
  }

  loadFromStorage() {
    this.items = mealStorage.get();
  }

  private saveToStorage() {
    mealStorage.set(this.items);
  }
}

// Export singleton instance
export const mealStore = new MealStore();
