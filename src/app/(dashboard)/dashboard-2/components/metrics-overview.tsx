"use client"

import { useEffect, useState } from "react"
import { 
  TrendingUp, 
  TrendingDown, 
  Package, 
  Users, 
  Utensils, 
  Leaf 
} from "lucide-react"
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

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

interface MetricsOverviewProps {
  timeRange: TimeRange
}

export function MetricsOverview({ timeRange }: MetricsOverviewProps) {
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
        
        switch (timeRange) {
          case "12months":
            metricsData = {
              foodDonated: `${baseMetrics.totalDonationsKg.toLocaleString()} kg`,
              activeDonors: baseMetrics.activeDonors.toString(),
              mealsSaved: baseMetrics.mealsSaved.toLocaleString(),
              co2Reduced: `${baseMetrics.co2Reduced.toLocaleString()} kg`,
              foodDonatedChange: "+18%",
              activeDonorsChange: "+12%",
              mealsSavedChange: "+22%",
              co2ReducedChange: "+18%",
              description: "Last 12 months"
            }
            break
          case "6months":
            metricsData = {
              foodDonated: `${Math.floor(baseMetrics.totalDonationsKg * 0.6).toLocaleString()} kg`,
              activeDonors: Math.floor(baseMetrics.activeDonors * 0.85).toString(),
              mealsSaved: Math.floor(baseMetrics.mealsSaved * 0.6).toLocaleString(),
              co2Reduced: `${Math.floor(baseMetrics.co2Reduced * 0.6).toLocaleString()} kg`,
              foodDonatedChange: "+15%",
              activeDonorsChange: "+10%",
              mealsSavedChange: "+18%",
              co2ReducedChange: "+15%",
              description: "Last 6 months"
            }
            break
          case "30days":
            metricsData = {
              foodDonated: `${Math.floor(baseMetrics.totalDonationsKg * 0.08).toLocaleString()} kg`,
              activeDonors: Math.floor(baseMetrics.activeDonors * 0.7).toString(),
              mealsSaved: Math.floor(baseMetrics.mealsSaved * 0.08).toLocaleString(),
              co2Reduced: `${Math.floor(baseMetrics.co2Reduced * 0.08).toLocaleString()} kg`,
              foodDonatedChange: "+12%",
              activeDonorsChange: "+8%",
              mealsSavedChange: "+14%",
              co2ReducedChange: "+12%",
              description: "Last 30 days"
            }
            break
          case "7days":
            metricsData = {
              foodDonated: `${Math.floor(baseMetrics.totalDonationsKg * 0.02).toLocaleString()} kg`,
              activeDonors: Math.floor(baseMetrics.activeDonors * 0.5).toString(),
              mealsSaved: Math.floor(baseMetrics.mealsSaved * 0.02).toLocaleString(),
              co2Reduced: `${Math.floor(baseMetrics.co2Reduced * 0.02).toLocaleString()} kg`,
              foodDonatedChange: "+8%",
              activeDonorsChange: "+5%",
              mealsSavedChange: "+10%",
              co2ReducedChange: "+8%",
              description: "Last 7 days"
            }
            break
          case "since-beginning":
            metricsData = {
              foodDonated: `${Math.floor(baseMetrics.totalDonationsKg * 2.5).toLocaleString()} kg`,
              activeDonors: baseMetrics.activeDonors.toString(),
              mealsSaved: Math.floor(baseMetrics.mealsSaved * 2.5).toLocaleString(),
              co2Reduced: `${Math.floor(baseMetrics.co2Reduced * 2.5).toLocaleString()} kg`,
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
      subfooter: "Helsinki restaurants leading"
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
      title: "CO₂ Reduced",
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
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs grid gap-3 grid-cols-2">
      {metricsCards.map((metric) => {
        const TrendIcon = metric.trend === "up" ? TrendingUp : TrendingDown
        
        return (
          <Card key={metric.title} className=" cursor-pointer">
            <CardHeader>
              <CardDescription>{metric.title}</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                {metric.value}
              </CardTitle>
              <CardAction>
                <Badge variant="outline">
                  <TrendIcon className="h-4 w-4" />
                  {metric.change}
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="line-clamp-1 flex gap-2 font-medium">
                {metric.footer} <TrendIcon className="size-4" />
              </div>
              <div className="text-muted-foreground">
                {metric.subfooter}
              </div>
            </CardFooter>
          </Card>
        )
      })}
    </div>
  )
}
