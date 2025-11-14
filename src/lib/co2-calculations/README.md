# CO2 Calculations Module

This module provides accurate CO2 emission calculations for food waste prevention. It implements both simplified and component-based calculation methods.

## Overview

The module implements the theoretical calculation formula:

```
Total CO₂e = Σᵢ(raw_massᵢ × emission_factorᵢ)
```

### Calculation Methods

1. **Component-Based (Theoretical)**: Most accurate, breaks dishes into ingredients
2. **Simplified**: Faster, uses pre-calculated emission factors

## Installation

The module is already integrated into your project at:
```
src/lib/co2-calculations/
```

## Usage Examples

### Basic Usage: Single Dish

```typescript
import { calculateCO2ComponentBased, formatCO2 } from '@/lib/co2-calculations';

// Calculate CO2 for beef stew (2.5 kg)
const result = calculateCO2ComponentBased('Naudanlihapta', 2.5);

console.log(formatCO2(result.totalCO2eKg)); // "67.50 kg CO₂e"
console.log(result.breakdown);
// [
//   { componentName: 'Meat', co2eKg: 36.0, percentage: 53.3%, ... },
//   { componentName: 'Starch', co2eKg: 28.1, percentage: 41.7%, ... },
//   ...
// ]
```

### Simplified Method

```typescript
import { calculateCO2Simplified } from '@/lib/co2-calculations';

// Using pre-calculated emission factor
const result = calculateCO2Simplified('Kikherne pihvit', 1.9, 0.8);
console.log(result.totalCO2eKg); // 1.52 kg CO₂e
```

### Multiple Donations

```typescript
import { calculateTotalCO2Saved } from '@/lib/co2-calculations';

const donations = [
  { dishName: 'Kalakeitto', weightKg: 7.06 },
  { dishName: 'Kasvis-makaronilaatikko', weightKg: 3.91 },
  { dishName: 'Thai curry tofu', weightKg: 5.725 },
];

const totals = calculateTotalCO2Saved(donations, true);
console.log(`Total CO2 saved: ${formatCO2(totals.totalCO2eKg)}`);
console.log(`From ${totals.donationCount} donations (${totals.totalWeightKg} kg)`);
```

### Custom Components

```typescript
import { calculateCO2ComponentBased } from '@/lib/co2-calculations';

// Define custom ingredient breakdown
const customComponents = [
  { ingredientKey: 'salmon', ingredientName: 'Salmon', category: 'fish', massShare: 0.50 },
  { ingredientKey: 'potato', ingredientName: 'Potatoes', category: 'vegetables', massShare: 0.30 },
  { ingredientKey: 'cream', ingredientName: 'Cream', category: 'dairy', massShare: 0.15 },
  { ingredientKey: 'vegetable_oil', ingredientName: 'Oil', category: 'oils', massShare: 0.05 },
];

const result = calculateCO2ComponentBased(
  'Kylmäsavulohikeitto',
  9.4,
  customComponents
);
```

### CO2 Equivalents

```typescript
import { getCO2Equivalents, formatCO2 } from '@/lib/co2-calculations';

const co2Kg = 67.5;
const equivalents = getCO2Equivalents(co2Kg);

console.log(`${formatCO2(co2Kg)} is equivalent to:`);
console.log(`- Driving ${equivalents.carKm.toFixed(0)} km by car`);
console.log(`- ${equivalents.treesNeeded.toFixed(1)} trees needed for 1 year`);
console.log(`- Charging a phone ${equivalents.phoneCharges.toFixed(0)} times`);
```

### Compare Protein Choices

```typescript
import { compareCO2Impact } from '@/lib/co2-calculations';

const comparison = compareCO2Impact('beef', 'chickpeas', 1.0);

console.log(`Replacing 1kg beef with chickpeas saves:`);
console.log(`${comparison.savingsKg.toFixed(2)} kg CO₂e`);
console.log(`(${comparison.savingsPercent.toFixed(1)}% reduction)`);
```

### Integration with Existing Data

```typescript
import { foodItemsWithMetrics } from '@/lib/demo-data';
import { calculateCO2ComponentBased, calculateCO2Simplified } from '@/lib/co2-calculations';

// Use component-based for new calculations
const accurateResults = foodItemsWithMetrics.map(item => 
  calculateCO2ComponentBased(item.name, item.quantity)
);

// Or use simplified with existing emission factors
const quickResults = foodItemsWithMetrics.map(item =>
  calculateCO2Simplified(item.name, item.quantity, item.co2Emission)
);
```

## Module Structure

```
co2-calculations/
├── index.ts                  # Module exports
├── calculate-co2.ts          # Main calculation engine
├── emission-factors.ts       # FoodGWP database
├── conversion-factors.ts     # Cooked-to-raw conversions
├── dish-components.ts        # Dish breakdown templates
└── README.md                 # This file
```

## Key Differences: Component-Based vs Simplified

| Aspect | Component-Based | Simplified |
|--------|----------------|------------|
| Accuracy | High - ingredient level | Moderate - dish level |
| Speed | Slower | Fast |
| Data needed | Dish name, weight | Dish name, weight, emission factor |
| Conversions | Cooked → raw | None |
| Breakdown | Per ingredient | Single value |
| Use case | Detailed analysis | Quick estimates |

## Dish Type Detection

The module automatically detects dish types from Finnish names:

- **Soups**: "keitto" → `soup`
- **Casseroles**: "laatikko", "kiusaus", "gratin" → `casserole`
- **Salads**: "salaatti" → `salad`
- **Pasta**: "pasta", "makaroni" → `pasta_dish`
- **Proteins**: "nauda" (beef), "kala" (fish), "broiler" (chicken), etc.

## Emission Factor Sources

Values based on:
- FoodGWP database
- Research literature on food carbon footprints
- Average values for ingredient categories

## Contributing

To add new ingredients:
1. Add to `EMISSION_FACTORS` in `emission-factors.ts`
2. Add cooking conversion to `CONVERSION_FACTORS` in `conversion-factors.ts`
3. Update dish templates in `dish-components.ts` if needed
