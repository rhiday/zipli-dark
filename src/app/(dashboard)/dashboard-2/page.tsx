"use client"

import { MetricsOverview } from "./components/metrics-overview"
import { SalesChart } from "./components/sales-chart"
import { RecentTransactions } from "./components/recent-transactions"
import { QuickActions } from "./components/quick-actions"
import { RevenueBreakdown } from "./components/revenue-breakdown"
import { AchievementsBadge } from "./components/achievements-badge"
import { FoodSurplusMap } from "@/components/map/food-surplus-map"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

export default function Dashboard2() {
  return (
    <div className="flex-1 space-y-6 px-6 pt-0">
        {/* Enhanced Header */}

        <div className="flex md:flex-row flex-col md:items-center justify-between gap-4 md:gap-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src="/avatar.png" alt="Olivia" />
              <AvatarFallback>OL</AvatarFallback>
            </Avatar>
            <h1 className="text-2xl font-bold tracking-tight">Welcome back, Olivia</h1>
          </div>
          <QuickActions />
        </div>

        {/* Main Dashboard Grid */}
        <div className="@container/main space-y-6">
          {/* Top Row - Map View */}
          <div>
            <FoodSurplusMap />
          </div>

          {/* Second Row - Recent Donations & Key Metrics */}
          <div className="grid gap-6 grid-cols-1 @5xl:grid-cols-2">
            <RecentTransactions />
            <div className="space-y-3">
              <AchievementsBadge />
              <MetricsOverview />
            </div>
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
