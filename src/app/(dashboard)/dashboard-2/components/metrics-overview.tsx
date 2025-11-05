"use client"

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

const getMetricsData = (timeRange: TimeRange): MetricsData => {
  const data: Record<TimeRange, MetricsData> = {
    "12months": {
      foodDonated: "937,788 kg",
      activeDonors: "89",
      mealsSaved: "1,875,576",
      co2Reduced: "2,340 kg",
      foodDonatedChange: "+18%",
      activeDonorsChange: "+12%",
      mealsSavedChange: "+22%",
      co2ReducedChange: "+15%",
      description: "Last 12 months"
    },
    "6months": {
      foodDonated: "468,894 kg",
      activeDonors: "76",
      mealsSaved: "937,788",
      co2Reduced: "1,170 kg",
      foodDonatedChange: "+15%",
      activeDonorsChange: "+10%",
      mealsSavedChange: "+18%",
      co2ReducedChange: "+12%",
      description: "Last 6 months"
    },
    "30days": {
      foodDonated: "78,149 kg",
      activeDonors: "67",
      mealsSaved: "156,298",
      co2Reduced: "195 kg",
      foodDonatedChange: "+12%",
      activeDonorsChange: "+8%",
      mealsSavedChange: "+14%",
      co2ReducedChange: "+10%",
      description: "Last 30 days"
    },
    "7days": {
      foodDonated: "18,228 kg",
      activeDonors: "54",
      mealsSaved: "36,456",
      co2Reduced: "46 kg",
      foodDonatedChange: "+8%",
      activeDonorsChange: "+5%",
      mealsSavedChange: "+10%",
      co2ReducedChange: "+7%",
      description: "Last 7 days"
    },
    "since-beginning": {
      foodDonated: "2,813,364 kg",
      activeDonors: "89",
      mealsSaved: "5,626,728",
      co2Reduced: "7,020 kg",
      foodDonatedChange: "+25%",
      activeDonorsChange: "+18%",
      mealsSavedChange: "+28%",
      co2ReducedChange: "+22%",
      description: "All time"
    }
  }
  
  return data[timeRange]
}

interface MetricsOverviewProps {
  timeRange: TimeRange
}

export function MetricsOverview({ timeRange }: MetricsOverviewProps) {
  const metricsData = getMetricsData(timeRange)
  
  const metrics = [
    {
      title: "Food Donated",
      value: metricsData.foodDonated,
      description: metricsData.description,
      change: metricsData.foodDonatedChange,
      trend: "up" as const,
      icon: Package,
      footer: "Strong donation growth",
      subfooter: "Helsinki restaurants leading"
    },
    {
      title: "Active Donors",
      value: metricsData.activeDonors,
      description: "Restaurants & stores",
      change: metricsData.activeDonorsChange, 
      trend: "up" as const,
      icon: Users,
      footer: "New partners this month",
      subfooter: "S-Market, Fazer, Stockmann"
    },
    {
      title: "Meals Saved",
      value: metricsData.mealsSaved,
      description: "Equivalent meals",
      change: metricsData.mealsSavedChange,
      trend: "up" as const, 
      icon: Utensils,
      footer: "More people fed",
      subfooter: "1 meal ≈ 0.5 kg food"
    },
    {
      title: "CO₂ Reduced",
      value: metricsData.co2Reduced,
      description: "Carbon footprint saved",
      change: metricsData.co2ReducedChange,
      trend: "up" as const,
      icon: Leaf,
      footer: "Carbon footprint of donations",
      subfooter: "Diverted from landfills to people"
    },
  ]
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs grid gap-4 sm:grid-cols-2 @5xl:grid-cols-4">
      {metrics.map((metric) => {
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
