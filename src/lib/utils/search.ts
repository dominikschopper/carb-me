import Fuse, { type IFuseOptions } from 'fuse.js';
import type { FoodItem } from '$lib/types/food';

const fuseOptions: IFuseOptions<FoodItem> = {
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
 * Perform fuzzy search on food items with intelligent sorting
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
  const lowerQuery = query.toLowerCase().trim();

  // Sort results with custom priority
  const sortedResults = results.sort((a, b) => {
    const nameA = a.item.name.toLowerCase();
    const nameB = b.item.name.toLowerCase();

    // Priority 1: Exact match
    const exactA = nameA === lowerQuery ? 1000 : 0;
    const exactB = nameB === lowerQuery ? 1000 : 0;
    if (exactA !== exactB) return exactB - exactA;

    // Priority 2: Starts with query
    const startsA = nameA.startsWith(lowerQuery) ? 500 : 0;
    const startsB = nameB.startsWith(lowerQuery) ? 500 : 0;
    if (startsA !== startsB) return startsB - startsA;

    // Priority 3: Contains query
    const containsA = nameA.includes(lowerQuery) ? 100 : 0;
    const containsB = nameB.includes(lowerQuery) ? 100 : 0;
    if (containsA !== containsB) return containsB - containsA;

    // Priority 4: Fuzzy score (lower score is better in Fuse.js)
    return (a.score ?? 1) - (b.score ?? 1);
  });

  // Return just the items (not scores)
  return sortedResults.map((result) => result.item);
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
