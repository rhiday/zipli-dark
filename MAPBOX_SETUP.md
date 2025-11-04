# Mapbox Setup for Zipli Dashboard

## Quick Setup

1. **Get Mapbox Token:**
   - Go to [mapbox.com](https://mapbox.com)
   - Sign up for a free account
   - Go to your account page and copy your public token

2. **Add Environment Variable:**
   Create a `.env.local` file in the project root with:
   ```
   NEXT_PUBLIC_MAPBOX_TOKEN=your_actual_mapbox_token_here
   ```

3. **Restart Development Server:**
   ```bash
   pnpm dev
   ```

## Features

- Interactive map centered on Helsinki
- Sample data with 5 locations (4 donors, 2 receivers)
- Click markers to see detailed information
- Different icons for donors vs receivers
- Responsive design

## Sample Data

The map includes sample locations:
- S-Market Hakaniemi (supermarket)
- Fazer Café Kamppi (bakery)
- Hotel Kämp Kitchen (hotel)
- Helsinki Food Bank (receiver)
- Pelastusarmeija (receiver)

## Customization

To add your own data, edit `src/components/map/food-surplus-map.tsx` and update the `sampleData` object with your GeoJSON features.
