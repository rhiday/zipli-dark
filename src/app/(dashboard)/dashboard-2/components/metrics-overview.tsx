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

const metrics = [
  {
    title: "Food Donated",
    value: "12,450 kg",
    description: "This month",
    change: "+18%",
    trend: "up",
    icon: Package,
    footer: "Strong donation growth",
    subfooter: "Helsinki restaurants leading"
  },
  {
    title: "Active Donors",
    value: "89",
    description: "Restaurants & stores",
    change: "+12%", 
    trend: "up",
    icon: Users,
    footer: "New partners this month",
    subfooter: "S-Market, Fazer, Stockmann"
  },
  {
    title: "Meals Saved",
    value: "31,125",
    description: "Equivalent meals",
    change: "+22%",
    trend: "up", 
    icon: Utensils,
    footer: "More people fed",
    subfooter: "1 meal ≈ 0.4 kg food"
  },
  {
    title: "CO₂ Reduced",
    value: "2,340 kg",
    description: "Carbon footprint saved",
    change: "+15%",
    trend: "up",
    icon: Leaf,
    footer: "Environmental impact",
    subfooter: "Preventing food waste"
  },
]

export function MetricsOverview() {
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
