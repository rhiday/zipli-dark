"use client"

import SankeyChart from "@/components/sankey/sankey-chart"
import { ROICalculator } from "../components/roi-calculator"
import { useState } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ClimateImpactPage() {
  const [metric, setMetric] = useState<"co2eq" | "mass">("co2eq")
  return (
    <div className="px-6">
      <h1 className="text-2xl font-semibold">Climate impact</h1>
      <div className="mt-6 bg-card rounded-lg border p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Food flow (Sankey)</h2>
          <Tabs value={metric} onValueChange={(v) => setMetric(v as "co2eq" | "mass")}>
            <TabsList>
              <TabsTrigger value="co2eq">CO₂e</TabsTrigger>
              <TabsTrigger value="mass">Mass</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <SankeyChart metric={metric} />
      </div>
      <div className="mt-6">
        <ROICalculator />
      </div>
    </div>
  )
}


