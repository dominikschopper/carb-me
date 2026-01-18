/**
 * Convert BLS (Bundeslebensmittelschlüssel) CSV to app JSON format
 *
 * Usage: pnpm convert-bls
 *
 * Input: scripts/bls-data/BLS_4_0_Daten_2025_DE.csv
 * Output: static/lebensmittel-daten.json
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = resolve(__dirname, '..');

// Minimum carbohydrate threshold (g/100g)
const MIN_KH = 4;

// BLS code first letter to category mapping
const BLS_CATEGORY_MAP: Record<string, string> = {
  B: 'Brot & Backwaren',
  C: 'Getreide',
  D: 'Süßgebäck',
  E: 'Teigwaren',
  F: 'Obst',
  G: 'Gemüse',
  H: 'Hülsenfrüchte & Nüsse',
  K: 'Kartoffeln',
  M: 'Milchprodukte',
  N: 'Getränke',
  P: 'Alkoholische Getränke',
  Q: 'Fette & Öle',
  R: 'Gewürze & Saucen',
  S: 'Süßwaren',
  T: 'Fisch & Meeresfrüchte',
  U: 'Fleisch',
  V: 'Geflügel & Wild',
  W: 'Wurstwaren',
  X: 'Fertiggerichte',
  Y: 'Fertiggerichte (süß)',
};

// Categories that should use "ml" as unit
const BEVERAGE_CATEGORIES = new Set(['N', 'P']);

interface FoodItem {
  name: string;
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

  const foods: FoodItem[] = [];
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

    // Skip duplicates (keep first occurrence)
    if (seenNames.has(name)) {
      duplicates++;
      continue;
    }
    seenNames.add(name);

    // Calculate BE and KHE
    // 1 BE = 12g carbs, so gBE = 1200 / kh (grams needed for 1 BE)
    // 1 KHE = 10g carbs, so gKHE = 1000 / kh (grams needed for 1 KHE)
    const gBE = Math.round(1200 / kh);
    const gKHE = Math.round(1000 / kh);

    const category = getCategory(blsCode);
    const tags = generateTags(kh, blsCode);

    const food: FoodItem = {
      name,
      kh: Math.round(kh * 10) / 10, // Round to 1 decimal
      gBE,
      gKHE,
      categories: [[category]],
      tags,
      kcal: Math.round(kcal),
      kj: Math.round(kj),
      blsCode,
    };

    // Add unit for beverages
    if (BEVERAGE_CATEGORIES.has(blsCode.charAt(0))) {
      food.unit = 'ml';
    }

    foods.push(food);
  }

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
  console.log(`  Output items: ${foods.length}`);
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
