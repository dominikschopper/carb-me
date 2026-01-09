import Fuse from 'fuse.js';
import type { FoodItem } from '$lib/types/food';

const fuseOptions: Fuse.IFuseOptions<FoodItem> = {
  keys: [
    { name: 'name', weight: 0.7 },
    { name: 'categories', weight: 0.2 },
    { name: 'tags', weight: 0.1 },
  ],
  threshold: 0.4, // Lower = stricter matching
  ignoreLocation: true, // Match anywhere in string
  minMatchCharLength: 2,
  includeScore: true,
};

let fuseInstance: Fuse<FoodItem> | null = null;

/**
 * Initialize Fuse.js instance with food data
 */
export function initializeSearch(foods: FoodItem[]): void {
  fuseInstance = new Fuse(foods, fuseOptions);
}

/**
 * Perform fuzzy search on food items
 */
export function fuzzySearch(foods: FoodItem[], query: string): FoodItem[] {
  if (!query.trim()) {
    return foods;
  }

  // Reinitialize if foods changed or not initialized
  if (!fuseInstance) {
    initializeSearch(foods);
  }

  const results = fuseInstance!.search(query);

  // Return just the items (not scores)
  return results.map((result) => result.item);
}

/**
 * Debounce function for performance
 */
export function debounce<T extends (...args: any[]) => any>(fn: T, delay: number): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;

  return function (...args: Parameters<T>) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}
