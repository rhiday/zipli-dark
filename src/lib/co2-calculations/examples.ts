/**
 * CO2 Calculation Examples
 * 
 * This file demonstrates both the simplified and component-based approaches
 * using dishes from your existing data.
 */

import {
  calculateCO2ComponentBased,
  calculateCO2Simplified,
  calculateTotalCO2Saved,
  formatCO2,
  getCO2Equivalents,
  compareCO2Impact,
} from './index';

// Example 1: Compare both methods for a single dish
export function exampleCompareMethodsBeefStew() {
  const dishName = 'Naudanlihapta';
  const weightKg = 2.5;
  
  console.log('=== Example 1: Beef Stew (Naudanlihapta) ===\n');
  
  // Component-based (theoretical approach)
  const componentResult = calculateCO2ComponentBased(dishName, weightKg);
  console.log('📊 Component-Based Method:');
  console.log(`Total CO2: ${formatCO2(componentResult.totalCO2eKg)}`);
  console.log('\nBreakdown by ingredient:');
  componentResult.breakdown.forEach(c => {
    console.log(`  • ${c.componentName}: ${formatCO2(c.co2eKg)} (${c.percentage.toFixed(1)}%)`);
    console.log(`    Cooked: ${c.cookedWeightKg.toFixed(2)}kg → Raw: ${c.rawWeightKg.toFixed(2)}kg`);
  });
  
  // Simplified method (direct emission factor)
  const simplifiedResult = calculateCO2Simplified(dishName, weightKg, 27.0);
  console.log('\n⚡ Simplified Method:');
  console.log(`Total CO2: ${formatCO2(simplifiedResult.totalCO2eKg)}`);
  
  console.log('\n💡 Difference:');
  const diff = componentResult.totalCO2eKg - simplifiedResult.totalCO2eKg;
  console.log(`${formatCO2(Math.abs(diff))} (${((Math.abs(diff) / simplifiedResult.totalCO2eKg) * 100).toFixed(1)}%)`);
  console.log('Component-based is more accurate as it accounts for all ingredients.\n');
}

// Example 2: Calculate for vegetarian dishes
export function exampleVegetarianDishes() {
  console.log('=== Example 2: Vegetarian Dishes ===\n');
  
  const dishes = [
    { name: 'Kikherne pihvit', weightKg: 1.9 },
    { name: 'Thai curry tofu', weightKg: 5.725 },
    { name: 'Kidneypapu-ratatouille', weightKg: 7.0 },
  ];
  
  dishes.forEach(dish => {
    const result = calculateCO2ComponentBased(dish.name, dish.weightKg);
    console.log(`${dish.name} (${dish.weightKg}kg):`);
    console.log(`  CO2: ${formatCO2(result.totalCO2eKg)}`);
    console.log(`  Per kg: ${formatCO2(result.totalCO2eKg / dish.weightKg)}/kg\n`);
  });
}

// Example 3: Total CO2 saved from multiple donations
export function exampleTotalDonations() {
  console.log('=== Example 3: Total CO2 Saved from Donations ===\n');
  
  const donations = [
    { dishName: 'Naudanlihapta', weightKg: 2.5 },
    { dishName: 'Kalakeitto', weightKg: 7.06 },
    { dishName: 'Kasvis-makaronilaatikko', weightKg: 3.91 },
    { dishName: 'Broilerinakkikastikketta', weightKg: 4.77 },
    { dishName: 'Thai curry tofu', weightKg: 5.725 },
  ];
  
  const totals = calculateTotalCO2Saved(donations, true);
  
  console.log(`Total donations: ${totals.donationCount}`);
  console.log(`Total weight: ${totals.totalWeightKg.toFixed(2)} kg`);
  console.log(`Total CO2 saved: ${formatCO2(totals.totalCO2eKg)}`);
  console.log(`Average: ${formatCO2(totals.averageCO2PerKg)}/kg\n`);
  
  console.log('Per donation:');
  totals.results.forEach(result => {
    console.log(`  • ${result.dishName}: ${formatCO2(result.totalCO2eKg)}`);
  });
  
  // Show equivalents
  const equivalents = getCO2Equivalents(totals.totalCO2eKg);
  console.log('\n🌍 Impact Equivalents:');
  console.log(`  • Driving ${equivalents.carKm.toFixed(0)} km by car`);
  console.log(`  • ${equivalents.treesNeeded.toFixed(1)} trees for 1 year`);
  console.log(`  • Charging phone ${equivalents.phoneCharges.toFixed(0)} times\n`);
}

// Example 4: Compare protein choices
export function exampleProteinComparison() {
  console.log('=== Example 4: Protein Choice Impact ===\n');
  
  const weightKg = 1.0;
  const comparisons = [
    { from: 'beef', to: 'chicken', name: 'Beef → Chicken' },
    { from: 'beef', to: 'tofu', name: 'Beef → Tofu' },
    { from: 'chicken', to: 'chickpeas', name: 'Chicken → Chickpeas' },
    { from: 'salmon', to: 'tofu', name: 'Salmon → Tofu' },
  ];
  
  console.log(`Replacing 1kg of protein:\n`);
  
  comparisons.forEach(({ from, to, name }) => {
    const result = compareCO2Impact(from, to, weightKg);
    console.log(`${name}:`);
    console.log(`  Saves: ${formatCO2(result.savingsKg)} (${result.savingsPercent.toFixed(1)}% reduction)`);
    console.log(`  ${formatCO2(result.referenceCO2)} → ${formatCO2(result.alternativeCO2)}\n`);
  });
}

// Example 5: Detailed breakdown for fish soup
export function exampleFishSoupBreakdown() {
  console.log('=== Example 5: Detailed Breakdown - Fish Soup ===\n');
  
  const dishName = 'Kylmäsavulohikeitto';
  const weightKg = 9.4;
  
  const result = calculateCO2ComponentBased(dishName, weightKg);
  
  console.log(`Dish: ${dishName} (${weightKg} kg)`);
  console.log(`Type: ${result.method} calculation\n`);
  console.log(`Total CO2: ${formatCO2(result.totalCO2eKg)}\n`);
  
  console.log('Component Breakdown:');
  console.log('─'.repeat(80));
  console.log('Component        | Cooked (kg) | Raw (kg) | Factor (kg CO2/kg) | CO2 (kg) | %');
  console.log('─'.repeat(80));
  
  result.breakdown.forEach(c => {
    const component = c.componentName.padEnd(15);
    const cooked = c.cookedWeightKg.toFixed(2).padStart(11);
    const raw = c.rawWeightKg.toFixed(2).padStart(8);
    const factor = c.emissionFactorKgCO2ePerKg.toFixed(2).padStart(18);
    const co2 = c.co2eKg.toFixed(2).padStart(8);
    const pct = c.percentage.toFixed(1).padStart(5);
    
    console.log(`${component} | ${cooked} | ${raw} | ${factor} | ${co2} | ${pct}`);
  });
  console.log('─'.repeat(80) + '\n');
  
  const equivalents = getCO2Equivalents(result.totalCO2eKg);
  console.log('💡 This CO2 saving is equivalent to:');
  console.log(`   • Not driving ${equivalents.carKm.toFixed(0)} km`);
  console.log(`   • Planting ${equivalents.treesNeeded.toFixed(1)} trees\n`);
}

// Example 6: Using existing data structure
export function exampleWithExistingData() {
  console.log('=== Example 6: Integration with Existing Data ===\n');
  
  // Simulating your existing foodItemsWithMetrics structure
  const existingData = [
    { name: "Kikherne pihvit", quantity: 1.9, co2Emission: 0.8 },
    { name: "Naudanlihapta", quantity: 2.5, co2Emission: 27.0 },
    { name: "Thai curry tofu", quantity: 5.725, co2Emission: 0.6 },
  ];
  
  console.log('Comparing simplified (existing) vs component-based:\n');
  
  existingData.forEach(item => {
    // Your existing simplified calculation
    const simplified = item.quantity * item.co2Emission;
    
    // New component-based calculation
    const componentBased = calculateCO2ComponentBased(item.name, item.quantity);
    
    console.log(`${item.name}:`);
    console.log(`  Simplified:      ${formatCO2(simplified)}`);
    console.log(`  Component-based: ${formatCO2(componentBased.totalCO2eKg)}`);
    
    const diff = componentBased.totalCO2eKg - simplified;
    const diffPct = (Math.abs(diff) / simplified) * 100;
    console.log(`  Difference:      ${diff >= 0 ? '+' : ''}${formatCO2(diff)} (${diffPct.toFixed(1)}%)\n`);
  });
}

// Run all examples
export function runAllExamples() {
  exampleCompareMethodsBeefStew();
  console.log('\n' + '='.repeat(80) + '\n');
  
  exampleVegetarianDishes();
  console.log('='.repeat(80) + '\n');
  
  exampleTotalDonations();
  console.log('='.repeat(80) + '\n');
  
  exampleProteinComparison();
  console.log('='.repeat(80) + '\n');
  
  exampleFishSoupBreakdown();
  console.log('='.repeat(80) + '\n');
  
  exampleWithExistingData();
}
