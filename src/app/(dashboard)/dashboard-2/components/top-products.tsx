"use client"

import { Eye, Star, TrendingUp } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

const topDonors = [
  {
    id: 1,
    name: "S-Market Hakaniemi",
    donations: 2847,
    amount: "1,423 kg",
    growth: "+23%",
    rating: 4.8,
    activeDays: 28,
    category: "Supermarket",
  },
  {
    id: 2,
    name: "Fazer Café",
    donations: 1923,
    amount: "961 kg",
    growth: "+18%",
    rating: 4.6,
    activeDays: 25,
    category: "Bakery",
  },
  {
    id: 3,
    name: "Hotel Kämp Kitchen",
    donations: 1456,
    amount: "728 kg",
    growth: "+12%",
    rating: 4.9,
    activeDays: 30,
    category: "Hotel",
  },
  {
    id: 4,
    name: "Ravintola Savoy",
    donations: 892,
    amount: "1,784 kg",
    growth: "+8%",
    rating: 4.7,
    activeDays: 15,
    category: "Restaurant",
  },
  {
    id: 5,
    name: "K-Supermarket Kamppi",
    donations: 3421,
    amount: "684 kg",
    growth: "+31%",
    rating: 4.4,
    activeDays: 22,
    category: "Supermarket",
  },
]

export function TopProducts() {
  return (
    <Card className="cursor-pointer">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle>Top Donors</CardTitle>
          <CardDescription>Most active food donors this month</CardDescription>
        </div>
        <Button variant="outline" size="sm" className="cursor-pointer">
          <Eye className="h-4 w-4 mr-2" />
          View All
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {topDonors.map((donor, index) => (
          <div key={donor.id} className="flex items-center p-3 rounded-lg border gap-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold text-sm">
                #{index + 1}
              </div>
            <div className="flex gap-2 items-center justify-between space-x-3 flex-1 flex-wrap">
              <div className="">
                <div className="flex items-center space-x-2">
                  <p className="text-sm font-medium truncate">{donor.name}</p>
                  <Badge variant="outline" className="text-xs">
                    {donor.category}
                  </Badge>
                </div>
                <div className="flex items-center space-x-2 mt-1">
                  <div className="flex items-center space-x-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs text-muted-foreground">{donor.rating}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">•</span>
                  <span className="text-xs text-muted-foreground">{donor.donations} donations</span>
                </div>
              </div>
              <div className="text-right space-y-1">
                <div className="flex items-center space-x-2">
                  <p className="text-sm font-medium">{donor.amount}</p>
                  <Badge
                    variant="outline"
                    className="text-green-600 border-green-200 cursor-pointer"
                  >
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {donor.growth}
                  </Badge>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-muted-foreground">Active: {donor.activeDays} days</span>
                  <Progress
                    value={donor.activeDays > 30 ? 100 : (donor.activeDays / 30) * 100}
                    className="w-12 h-1"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
