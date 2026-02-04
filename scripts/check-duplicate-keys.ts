
import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { FoodItem } from '../src/lib/types/food';
import { exit } from 'node:process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = resolve(__dirname, '..');

const LEBENSMITTEL_JSON_PATH = 'static/lebensmittel-daten.json';
type MinimalFood = Pick<FoodItem, 'name' | 'blsCode'>
/**
 *
 * @returns FoodItem[]
 */
function loadLebensmittelJSON(): FoodItem[] {

  const foodJSON: string = resolve(PROJECT_ROOT, LEBENSMITTEL_JSON_PATH);
    if (!existsSync(foodJSON)) {
      console.warn(` >>!!No %o found!`, LEBENSMITTEL_JSON_PATH);
      return [];
    }
    console.log(`  >>Loading data from: %o`, LEBENSMITTEL_JSON_PATH);
    return JSON.parse(readFileSync(LEBENSMITTEL_JSON_PATH, 'utf-8')).lebensmittel;
}

function useFoodSet() {

  const foodMap = new Map<string, MinimalFood[]>();
  const duplicates: Array<MinimalFood[]> = [];

  /**
   *
   * @param {{name: string, blsCode: string}} food
   */
  function add(food: FoodItem) {
    const minimalFood = { name: food.name, blsCode: food.blsCode }
    if (foodMap.has(minimalFood.blsCode)) {
      const items = foodMap.get(food.blsCode);
      items!.push(minimalFood);
      foodMap.set(minimalFood.blsCode, items!);
    } else {
      foodMap.set(minimalFood.blsCode, [minimalFood]);
    }
  }

  function getDuplicates() {
    foodMap.forEach(minFoods => {
      if (minFoods.length > 1) {
        duplicates.push(minFoods);
      }
    });
  }

  return { foodMap, duplicates, add, getDuplicates }
}

console.log('=> searching for duplicate BLS Keys')

const lebensmittel: FoodItem[] = loadLebensmittelJSON();

if (lebensmittel.length < 1) {
  console.error(' >>could not read any Lebensmittel Daten');
  exit(1);
}

const { add, getDuplicates, duplicates } = useFoodSet();

for (const food of lebensmittel) {
  add(food);
}

getDuplicates();

console.log('  >>DUPLICATES\n', duplicates, '\n  <<');
console.log('=> finished searching for duplicate');
