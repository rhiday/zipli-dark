import { openai } from '@ai-sdk/openai'
import { generateText } from 'ai'
import type { AnalysisResult } from '@/app/api/analyze-surplus/route'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { message, analysisContext } = body as {
      message: string
      analysisContext: AnalysisResult
    }

    if (!message || !analysisContext) {
      return Response.json(
        { error: 'Missing message or analysis context' },
        { status: 400 }
      )
    }

    // Sort categories by surplus CO2 impact
    const sortedBySurplusCO2 = [...analysisContext.categories]
      .filter(c => c.surplus_co2_kg > 0)
      .sort((a, b) => b.surplus_co2_kg - a.surplus_co2_kg)

    // Sort by leftover rate
    const sortedByLeftoverRate = [...analysisContext.categories]
      .filter(c => c.surplus_estimate?.leftover_rate_percent > 0)
      .sort((a, b) => b.surplus_estimate.leftover_rate_percent - a.surplus_estimate.leftover_rate_percent)

    // Calculate rescue efficiency
    const rescueEfficiency = analysisContext.totals.total_prepared_mass_kg > 0
      ? (analysisContext.totals.total_surplus_mass_kg / analysisContext.totals.total_prepared_mass_kg * 100)
      : 0

    const systemPrompt = `You are a helpful food waste analyst for Zipli, a Finnish food rescue platform. You answer questions about menu analysis data, focusing on SURPLUS (leftovers) that can be rescued.

## Key Concepts
- **PREPARED** = Total food cooked (full batch)
- **SURPLUS** = Estimated leftovers (what Zipli can rescue)
- **Leftover Rate** = % of prepared food that becomes surplus

## Analysis Summary

### Overall Numbers
| Metric | Value |
|--------|-------|
| Total Prepared | ${analysisContext.totals.total_prepared_mass_kg.toFixed(1)} kg |
| Total Surplus (Rescuable) | ${analysisContext.totals.total_surplus_mass_kg.toFixed(1)} kg |
| Average Leftover Rate | ${analysisContext.totals.average_leftover_rate_percent.toFixed(1)}% |
| CO2 if All Wasted | ${analysisContext.totals.total_prepared_co2_kg.toFixed(1)} kg CO2e |
| **CO2 Saved by Rescue** | **${analysisContext.totals.total_surplus_co2_kg.toFixed(1)} kg CO2e** |

### Categories by Surplus CO2 Impact
${sortedBySurplusCO2.map((cat, i) => 
  `${i + 1}. **${cat.name}**: ${cat.surplus_co2_kg.toFixed(1)} kg CO2e saved (${cat.surplus_mass_kg.toFixed(1)} kg surplus from ${cat.prepared_mass_kg.toFixed(1)} kg prepared)`
).join('\n')}

### Categories by Leftover Rate (highest waste)
${sortedByLeftoverRate.map(cat => 
  `- **${cat.name}**: ${cat.surplus_estimate.leftover_rate_percent.toFixed(0)}% leftover rate — ${cat.surplus_estimate.reasoning}`
).join('\n')}

### Per-Item Details
${analysisContext.item_breakdown?.slice(0, 10).map(item =>
  `- ${item.item_name}: ${item.prepared_mass_kg.toFixed(1)}kg prepared → ${item.leftover_rate_percent}% leftover → ${item.surplus_mass_kg.toFixed(1)}kg surplus (${item.surplus_co2_kg.toFixed(1)} kg CO2e)`
).join('\n') || 'Detailed item breakdown not available'}

### Key Insights
${analysisContext.insights.map(i => `• ${i}`).join('\n')}

### Recommendations  
${analysisContext.recommendations.map(r => `• ${r}`).join('\n')}

### Leftover Rate Assumptions
${analysisContext.categorization_notes?.map(n => `• ${n}`).join('\n') || 'Standard institutional kitchen rates applied'}

## How to Answer Questions

1. **Surplus vs Prepared**: Always clarify which you're discussing
2. **Be specific**: Use actual numbers from the data
3. **Explain rates**: When discussing leftovers, explain WHY that rate was estimated
4. **Actionable advice**: Focus on reducing waste OR maximizing rescue
5. **Comparisons**: 
   - 1 kg CO2 ≈ 4 km car driving
   - 21 kg CO2 ≈ 1 tree absorbing CO2 for a year
   - Rescuing 10kg of beef surplus saves as much CO2 as not driving 1,125 km

## Example Q&A

Q: "How much food will be left over?"
A: "Based on typical institutional patterns, we estimate **${analysisContext.totals.total_surplus_mass_kg.toFixed(1)} kg** of surplus (${rescueEfficiency.toFixed(0)}% of the ${analysisContext.totals.total_prepared_mass_kg.toFixed(1)} kg prepared). The highest leftover rates are in ${sortedByLeftoverRate[0]?.name || 'salads'} at ${sortedByLeftoverRate[0]?.surplus_estimate.leftover_rate_percent.toFixed(0) || '25'}%."

Q: "Which dishes have the most waste?"
A: Look at categories with highest leftover_rate_percent and explain the reasoning.

Q: "How much CO2 does rescuing this save?"
A: The surplus CO2 value, with tree/car equivalents.`

    const result = await generateText({
      model: openai('gpt-4o-mini'),
      system: systemPrompt,
      prompt: message,
      maxTokens: 600,
    })

    return Response.json({ response: result.text })
  } catch (error) {
    console.error('Chat error:', error)
    return Response.json(
      { error: error instanceof Error ? error.message : 'Chat failed' },
      { status: 500 }
    )
  }
}
