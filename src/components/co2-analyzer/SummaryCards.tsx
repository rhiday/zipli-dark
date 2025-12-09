"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Scale, TrendingUp, Package, Archive, Percent, Euro } from "lucide-react"
import type { AnalysisResult } from "@/app/api/analyze-surplus/route"

interface SummaryCardsProps {
  data: AnalysisResult
}

export function SummaryCards({ data }: SummaryCardsProps) {
  const { totals } = data
  
  // Use new surplus fields, with fallback for backwards compatibility
  const preparedMass = totals.total_prepared_mass_kg ?? 0
  const surplusMass = totals.total_surplus_mass_kg ?? 0
  const surplusCO2 = totals.total_surplus_co2_kg ?? 0
  const leftoverRate = totals.average_leftover_rate_percent ?? 0
  
  // Equivalents based on SURPLUS (what we actually rescue)
  const treesEquivalent = (surplusCO2 / 21).toFixed(1)
  const carKmEquivalent = (surplusCO2 / 0.21).toFixed(0)

  const PRICE_PER_KG = 4 // €4 per kg assumption
  const productionCost = surplusMass * PRICE_PER_KG

  return (
    <div className="space-y-4">
      {/* Main metrics row */}
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
        {/* Prepared Food */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                <Package className="h-5 w-5 text-slate-600 dark:text-slate-400" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">Prepared</p>
                <p className="text-xl font-bold">{preparedMass.toFixed(1)} kg</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Leftover Rate */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                <Percent className="h-5 w-5 text-slate-600 dark:text-slate-400" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">Leftover Rate</p>
                <p className="text-xl font-bold">{leftoverRate.toFixed(0)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Surplus (Rescuable) */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                <Archive className="h-5 w-5 text-slate-600 dark:text-slate-400" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">Surplus (Rescuable)</p>
                <p className="text-xl font-bold">{surplusMass.toFixed(1)} kg</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CO2 Saved */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                <TrendingUp className="h-5 w-5 text-slate-600 dark:text-slate-400" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">CO₂ Saved</p>
                <p className="text-xl font-bold">{surplusCO2.toFixed(1)} kg</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Items Analyzed */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                <Scale className="h-5 w-5 text-slate-600 dark:text-slate-400" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">Menu Items</p>
                <p className="text-xl font-bold">{totals.items_analyzed}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Production Cost */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                <Euro className="h-5 w-5 text-slate-600 dark:text-slate-400" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">Production Cost</p>
                <p className="text-xl font-bold">€{productionCost.toFixed(0)}</p>
                <p className="text-xs text-muted-foreground">@€4/kg</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Equivalence cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardContent className="p-5">
            <p className="text-sm font-medium text-muted-foreground">🌳 Environmental Impact</p>
            <p className="mt-2 text-lg">
              Rescuing this surplus saves CO₂ equal to <span className="font-bold">{treesEquivalent} trees</span> absorbing carbon for a year
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <p className="text-sm font-medium text-muted-foreground">🚗 Car Travel Equivalent</p>
            <p className="mt-2 text-lg">
              Same as avoiding <span className="font-bold">{carKmEquivalent} km</span> of car travel
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Explanation card */}
      <Card className="bg-muted/50">
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground">
            <strong>How we calculate:</strong> We estimate that ~{leftoverRate.toFixed(0)}% of prepared food ({preparedMass.toFixed(1)} kg) 
            becomes surplus ({surplusMass.toFixed(1)} kg). By rescuing this surplus instead of letting it go to waste, 
            we save {surplusCO2.toFixed(1)} kg of CO₂ emissions. Leftover rates vary by dish type: 
            salads (~25%), popular mains (~10%), soups (~12%).
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
