/**
 * FoodGWP Emission Factors Database
 * Values in kg CO2e per kg of raw ingredient
 * Source: Based on FoodGWP database and research literature
 */

export interface EmissionFactor {
  name: string;
  category: IngredientCategory;
  kgCO2ePerKg: number;
  source?: string;
}

export type IngredientCategory =
  | 'beef'
  | 'pork'
  | 'poultry'
  | 'fish'
  | 'seafood'
  | 'dairy'
  | 'eggs'
  | 'legumes'
  | 'grains'
  | 'vegetables'
  | 'fruits'
  | 'nuts'
  | 'oils'
  | 'other';

/**
 * Emission factors for common ingredients
 * Values represent kg CO2e per kg of raw ingredient
 */
export const EMISSION_FACTORS: Record<string, EmissionFactor> = {
  // Meat & Poultry
  beef: { name: 'Beef', category: 'beef', kgCO2ePerKg: 27.0 },
  beef_ground: { name: 'Ground Beef', category: 'beef', kgCO2ePerKg: 26.5 },
  pork: { name: 'Pork', category: 'pork', kgCO2ePerKg: 7.6 },
  chicken: { name: 'Chicken', category: 'poultry', kgCO2ePerKg: 4.2 },
  turkey: { name: 'Turkey', category: 'poultry', kgCO2ePerKg: 4.1 },
  
  // Fish & Seafood
  salmon: { name: 'Salmon', category: 'fish', kgCO2ePerKg: 3.8 },
  salmon_smoked: { name: 'Smoked Salmon', category: 'fish', kgCO2ePerKg: 4.0 },
  fish_white: { name: 'White Fish', category: 'fish', kgCO2ePerKg: 3.5 },
  fish_balls: { name: 'Fish Balls', category: 'fish', kgCO2ePerKg: 3.5 },
  shrimp: { name: 'Shrimp', category: 'seafood', kgCO2ePerKg: 11.8 },
  
  // Dairy & Eggs
  milk: { name: 'Milk', category: 'dairy', kgCO2ePerKg: 1.4 },
  cheese: { name: 'Cheese', category: 'dairy', kgCO2ePerKg: 9.8 },
  cream: { name: 'Cream', category: 'dairy', kgCO2ePerKg: 3.2 },
  butter: { name: 'Butter', category: 'dairy', kgCO2ePerKg: 9.0 },
  eggs: { name: 'Eggs', category: 'eggs', kgCO2ePerKg: 2.7 },
  
  // Legumes & Plant Proteins
  chickpeas: { name: 'Chickpeas', category: 'legumes', kgCO2ePerKg: 0.8 },
  kidney_beans: { name: 'Kidney Beans', category: 'legumes', kgCO2ePerKg: 0.7 },
  lentils: { name: 'Lentils', category: 'legumes', kgCO2ePerKg: 0.9 },
  tofu: { name: 'Tofu', category: 'legumes', kgCO2ePerKg: 0.6 },
  soy: { name: 'Soy Products', category: 'legumes', kgCO2ePerKg: 0.4 },
  
  // Grains & Starches
  wheat: { name: 'Wheat', category: 'grains', kgCO2ePerKg: 0.6 },
  rice: { name: 'Rice', category: 'grains', kgCO2ePerKg: 2.7 },
  pasta: { name: 'Pasta', category: 'grains', kgCO2ePerKg: 0.9 },
  bread: { name: 'Bread', category: 'grains', kgCO2ePerKg: 0.6 },
  potato: { name: 'Potato', category: 'vegetables', kgCO2ePerKg: 0.3 },
  
  // Vegetables
  beetroot: { name: 'Beetroot', category: 'vegetables', kgCO2ePerKg: 0.4 },
  cauliflower: { name: 'Cauliflower', category: 'vegetables', kgCO2ePerKg: 0.5 },
  mushroom: { name: 'Mushroom', category: 'vegetables', kgCO2ePerKg: 0.3 },
  tomato: { name: 'Tomato', category: 'vegetables', kgCO2ePerKg: 0.7 },
  onion: { name: 'Onion', category: 'vegetables', kgCO2ePerKg: 0.3 },
  carrot: { name: 'Carrot', category: 'vegetables', kgCO2ePerKg: 0.3 },
  cabbage: { name: 'Cabbage', category: 'vegetables', kgCO2ePerKg: 0.2 },
  squash: { name: 'Squash', category: 'vegetables', kgCO2ePerKg: 0.3 },
  
  // Nuts & Seeds
  peanuts: { name: 'Peanuts', category: 'nuts', kgCO2ePerKg: 1.1 },
  almonds: { name: 'Almonds', category: 'nuts', kgCO2ePerKg: 2.3 },
  
  // Oils & Fats
  olive_oil: { name: 'Olive Oil', category: 'oils', kgCO2ePerKg: 3.8 },
  vegetable_oil: { name: 'Vegetable Oil', category: 'oils', kgCO2ePerKg: 2.5 },
};

/**
 * Get emission factor for an ingredient by key
 */
export function getEmissionFactor(ingredientKey: string): number {
  return EMISSION_FACTORS[ingredientKey]?.kgCO2ePerKg ?? 0;
}

/**
 * Get average emission factor for an ingredient category
 */
export function getCategoryAverageEmission(category: IngredientCategory): number {
  const factorsInCategory = Object.values(EMISSION_FACTORS).filter(
    (f) => f.category === category
  );
  
  if (factorsInCategory.length === 0) return 0;
  
  const sum = factorsInCategory.reduce((acc, f) => acc + f.kgCO2ePerKg, 0);
  return sum / factorsInCategory.length;
}

/**
 * Search for emission factor by ingredient name (fuzzy match)
 */
export function findEmissionFactor(ingredientName: string): EmissionFactor | null {
  const normalized = ingredientName.toLowerCase();
  
  // Try exact match first
  const exactMatch = Object.values(EMISSION_FACTORS).find(
    (f) => f.name.toLowerCase() === normalized
  );
  if (exactMatch) return exactMatch;
  
  // Try partial match
  const partialMatch = Object.values(EMISSION_FACTORS).find((f) =>
    f.name.toLowerCase().includes(normalized) ||
    normalized.includes(f.name.toLowerCase())
  );
  
  return partialMatch ?? null;
}
