"use client"

import { useState, useEffect } from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"

const donationsDataStatic = [
  { month: "Jan", donations: 8500, target: 10000 },
  { month: "Feb", donations: 11200, target: 10000 },
  { month: "Mar", donations: 9800, target: 10000 },
  { month: "Apr", donations: 13400, target: 12000 },
  { month: "May", donations: 14600, target: 12000 },
  { month: "Jun", donations: 16200, target: 15000 },
  { month: "Jul", donations: 18500, target: 15000 },
  { month: "Aug", donations: 17800, target: 15000 },
  { month: "Sep", donations: 19200, target: 18000 },
  { month: "Oct", donations: 15000, target: 18000 },  // Underperforming
  { month: "Nov", donations: 16500, target: 20000 },  // Underperforming
  { month: "Dec", donations: 17000, target: 22000 },  // Underperforming
]

const chartConfig = {
  donations: {
    label: "Donations",
    color: "hsl(142, 76%, 36%)", // Green color for donations
  },
  target: {
    label: "Target",
    color: "hsl(150, 70%, 45%)", // Muted Zipli Lime for target
  },
} as const

export function SalesChart() {
  const [timeRange, setTimeRange] = useState("12m")
  const [donationsData, setDonationsData] = useState(donationsDataStatic)

  // Load data from API
  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/data/dashboard-data.json')
        const data = await response.json()
        if (data.monthlyTrends) {
          setDonationsData(data.monthlyTrends)
        }
      } catch (error) {
        console.error('Failed to load chart data:', error)
      }
    }
    loadData()
  }, [])

  // Filter data based on selected time range
  const getFilteredData = () => {
    const monthsToShow = timeRange === "3m" ? 3 : timeRange === "6m" ? 6 : 12
    return donationsData.slice(-monthsToShow)
  }

  // Calculate performance ratio to determine colors
  const filteredData = getFilteredData()
  const avgPerformance = filteredData.reduce((sum, d) => 
    sum + (d.donations / d.target), 0) / filteredData.length

  // Target line always stays green
  const targetColor = "hsl(150, 70%, 45%)" // Muted Zipli Lime

  // Donation line: subtle reddish tint when underperforming
  const donationColor = avgPerformance >= 0.95
    ? "hsl(142, 76%, 36%)"      // Green - meeting/close to targets
    : avgPerformance >= 0.85
    ? "hsl(135, 65%, 38%)"      // Slightly warmer green
    : "hsl(125, 50%, 40%)"      // Subtle olive/reddish-green tint

  return (
    <Card className="cursor-pointer">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle>Food Donations Over Time</CardTitle>
          <CardDescription>Monthly donations vs targets (kg)</CardDescription>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32 cursor-pointer">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3m" className="cursor-pointer">Last 3 months</SelectItem>
              <SelectItem value="6m" className="cursor-pointer">Last 6 months</SelectItem>
              <SelectItem value="12m" className="cursor-pointer">Last 12 months</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="cursor-pointer">
            Export
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0 pt-6">
        <div className="px-6 pb-6">
          <ChartContainer config={chartConfig} className="h-[350px] w-full">
            <AreaChart data={filteredData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
              <defs>
                <linearGradient id="colorDonations" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={donationColor} stopOpacity={0.4} />
                  <stop offset="95%" stopColor={donationColor} stopOpacity={0.05} />
                </linearGradient>
                <linearGradient id="colorTarget" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={targetColor} stopOpacity={0.2} />
                  <stop offset="95%" stopColor={targetColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
              <XAxis 
                dataKey="month" 
                axisLine={false}
                tickLine={false}
                className="text-xs"
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                className="text-xs"
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `${value.toLocaleString()} kg`}
              />
              <ChartTooltip 
                content={
                  <ChartTooltipContent 
                    formatter={(value, name) => {
                      const indicator = name === "target" ? "dashed" : "line"
                      return (
                        <div className="flex items-center gap-2">
                          {indicator === "dashed" ? (
                            <div className="h-0 w-6 border-t-2 border-dashed" style={{ borderColor: targetColor }} />
                          ) : (
                            <div className="h-0.5 w-6" style={{ backgroundColor: donationColor }} />
                          )}
                          <span>{value?.toLocaleString()} kg</span>
                        </div>
                      )
                    }}
                  />
                } 
              />
              <Area
                type="monotone"
                dataKey="target"
                stackId="1"
                stroke={targetColor}
                fill="url(#colorTarget)"
                strokeDasharray="5 5"
                strokeWidth={1}
              />
              <Area
                type="monotone"
                dataKey="donations"
                stackId="2"
                stroke={donationColor}
                fill="url(#colorDonations)"
                strokeWidth={1}
              />
            </AreaChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  )
}
