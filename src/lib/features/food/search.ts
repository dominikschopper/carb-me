import Fuse, { type IFuseOptions } from 'fuse.js';
import type { FoodItem } from '$lib/types/food';

const fuseOptions: IFuseOptions<FoodItem> = {
  keys: [
    { name: 'name', weight: 0.7 },
    { name: 'subtitle', weight: 0.5 },
    { name: 'searchTerms', weight: 0.6 },
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

function matchTier(text: string, query: string): number {
  if (text === query) return 0;
  if (text.startsWith(query + ' ')) return 1;
  if (text.startsWith(query)) return 2;
  if (text.includes(' ' + query) || text.includes(',' + query)) return 3;
  if (text.includes(query)) return 4;
  return 5;
}

function bestTier(item: FoodItem, lowerQuery: string): number {
  if (item.searchTerms?.some((term) => term.toLowerCase() === lowerQuery)) {
    return 0;
  }
  return matchTier(item.name.toLowerCase(), lowerQuery);
}

export type RawFirstMode = 'off' | 'tie-break' | 'always';

function isRaw(item: FoodItem): boolean {
  return item.name.toLowerCase().endsWith(' roh');
}

/**
 * Perform fuzzy search on food items with intelligent sorting
 */
export function fuzzySearch(
  index: Fuse<FoodItem>,
  query: string,
  rawFirstMode: RawFirstMode = 'off'
): FoodItem[] {
  if (!query.trim()) {
    return [];
  }

  const results = index.search(query, { limit: 100 });
  const lowerQuery = query.toLowerCase().trim();

  const scored = results.map((r) => ({
    item: r.item,
    score: r.score ?? 1,
    tier: bestTier(r.item, lowerQuery),
    raw: isRaw(r.item),
  }));

  scored.sort((a, b) => {
    if (rawFirstMode === 'always' && a.raw !== b.raw) return a.raw ? -1 : 1;
    if (a.tier !== b.tier) return a.tier - b.tier;
    if (rawFirstMode === 'tie-break' && a.raw !== b.raw) return a.raw ? -1 : 1;
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
