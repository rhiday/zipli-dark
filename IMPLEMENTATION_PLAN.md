# Implementation Plan: Add New Location Data to Map

## Problem Statement
Colleague pushed three new JSON files with food producer and supermarket data to the main branch (commit `22cf26c`). We need to fetch these files and display them on our existing map as **donor locations** (green markers with appropriate icons for their type).

## Current State

### Local Map Component
**File**: `src/components/map/food-surplus-map.tsx`
- Currently loads only `/data/dashboard-data.json` (donors and receivers)
- Has `getLocationStyle()` function that assigns icons based on type:
  - Student/staff/school restaurants: fork/knife, coffee, building icons
  - All donors use **green color** (#024209)
  - Receivers use purple (#5A0057)
- Displays 2 legend items: Donors and Receivers

### New Data Files on Remote
1. **`public/data/foodproducers.json`**
   - 10 producers: Valio, Fazer, Paulig, Solar Foods, etc.
   - Properties: id, name, type: "producer", address, phone, website, products[], status
   - GeoJSON format

2. **`public/data/helsinkiresturants.json`**
   - Student/staff restaurants: Alvari, TUAS, Dipoli, etc.
   - Properties: id, name, type: "student restaurant", cuisine, donations, meals, etc.
   - GeoJSON format

3. **`public/data/shopshelsinki.json`**
   - 10 supermarkets: Prisma, S-Market, Lidl, K-Supermarket
   - Properties: id, name, type: "supermarket" or "hypermarket", address, phone, website
   - GeoJSON format

## Proposed Changes

### Step 1: Fetch the three new JSON files (no code changes)
```bash
git checkout origin/main -- public/data/foodproducers.json
git checkout origin/main -- public/data/helsinkiresturants.json
git checkout origin/main -- public/data/shopshelsinki.json
```

### Step 2: Add new icon imports
**File**: `src/components/map/food-surplus-map.tsx` (line 8)

Add `Sprout` and `ShoppingCart` icons:
```typescript
import { Package, Users, X, UtensilsCrossed, Coffee, School, Building2, Flame, Sprout, ShoppingCart } from 'lucide-react'
```

### Step 3: Update getLocationStyle() to handle new types
**File**: `src/components/map/food-surplus-map.tsx` (after line 76, before student restaurant check)

Add cases for producer and supermarket types (all use green color):
```typescript
// Producer type
if (type === 'producer') {
  return {
    icon: Sprout,
    bgColor: '#024209',  // Same green as other donors
    label: 'Producer'
  }
}

// Supermarket/Hypermarket types
if (type === 'supermarket' || type === 'hypermarket') {
  return {
    icon: ShoppingCart,
    bgColor: '#024209',  // Same green as other donors
    label: type === 'hypermarket' ? 'Hypermarket' : 'Supermarket'
  }
}
```

### Step 4: Load the new data files in loadLocations()
**File**: `src/components/map/food-surplus-map.tsx` (inside loadLocations function, after receiverFeatures)

Add before the line `const allFeatures = [...donorFeatures, ...receiverFeatures]`:
```typescript
// Load additional location data
const extraFeatures: LocationData[] = []

// Load restaurants
try {
  const restaurantsResponse = await fetch('/data/helsinkiresturants.json')
  if (restaurantsResponse.ok) {
    const restaurantsData = await restaurantsResponse.json()
    if (restaurantsData.features) {
      extraFeatures.push(...(restaurantsData.features as LocationData[]))
    }
  }
} catch (error) {
  console.error('Failed to load restaurant data:', error)
}

// Load producers
try {
  const producersResponse = await fetch('/data/foodproducers.json')
  if (producersResponse.ok) {
    const producersData = await producersResponse.json()
    if (producersData.features) {
      extraFeatures.push(...(producersData.features as LocationData[]))
    }
  }
} catch (error) {
  console.error('Failed to load producer data:', error)
}

// Load shops
try {
  const shopsResponse = await fetch('/data/shopshelsinki.json')
  if (shopsResponse.ok) {
    const shopsData = await shopsResponse.json()
    if (shopsData.features) {
      extraFeatures.push(...(shopsData.features as LocationData[]))
    }
  }
} catch (error) {
  console.error('Failed to load shop data:', error)
}
```

Then update the allFeatures line to include extraFeatures:
```typescript
const allFeatures: LocationData[] = [...donorFeatures, ...receiverFeatures, ...extraFeatures]
```

## Summary of Changes
1. Fetch 3 new JSON files from remote
2. Import `Sprout` and `ShoppingCart` icons
3. Add producer and supermarket cases to `getLocationStyle()` (both use green)
4. Add 3 fetch calls in `loadLocations()` to load new data files
5. Include new locations in the map's feature array

## Result
Map will show:
- All existing donors and receivers
- **+ 10 new producers** (green markers with Sprout icon)
- **+ new student/staff restaurants** (green markers with existing restaurant icons)
- **+ 10 new supermarkets** (green markers with ShoppingCart icon)

All new locations will be **green** (donor color) with **different icons** to distinguish their type.

## Testing
- [ ] Navigate to map page
- [ ] Verify no console errors
- [ ] Confirm map shows more locations than before
- [ ] Check that producer markers have Sprout icon (green)
- [ ] Check that supermarket markers have ShoppingCart icon (green)
- [ ] Click markers to verify popups work (will show existing popup format)
- [ ] Verify map auto-adjusts to fit all markers
