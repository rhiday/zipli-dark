"use client"

import * as React from "react"
import { Label, Pie, PieChart, Sector } from "recharts"
import type { PieSectorDataItem } from "recharts/types/polar/Pie"
import { ChartContainer, ChartStyle, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const chartConfig = {
  emissions: {
    label: "CO₂ Emissions",
  },
  amount: {
    label: "Amount",
  },
  beef: {
    label: "Beef",
    color: "#026209", // Zipli Earth (dark green)
  },
  fish: {
    label: "Fish",
    color: "#18E170", // Zipli Lime (bright green)
  },
  pork: {
    label: "Pork",
    color: "#FFA5BD", // Zipli Rose (pink)
  },
  veg: {
    label: "Vegetarian",
    color: "#5A0057", // Zipli Plum (purple)
  },
}

interface FoodNode {
  id: string
  co2eq?: number
  mass?: number
}

interface FoodFlowData {
  nodes: FoodNode[]
}

interface ChartDataItem {
  protein: string
  co2eq: number
  mass: number
  fill: string
}

type FlowMetric = 'mass' | 'co2eq'

interface CO2PieChartProps {
  metric?: FlowMetric
}

export function CO2PieChart({ metric = 'co2eq' }: CO2PieChartProps) {
  const id = "co2-protein-chart"
  const [chartData, setChartData] = React.useState<ChartDataItem[]>([])
  const [loading, setLoading] = React.useState(true)
  const [activeProtein, setActiveProtein] = React.useState("")

  React.useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/data/food-flow.json')
        const data: FoodFlowData = await response.json()
        
        // Filter nodes for protein types only
        const proteinTypes = ['beef', 'fish', 'pork', 'veg']
        const proteins = data.nodes.filter((node) => proteinTypes.includes(node.id))
        
        const transformed = proteins.map((protein) => ({
          protein: protein.id,
          co2eq: protein.co2eq || 0,
          mass: protein.mass || 0,
          fill: `var(--color-${protein.id})`
        }))
        
        setChartData(transformed)
        if (transformed.length > 0) {
          setActiveProtein(transformed[0].protein)
        }
      } catch (error) {
        console.error('Failed to load CO2 data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const activeIndex = React.useMemo(
    () => chartData.findIndex((item) => item.protein === activeProtein),
    [activeProtein, chartData]
  )
  
  const proteins = React.useMemo(() => chartData.map((item) => item.protein), [chartData])

  if (loading || chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-lg text-muted-foreground">Loading...</div>
      </div>
    )
  }

  const dataKey = metric === 'mass' ? 'mass' : 'co2eq'
  const unit = metric === 'mass' ? 'kg' : 'kg CO₂e'

  return (
    <div data-chart={id} className="w-full h-full">
      <ChartStyle id={id} config={chartConfig} />
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between mb-4">
          <Select value={activeProtein} onValueChange={setActiveProtein}>
            <SelectTrigger
              className="w-[175px] rounded-lg"
              aria-label="Select a protein"
            >
              <SelectValue placeholder="Select protein" />
            </SelectTrigger>
            <SelectContent align="end" className="rounded-lg">
              {proteins.map((key) => {
                const config = chartConfig[key as keyof typeof chartConfig]

                if (!config) {
                  return null
                }

                return (
                  <SelectItem
                    key={key}
                    value={key}
                    className="rounded-md [&_span]:flex"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="flex h-3 w-3 shrink-0 rounded-full"
                        style={{
                          backgroundColor: `var(--color-${key})`,
                        }}
                      />
                      {config?.label}
                    </div>
                  </SelectItem>
                )
              })}
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex-1 flex items-center justify-center">
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
                data={chartData}
                dataKey={dataKey}
                nameKey="protein"
                innerRadius={60}
                strokeWidth={5}
                activeIndex={activeIndex}
                activeShape={(({
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
                ))}
              >
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      const value = chartData[activeIndex][dataKey]
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
                            {value.toFixed(1)}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-muted-foreground text-sm"
                          >
                            {unit}
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
        
        <div className="mt-4 space-y-2">
          {chartData.map((item, index) => {
            const config = chartConfig[item.protein as keyof typeof chartConfig]
            const isActive = index === activeIndex
            const value = item[dataKey]
            
            return (
              <div 
                key={item.protein}
                className={`flex items-center justify-between p-3 rounded-lg transition-colors cursor-pointer ${
                  isActive ? 'bg-muted' : 'hover:bg-muted/50'
                }`}
                onClick={() => setActiveProtein(item.protein)}
              >
                <div className="flex items-center gap-3">
                  <span
                    className="flex h-3 w-3 shrink-0 rounded-full"
                    style={{
                      backgroundColor: `var(--color-${item.protein})`,
                    }}
                  />
                  <span className="font-medium">{config?.label}</span>
                </div>
                <div className="text-right">
                  <div className="font-bold">{value.toFixed(1)} {unit}</div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
