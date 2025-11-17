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
    color: "#18E170", // Zipli Lime (bright green)
  },
  "staff-restaurants": {
    label: "Staff Restaurants",
    color: "#FFA5BD", // Zipli Rose (pink)
  },
  producers: {
    label: "Producers",
    color: "#84cc16", // Lime green
  },
  supermarkets: {
    label: "Supermarkets",
    color: "#3b82f6", // Blue
  },
  hypermarkets: {
    label: "Hypermarkets",
    color: "#8b5cf6", // Purple
  },
}

interface ChartDataItem {
  category: string
  value: number
  amount: number
  fill: string
}

interface DonorSummary {
  category?: string
  totalDonations?: number
}

interface ProducerFeature {
  properties?: {
    donations?: number
  }
}

interface ShopFeature {
  properties?: {
    donations?: number
    type?: string
  }
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
        
        // Calculate donation totals by category from all donors
        const categoryTotals: Record<string, number> = {}
        
        // Process donors from dashboard data
        if (data.donors) {
          (data.donors as DonorSummary[]).forEach((donor) => {
            const category = donor.category || 'Other'
            categoryTotals[category] = (categoryTotals[category] || 0) + (donor.totalDonations || 0)
          })
        }
        
        // Load and process additional data sources
        const loadAdditionalData = async () => {
          // Load producers
          try {
            const producersResponse = await fetch('/data/foodproducers.json')
            if (producersResponse.ok) {
              const producersData = await producersResponse.json()
              if (producersData.features) {
                (producersData.features as ProducerFeature[]).forEach((f) => {
                  if (f.properties?.donations) {
                    categoryTotals['Producers'] = (categoryTotals['Producers'] || 0) + f.properties.donations
                  }
                })
              }
            }
          } catch (error) {
            console.error('Failed to load producers:', error)
          }
          
          // Load shops (supermarkets and hypermarkets)
          try {
            const shopsResponse = await fetch('/data/shopshelsinki.json')
            if (shopsResponse.ok) {
              const shopsData = await shopsResponse.json()
              if (shopsData.features) {
                (shopsData.features as ShopFeature[]).forEach((f) => {
                  if (f.properties?.donations) {
                    const type = f.properties.type
                    if (type === 'hypermarket') {
                      categoryTotals['Hypermarkets'] = (categoryTotals['Hypermarkets'] || 0) + f.properties.donations
                    } else if (type === 'supermarket') {
                      categoryTotals['Supermarkets'] = (categoryTotals['Supermarkets'] || 0) + f.properties.donations
                    }
                  }
                })
              }
            }
          } catch (error) {
            console.error('Failed to load shops:', error)
          }
        }
        
        await loadAdditionalData()
        
        // Calculate total and percentages
        const total = Object.values(categoryTotals).reduce((sum, val) => sum + val, 0)
        
        // Transform into chart format
        const chartData = Object.entries(categoryTotals)
          .map(([category, amount]) => ({
            category: category.toLowerCase().replace(/ /g, '-'),
            value: Math.round((amount / total) * 100),
            amount: Math.floor(amount * multiplier),
            fill: `var(--color-${category.toLowerCase().replace(/ /g, '-')})`
          }))
          .sort((a, b) => b.amount - a.amount) // Sort by amount descending
        
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
      <CardContent className="flex flex-1 flex-col items-center">
        <ChartContainer
          id={id}
          config={chartConfig}
          className="mx-auto aspect-square w-full max-w-[280px]"
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
        
        <div className="grid grid-cols-2 gap-1.5 w-full mt-3 max-w-[500px]">
          {donationSourcesData.map((item, index) => {
            const config = chartConfig[item.category as keyof typeof chartConfig]
            const isActive = index === activeIndex
            
            return (
              <div 
                key={item.category}
                className={`flex items-center justify-between px-2 py-1 rounded transition-colors cursor-pointer ${
                  isActive ? 'bg-muted' : 'hover:bg-muted/50'
                }`}
                onClick={() => setActiveCategory(item.category)}
              >
                <div className="flex items-center gap-1.5 min-w-0">
                  <span
                    className="flex h-2 w-2 shrink-0 rounded-full"
                    style={{
                      backgroundColor: `var(--color-${item.category})`,
                    }}
                  />
                  <span className="text-[11px] font-medium truncate">{config?.label}</span>
                </div>
                <div className="text-right shrink-0 ml-1.5">
                  <div className="text-[11px] font-bold">{(item.amount / 1000).toFixed(1)}K kg</div>
                  <div className="text-[9px] text-muted-foreground">{item.value}%</div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
