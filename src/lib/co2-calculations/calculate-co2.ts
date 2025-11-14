/**
 * CO2 Emission Calculation Engine
 * 
 * Implements the theoretical calculation:
 * Total CO₂e = Σᵢ(raw_massᵢ × emission_factorᵢ)
 * 
 * Steps:
 * 1. Identify dish type and break down into components
 * 2. Assign mass shares to each component
 * 3. Convert cooked weights to raw equivalents
 * 4. Look up emission factors for each ingredient
 * 5. Calculate and sum emissions
 */

import { getEmissionFactor, getCategoryAverageEmission } from './emission-factors';
import { convertCookedToRaw } from './conversion-factors';
import { createDishBreakdown, getComponentWeights } from './dish-components';
import type { DishComponent } from './dish-components';

export interface CO2CalculationResult {
  totalCO2eKg: number;
  breakdown: ComponentEmission[];
  method: 'component-based' | 'simplified';
  dishName: string;
  totalWeightKg: number;
}

export interface ComponentEmission {
  componentName: string;
  cookedWeightKg: number;
  rawWeightKg: number;
  emissionFactorKgCO2ePerKg: number;
  co2eKg: number;
  percentage: number;
}

/**
 * Calculate CO2 emissions using component-based method (theoretical approach)
 * 
 * This is the most accurate method, breaking down dishes into ingredients,
 * converting to raw weights, and applying emission factors.
 */
export function calculateCO2ComponentBased(
  dishName: string,
  totalWeightKg: number,
  customComponents?: DishComponent[]
): CO2CalculationResult {
  // Step 1 & 2: Create dish breakdown with component mass shares
  const breakdown = createDishBreakdown(dishName, totalWeightKg, customComponents);
  const componentWeights = getComponentWeights(breakdown);
  
  // Steps 3-5: Calculate emissions for each component
  const componentEmissions: ComponentEmission[] = componentWeights.map(component => {
    // Step 3: Convert cooked weight to raw weight
    const rawWeightKg = convertCookedToRaw(component.weightKg, component.ingredientKey);
    
    // Step 4: Look up emission factor
    const emissionFactor = getEmissionFactor(component.ingredientKey) || 
                          getCategoryAverageEmission(component.category);
    
    // Step 5: Calculate component emission
    const co2eKg = rawWeightKg * emissionFactor;
    
    return {
      componentName: component.ingredientName,
      cookedWeightKg: component.weightKg,
      rawWeightKg,
      emissionFactorKgCO2ePerKg: emissionFactor,
      co2eKg,
      percentage: 0, // Will be calculated after summing
    };
  });
  
  // Sum total emissions
  const totalCO2eKg = componentEmissions.reduce((sum, c) => sum + c.co2eKg, 0);
  
  // Calculate percentages
  componentEmissions.forEach(c => {
    c.percentage = totalCO2eKg > 0 ? (c.co2eKg / totalCO2eKg) * 100 : 0;
  });
  
  return {
    totalCO2eKg,
    breakdown: componentEmissions,
    method: 'component-based',
    dishName,
    totalWeightKg,
  };
}

/**
 * Calculate CO2 emissions using simplified method (direct emission factor)
 * 
 * This is faster but less accurate, using pre-calculated emission factors
 * applied directly to the dish weight.
 */
export function calculateCO2Simplified(
  dishName: string,
  totalWeightKg: number,
  emissionFactorKgCO2ePerKg: number
): CO2CalculationResult {
  const totalCO2eKg = totalWeightKg * emissionFactorKgCO2ePerKg;
  
  return {
    totalCO2eKg,
    breakdown: [{
      componentName: dishName,
      cookedWeightKg: totalWeightKg,
      rawWeightKg: totalWeightKg,
      emissionFactorKgCO2ePerKg,
      co2eKg: totalCO2eKg,
      percentage: 100,
    }],
    method: 'simplified',
    dishName,
    totalWeightKg,
  };
}

/**
 * Calculate total CO2 saved from multiple food donations
 */
export function calculateTotalCO2Saved(
  donations: Array<{
    dishName: string;
    weightKg: number;
    emissionFactor?: number;
    customComponents?: DishComponent[];
  }>,
  useComponentBased: boolean = true
): {
  totalCO2eKg: number;
  totalWeightKg: number;
  donationCount: number;
  averageCO2PerKg: number;
  results: CO2CalculationResult[];
} {
  const results = donations.map(donation => {
    if (useComponentBased || !donation.emissionFactor) {
      return calculateCO2ComponentBased(
        donation.dishName,
        donation.weightKg,
        donation.customComponents
      );
    } else {
      return calculateCO2Simplified(
        donation.dishName,
        donation.weightKg,
        donation.emissionFactor
      );
    }
  });
  
  const totalCO2eKg = results.reduce((sum, r) => sum + r.totalCO2eKg, 0);
  const totalWeightKg = results.reduce((sum, r) => sum + r.totalWeightKg, 0);
  
  return {
    totalCO2eKg,
    totalWeightKg,
    donationCount: donations.length,
    averageCO2PerKg: totalWeightKg > 0 ? totalCO2eKg / totalWeightKg : 0,
    results,
  };
}

/**
 * Format CO2 value for display
 */
export function formatCO2(co2Kg: number): string {
  if (co2Kg >= 1000) {
    return `${(co2Kg / 1000).toFixed(2)} t CO₂e`;
  } else if (co2Kg >= 1) {
    return `${co2Kg.toFixed(2)} kg CO₂e`;
  } else {
    return `${(co2Kg * 1000).toFixed(0)} g CO₂e`;
  }
}

/**
 * Get CO2 impact equivalents for context
 */
export function getCO2Equivalents(co2Kg: number): {
  carKm: number;
  treesNeeded: number;
  phoneCharges: number;
} {
  return {
    carKm: co2Kg / 0.12, // Average car emits ~120g CO2/km
    treesNeeded: co2Kg / 21, // One tree absorbs ~21kg CO2/year
    phoneCharges: co2Kg / 0.008, // Charging a phone once = ~8g CO2
  };
}

/**
 * Compare CO2 impact between different protein choices
 */
export function compareCO2Impact(
  referenceProtein: string,
  alternativeProtein: string,
  weightKg: number = 1
): {
  referenceCO2: number;
  alternativeCO2: number;
  savingsKg: number;
  savingsPercent: number;
} {
  const refEmission = getEmissionFactor(referenceProtein);
  const altEmission = getEmissionFactor(alternativeProtein);
  
  const referenceCO2 = weightKg * refEmission;
  const alternativeCO2 = weightKg * altEmission;
  const savingsKg = referenceCO2 - alternativeCO2;
  const savingsPercent = referenceCO2 > 0 ? (savingsKg / referenceCO2) * 100 : 0;
  
  return {
    referenceCO2,
    alternativeCO2,
    savingsKg,
    savingsPercent,
  };
}
