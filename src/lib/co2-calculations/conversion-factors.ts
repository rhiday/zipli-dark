/**
 * Cooked-to-Raw Conversion Factors
 * 
 * These factors account for weight changes during cooking:
 * - Water loss (meats shrink, pasta/rice expand)
 * - Fat rendering
 * - Moisture absorption
 * 
 * Formula: raw_weight = cooked_weight / conversion_factor
 * Example: 100g cooked chicken = 100g / 0.75 = 133g raw chicken
 */

export interface ConversionFactor {
  name: string;
  cookedToRawFactor: number; // multiplier to get raw from cooked
  description?: string;
}

/**
 * Conversion factors for common ingredients
 * Values represent the ratio: cooked weight / raw weight
 */
export const CONVERSION_FACTORS: Record<string, ConversionFactor> = {
  // Meats (generally lose 20-30% weight when cooked)
  beef: {
    name: 'Beef',
    cookedToRawFactor: 0.75,
    description: 'Beef loses ~25% weight when cooked',
  },
  beef_ground: {
    name: 'Ground Beef',
    cookedToRawFactor: 0.70,
    description: 'Ground beef loses ~30% weight',
  },
  pork: {
    name: 'Pork',
    cookedToRawFactor: 0.75,
    description: 'Pork loses ~25% weight',
  },
  chicken: {
    name: 'Chicken',
    cookedToRawFactor: 0.75,
    description: 'Chicken loses ~25% weight',
  },
  turkey: {
    name: 'Turkey',
    cookedToRawFactor: 0.75,
    description: 'Turkey loses ~25% weight',
  },
  
  // Fish & Seafood (lose 20-25% weight)
  salmon: {
    name: 'Salmon',
    cookedToRawFactor: 0.77,
    description: 'Salmon loses ~23% weight',
  },
  fish_white: {
    name: 'White Fish',
    cookedToRawFactor: 0.78,
    description: 'White fish loses ~22% weight',
  },
  fish_balls: {
    name: 'Fish Balls',
    cookedToRawFactor: 0.85,
    description: 'Pre-cooked, minimal change',
  },
  shrimp: {
    name: 'Shrimp',
    cookedToRawFactor: 0.80,
    description: 'Shrimp loses ~20% weight',
  },
  
  // Legumes (gain weight by absorbing water)
  chickpeas: {
    name: 'Chickpeas',
    cookedToRawFactor: 2.5,
    description: 'Chickpeas absorb water, gain 150% weight',
  },
  kidney_beans: {
    name: 'Kidney Beans',
    cookedToRawFactor: 2.5,
    description: 'Beans absorb water, gain 150% weight',
  },
  lentils: {
    name: 'Lentils',
    cookedToRawFactor: 2.2,
    description: 'Lentils gain 120% weight',
  },
  
  // Grains & Pasta (gain weight from water absorption)
  rice: {
    name: 'Rice',
    cookedToRawFactor: 3.0,
    description: 'Rice triples in weight when cooked',
  },
  pasta: {
    name: 'Pasta',
    cookedToRawFactor: 2.5,
    description: 'Pasta gains 150% weight',
  },
  
  // Vegetables (generally lose 5-15% weight)
  potato: {
    name: 'Potato',
    cookedToRawFactor: 0.90,
    description: 'Potatoes lose ~10% weight',
  },
  beetroot: {
    name: 'Beetroot',
    cookedToRawFactor: 0.92,
    description: 'Beetroot loses ~8% weight',
  },
  cauliflower: {
    name: 'Cauliflower',
    cookedToRawFactor: 0.88,
    description: 'Cauliflower loses ~12% weight',
  },
  mushroom: {
    name: 'Mushroom',
    cookedToRawFactor: 0.70,
    description: 'Mushrooms lose ~30% weight (high water content)',
  },
  tomato: {
    name: 'Tomato',
    cookedToRawFactor: 0.85,
    description: 'Tomatoes lose ~15% weight',
  },
  onion: {
    name: 'Onion',
    cookedToRawFactor: 0.90,
    description: 'Onions lose ~10% weight',
  },
  carrot: {
    name: 'Carrot',
    cookedToRawFactor: 0.92,
    description: 'Carrots lose ~8% weight',
  },
  
  // Items typically used cooked or with minimal change
  tofu: {
    name: 'Tofu',
    cookedToRawFactor: 0.95,
    description: 'Tofu has minimal weight change',
  },
  cheese: {
    name: 'Cheese',
    cookedToRawFactor: 0.98,
    description: 'Cheese has minimal weight change',
  },
  eggs: {
    name: 'Eggs',
    cookedToRawFactor: 0.95,
    description: 'Eggs lose minimal weight',
  },
  bread: {
    name: 'Bread',
    cookedToRawFactor: 1.0,
    description: 'Already cooked product',
  },
};

/**
 * Convert cooked weight to raw weight equivalent
 */
export function convertCookedToRaw(
  cookedWeightKg: number,
  ingredientKey: string
): number {
  const factor = CONVERSION_FACTORS[ingredientKey]?.cookedToRawFactor ?? 1.0;
  return cookedWeightKg / factor;
}

/**
 * Convert raw weight to cooked weight equivalent
 */
export function convertRawToCooked(
  rawWeightKg: number,
  ingredientKey: string
): number {
  const factor = CONVERSION_FACTORS[ingredientKey]?.cookedToRawFactor ?? 1.0;
  return rawWeightKg * factor;
}

/**
 * Get conversion factor for an ingredient
 */
export function getConversionFactor(ingredientKey: string): number {
  return CONVERSION_FACTORS[ingredientKey]?.cookedToRawFactor ?? 1.0;
}
