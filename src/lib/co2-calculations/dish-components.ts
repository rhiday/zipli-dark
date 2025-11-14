/**
 * Dish Component Breakdown System
 * 
 * This module handles:
 * 1. Identifying main protein and dish type
 * 2. Assigning component mass shares based on dish type
 * 3. Breaking down dishes into ingredient components
 */

import type { IngredientCategory } from './emission-factors';

export interface DishComponent {
  ingredientKey: string;
  ingredientName: string;
  category: IngredientCategory;
  massShare: number; // 0-1, represents percentage of total dish weight
}

export interface DishBreakdown {
  dishName: string;
  dishType: DishType;
  totalWeightKg: number;
  components: DishComponent[];
}

export type DishType =
  | 'meat_main'        // Meat as primary protein
  | 'fish_main'        // Fish as primary protein
  | 'poultry_main'     // Poultry as primary protein
  | 'vegetarian_main'  // Plant-based proteins
  | 'soup'             // Liquid-based dishes
  | 'casserole'        // Baked dishes with mixed components
  | 'stew'             // Slow-cooked mixed dishes
  | 'salad'            // Raw or lightly cooked vegetables
  | 'grain_bowl'       // Grain-based with toppings
  | 'pasta_dish';      // Pasta-based dishes

/**
 * Standard component mass shares for different dish types
 */
export const DISH_TYPE_TEMPLATES: Record<DishType, DishComponent[]> = {
  meat_main: [
    { ingredientKey: 'beef', ingredientName: 'Meat', category: 'beef', massShare: 0.40 },
    { ingredientKey: 'potato', ingredientName: 'Starch/Sides', category: 'vegetables', massShare: 0.35 },
    { ingredientKey: 'carrot', ingredientName: 'Vegetables', category: 'vegetables', massShare: 0.20 },
    { ingredientKey: 'vegetable_oil', ingredientName: 'Fats/Oils', category: 'oils', massShare: 0.05 },
  ],
  
  fish_main: [
    { ingredientKey: 'fish_white', ingredientName: 'Fish', category: 'fish', massShare: 0.35 },
    { ingredientKey: 'potato', ingredientName: 'Starch', category: 'vegetables', massShare: 0.35 },
    { ingredientKey: 'carrot', ingredientName: 'Vegetables', category: 'vegetables', massShare: 0.25 },
    { ingredientKey: 'vegetable_oil', ingredientName: 'Fats/Oils', category: 'oils', massShare: 0.05 },
  ],
  
  poultry_main: [
    { ingredientKey: 'chicken', ingredientName: 'Poultry', category: 'poultry', massShare: 0.40 },
    { ingredientKey: 'potato', ingredientName: 'Starch', category: 'vegetables', massShare: 0.35 },
    { ingredientKey: 'carrot', ingredientName: 'Vegetables', category: 'vegetables', massShare: 0.20 },
    { ingredientKey: 'vegetable_oil', ingredientName: 'Fats/Oils', category: 'oils', massShare: 0.05 },
  ],
  
  vegetarian_main: [
    { ingredientKey: 'chickpeas', ingredientName: 'Legumes', category: 'legumes', massShare: 0.30 },
    { ingredientKey: 'potato', ingredientName: 'Starch', category: 'vegetables', massShare: 0.25 },
    { ingredientKey: 'carrot', ingredientName: 'Vegetables', category: 'vegetables', massShare: 0.30 },
    { ingredientKey: 'tomato', ingredientName: 'Sauce/Base', category: 'vegetables', massShare: 0.10 },
    { ingredientKey: 'vegetable_oil', ingredientName: 'Fats/Oils', category: 'oils', massShare: 0.05 },
  ],
  
  soup: [
    { ingredientKey: 'chicken', ingredientName: 'Protein', category: 'poultry', massShare: 0.20 },
    { ingredientKey: 'potato', ingredientName: 'Vegetables/Starch', category: 'vegetables', massShare: 0.25 },
    { ingredientKey: 'carrot', ingredientName: 'Vegetables', category: 'vegetables', massShare: 0.15 },
    { ingredientKey: 'milk', ingredientName: 'Liquid Base', category: 'dairy', massShare: 0.35 },
    { ingredientKey: 'vegetable_oil', ingredientName: 'Fats', category: 'oils', massShare: 0.05 },
  ],
  
  casserole: [
    { ingredientKey: 'beef_ground', ingredientName: 'Protein', category: 'beef', massShare: 0.30 },
    { ingredientKey: 'potato', ingredientName: 'Starch', category: 'vegetables', massShare: 0.35 },
    { ingredientKey: 'onion', ingredientName: 'Vegetables', category: 'vegetables', massShare: 0.15 },
    { ingredientKey: 'cheese', ingredientName: 'Dairy', category: 'dairy', massShare: 0.15 },
    { ingredientKey: 'vegetable_oil', ingredientName: 'Fats', category: 'oils', massShare: 0.05 },
  ],
  
  stew: [
    { ingredientKey: 'beef', ingredientName: 'Meat', category: 'beef', massShare: 0.35 },
    { ingredientKey: 'potato', ingredientName: 'Starch', category: 'vegetables', massShare: 0.25 },
    { ingredientKey: 'carrot', ingredientName: 'Vegetables', category: 'vegetables', massShare: 0.20 },
    { ingredientKey: 'tomato', ingredientName: 'Sauce Base', category: 'vegetables', massShare: 0.15 },
    { ingredientKey: 'vegetable_oil', ingredientName: 'Fats', category: 'oils', massShare: 0.05 },
  ],
  
  salad: [
    { ingredientKey: 'cabbage', ingredientName: 'Leafy Greens', category: 'vegetables', massShare: 0.50 },
    { ingredientKey: 'tomato', ingredientName: 'Vegetables', category: 'vegetables', massShare: 0.25 },
    { ingredientKey: 'carrot', ingredientName: 'Root Vegetables', category: 'vegetables', massShare: 0.15 },
    { ingredientKey: 'olive_oil', ingredientName: 'Dressing', category: 'oils', massShare: 0.10 },
  ],
  
  grain_bowl: [
    { ingredientKey: 'rice', ingredientName: 'Grain Base', category: 'grains', massShare: 0.40 },
    { ingredientKey: 'chickpeas', ingredientName: 'Protein', category: 'legumes', massShare: 0.20 },
    { ingredientKey: 'carrot', ingredientName: 'Vegetables', category: 'vegetables', massShare: 0.30 },
    { ingredientKey: 'vegetable_oil', ingredientName: 'Fats', category: 'oils', massShare: 0.10 },
  ],
  
  pasta_dish: [
    { ingredientKey: 'pasta', ingredientName: 'Pasta', category: 'grains', massShare: 0.45 },
    { ingredientKey: 'beef_ground', ingredientName: 'Protein', category: 'beef', massShare: 0.25 },
    { ingredientKey: 'tomato', ingredientName: 'Sauce', category: 'vegetables', massShare: 0.20 },
    { ingredientKey: 'cheese', ingredientName: 'Cheese', category: 'dairy', massShare: 0.05 },
    { ingredientKey: 'olive_oil', ingredientName: 'Oil', category: 'oils', massShare: 0.05 },
  ],
};

/**
 * Identify dish type from dish name (Finnish dishes)
 */
export function identifyDishType(dishName: string): DishType {
  const name = dishName.toLowerCase();
  
  // Soups
  if (name.includes('keitto') || name.includes('soup')) return 'soup';
  
  // Casseroles
  if (name.includes('laatikko') || name.includes('kiusaus') || name.includes('gratin')) {
    return 'casserole';
  }
  
  // Salads
  if (name.includes('salaatti') || name.includes('salad')) return 'salad';
  
  // Pasta dishes
  if (name.includes('pasta') || name.includes('makaroni') || name.includes('spagetti')) {
    return 'pasta_dish';
  }
  
  // Identify protein type
  if (name.includes('nauda') || name.includes('beef') || name.includes('pihvi')) {
    return 'meat_main';
  }
  if (name.includes('kala') || name.includes('lohi') || name.includes('fish') || name.includes('salmon')) {
    return 'fish_main';
  }
  if (name.includes('broiler') || name.includes('kana') || name.includes('kalkku') || 
      name.includes('chicken') || name.includes('turkey')) {
    return 'poultry_main';
  }
  
  // Vegetarian indicators
  if (name.includes('kasvi') || name.includes('tofu') || name.includes('kikherne') ||
      name.includes('papu') || name.includes('sieni') || name.includes('vegetarian')) {
    return 'vegetarian_main';
  }
  
  // Default to vegetarian if no meat detected
  return 'vegetarian_main';
}

/**
 * Create a dish breakdown with component mass shares
 */
export function createDishBreakdown(
  dishName: string,
  totalWeightKg: number,
  customComponents?: DishComponent[]
): DishBreakdown {
  const dishType = identifyDishType(dishName);
  const components = customComponents ?? DISH_TYPE_TEMPLATES[dishType];
  
  return {
    dishName,
    dishType,
    totalWeightKg,
    components: components.map(c => ({
      ...c,
      // Normalize mass shares to sum to 1.0
      massShare: c.massShare / components.reduce((sum, comp) => sum + comp.massShare, 0),
    })),
  };
}

/**
 * Get component weights in kg from a dish breakdown
 */
export function getComponentWeights(breakdown: DishBreakdown): Array<{
  ingredientKey: string;
  ingredientName: string;
  category: IngredientCategory;
  weightKg: number;
}> {
  return breakdown.components.map(component => ({
    ingredientKey: component.ingredientKey,
    ingredientName: component.ingredientName,
    category: component.category,
    weightKg: breakdown.totalWeightKg * component.massShare,
  }));
}
