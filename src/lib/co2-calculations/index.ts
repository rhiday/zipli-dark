/**
 * CO2 Calculations Module
 * 
 * Provides both simplified and component-based CO2 emission calculations
 * for food donations and waste prevention.
 */

// Main calculation functions
export {
  calculateCO2ComponentBased,
  calculateCO2Simplified,
  calculateTotalCO2Saved,
  formatCO2,
  getCO2Equivalents,
  compareCO2Impact,
  type CO2CalculationResult,
  type ComponentEmission,
} from './calculate-co2';

// Emission factors database
export {
  EMISSION_FACTORS,
  getEmissionFactor,
  getCategoryAverageEmission,
  findEmissionFactor,
  type EmissionFactor,
  type IngredientCategory,
} from './emission-factors';

// Conversion factors
export {
  CONVERSION_FACTORS,
  convertCookedToRaw,
  convertRawToCooked,
  getConversionFactor,
  type ConversionFactor,
} from './conversion-factors';

// Dish components
export {
  DISH_TYPE_TEMPLATES,
  identifyDishType,
  createDishBreakdown,
  getComponentWeights,
  type DishComponent,
  type DishBreakdown,
  type DishType,
} from './dish-components';
