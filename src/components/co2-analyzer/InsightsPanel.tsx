"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Lightbulb, Target, AlertTriangle, CheckCircle2, TrendingUp } from "lucide-react"
import type { AnalysisResult } from "@/app/api/analyze-surplus/route"

interface InsightsPanelProps {
  data: AnalysisResult
}

export function InsightsPanel({ data }: InsightsPanelProps) {
  // Sort by surplus CO2 for the breakdown
  const sortedCategories = [...data.categories]
    .filter(cat => cat.surplus_co2_kg > 0)
    .sort((a, b) => b.surplus_co2_kg - a.surplus_co2_kg)

  const totalSurplusCO2 = data.totals.total_surplus_co2_kg || 0

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Insights Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-amber-500" />
            Key Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {data.insights.map((insight, index) => (
              <li key={index} className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                <span className="text-sm">{insight}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Recommendations Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-green-500" />
            Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {data.recommendations.map((rec, index) => (
              <li key={index} className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                <span className="text-sm">{rec}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Surplus Breakdown */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Surplus Breakdown by Category
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sortedCategories.map((category) => {
              const leftoverRate = category.surplus_estimate?.leftover_rate_percent || 0
              const progressWidth = totalSurplusCO2 > 0 
                ? (category.surplus_co2_kg / totalSurplusCO2) * 100 
                : 0

              return (
                <div key={category.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-medium capitalize">{category.name}</span>
                      <span className="text-xs px-2 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-full">
                        {leftoverRate.toFixed(0)}% leftover
                      </span>
                      <span className="text-xs text-muted-foreground">
                        ({category.items.length} items)
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-semibold text-green-600 dark:text-green-400">
                        {category.surplus_co2_kg.toFixed(1)} kg CO₂e saved
                      </span>
                      <span className="text-xs text-muted-foreground ml-2">
                        ({category.surplus_mass_kg.toFixed(1)} kg surplus)
                      </span>
                    </div>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 rounded-full transition-all"
                      style={{ width: `${progressWidth}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>
                      Prepared: {category.prepared_mass_kg.toFixed(1)} kg → 
                      Surplus: {category.surplus_mass_kg.toFixed(1)} kg
                    </span>
                    {category.surplus_estimate?.reasoning && (
                      <span className="italic">{category.surplus_estimate.reasoning}</span>
                    )}
                  </div>
                  {category.items.length > 0 && (
                    <p className="text-xs text-muted-foreground">
                      Items: {category.items.slice(0, 4).join(", ")}
                      {category.items.length > 4 && ` +${category.items.length - 4} more`}
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Leftover Rate Notes */}
      {data.categorization_notes && data.categorization_notes.length > 0 && (
        <Card className="md:col-span-2 bg-muted/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Leftover Rate Assumptions</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-xs text-muted-foreground space-y-1">
              {data.categorization_notes.map((note, index) => (
                <li key={index}>• {note}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

