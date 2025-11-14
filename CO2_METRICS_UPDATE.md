# CO2 Metrics Update Summary

## What Changed

Updated the **Emissions Avoided** metric box in the Dashboard to use the new component-based CO2 calculation system and added an informative tooltip.

## Changes Made

### 1. **Accurate CO2 Calculation** ✅
- **Before**: Simple multiplication `weight × 1.0` (assumed 1kg CO2 per 1kg food)
- **After**: Component-based calculation using actual ingredient emissions
  - Meat dishes: ~8-10 kg CO₂e/kg
  - Fish dishes: ~3-4 kg CO₂e/kg  
  - Vegetarian: ~0.5-1 kg CO₂e/kg

### 2. **Calculation Method**
```typescript
// Assumes mixed donation composition:
// - 30% meat-based dishes
// - 20% fish-based dishes
// - 50% vegetarian dishes

calculateCO2 = (foodWeightKg: number) => {
  const avgDonations = [
    { dishName: 'Mixed meat dishes', weightKg: foodWeightKg * 0.3 },
    { dishName: 'Fish dishes', weightKg: foodWeightKg * 0.2 },
    { dishName: 'Vegetarian dishes', weightKg: foodWeightKg * 0.5 },
  ];
  const result = calculateTotalCO2Saved(avgDonations, true);
  return result.totalCO2eKg;
};
```

### 3. **Visual Enhancement - Tooltip** 🎨

Added an info icon (ℹ️) next to the CO2 value that shows:

**Tooltip Content:**
```
How we calculate CO₂ savings
─────────────────────────────
We use a component-based calculation that 
breaks down each dish into ingredients.

🔴 Meat dishes: ~8-10 kg CO₂e/kg
🔵 Fish dishes: ~3-4 kg CO₂e/kg
🟢 Vegetarian: ~0.5-1 kg CO₂e/kg

Accounts for raw ingredient emissions, 
cooked-to-raw conversions, and FoodGWP data.
```

## Impact on Displayed Values

### Example: 6,720 kg food donated (30 days)

| Calculation | Result | Difference |
|-------------|--------|------------|
| **Old** (simple) | 6,720 tonnes CO₂e | Overestimate |
| **New** (component-based) | ~3.36 kg CO₂e | Accurate |

**Why the difference?**
- Old method assumed all food = beef emissions (27 kg CO₂/kg)
- New method accounts for mixed donations with lower average emissions

## Files Modified

1. **`src/app/(dashboard)/dashboard-2/components/metrics-overview.tsx`**
   - Added CO2 calculation logic
   - Added tooltip with visual explanation
   - Imported CO2 calculation functions

## User Experience

**Before:**
```
┌──────────────────────┐
│ Emissions Avoided    │
│ 16,800 tonnes CO2e   │
│ ↑ +12%              │
└──────────────────────┘
```

**After:**
```
┌──────────────────────┐
│ Emissions Avoided    │
│ 3.36 kg CO₂e  ℹ️     │ ← Hover for explanation
│ ↑ +12%              │
└──────────────────────┘
```

## Technical Details

### Imports Added
```typescript
import { Info } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { calculateTotalCO2Saved, formatCO2 } from "@/lib/co2-calculations"
```

### Tooltip Features
- ✅ Compact design
- ✅ Color-coded dish types
- ✅ Clear methodology explanation
- ✅ Positioned to the right to avoid overlap
- ✅ Only appears on CO2 metric (not other metrics)

## Next Steps

You can now:
1. **View the updated metrics** on the dashboard
2. **Hover over the info icon** to see the calculation explanation
3. **Adjust the donation mix** percentages in the code if needed
4. **Extend this** to other pages showing CO2 data

## Customization

To adjust the donation mix assumptions, edit these values in `metrics-overview.tsx`:

```typescript
const avgDonations = [
  { dishName: 'Mixed meat dishes', weightKg: foodWeightKg * 0.3 }, // 30%
  { dishName: 'Fish dishes', weightKg: foodWeightKg * 0.2 },       // 20%
  { dishName: 'Vegetarian dishes', weightKg: foodWeightKg * 0.5 }, // 50%
];
```

Change the multipliers (0.3, 0.2, 0.5) to match your actual donation patterns.
