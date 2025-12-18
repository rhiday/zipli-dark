"use client"

import dynamic from 'next/dynamic'
import { MetricsOverview } from "../dashboard/components/metrics-overview"
import { SalesChart } from "../dashboard/components/sales-chart"
import { RecentTransactions } from "../dashboard/components/recent-transactions"
import { QuickActions } from "../dashboard/components/quick-actions"
import { RevenueBreakdown } from "../dashboard/components/revenue-breakdown"
import { AchievementsBadge } from "../dashboard/components/achievements-badge"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

// Dynamically import map component with SSR disabled to avoid mapbox-gl issues
const FoodSurplusMap = dynamic(
  () => import('@/components/map/food-surplus-map').then(mod => ({ default: mod.FoodSurplusMap })),
  { ssr: false, loading: () => (
    <div className="w-full h-[500px] rounded-lg border bg-muted/50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
        <p className="text-sm text-muted-foreground">Loading map...</p>
      </div>
    </div>
  )}
)

export default function DailyOperationsPage() {

  return (
    <div className="flex-1 space-y-6 px-6 pt-0">
        {/* Enhanced Header */}

      <div className="flex flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src="/avatar.png" alt="Olivia" />
              <AvatarFallback>OL</AvatarFallback>
            </Avatar>
            <h1 className="text-2xl font-bold tracking-tight">Sodexo Helsinki Food Surplus Dashboard</h1>
          </div>
          <QuickActions />
        </div>

        {/* Main Dashboard Grid */}
        <div className="@container/main space-y-6">
          {/* Top Row - Map View */}
          <div>
            <FoodSurplusMap dataFilter="sodexo" />
          </div>

        {/* Second Row - Recent Donations & Key Metrics */}
        <div className="grid gap-6 grid-cols-2">
            <RecentTransactions />
            <div className="space-y-3">
              <AchievementsBadge />
              <MetricsOverview />
            </div>
          </div>

        {/* Third Row - Charts in 6-6 columns */}
        <div className="grid gap-6 grid-cols-2">
            <SalesChart />
            <RevenueBreakdown />
          </div>

          {/* Fifth Row - Sankey removed (moved to Climate impact page) */}
        </div>
      </div>
  )
}
