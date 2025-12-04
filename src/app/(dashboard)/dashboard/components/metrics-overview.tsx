"use client"

import { useEffect, useState } from "react"
import { 
  TrendingUp, 
  TrendingDown, 
  Package, 
  Users, 
  Utensils, 
  Leaf,
  Activity,
  Calendar,
  Info,
} from "lucide-react"
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { calculateTotalCO2Saved, formatCO2 } from "@/lib/co2-calculations"

type TimeRange = "12months" | "6months" | "30days" | "7days" | "since-beginning"

interface MetricsData {
  foodDonated: string
  activeDonors: string
  mealsSaved: string
  co2Reduced: string
  foodDonatedChange: string
  activeDonorsChange: string
  mealsSavedChange: string
  co2ReducedChange: string
  description: string
}

export function MetricsOverview() {
  const [timeRange, setTimeRange] = useState<TimeRange>("30days")
  const [metrics, setMetrics] = useState<MetricsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadMetrics = async () => {
      try {
        const response = await fetch('/data/dashboard-data.json')
        const data = await response.json()
        
        // Calculate metrics based on time range
        const baseMetrics = data.metrics
        let metricsData: MetricsData
        
        // Helper function to calculate CO2 from food weight
        const calculateCO2 = (foodWeightKg: number) => {
          // Use component-based calculation with average dish composition
          // Assuming mixed donations (meat, fish, vegetarian)
          const avgDonations = [
            { dishName: 'Mixed meat dishes', weightKg: foodWeightKg * 0.3 },
            { dishName: 'Fish dishes', weightKg: foodWeightKg * 0.2 },
            { dishName: 'Vegetarian dishes', weightKg: foodWeightKg * 0.5 },
          ];
          const result = calculateTotalCO2Saved(avgDonations, true);
          return result.totalCO2eKg;
        };
        
        switch (timeRange) {
          case "12months":
            const co2_12m = calculateCO2(baseMetrics.totalDonationsKg * 5);
            metricsData = {
              foodDonated: `${(baseMetrics.totalDonationsKg * 5).toLocaleString()} kg`,
              activeDonors: (baseMetrics.activeDonors * 5).toString(),
              mealsSaved: (baseMetrics.mealsSaved * 5).toLocaleString(),
              co2Reduced: formatCO2(co2_12m),
              foodDonatedChange: "+18%",
              activeDonorsChange: "+12%",
              mealsSavedChange: "+22%",
              co2ReducedChange: "+18%",
              description: "Last 12 months"
            }
            break
          case "6months":
            const co2_6m = calculateCO2(Math.floor(baseMetrics.totalDonationsKg * 0.6 * 5));
            metricsData = {
              foodDonated: `${Math.floor(baseMetrics.totalDonationsKg * 0.6 * 5).toLocaleString()} kg`,
              activeDonors: Math.floor(baseMetrics.activeDonors * 0.85 * 5).toString(),
              mealsSaved: Math.floor(baseMetrics.mealsSaved * 0.6 * 5).toLocaleString(),
              co2Reduced: formatCO2(co2_6m),
              foodDonatedChange: "+15%",
              activeDonorsChange: "+10%",
              mealsSavedChange: "+18%",
              co2ReducedChange: "+15%",
              description: "Last 6 months"
            }
            break
          case "30days":
            const co2_30d = calculateCO2(Math.floor(baseMetrics.totalDonationsKg * 0.08 * 5));
            metricsData = {
              foodDonated: `${Math.floor(baseMetrics.totalDonationsKg * 0.08 * 5).toLocaleString()} kg`,
              activeDonors: Math.floor(baseMetrics.activeDonors * 0.7 * 5).toString(),
              mealsSaved: Math.floor(baseMetrics.mealsSaved * 0.08 * 5).toLocaleString(),
              co2Reduced: formatCO2(co2_30d),
              foodDonatedChange: "+12%",
              activeDonorsChange: "+8%",
              mealsSavedChange: "+14%",
              co2ReducedChange: "+12%",
              description: "Last 30 days"
            }
            break
          case "7days":
            const co2_7d = calculateCO2(Math.floor(baseMetrics.totalDonationsKg * 0.02 * 5));
            metricsData = {
              foodDonated: `${Math.floor(baseMetrics.totalDonationsKg * 0.02 * 5).toLocaleString()} kg`,
              activeDonors: Math.floor(baseMetrics.activeDonors * 0.5 * 5).toString(),
              mealsSaved: Math.floor(baseMetrics.mealsSaved * 0.02 * 5).toLocaleString(),
              co2Reduced: formatCO2(co2_7d),
              foodDonatedChange: "+8%",
              activeDonorsChange: "+5%",
              mealsSavedChange: "+10%",
              co2ReducedChange: "+8%",
              description: "Last 7 days"
            }
            break
          case "since-beginning":
            const co2_all = calculateCO2(Math.floor(baseMetrics.totalDonationsKg * 2.5 * 5));
            metricsData = {
              foodDonated: `${Math.floor(baseMetrics.totalDonationsKg * 2.5 * 5).toLocaleString()} kg`,
              activeDonors: (baseMetrics.activeDonors * 5).toString(),
              mealsSaved: Math.floor(baseMetrics.mealsSaved * 2.5 * 5).toLocaleString(),
              co2Reduced: formatCO2(co2_all),
              foodDonatedChange: "+25%",
              activeDonorsChange: "+18%",
              mealsSavedChange: "+28%",
              co2ReducedChange: "+25%",
              description: "All time"
            }
            break
        }
        
        setMetrics(metricsData)
      } catch (error) {
        console.error('Failed to load metrics:', error)
      } finally {
        setLoading(false)
      }
    }

    loadMetrics()
  }, [timeRange])

  if (loading || !metrics) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 @5xl:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="cursor-pointer">
            <CardHeader>
              <CardDescription>Loading...</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    )
  }
  
  const metricsCards = [
    {
      title: "Food Donated",
      value: metrics.foodDonated,
      description: metrics.description,
      change: metrics.foodDonatedChange,
      trend: "up" as const,
      icon: Package,
      footer: "Strong donation growth",
      subfooter: "Sodexo Helsinki branches leading"
    },
    {
      title: "Active Donors",
      value: metrics.activeDonors,
      description: "Restaurants & cafes",
      change: metrics.activeDonorsChange, 
      trend: "up" as const,
      icon: Users,
      footer: "Growing network",
      subfooter: "Student & staff restaurants"
    },
    {
      title: "Meals Saved",
      value: metrics.mealsSaved,
      description: "Equivalent meals",
      change: metrics.mealsSavedChange,
      trend: "up" as const, 
      icon: Utensils,
      footer: "More people fed",
      subfooter: "1 meal ≈ 0.4 kg food"
    },
    {
      title: "Emissions Avoided",
      value: metrics.co2Reduced,
      description: "Carbon footprint saved",
      change: metrics.co2ReducedChange,
      trend: "up" as const,
      icon: Leaf,
      footer: "Environmental impact",
      subfooter: "Diverted from landfills"
    },
  ]

  return (
    <Card className="from-primary/5 to-card bg-gradient-to-t shadow-xs">
      <CardHeader className="flex flex-col gap-2 pb-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Key Metrics
          </CardTitle>
          <CardDescription className="mt-1.5">
            Real-time platform performance
          </CardDescription>
        </div>
        <div className="flex items-center gap-3">
          <Label htmlFor="metrics-time-range" className="flex items-center gap-2 text-xs sm:text-sm font-medium">
            <Calendar className="h-4 w-4" />
            Time Range:
          </Label>
          <Select value={timeRange} onValueChange={(v) => setTimeRange(v as TimeRange)}>
            <SelectTrigger id="metrics-time-range" className="w-[140px] sm:w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent align="end">
              <SelectItem value="12months">12 months</SelectItem>
              <SelectItem value="6months">6 months</SelectItem>
              <SelectItem value="30days">30 days</SelectItem>
              <SelectItem value="7days">7 days</SelectItem>
              <SelectItem value="since-beginning">Since beginning</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <TooltipProvider>
          <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs grid gap-3 grid-cols-2">
            {metricsCards.map((metric) => {
              const TrendIcon = metric.trend === "up" ? TrendingUp : TrendingDown
              const isCO2Metric = metric.title === "Emissions Avoided"
              
              return (
                <Card key={metric.title} className="cursor-pointer">
                  <CardHeader className="pb-2">
                    <CardDescription>{metric.title}</CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums flex items-center gap-2">
                      {metric.value}
                      {isCO2Metric && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent side="right" className="max-w-xs p-4">
                            <div className="space-y-3">
                              <div>
                                <p className="font-semibold text-sm mb-1">How we calculate CO₂ savings</p>
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                  We use a component-based calculation that breaks down each dish into ingredients.
                                </p>
                              </div>
                              <div className="space-y-1.5">
                                <div className="flex items-center gap-2 text-xs">
                                  <div className="h-1.5 w-1.5 rounded-full bg-red-500" />
                                  <span>Meat dishes: ~8-10 kg CO₂e/kg</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs">
                                  <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                                  <span>Fish dishes: ~3-4 kg CO₂e/kg</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs">
                                  <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                                  <span>Vegetarian: ~0.5-1 kg CO₂e/kg</span>
                                </div>
                              </div>
                              <div className="pt-2 border-t border-border">
                                <p className="text-xs text-muted-foreground">
                                  Accounts for raw ingredient emissions, cooked-to-raw conversions, and FoodGWP data.
                                </p>
                              </div>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </CardTitle>
                    <CardAction>
                      <Badge variant="outline">
                        <TrendIcon className="h-4 w-4" />
                        {metric.change}
                      </Badge>
                    </CardAction>
                  </CardHeader>
                  <CardFooter className="flex-col items-start gap-1 text-sm pt-2">
                    <div className="line-clamp-1 flex gap-2 font-medium">
                      {metric.footer} <TrendIcon className="size-4" />
                    </div>
                    <div className="text-muted-foreground text-xs">
                      {metric.subfooter}
                    </div>
                  </CardFooter>
                </Card>
              )
            })}
          </div>
        </TooltipProvider>
      </CardContent>
    </Card>
  )
}
