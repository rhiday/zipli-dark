# CO2 Calculation Methods: Comparison

## Your Question: Does the zipli-terminal approach match the theoretical calculation?

**Short Answer**: No, it's a **simplified approximation**.

## Detailed Comparison

### Zipli-Terminal Approach (Simplified)

```typescript
Total CO₂ = quantity (kg) × co2Emission (kg CO₂/kg)
```

**Example**: Beef dish (2.5 kg) with factor 27.0
```
2.5 kg × 27.0 = 67.5 kg CO₂e
```

**Characteristics**:
- ✅ Fast and simple
- ✅ No ingredient breakdown needed
- ❌ Less accurate
- ❌ No cooked-to-raw conversion
- ❌ Single emission factor per dish
- ❌ Doesn't show component contributions

---

### Theoretical Approach (Component-Based)

```typescript
Total CO₂e = Σᵢ(raw_massᵢ × emission_factorᵢ)
```

**Steps**:
1. **Identify dish type** → "Naudanlihapta" = meat_main
2. **Assign component mass shares**:
   - Beef: 40% (1.0 kg cooked)
   - Potato: 35% (0.875 kg cooked)
   - Vegetables: 20% (0.5 kg cooked)
   - Oil: 5% (0.125 kg cooked)

3. **Convert cooked → raw**:
   - Beef: 1.0 kg ÷ 0.75 = 1.33 kg raw
   - Potato: 0.875 kg ÷ 0.90 = 0.97 kg raw
   - Vegetables: 0.5 kg ÷ 0.92 = 0.54 kg raw
   - Oil: 0.125 kg (no change)

4. **Look up emission factors**:
   - Beef: 27.0 kg CO₂/kg
   - Potato: 0.3 kg CO₂/kg
   - Vegetables: 0.3 kg CO₂/kg
   - Oil: 2.5 kg CO₂/kg

5. **Calculate & sum**:
   - Beef: 1.33 × 27.0 = 35.91 kg CO₂e (53%)
   - Potato: 0.97 × 0.3 = 0.29 kg CO₂e (0.4%)
   - Vegetables: 0.54 × 0.3 = 0.16 kg CO₂e (0.2%)
   - Oil: 0.125 × 2.5 = 0.31 kg CO₂e (0.5%)
   - **Total: 36.67 kg CO₂e**

**Characteristics**:
- ✅ High accuracy
- ✅ Ingredient-level breakdown
- ✅ Accounts for cooking weight changes
- ✅ Shows which ingredients contribute most
- ❌ Slower computation
- ❌ Requires ingredient database

---

## Key Differences

| Aspect | Simplified | Component-Based |
|--------|-----------|----------------|
| **Formula** | `weight × factor` | `Σ(raw_weight × factor)` |
| **Beef dish result** | 67.5 kg CO₂e | 36.67 kg CO₂e |
| **Difference** | +84% overestimate | Actual breakdown |
| **Speed** | Very fast | Moderate |
| **Data required** | 1 factor | Multiple factors + conversions |
| **Accuracy** | Approximate | High |

## Why the Difference?

The simplified method assumes the **entire dish** has the emission factor of the **primary protein**. This overestimates because:

1. **Not all ingredients are beef**: Potatoes, vegetables, and oils have much lower emissions
2. **No weight conversion**: Ignores that meat shrinks when cooked (25% weight loss)
3. **Lumps everything together**: Can't identify high-impact components

## Which Should You Use?

### Use **Simplified** when:
- You need quick estimates
- You already have dish-level emission factors
- Speed is more important than precision
- You're showing aggregate statistics

### Use **Component-Based** when:
- You need accurate calculations
- You want to show ingredient breakdowns
- You're comparing dish choices
- You're optimizing recipes
- You need to justify numbers with data

## Real-World Example

**Chickpea Patties vs Beef Stew** (both 2.5 kg):

| Method | Chickpeas | Beef | Difference |
|--------|-----------|------|------------|
| Simplified | 2.0 kg CO₂e | 67.5 kg CO₂e | 65.5 kg |
| Component-Based | 1.8 kg CO₂e | 36.67 kg CO₂e | 34.87 kg |

The **relative difference** is similar (beef is much worse), but the **absolute values** differ significantly.

## Implementation in Your App

You now have **both methods** available:

```typescript
// Quick estimate (existing approach)
const quick = calculateCO2Simplified('Naudanlihapta', 2.5, 27.0);

// Accurate calculation (new approach)
const accurate = calculateCO2ComponentBased('Naudanlihapta', 2.5);

// Bulk calculations
const totals = calculateTotalCO2Saved(donations, useComponentBased=true);
```

## Recommendation

**Start with component-based** for your climate impact features. The accuracy difference matters when:
- Communicating savings to users
- Making environmental claims
- Comparing alternatives
- Building trust in your data

You can always fall back to simplified for:
- Quick previews
- When ingredient data is unavailable
- Performance-critical sections
