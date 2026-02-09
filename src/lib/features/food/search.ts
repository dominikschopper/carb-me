import Fuse, { type IFuseOptions } from 'fuse.js';
import type { FoodItem } from '$lib/types/food';

const fuseOptions: IFuseOptions<FoodItem> = {
  keys: [
    { name: 'name', weight: 0.7 },
    { name: 'subtitle', weight: 0.5 },
    { name: 'categories', weight: 0.2 },
    { name: 'tags', weight: 0.1 },
  ],
  threshold: 0.4,
  ignoreLocation: true,
  minMatchCharLength: 2,
  includeScore: true,
  shouldSort: true,
};

/**
 * Create a new Fuse.js search index for the given foods
 */
export function createSearchIndex(foods: FoodItem[]): Fuse<FoodItem> {
  return new Fuse(foods, fuseOptions);
}

/**
 * Perform fuzzy search on food items with intelligent sorting
 */
export function fuzzySearch(index: Fuse<FoodItem>, query: string): FoodItem[] {
  if (!query.trim()) {
    return [];
  }

  const results = index.search(query, { limit: 100 });
  const lowerQuery = query.toLowerCase().trim();

  // Pre-compute lowercase names once
  const scored = results.map((r) => ({
    item: r.item,
    score: r.score ?? 1,
    lowerName: r.item.name.toLowerCase(),
  }));

  // Sort with custom priority
  scored.sort((a, b) => {
    // Priority 1: Exact match
    if (a.lowerName === lowerQuery) return -1;
    if (b.lowerName === lowerQuery) return 1;

    // Priority 2: Starts with query as complete word (e.g., "Apfel roh" for "apfel")
    const wordBoundaryA = a.lowerName.startsWith(lowerQuery + ' ') || a.lowerName === lowerQuery;
    const wordBoundaryB = b.lowerName.startsWith(lowerQuery + ' ') || b.lowerName === lowerQuery;
    if (wordBoundaryA !== wordBoundaryB) return wordBoundaryA ? -1 : 1;

    // Priority 3: Starts with query (prefix match, e.g., "Apfelkorn")
    const startsA = a.lowerName.startsWith(lowerQuery);
    const startsB = b.lowerName.startsWith(lowerQuery);
    if (startsA !== startsB) return startsA ? -1 : 1;

    // Priority 4: Contains query as word boundary
    const wordInA = a.lowerName.includes(' ' + lowerQuery) || a.lowerName.includes(',' + lowerQuery);
    const wordInB = b.lowerName.includes(' ' + lowerQuery) || b.lowerName.includes(',' + lowerQuery);
    if (wordInA !== wordInB) return wordInA ? -1 : 1;

    // Priority 5: Contains query anywhere
    const containsA = a.lowerName.includes(lowerQuery);
    const containsB = b.lowerName.includes(lowerQuery);
    if (containsA !== containsB) return containsA ? -1 : 1;

    // Priority 6: Fuzzy score
    return a.score - b.score;
  });

  return scored.map((s) => s.item);
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
