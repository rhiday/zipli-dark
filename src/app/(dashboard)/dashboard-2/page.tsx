"use client"

import { useState } from "react"
import { MetricsOverview } from "./components/metrics-overview"
import { SalesChart } from "./components/sales-chart"
import { RecentTransactions } from "./components/recent-transactions"
import { TopProducts } from "./components/top-products"
import { QuickActions } from "./components/quick-actions"
import { RevenueBreakdown } from "./components/revenue-breakdown"
import { FoodSurplusMap } from "@/components/map/food-surplus-map"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Calendar } from "lucide-react"

type TimeRange = "12months" | "6months" | "30days" | "7days" | "since-beginning"

export default function Dashboard2() {
  const [timeRange, setTimeRange] = useState<TimeRange>("12months")

  return (
    <div className="flex-1 space-y-6 px-6 pt-0">
        {/* Enhanced Header */}

        <div className="flex md:flex-row flex-col md:items-center justify-between gap-4 md:gap-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold tracking-tight">Food Surplus Dashboard</h1>
            <p className="text-muted-foreground">
              Monitor food donations, receivers, and impact in Helsinki
            </p>
          </div>
          <QuickActions />
        </div>

        {/* Main Dashboard Grid */}
        <div className="@container/main space-y-6">
          {/* Time Range Filter */}
          <div className="flex items-center gap-3">
            <Label htmlFor="time-range" className="flex items-center gap-2 text-sm font-medium">
              <Calendar className="h-4 w-4" />
              Time Range:
            </Label>
            <Select value={timeRange} onValueChange={(v) => setTimeRange(v as TimeRange)}>
              <SelectTrigger id="time-range" className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="12months">12 months</SelectItem>
                <SelectItem value="6months">6 months</SelectItem>
                <SelectItem value="30days">30 days</SelectItem>
                <SelectItem value="7days">7 days</SelectItem>
                <SelectItem value="since-beginning">Since beginning</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Top Row - Key Metrics */}

          <MetricsOverview timeRange={timeRange} />

          {/* Second Row - Map View */}
          <div>
            <FoodSurplusMap />
          </div>

          {/* Recent Donations & Top Donors - Two Column Layout */}
          <div className="grid gap-6 grid-cols-1 @5xl:grid-cols-2">
            <RecentTransactions />
            <TopProducts />
          </div>

          {/* Third Row - Charts in 6-6 columns */}
          <div className="grid gap-6 grid-cols-1 @5xl:grid-cols-2">
            <SalesChart />
            <RevenueBreakdown />
          </div>

          {/* Fifth Row - Sankey removed (moved to Climate impact page) */}
        </div>
      </div>
  )
}
