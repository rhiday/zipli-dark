"use client"

import * as React from "react"
import { Label, Pie, PieChart, Sector } from "recharts"
import type { PieSectorDataItem } from "recharts/types/polar/Pie"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartStyle, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Calendar } from "lucide-react"

const chartConfig = {
  donations: {
    label: "Donations",
  },
  amount: {
    label: "Amount",
  },
  restaurants: {
    label: "Restaurants",
    color: "#026209", // Zipli Earth (dark green)
  },
  "student-restaurants": {
    label: "Student Restaurants", 
    color: "#5A0057", // Zipli Plum (purple)
  },
  cafes: {
    label: "Cafes",
    color: "#18E170", // Zipli Lime (bright green - smallest slice)
  },
  "staff-restaurants": {
    label: "Staff Restaurants",
    color: "#FFA5BD", // Zipli Rose (pink)
  },
}

interface ChartDataItem {
  category: string
  value: number
  amount: number
  fill: string
}

interface CategoryValue {
  percentage: number
  kg: number
}

type TimeRange = "12months" | "6months" | "30days" | "7days" | "since-beginning"

export function RevenueBreakdown() {
  const id = "donation-sources"
  const [donationSourcesData, setDonationSourcesData] = React.useState<ChartDataItem[]>([])
  const [loading, setLoading] = React.useState(true)
  const [activeCategory, setActiveCategory] = React.useState("")
  const [timeRange, setTimeRange] = React.useState<TimeRange>("30days")

  React.useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/data/dashboard-data.json')
        const data = await response.json()
        
        // Transform category data into chart format with time range multipliers
        const categoryData = data.donationsByCategory as Record<string, CategoryValue>
        
        // Apply time range multiplier
        let multiplier = 1
        switch (timeRange) {
          case "12months":
            multiplier = 5
            break
          case "6months":
            multiplier = 3
            break
          case "30days":
            multiplier = 1
            break
          case "7days":
            multiplier = 0.25
            break
          case "since-beginning":
            multiplier = 12
            break
        }
        
        const chartData = Object.entries(categoryData).map(([key, value]) => ({
          category: key.toLowerCase().replace(/ /g, '-'),
          value: value.percentage,
          amount: Math.floor(value.kg * multiplier),
          fill: `var(--color-${key.toLowerCase().replace(/ /g, '-')})`
        }))
        
        setDonationSourcesData(chartData)
        if (chartData.length > 0) {
          setActiveCategory(chartData[0].category)
        }
      } catch (error) {
        console.error('Failed to load donation sources:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [timeRange])

  const activeIndex = React.useMemo(
    () => donationSourcesData.findIndex((item) => item.category === activeCategory),
    [activeCategory, donationSourcesData]
  )

  if (loading || donationSourcesData.length === 0) {
    return (
      <Card data-chart={id} className="flex flex-col cursor-pointer">
        <CardHeader>
          <CardTitle>Donation Sources</CardTitle>
          <CardDescription>Loading...</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card data-chart={id} className="flex flex-col cursor-pointer">
      <ChartStyle id={id} config={chartConfig} />
      <CardHeader className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 pb-2">
        <div>
          <CardTitle>Donation Sources</CardTitle>
          <CardDescription>Food donations by source type (kg)</CardDescription>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <Select value={timeRange} onValueChange={(v) => setTimeRange(v as TimeRange)}>
              <SelectTrigger
                className="w-[140px] rounded-lg cursor-pointer"
                aria-label="Select time range"
              >
                <SelectValue placeholder="Select range" />
              </SelectTrigger>
              <SelectContent align="end" className="rounded-lg">
                <SelectItem value="7days" className="cursor-pointer">7 days</SelectItem>
                <SelectItem value="30days" className="cursor-pointer">30 days</SelectItem>
                <SelectItem value="6months" className="cursor-pointer">6 months</SelectItem>
                <SelectItem value="12months" className="cursor-pointer">12 months</SelectItem>
                <SelectItem value="since-beginning" className="cursor-pointer">Since beginning</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button variant="outline" className="cursor-pointer">
            Export
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
          <div className="flex justify-center">
            <ChartContainer
              id={id}
              config={chartConfig}
              className="mx-auto aspect-square w-full max-w-[300px]"
            >
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Pie
                  data={donationSourcesData}
                  dataKey="amount"
                  nameKey="category"
                  innerRadius={60}
                  strokeWidth={5}
                  activeIndex={activeIndex}
                  activeShape={({
                    outerRadius = 0,
                    ...props
                  }: PieSectorDataItem) => (
                    <g>
                      <Sector {...props} outerRadius={outerRadius + 10} />
                      <Sector
                        {...props}
                        outerRadius={outerRadius + 25}
                        innerRadius={outerRadius + 12}
                      />
                    </g>
                  )}
                >
                  <Label
                    content={({ viewBox }) => {
                      if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                        return (
                          <text
                            x={viewBox.cx}
                            y={viewBox.cy}
                            textAnchor="middle"
                            dominantBaseline="middle"
                          >
                            <tspan
                              x={viewBox.cx}
                              y={viewBox.cy}
                              className="fill-foreground text-3xl font-bold"
                            >
                              {(donationSourcesData[activeIndex].amount / 1000).toFixed(1)}K kg
                            </tspan>
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy || 0) + 24}
                              className="fill-muted-foreground"
                            >
                              Donated
                            </tspan>
                          </text>
                        )
                      }
                    }}
                  />
                </Pie>
              </PieChart>
            </ChartContainer>
          </div>
          
          <div className="flex flex-col justify-center space-y-4">
            {donationSourcesData.map((item, index) => {
              const config = chartConfig[item.category as keyof typeof chartConfig]
              const isActive = index === activeIndex
              
              return (
                <div 
                  key={item.category}
                  className={`flex items-center justify-between p-3 rounded-lg transition-colors cursor-pointer ${
                    isActive ? 'bg-muted' : 'hover:bg-muted/50'
                  }`}
                  onClick={() => setActiveCategory(item.category)}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="flex h-3 w-3 shrink-0 rounded-full"
                      style={{
                        backgroundColor: `var(--color-${item.category})`,
                      }}
                    />
                    <span className="font-medium">{config?.label}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{(item.amount / 1000).toFixed(1)}K kg</div>
                    <div className="text-sm text-muted-foreground">{item.value}%</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
