"use client"

import SankeyChart from "@/components/sankey/sankey-chart"
import { CO2PieChart } from "@/components/climate/co2-pie-chart"
import { ROICalculator } from "../components/roi-calculator"
import { useState } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ClimateImpactPage() {
  const [metric, setMetric] = useState<"co2eq" | "mass">("co2eq")
  const [chartType, setChartType] = useState<"sankey" | "pie">("sankey")
  
  return (
    <div className="px-6">
      <h1 className="text-2xl font-semibold">Climate impact</h1>
      
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left side - Chart visualization */}
        <div className="bg-card rounded-lg border p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <h2 className="text-lg font-semibold">
                {chartType === "sankey" ? "Food flow (Sankey)" : "CO₂ per protein type"}
              </h2>
              <Tabs value={chartType} onValueChange={(v) => setChartType(v as "sankey" | "pie")}>
                <TabsList>
                  <TabsTrigger value="sankey">Sankey</TabsTrigger>
                  <TabsTrigger value="pie">Pie chart</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <Tabs value={metric} onValueChange={(v) => setMetric(v as "co2eq" | "mass")}>
              <TabsList>
                <TabsTrigger value="co2eq">CO₂e</TabsTrigger>
                <TabsTrigger value="mass">Mass</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          {chartType === "sankey" ? (
            <SankeyChart metric={metric} />
          ) : (
            <CO2PieChart metric={metric} />
          )}
        </div>
        
        {/* Right side - Calculator */}
        <div>
          <ROICalculator />
        </div>
      </div>
    </div>
  )
}


