import { openai } from '@ai-sdk/openai'
import { generateObject } from 'ai'
import { z } from 'zod'

const SYSTEM_PROMPT = `You are a food waste and climate impact analyst for Zipli, a Finnish food rescue platform that connects restaurants with food banks to reduce waste.

## Your Task
Analyze food menu data and calculate:
1. **Total prepared food** - full batch sizes for each menu item
2. **Estimated surplus/leftovers** - the portion that typically goes uneaten
3. **CO2 impact** - both potential (if all wasted) and actual savings (from rescuing surplus)

## Understanding Finnish Menu Items
Common Finnish dish patterns:
- "keitto" = soup, "pata" = stew/casserole, "kastike" = sauce
- "broileri/kana" = chicken, "nauta" = beef, "sika/porsas" = pork
- "lohi" = salmon, "kala" = fish, "silakka" = Baltic herring
- "kasvis/vege/vegaani" = vegetable/vegan, "kasvispihvi" = veggie patty
- "riisi" = rice, "pasta" = pasta, "peruna" = potato
- "salaatti" = salad, "keitetty" = boiled, "paistettu" = fried

## Categories & CO2 Emission Factors (kg CO2eq per kg food)

| Category | Factor | Examples |
|----------|--------|----------|
| beef | 27.0 | Beef stew, naudanliha, lasagna with beef |
| pork | 12.1 | Pork schnitzel, porsaanleike, ham |
| poultry | 6.9 | Chicken curry, broileri, turkey |
| fish | 6.1 | Salmon, lohi, fish soup, kalakeitto |
| dairy | 3.2 | Cheese dishes, cream sauces |
| mixed | 5.0 | Combined dishes, unclear protein |
| vegetables | 2.0 | Salads, veggie soups, plant-based |
| grains | 1.4 | Rice, pasta, bread, oatmeal |
| sides | 2.5 | Potatoes, fries, accompaniments |

## Batch Size Estimation (if mass not provided)
For institutional kitchens (schools, corporate cafeterias):
- Main course (pääruoka): 12-18 kg per menu item
- Soup (keitto): 15-25 kg (higher volume)
- Side dish (lisäke): 8-12 kg
- Salad: 6-10 kg
- Dessert (jälkiruoka): 5-8 kg

## 🆕 LEFTOVER/SURPLUS ESTIMATION RULES

Estimate what percentage of prepared food typically becomes surplus based on:

### By Dish Popularity (institutional settings)
| Dish Type | Leftover Rate | Reasoning |
|-----------|---------------|-----------|
| Popular proteins (chicken, meatballs) | 8-12% | High demand |
| Average proteins (pork, fish) | 12-18% | Moderate demand |
| Less popular (liver, certain fish) | 20-30% | Lower demand |
| Vegetarian mains | 15-25% | Variable demand |

### By Dish Category
| Category | Leftover Rate | Reasoning |
|----------|---------------|-----------|
| Soups (keitto) | 10-15% | Easy to store, reheat |
| Casseroles (pata, laatikko) | 12-18% | Good shelf life |
| Sauces/stews (kastike) | 10-15% | Flexible portions |
| Salads (salaatti) | 20-30% | Wilts quickly, overproduced |
| Sides (lisäke) | 10-15% | Often overproduced |
| Desserts (jälkiruoka) | 8-12% | Usually popular |

### By Day of Week (if date available)
- Monday: +5% more leftovers (people ease into week)
- Friday: +10% more leftovers (people leave early)
- Mid-week (Tue-Thu): baseline rates

## Calculation Method

For each menu item:
1. \`prepared_mass_kg\` = estimated batch size
2. \`leftover_rate\` = estimated % based on rules above
3. \`surplus_mass_kg\` = prepared_mass × leftover_rate
4. \`prepared_co2_kg\` = prepared_mass × emission_factor (potential waste)
5. \`surplus_co2_kg\` = surplus_mass × emission_factor (actual rescuable)

## Output Requirements
- Always provide BOTH prepared totals AND surplus estimates
- Explain leftover rate assumptions in categorization_notes
- Insights should reference surplus specifically
- Recommendations should focus on reducing leftovers AND rescuing what remains`

const SurplusEstimateSchema = z.object({
  leftover_rate_percent: z.number().describe('Estimated leftover rate (5-35%)'),
  reasoning: z.string().describe('Brief explanation for this rate'),
})

const AnalysisSchema = z.object({
  categories: z.array(z.object({
    name: z.string().describe('Category: beef, pork, fish, poultry, dairy, vegetables, grains, sides, or mixed'),
    // Prepared (full batch) metrics
    prepared_mass_kg: z.number().describe('Total prepared/cooked mass in kg'),
    prepared_co2_kg: z.number().describe('CO2 if all food were wasted'),
    // Surplus (leftover) metrics
    surplus_estimate: SurplusEstimateSchema,
    surplus_mass_kg: z.number().describe('Estimated leftover mass in kg'),
    surplus_co2_kg: z.number().describe('CO2 saved by rescuing surplus'),
    // Item details
    emission_factor: z.number().describe('CO2 factor used (kg CO2/kg food)'),
    items: z.array(z.string()).describe('List of food items in this category'),
    item_count: z.number().describe('Number of menu items'),
  })),
  flows: z.array(z.object({
    source: z.string().describe('Source category (protein type)'),
    target: z.string().describe('Dish type (soup, casserole, etc.)'),
    value: z.number().describe('Surplus CO2eq value'),
    mass: z.number().describe('Surplus mass in kg'),
  })),
  totals: z.object({
    // Prepared totals
    total_prepared_mass_kg: z.number().describe('Total mass of all prepared food'),
    total_prepared_co2_kg: z.number().describe('CO2 if all food were wasted'),
    // Surplus totals (what we actually rescue)
    total_surplus_mass_kg: z.number().describe('Total estimated leftover mass'),
    total_surplus_co2_kg: z.number().describe('CO2 saved by rescuing all surplus'),
    // Averages
    average_leftover_rate_percent: z.number().describe('Weighted average leftover rate'),
    co2_per_kg: z.number().describe('Average CO2 intensity'),
    items_analyzed: z.number().describe('Number of menu items analyzed'),
    // Impact categories
    highest_impact_category: z.string().describe('Category with highest surplus CO2'),
    highest_leftover_category: z.string().describe('Category with highest leftover rate'),
  }),
  // Per-item breakdown for detailed analysis
  item_breakdown: z.array(z.object({
    item_name: z.string(),
    category: z.string(),
    prepared_mass_kg: z.number(),
    leftover_rate_percent: z.number(),
    surplus_mass_kg: z.number(),
    surplus_co2_kg: z.number(),
  })).optional().describe('Detailed per-item breakdown'),
  insights: z.array(z.string()).describe('3-5 specific findings about surplus patterns'),
  recommendations: z.array(z.string()).describe('3-5 actionable recommendations'),
  categorization_notes: z.array(z.string()).optional().describe('Notes on leftover rate assumptions'),
})

export type AnalysisResult = z.infer<typeof AnalysisSchema>

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { data, summary } = body

    if (!data || !Array.isArray(data.rows)) {
      return Response.json(
        { error: 'Invalid data format. Expected { data: { rows: [...] } }' },
        { status: 400 }
      )
    }

    const userPrompt = `## Food Menu Analysis Request

### Context
${summary}

### Menu Data (${data.rows.length} items)
\`\`\`json
${JSON.stringify(data.rows.slice(0, 100), null, 2)}
\`\`\`
${data.rows.length > 100 ? `\n(Showing first 100 of ${data.rows.length} items)` : ''}

### Analysis Instructions

1. **Categorize** each menu item by primary protein/ingredient
2. **Estimate batch sizes** if mass not provided (institutional kitchen sizes)
3. **Estimate leftover rates** for each item based on:
   - Dish type (soup vs salad vs main)
   - Protein popularity (chicken popular, fish less so)
   - Day of week if available
4. **Calculate both**:
   - PREPARED totals (full batch = potential waste if not eaten)
   - SURPLUS totals (estimated leftovers = what Zipli can rescue)
5. **Generate insights** specifically about surplus patterns
6. **Recommend** ways to reduce leftovers AND maximize rescue

Remember: 
- PREPARED = total food cooked (if all wasted, this CO2 is lost)
- SURPLUS = estimated leftovers (what food rescue actually saves)
- Zipli rescues the SURPLUS, not the full prepared amount`

    const result = await generateObject({
      model: openai('gpt-4o'),
      schema: AnalysisSchema,
      system: SYSTEM_PROMPT,
      prompt: userPrompt,
    })

    return Response.json({ analysis: result.object })
  } catch (error) {
    console.error('Analysis error:', error)
    return Response.json(
      { error: error instanceof Error ? error.message : 'Analysis failed' },
      { status: 500 }
    )
  }
}
