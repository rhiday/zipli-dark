"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Euro,
  Leaf,
  TrendingDown,
  Utensils,
  ShoppingCart,
  Trash2,
  ArrowRight,
  Truck,
  Package,
  Users,
  Info,
} from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const RESTAURANT_PRESETS = [
  { label: "Small restaurant (50 meals/day)", monthlyOrders: 3500, avgFoodCost: 4.2, wastePercent: 18, mealsPerDay: 50 },
  { label: "Medium restaurant (150 meals/day)", monthlyOrders: 7200, avgFoodCost: 3.8, wastePercent: 20, mealsPerDay: 150 },
  { label: "Large restaurant (300 meals/day)", monthlyOrders: 14000, avgFoodCost: 3.5, wastePercent: 22, mealsPerDay: 300 },
  { label: "Hotel restaurant (500 meals/day)", monthlyOrders: 24000, avgFoodCost: 4.5, wastePercent: 15, mealsPerDay: 500 },
  { label: "Custom", monthlyOrders: 0, avgFoodCost: 0, wastePercent: 0, mealsPerDay: 0 },
]

const CO2_PER_KG_FOOD_WASTE = 2.5 // kg CO2e per kg food waste (LUKE Finland)
const DISPOSAL_COST_PER_KG = 0.15 // EUR per kg disposal
const KG_PER_MEAL = 0.4 // average kg of food per meal

export default function CalculatorPage() {
  const [preset, setPreset] = useState("1")
  const [monthlyOrdersKg, setMonthlyOrdersKg] = useState(7200)
  const [avgFoodCostPerKg, setAvgFoodCostPerKg] = useState(3.8)
  const [currentWastePercent, setCurrentWastePercent] = useState(20)
  const [targetWastePercent, setTargetWastePercent] = useState(12)
  const [locations, setLocations] = useState(1)

  const results = useMemo(() => {
    const currentWasteKg = monthlyOrdersKg * (currentWastePercent / 100)
    const targetWasteKg = monthlyOrdersKg * (targetWastePercent / 100)
    const wasteReductionKg = currentWasteKg - targetWasteKg

    // Procurement savings (less over-ordering)
    const procurementSavings = wasteReductionKg * avgFoodCostPerKg

    // Disposal cost savings
    const disposalSavings = wasteReductionKg * DISPOSAL_COST_PER_KG

    // Total monthly savings per location
    const monthlySavingsPerLocation = procurementSavings + disposalSavings
    const annualSavingsPerLocation = monthlySavingsPerLocation * 12

    // Impact metrics
    const co2AvoidedMonthly = wasteReductionKg * CO2_PER_KG_FOOD_WASTE
    const mealsRedirectedMonthly = Math.floor(wasteReductionKg * 0.6 / KG_PER_MEAL) // 60% of reduced waste redirectable
    const co2AvoidedAnnual = co2AvoidedMonthly * 12
    const mealsRedirectedAnnual = mealsRedirectedMonthly * 12

    // Multi-location
    const totalMonthlySavings = monthlySavingsPerLocation * locations
    const totalAnnualSavings = annualSavingsPerLocation * locations
    const totalCo2Annual = co2AvoidedAnnual * locations
    const totalMealsAnnual = mealsRedirectedAnnual * locations

    // Reverse logistics value (Suppilog trucks)
    const truckTripsAvoidedMonthly = Math.ceil(wasteReductionKg / 500) * locations // 1 trip per 500kg
    const reverseLogisticsSavings = truckTripsAvoidedMonthly * 85 // ~85 EUR per dedicated waste pickup saved

    return {
      currentWasteKg,
      targetWasteKg,
      wasteReductionKg,
      procurementSavings,
      disposalSavings,
      monthlySavingsPerLocation,
      annualSavingsPerLocation,
      co2AvoidedMonthly,
      co2AvoidedAnnual,
      mealsRedirectedMonthly,
      mealsRedirectedAnnual,
      totalMonthlySavings,
      totalAnnualSavings,
      totalCo2Annual,
      totalMealsAnnual,
      truckTripsAvoidedMonthly,
      reverseLogisticsSavings,
      locations,
    }
  }, [monthlyOrdersKg, avgFoodCostPerKg, currentWastePercent, targetWastePercent, locations])

  const handlePresetChange = (value: string) => {
    setPreset(value)
    const idx = parseInt(value)
    if (idx < RESTAURANT_PRESETS.length - 1) {
      const p = RESTAURANT_PRESETS[idx]
      setMonthlyOrdersKg(p.monthlyOrders)
      setAvgFoodCostPerKg(p.avgFoodCost)
      setCurrentWastePercent(p.wastePercent)
    }
  }

  return (
    <TooltipProvider>
      <div className="flex-1 space-y-6 px-6 pt-4 pb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Cross-Match Savings Calculator</h1>
          <p className="text-muted-foreground mt-1">
            See how combining Suppilog ordering data with Zipli waste tracking creates instant value for restaurant buyers.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-5">
          {/* Input Panel */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Your Restaurant Profile
              </CardTitle>
              <CardDescription>Adjust the inputs or pick a preset</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label>Restaurant type</Label>
                <Select value={preset} onValueChange={handlePresetChange}>
                  <SelectTrigger className="cursor-pointer">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {RESTAURANT_PRESETS.map((p, i) => (
                      <SelectItem key={i} value={String(i)} className="cursor-pointer">
                        {p.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  Monthly food orders (kg)
                  <Tooltip>
                    <TooltipTrigger><Info className="h-3.5 w-3.5 text-muted-foreground" /></TooltipTrigger>
                    <TooltipContent>Total kg ordered through Suppilog per month</TooltipContent>
                  </Tooltip>
                </Label>
                <Input
                  type="number"
                  value={monthlyOrdersKg}
                  onChange={(e) => { setMonthlyOrdersKg(Number(e.target.value)); setPreset("4") }}
                  className="tabular-nums"
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  Avg. food cost (EUR/kg)
                  <Tooltip>
                    <TooltipTrigger><Info className="h-3.5 w-3.5 text-muted-foreground" /></TooltipTrigger>
                    <TooltipContent>Average cost per kg of food ordered</TooltipContent>
                  </Tooltip>
                </Label>
                <Input
                  type="number"
                  step="0.1"
                  value={avgFoodCostPerKg}
                  onChange={(e) => { setAvgFoodCostPerKg(Number(e.target.value)); setPreset("4") }}
                  className="tabular-nums"
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  Current waste ratio (%)
                  <Tooltip>
                    <TooltipTrigger><Info className="h-3.5 w-3.5 text-muted-foreground" /></TooltipTrigger>
                    <TooltipContent>What % of ordered food becomes waste today</TooltipContent>
                  </Tooltip>
                </Label>
                <div className="flex items-center gap-3">
                  <Input
                    type="range"
                    min={5}
                    max={40}
                    value={currentWastePercent}
                    onChange={(e) => setCurrentWastePercent(Number(e.target.value))}
                    className="flex-1 cursor-pointer"
                  />
                  <Badge variant="destructive" className="w-14 justify-center tabular-nums">
                    {currentWastePercent}%
                  </Badge>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  Target waste ratio with Zipli (%)
                  <Tooltip>
                    <TooltipTrigger><Info className="h-3.5 w-3.5 text-muted-foreground" /></TooltipTrigger>
                    <TooltipContent>Achievable waste % with data-driven ordering optimisation</TooltipContent>
                  </Tooltip>
                </Label>
                <div className="flex items-center gap-3">
                  <Input
                    type="range"
                    min={3}
                    max={currentWastePercent - 1}
                    value={Math.min(targetWastePercent, currentWastePercent - 1)}
                    onChange={(e) => setTargetWastePercent(Number(e.target.value))}
                    className="flex-1 cursor-pointer"
                  />
                  <Badge className="w-14 justify-center tabular-nums bg-green-600">
                    {targetWastePercent}%
                  </Badge>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Number of locations
                </Label>
                <Input
                  type="number"
                  min={1}
                  max={500}
                  value={locations}
                  onChange={(e) => setLocations(Math.max(1, Number(e.target.value)))}
                  className="tabular-nums"
                />
              </div>
            </CardContent>
          </Card>

          {/* Results Panel */}
          <div className="lg:col-span-3 space-y-6">
            {/* Headline Results */}
            <div className="grid gap-4 sm:grid-cols-2">
              <Card className="border-green-500/30 bg-green-500/5">
                <CardHeader className="pb-2">
                  <CardDescription className="flex items-center gap-1.5">
                    <Euro className="h-4 w-4" />
                    Annual savings {locations > 1 && `(${locations} locations)`}
                  </CardDescription>
                  <CardTitle className="text-4xl font-bold tabular-nums text-green-500">
                    {results.totalAnnualSavings.toLocaleString('fi-FI', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {results.annualSavingsPerLocation.toLocaleString('fi-FI', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })} per location/year
                  </p>
                </CardContent>
              </Card>

              <Card className="border-blue-500/30 bg-blue-500/5">
                <CardHeader className="pb-2">
                  <CardDescription className="flex items-center gap-1.5">
                    <Leaf className="h-4 w-4" />
                    CO2 emissions avoided / year
                  </CardDescription>
                  <CardTitle className="text-4xl font-bold tabular-nums text-blue-500">
                    {(results.totalCo2Annual / 1000).toFixed(1)} t
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {results.co2AvoidedAnnual.toLocaleString()} kg CO2e per location
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Flow visualization */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">How cross-matching creates value</CardTitle>
                <CardDescription>Suppilog ordering data + Zipli waste data = actionable insights</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 items-center">
                  {/* Before */}
                  <div className="space-y-3 p-4 rounded-lg border bg-red-500/5 border-red-500/20">
                    <p className="text-sm font-medium text-red-400">Without cross-match</p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Ordered</span>
                        <span className="tabular-nums font-medium">{monthlyOrdersKg.toLocaleString()} kg</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Wasted</span>
                        <span className="tabular-nums font-medium text-red-400">{results.currentWasteKg.toLocaleString()} kg</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Waste ratio</span>
                        <Badge variant="destructive" className="tabular-nums">{currentWastePercent}%</Badge>
                      </div>
                    </div>
                  </div>

                  {/* Arrow */}
                  <div className="flex flex-col items-center gap-2">
                    <ArrowRight className="h-8 w-8 text-primary" />
                    <p className="text-xs text-center text-muted-foreground">Zipli AI analyses patterns,<br />optimises orders</p>
                  </div>

                  {/* After */}
                  <div className="space-y-3 p-4 rounded-lg border bg-green-500/5 border-green-500/20">
                    <p className="text-sm font-medium text-green-400">With cross-match</p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Ordered</span>
                        <span className="tabular-nums font-medium">{(monthlyOrdersKg - results.wasteReductionKg).toLocaleString()} kg</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Wasted</span>
                        <span className="tabular-nums font-medium text-green-400">{results.targetWasteKg.toLocaleString()} kg</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Waste ratio</span>
                        <Badge className="tabular-nums bg-green-600">{targetWastePercent}%</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Detailed breakdown */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription className="flex items-center gap-1.5">
                    <TrendingDown className="h-4 w-4" />
                    Waste reduced / month
                  </CardDescription>
                  <CardTitle className="text-2xl tabular-nums">
                    {(results.wasteReductionKg * locations).toLocaleString()} kg
                  </CardTitle>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardDescription className="flex items-center gap-1.5">
                    <Package className="h-4 w-4" />
                    Procurement savings
                  </CardDescription>
                  <CardTitle className="text-2xl tabular-nums">
                    {(results.procurementSavings * locations).toLocaleString('fi-FI', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })} /mo
                  </CardTitle>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardDescription className="flex items-center gap-1.5">
                    <Utensils className="h-4 w-4" />
                    Meals redirected / year
                  </CardDescription>
                  <CardTitle className="text-2xl tabular-nums">
                    {results.totalMealsAnnual.toLocaleString()}
                  </CardTitle>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardDescription className="flex items-center gap-1.5">
                    <Truck className="h-4 w-4" />
                    Reverse logistics savings
                  </CardDescription>
                  <CardTitle className="text-2xl tabular-nums">
                    {(results.reverseLogisticsSavings * 12).toLocaleString('fi-FI', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })} /yr
                  </CardTitle>
                </CardHeader>
              </Card>
            </div>

            {/* Suppilog-specific value props */}
            <Card className="bg-primary/5 border-primary/20">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Trash2 className="h-5 w-5" />
                  Why this matters for Suppilog buyers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-1.5">
                    <p className="text-sm font-medium">Ordering intelligence</p>
                    <p className="text-xs text-muted-foreground">
                      Cross-matching Suppilog order history with Zipli waste logs reveals which products are consistently over-ordered. AI-generated alerts suggest reduced standing orders.
                    </p>
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-sm font-medium">Reverse logistics</p>
                    <p className="text-xs text-muted-foreground">
                      Suppilog delivery trucks return empty. Surplus food rides back on the same routes — the &quot;breaking point&quot; solution for restaurant waste pickup.
                    </p>
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-sm font-medium">CSRD compliance</p>
                    <p className="text-xs text-muted-foreground">
                      Zipli generates auditable waste prevention certificates. Food diverted to human consumption counts as &quot;Waste Prevention&quot; — the highest EU waste hierarchy tier.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
