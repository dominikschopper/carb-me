/**
 * Convert BLS (Bundeslebensmittelschlüssel) CSV to app JSON format
 *
 * Usage: pnpm convert-bls
 *
 * Input: scripts/bls-data/BLS_4_0_Daten_2025_DE.csv
 * Output: static/lebensmittel-daten.json
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = resolve(__dirname, '..');

// Configuration file for manual prefixes and merge groups
interface BlsConfig {
  prefixes: Record<string, string[]>;
  mergeGroups: Array<{
    name: string;
    blsCodes: string[];
    subtitle?: string;
  }>;
}

function loadBlsConfig(): BlsConfig {
  const configPath = resolve(PROJECT_ROOT, 'scripts/bls-data/bls-config.json');
  if (!existsSync(configPath)) {
    console.warn('!!No bls-config.json found, using defaults');
    return { prefixes: {}, mergeGroups: [] };
  }
  console.log('  >>Loading BLS config from:', configPath);
  return JSON.parse(readFileSync(configPath, 'utf-8'));
}

// Minimum carbohydrate threshold (g/100g)
const MIN_KH = 4;

// Grouping configuration
const GROUPING_CONFIG = {
  enabled: true,
  blsPrefixLength: 4, // Group by first 4 characters (e.g., C213 = Weizenmehl)
  maxKhDifference: 15, // Max KH/100gr difference within a group
  excludeCategories: ['X', 'Y'], // Don't group prepared meals
};

// BLS code first letter to category mapping
const BLS_CATEGORY_MAP: Record<string, string> = {
  'B': 'Brot und Kleingebäck',
  'C': 'Getreide, Getreideprodukte',
  'D': 'Dauerbackwaren, Kuchen',
  'E': 'Eier und Eierprodukte, Nudeln',
  'F': 'Früchte + Obst',
  'G': 'Gemüse und Gemüseerzeugnisse',
  'H': 'Hülsenfrüchte',
  'K': 'Kartoffeln, Pilze',
  'M': 'Milch, Milcherzeugnisse',
  'N': 'Getränke (alkoholfrei)',
  'P': 'Getränke (mit Alkohol)',
  'Q': 'Speisefette und Öle',
  'R': 'Gewürze + Saucen',
  'S': 'Süßwaren, Zucker, Schokolade',
  'T': 'Fische, Meeresfrüchte',
  'U': 'Fleisch Rind/Schwein/Schaf/Lamm',
  'V': 'Fleisch Wild/Geflügel/Federwild',
  'W': 'Fleisch- und Wurstwaren',
  'X': 'Menükomponenten (pflanzlich)',
  'Y': 'Menükomponenten (tierisch)',
};

// Categories that should use "ml" as unit
const BEVERAGE_CATEGORIES = new Set(['N', 'P']);

// BLS codes to exclude (spirits/Schnäpse - P6xx and P7xx)
// P1xx-P4xx = Beer, Wine, Cider (keep)
// P5xx = Liqueurs (keep)
// P6xx = Brandy, Cognac, Calvados (exclude)
// P7xx = Vodka, Rum, Whisky, Gin, etc. (exclude)
const EXCLUDE_BLS_PREFIXES = ['P6', 'P7'];

interface FoodItem {
  name: string;
  subtitle?: string;
  kh: number;
  gBE: number;
  gKHE: number;
  categories: string[][];
  tags: string[];
  unit?: string;
  kcal?: number;
  kj?: number;
  blsCode?: string;
}

interface ParsedFood {
  name: string;
  kh: number;
  kcal: number;
  kj: number;
  blsCode: string;
  isManualMerge?: boolean; // Flag to skip automatic prefix (name already complete)
}

/**
 * Parse a numeric value from CSV, handling special cases
 */
function parseNumber(value: string): number {
  const trimmed = value.trim();

  // Handle missing or below detection limit values
  if (!trimmed || trimmed === '-' || trimmed.startsWith('<')) {
    return 0;
  }

  const parsed = parseFloat(trimmed.replace(',', '.'));
  return isNaN(parsed) ? 0 : parsed;
}

/**
 * Parse a CSV line, handling quoted fields
 */
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  result.push(current.trim());
  return result;
}

/**
 * Generate tags based on carbohydrate content
 */
function generateTags(kh: number, blsCode: string): string[] {
  const tags: string[] = [];

  // Carb level tags
  if (kh < 10) {
    tags.push('wenigeKH');
  } else if (kh <= 30) {
    tags.push('mittlereKH');
  } else {
    tags.push('vieleKH');
  }

  // Fast carbs for sugary items and beverages
  const category = blsCode.charAt(0);
  if (category === 'S' || category === 'N' || category === 'P') {
    tags.push('schnelleKH');
  }

  return tags;
}

/**
 * Get category from BLS code
 */
function getCategory(blsCode: string): string {
  const letter = blsCode.charAt(0).toUpperCase();
  return BLS_CATEGORY_MAP[letter] || 'Sonstiges';
}

/**
 * Calculate median of numeric array
 */
function calculateMedian(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

/**
 * Truncate subtitle if too long
 */
const MAX_SUBTITLE_LENGTH = 40;
const DEFAULT_SUBTITLE = 'verschiedene Varianten';

function truncateSubtitle(subtitle: string | undefined): string | undefined {
  if (!subtitle) return undefined;
  if (subtitle.length <= MAX_SUBTITLE_LENGTH) return subtitle;
  return DEFAULT_SUBTITLE;
}

/**
 * Find first common word among food names
 * e.g., ["Weizenbrötchen mit Kürbiskernen", "Weizenbrötchen mit Sesam"] -> "Weizenbrötchen"
 */
function findCommonPrefix(names: string[]): string {
  if (names.length === 0) return '';
  if (names.length === 1) return names[0];

  // Get first word of each name
  const firstWords = names.map((n) => n.split(/\s+/)[0]);

  // Check if all first words match (case-insensitive)
  const firstWord = firstWords[0];
  if (firstWords.every((w) => w.toLowerCase() === firstWord.toLowerCase())) {
    // Return first word, cleaned up (remove trailing comma if any)
    return firstWord.replace(/,\s*$/, '').trim();
  }

  // No common first word - return empty
  return '';
}

/**
 * Group similar foods by BLS prefix and KH similarity
 */
function groupSimilarFoods(foods: ParsedFood[]): (ParsedFood & { subtitle?: string })[] {
  if (!GROUPING_CONFIG.enabled) {
    return foods;
  }

  // Group by BLS prefix
  const groups = new Map<string, ParsedFood[]>();

  for (const food of foods) {
    const category = food.blsCode.charAt(0);

    // Skip excluded categories
    if (GROUPING_CONFIG.excludeCategories.includes(category)) {
      const key = food.blsCode; // Use full code as unique key
      groups.set(key, [food]);
      continue;
    }

    const prefix = food.blsCode.substring(0, GROUPING_CONFIG.blsPrefixLength);
    if (!groups.has(prefix)) {
      groups.set(prefix, []);
    }
    groups.get(prefix)!.push(food);
  }

  const result: (ParsedFood & { subtitle?: string })[] = [];
  let groupedCount = 0;

  /* eslint-disable  @typescript-eslint/no-unused-vars */
  for (const [_prefix, groupFoods] of groups) {
    if (groupFoods.length === 1) {
      result.push(groupFoods[0]);
      continue;
    }

    // Check KH difference within group
    const khValues = groupFoods.map((f) => f.kh);
    const khMin = Math.min(...khValues);
    const khMax = Math.max(...khValues);

    if (khMax - khMin <= GROUPING_CONFIG.maxKhDifference) {
      // Merge the group
      const names = groupFoods.map((f) => f.name);
      const baseName = findCommonPrefix(names);

      // Create subtitle from all original names (without the common prefix)
      const subtitle = truncateSubtitle(
        names
          .map((n) => n.replace(baseName, '').replace(/^[,\s]+/, '').trim())
          .filter((s) => s !== '')
          .join(', ')
      );

      // Use median values
      const medianKh = calculateMedian(groupFoods.map((f) => f.kh));
      const medianKcal = calculateMedian(groupFoods.map((f) => f.kcal));
      const medianKj = calculateMedian(groupFoods.map((f) => f.kj));

      // Concatenate all BLS codes for uniqueness
      const allBlsCodes = groupFoods.map((f) => f.blsCode).join('+');

      const merged: ParsedFood & { subtitle?: string } = {
        name: baseName || groupFoods[0].name,
        subtitle: subtitle || undefined,
        kh: medianKh,
        kcal: medianKcal,
        kj: medianKj,
        blsCode: allBlsCodes,
      };

      result.push(merged);
      groupedCount += groupFoods.length - 1;
    } else {
      // KH difference too large - keep individual entries
      result.push(...groupFoods);
    }
  }

  console.log(`  Grouped entries: ${groupedCount} items merged`);

  return result;
}

/**
 * Apply manual merge groups from config (after automatic grouping)
 */
function applyManualMergeGroups(
  foods: (ParsedFood & { subtitle?: string })[],
  mergeGroups: BlsConfig['mergeGroups']
): (ParsedFood & { subtitle?: string })[] {
  if (mergeGroups.length === 0) {
    return foods;
  }

  const result: (ParsedFood & { subtitle?: string })[] = [];
  const mergedBlsCodes = new Set<string>();
  let manualMergeCount = 0;

  // Process each merge group
  for (const group of mergeGroups) {
    // Find foods that match any of the BLS codes in this group
    // BLS codes in foods can be combined (e.g., "B226800+B226500")
    const matchingFoods = foods.filter((f) => {
      const foodCodes = f.blsCode.split('+');
      return group.blsCodes.some((configCode) =>
        foodCodes.some((foodCode) => foodCode.startsWith(configCode))
      );
    });

    if (matchingFoods.length > 1) {
      // Mark these as merged
      for (const f of matchingFoods) {
        mergedBlsCodes.add(f.blsCode);
      }

      // Calculate median values
      const medianKh = calculateMedian(matchingFoods.map((f) => f.kh));
      const medianKcal = calculateMedian(matchingFoods.map((f) => f.kcal));
      const medianKj = calculateMedian(matchingFoods.map((f) => f.kj));

      // Combine all BLS codes
      const allBlsCodes = matchingFoods.map((f) => f.blsCode).join('+');

      result.push({
        name: group.name,
        subtitle: truncateSubtitle(group.subtitle),
        kh: medianKh,
        kcal: medianKcal,
        kj: medianKj,
        blsCode: allBlsCodes,
        isManualMerge: true, // Skip automatic prefix
      });

      manualMergeCount += matchingFoods.length - 1;
    } else if (matchingFoods.length === 1) {
      // Only one match - just rename it
      mergedBlsCodes.add(matchingFoods[0].blsCode);
      result.push({
        ...matchingFoods[0],
        name: group.name,
        subtitle: truncateSubtitle(group.subtitle || matchingFoods[0].subtitle),
        isManualMerge: true, // Skip automatic prefix
      });
    }
  }

  // Add all foods that weren't manually merged
  for (const food of foods) {
    if (!mergedBlsCodes.has(food.blsCode)) {
      result.push(food);
    }
  }

  if (manualMergeCount > 0) {
    console.log(`  Manual merge groups: ${manualMergeCount} items merged`);
  }

  return result;
}

/**
 * Build prefix lookup map from config
 */
function buildPrefixMap(prefixes: BlsConfig['prefixes']): Map<string, string> {
  const prefixMap = new Map<string, string>();
  for (const [prefix, codes] of Object.entries(prefixes)) {
    for (const code of codes) {
      prefixMap.set(code, prefix + ': ');
    }
  }
  return prefixMap;
}

/**
 * Get prefix for a food item based on its BLS code(s)
 */
function getPrefix(combinedBlsCode: string, prefixMap: Map<string, string>): string {
  const codes = combinedBlsCode.split('+');
  for (const code of codes) {
    // Check for exact match first
    const exactPrefix = prefixMap.get(code);
    if (exactPrefix) return exactPrefix;

    // Check for prefix match (e.g., "B22" matches "B221000")
    for (const [configCode, prefix] of prefixMap) {
      if (code.startsWith(configCode)) {
        return prefix;
      }
    }
  }
  return '';
}

function isJuiceInFruits(food: ParsedFood) {
  const FRUIT_CATEGORY = 'F';
  const saftRegex = new RegExp('^\\w+saft\\b')
  if (food.name === 'Apfelsaft') {
    console.log('Apfelsaft saftRegex.test(food.name)', saftRegex.test(food.name))
  }
  return food.blsCode.startsWith(FRUIT_CATEGORY) && saftRegex.test(food.name);
}

/**
 * Main conversion function
 */
function convertBLStoJSON(): void {
  const inputPath = resolve(PROJECT_ROOT, 'scripts/bls-data/BLS_4_0_Daten_2025_DE.csv');
  const outputPath = resolve(PROJECT_ROOT, 'static/lebensmittel-daten.json');

  console.log('Reading CSV from:', inputPath);

  const csvContent = readFileSync(inputPath, 'utf-8');
  const lines = csvContent.split('\n');

  // Skip header line
  const dataLines = lines.slice(1).filter((line) => line.trim());

  console.log(`Processing ${dataLines.length} entries...`);

  // Step 1: Parse all foods into raw data
  const parsedFoods: ParsedFood[] = [];
  const seenNames = new Set<string>();
  let filtered = 0;
  let duplicates = 0;

  for (const line of dataLines) {
    const fields = parseCSVLine(line);

    if (fields.length < 6) continue;

    const blsCode = fields[0];
    const name = fields[1];
    const kj = parseNumber(fields[3]);
    const kcal = parseNumber(fields[4]);
    const kh = parseNumber(fields[5]);

    // Filter by minimum carbohydrate content
    if (kh < MIN_KH) {
      filtered++;
      continue;
    }

    // Exclude spirits (Schnäpse)
    if (EXCLUDE_BLS_PREFIXES.some((prefix) => blsCode.startsWith(prefix))) {
      filtered++;
      continue;
    }

    // Skip duplicates (keep first occurrence)
    if (seenNames.has(name)) {
      duplicates++;
      continue;
    }
    seenNames.add(name);

    parsedFoods.push({ name, kh, kcal, kj, blsCode });
  }

  const beforeGrouping = parsedFoods.length;

  // Load BLS config for manual merges and prefixes
  const config = loadBlsConfig();
  const prefixMap = buildPrefixMap(config.prefixes);

  // Step 2: Automatic grouping (by BLS prefix + KH similarity)
  const autoGroupedFoods = groupSimilarFoods(parsedFoods);

  // Step 3: Manual merge groups (from config, after automatic grouping)
  const manualGroupedFoods = applyManualMergeGroups(autoGroupedFoods, config.mergeGroups);

  // Step 4: Convert to final FoodItem format and apply prefixes
  const foods: FoodItem[] = manualGroupedFoods.map((parsed) => {
    const kh = Math.round(parsed.kh * 10) / 10; // Round to 1 decimal
    const gBE = Math.round(1200 / parsed.kh);
    const gKHE = Math.round(1000 / parsed.kh);
    const category = getCategory(parsed.blsCode);
    const tags = generateTags(parsed.kh, parsed.blsCode);

    // Apply prefix from config (skip for manual merge groups - name is already complete)
    const prefix = parsed.isManualMerge ? '' : getPrefix(parsed.blsCode, prefixMap);

    const food: FoodItem = {
      name: prefix + parsed.name,
      kh,
      gBE,
      gKHE,
      categories: [[category]],
      tags,
      kcal: Math.round(parsed.kcal),
      kj: Math.round(parsed.kj),
      blsCode: parsed.blsCode,
    };

    // Add subtitle if present
    if ('subtitle' in parsed && parsed.subtitle) {
      food.subtitle = parsed.subtitle as string;
    }

    // Add unit for beverages
    if (BEVERAGE_CATEGORIES.has(parsed.blsCode.charAt(0)) || isJuiceInFruits(parsed)) {
      food.unit = 'ml';
    }

    return food;
  });

  // Sort by category, then by name
  foods.sort((a, b) => {
    const catCompare = a.categories[0][0].localeCompare(b.categories[0][0], 'de');
    if (catCompare !== 0) return catCompare;
    return a.name.localeCompare(b.name, 'de');
  });

  const output = {
    lebensmittel: foods,
  };

  writeFileSync(outputPath, JSON.stringify(output, null, 2), 'utf-8');

  console.log('\nConversion complete!');
  console.log(`  Total processed: ${dataLines.length}`);
  console.log(`  Filtered (KH < ${MIN_KH}g): ${filtered}`);
  console.log(`  Duplicates skipped: ${duplicates}`);
  console.log(`  Before grouping: ${beforeGrouping}`);
  console.log(`  After grouping: ${foods.length}`);
  console.log(`  Output file: ${outputPath}`);

  // Show category distribution
  const categoryCount: Record<string, number> = {};
  for (const food of foods) {
    const cat = food.categories[0][0];
    categoryCount[cat] = (categoryCount[cat] || 0) + 1;
  }

  console.log('\nCategory distribution:');
  Object.entries(categoryCount)
    .sort((a, b) => b[1] - a[1])
    .forEach(([cat, count]) => {
      console.log(`  ${cat}: ${count}`);
    });
}

// Run
convertBLStoJSON();
