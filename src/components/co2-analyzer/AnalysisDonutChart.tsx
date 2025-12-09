"use client"

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import type { AnalysisResult } from "@/app/api/analyze-surplus/route"

interface AnalysisDonutChartProps {
  data: AnalysisResult
  metric: "co2" | "mass"
}

const COLORS: Record<string, string> = {
  beef: "#dc2626",      // red
  pork: "#f97316",      // orange
  fish: "#3b82f6",      // blue
  poultry: "#eab308",   // yellow
  dairy: "#8b5cf6",     // purple
  vegetables: "#22c55e", // green
  grains: "#a3a3a3",    // gray
  sides: "#06b6d4",     // cyan
  mixed: "#ec4899",     // pink
}

export function AnalysisDonutChart({ data, metric }: AnalysisDonutChartProps) {
  // Use surplus values (what we actually rescue)
  const chartData = data.categories
    .filter(cat => {
      const value = metric === "co2" ? cat.surplus_co2_kg : cat.surplus_mass_kg
      return value > 0
    })
    .map(cat => ({
      name: cat.name.charAt(0).toUpperCase() + cat.name.slice(1),
      value: metric === "co2" ? cat.surplus_co2_kg : cat.surplus_mass_kg,
      prepared: metric === "co2" ? cat.prepared_co2_kg : cat.prepared_mass_kg,
      leftoverRate: cat.surplus_estimate?.leftover_rate_percent || 0,
      items: cat.items.length,
    }))
    .sort((a, b) => b.value - a.value)

  const total = chartData.reduce((sum, item) => sum + item.value, 0)
  const totalPrepared = chartData.reduce((sum, item) => sum + item.prepared, 0)
  const unit = metric === "co2" ? "kg CO₂e" : "kg"

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {metric === "co2" ? "CO₂ Saved by Category" : "Surplus Mass by Category"}
        </CardTitle>
        <CardDescription>
          Showing rescuable surplus ({((total / totalPrepared) * 100).toFixed(0)}% of prepared)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
                label={({ name, percent }) => 
                  `${name} (${(percent * 100).toFixed(0)}%)`
                }
                labelLine={true}
              >
                {chartData.map((entry) => (
                  <Cell
                    key={entry.name}
                    fill={COLORS[entry.name.toLowerCase()] || "#666666"}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number, _name: string, props: { payload: typeof chartData[0] }) => {
                  const item = props.payload
                  return [
                    `${value.toFixed(1)} ${unit} surplus (${item.leftoverRate.toFixed(0)}% leftover rate)`,
                    metric === "co2" ? "CO₂ Saved" : "Surplus Mass",
                  ]
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 text-center space-y-1">
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">{total.toFixed(1)} {unit}</p>
          <p className="text-sm text-muted-foreground">
            Total {metric === "co2" ? "CO₂ saved" : "surplus"} by rescuing leftovers
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
