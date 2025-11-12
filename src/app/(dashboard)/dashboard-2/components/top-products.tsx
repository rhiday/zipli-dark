"use client"

import { useEffect, useState } from "react"
import { Eye, Star, TrendingUp } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

interface Donor {
  id: string
  name: string
  type: string
  category: string
  totalDonations: number
  rating: number
  activeDays: number
}

export function TopProducts() {
  const [topDonors, setTopDonors] = useState<Donor[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadDonors = async () => {
      try {
        const response = await fetch('/data/dashboard-data.json')
        const data = await response.json()
        // Sort by totalDonations and take top 5
        const sorted = (data.donors || [])
          .sort((a: Donor, b: Donor) => b.totalDonations - a.totalDonations)
          .slice(0, 5)
        setTopDonors(sorted)
      } catch (error) {
        console.error('Failed to load donors:', error)
      } finally {
        setLoading(false)
      }
    }

    loadDonors()
  }, [])

  if (loading) {
    return (
      <Card className="cursor-pointer">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle>Top Donors</CardTitle>
            <CardDescription>Most active food donors this month</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground text-center py-8">Loading...</div>
        </CardContent>
      </Card>
    )
  }

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
                  <span className="text-xs text-muted-foreground">{donor.totalDonations} kg donated</span>
                </div>
              </div>
              <div className="text-right space-y-1">
                <div className="flex items-center space-x-2">
                  <p className="text-sm font-medium">{donor.totalDonations} kg</p>
                  <Badge
                    variant="outline"
                    className="text-green-600 border-green-200 cursor-pointer"
                  >
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +{Math.floor(donor.rating * 5)}%
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
