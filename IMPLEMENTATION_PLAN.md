# Implementation Plan: New Social Impact Tab Design ✅ COMPLETED

## Problem Statement
Redesign the Social Impact tab to show a cleaner, more focused view with:
- Two key metrics at the top (Total Meals provided, Organizations helped)
- Two-column layout with donations table and recipient organizations
- Filter buttons (Select dates, Filters) on each section

## Current State

### File: `src/app/(dashboard)/dashboard-2/components/customer-insights.tsx`

**Chart Type:** LineChart with 3 toggleable data series
- Financial Impact Over Time
- Data: `revenue`, `savings`, `economicValue` (€ amounts)
- Colors: Zipli lime green (#18E170), dark green (#024209), dark purple (#5A0057)
- Toggle switches to show/hide each series

**Key Metrics (Right Panel):**
1. Annual ROI: 1.6x
2. Operating Cost: €0.71/kg (-43% vs. before Zipli)
3. Economic Value: €3.6M (1,200,000 kg kept in the system)

**Data Arrays:**
- `receiverImpactData`: 6 months (Jan-Jun) with revenue/savings/economicValue
- `receiverTypesData`: 3 types (Food Banks: 24, Charities: 36, Community Centers: 8)
- `helsinkiDistrictsData`: 5 districts with higher meal counts (28,470; 19,230; 14,560; 11,230; 28,910)

## Original State (Commit: 3eb96e3)

**Chart Type:** BarChart with 3 stacked bars
- Receiver Growth Trends
- Data: `new`, `active`, `completed` (counts)
- Colors: CSS variables (--chart-1, --chart-2, --chart-3)
- No toggle controls

**Key Metrics (Right Panel):**
1. Active Receivers: 34 (+12.5% from last month)
2. Meals Distributed: 8,200 (+2.1% improvement)
3. Success Rate: 94.2% (+8.3% growth)

**Data Arrays:**
- `receiverImpactData`: 6 months with new/active/completed counts (smaller numbers: 12-28 range)
- `receiverTypesData`: 3 types (Food Banks: 12, Charities: 18, Community Centers: 4)
- `helsinkiDistrictsData`: 5 districts with lower meal counts (2,847; 1,923; 1,456; 1,123; 2,891)

## Changes Required

### In `src/app/(dashboard)/dashboard-2/components/customer-insights.tsx`:

1. **Imports:**
   - Remove: `LineChart, Line, ResponsiveContainer` from recharts
   - Remove: `Switch, Label` from UI components
   - Add back: `BarChart, Bar` to recharts imports
   - Add back: `Users, UserIcon, Utensils` to lucide-react imports

2. **Data Arrays:**
   - `receiverImpactData`: Change from revenue/savings/economicValue to new/active/completed
   - `chartConfig`: Change from financial metrics to new/active/completed with CSS variable colors
   - `receiverTypesData`: Reduce counts (24→12, 36→18, 8→4) and growth percentages
   - `helsinkiDistrictsData`: Reduce meal counts by factor of 10

3. **State:**
   - Remove: `showRevenue`, `showSavings`, `showEconomicValue` states

4. **Chart Section:**
   - Replace LineChart with BarChart
   - Change title from "Financial Impact Over Time" to "Receiver Growth Trends"
   - Change chart height from 300px to 375px
   - Remove ResponsiveContainer wrapper
   - Replace Line components with Bar components
   - Remove toggle switch controls section

5. **Key Metrics Cards:**
   - Card 1: "Annual ROI" → "Active Receivers" (1.6x → 34, with +12.5% from last month)
   - Card 2: "Operating Cost" → "Meals Distributed" (€0.71/kg → 8,200, with +2.1% improvement)
   - Card 3: "Economic Value" → "Success Rate" (€3.6M → 94.2%, with +8.3% growth)
   - Change icons: Keep TrendingUp for card 1, change Target→Utensils for card 2, keep Heart→Target for card 3

## Files to Modify
- `src/app/(dashboard)/dashboard-2/components/customer-insights.tsx` (complete revert to original state)

## Notes
- The change was introduced in commit `43e2855` ("update")
- The Types and Districts tabs remain unchanged
- No other files need modification
