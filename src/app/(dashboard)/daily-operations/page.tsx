"use client"

import { useEffect, useState } from "react"
import dynamic from 'next/dynamic'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { TrendingDown, Package, AlertCircle, CheckCircle, ChevronRight, MapPin } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from "recharts"
import { VendorDetailModal } from "./vendor-detail-modal"

const VendorMap = dynamic(
  () => import('./vendor-map').then(mod => ({ default: mod.VendorMap })),
  { ssr: false, loading: () => (
    <div className="w-full h-[500px] rounded-lg border bg-muted/50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
        <p className="text-sm text-muted-foreground">Loading map...</p>
      </div>
    </div>
  )}
)

interface Vendor {
  id: string
  name: string
  monthlyOrders: number
  monthlyWaste: number
  wasteRatio: number
  rating: number
}

interface Order {
  supplilogOrderNo: string
  vendorName: string
  orderDate: string
  items: string[]
  orderValue: number
  wastedValue: number
  wasteRatio: number
  status: string
}

export default function DailyOperationsPage() {
  const [buyer, setBuyer] = useState<any>(null)
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [recentOrders, setRecentOrders] = useState<Order[]>([])
  const [chartData, setChartData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedVendorId, setSelectedVendorId] = useState<string | null>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/data/dashboard-data.json')
        const data = await response.json()
        setBuyer(data.buyer)
        setVendors(data.vendors)
        setRecentOrders(data.recentOrders.slice(0, 5))
        setChartData(data.monthlyTrends.slice(-6))
      } catch (error) {
        console.error('Failed to load dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  if (loading || !buyer) {
    return (
      <div className="flex-1 space-y-6 px-6 pt-0">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <>
      {/* Modal */}
      {selectedVendorId && (
        <VendorDetailModal
          vendorId={selectedVendorId}
          isOpen={!!selectedVendorId}
          onClose={() => setSelectedVendorId(null)}
        />
      )}

      <div className="flex-1 space-y-6 px-6 pt-0 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src="/avatar.png" alt={buyer.manager} />
            <AvatarFallback>{buyer.manager.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Suppilog Waste Analytics</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {buyer.manager} • {buyer.name}
            </p>
          </div>
        </div>
      </div>

      {/* Map View */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Vendor Locations
          </CardTitle>
          <CardDescription>Click vendor pins to view details</CardDescription>
        </CardHeader>
        <CardContent>
          <VendorMap onVendorClick={setSelectedVendorId} />
        </CardContent>
      </Card>

      {/* Key Metrics Row */}
      <div className="grid gap-6 grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Ordered (12mo)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€{(buyer.totalOrdered / 1000).toFixed(1)}k</div>
            <p className="text-xs text-muted-foreground mt-1">~€{Math.round(buyer.monthlyBudget)}/month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Wasted</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{buyer.totalWaste} kg</div>
            <p className="text-xs text-muted-foreground mt-1">{buyer.wasteRatio.toFixed(1)}% waste ratio</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Cost of Waste</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">€{Math.round(buyer.totalOrdered * buyer.wasteRatio / 100)}</div>
            <p className="text-xs text-muted-foreground mt-1">Money lost to waste</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Active Vendors</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{vendors.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Suppilog suppliers</p>
          </CardContent>
        </Card>
      </div>

      {/* Vendor Performance Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Vendor Performance Breakdown
          </CardTitle>
          <CardDescription>Click any vendor to see detailed product breakdown</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {vendors
              .sort((a, b) => a.wasteRatio - b.wasteRatio)
              .map((vendor) => (
                <button
                  key={vendor.id}
                  onClick={() => setSelectedVendorId(vendor.id)}
                  className="w-full flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors text-left"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-sm">{vendor.name}</h3>
                      <Badge variant={vendor.wasteRatio < 5 ? "default" : vendor.wasteRatio < 8 ? "secondary" : "destructive"}>
                        {vendor.wasteRatio.toFixed(1)}% waste
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>Ordered: €{vendor.monthlyOrders}</span>
                      <span>Wasted: {vendor.monthlyWaste} kg</span>
                      <span>Rating: {vendor.rating}/5</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${vendor.wasteRatio < 5 ? 'bg-green-500' : vendor.wasteRatio < 8 ? 'bg-yellow-500' : 'bg-red-500'}`}
                        style={{ width: `${Math.min(vendor.wasteRatio * 10, 100)}%` }}
                      />
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </button>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Recommendation */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-900">
            <AlertCircle className="h-5 w-5" />
            Cost Optimization Opportunity
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-blue-800">
          <p className="mb-2">
            <strong>Switch 30% of orders from Party Bugs to Slow A/S</strong>
          </p>
          <p>
            Party Bugs has 16% waste ratio vs. Slow A/S at 3%. Moving €180/month to Slow would save approximately <strong>€480/month</strong> in waste costs.
          </p>
        </CardContent>
      </Card>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders & Waste Tracking</CardTitle>
          <CardDescription>Last orders from Suppilog suppliers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <div key={order.supplilogOrderNo} className="p-3 border rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="font-semibold text-sm">{order.vendorName}</div>
                    <div className="text-xs text-muted-foreground">{order.supplilogOrderNo} • {order.orderDate}</div>
                  </div>
                  <Badge variant={order.wasteRatio < 5 ? "outline" : "secondary"}>
                    {order.wasteRatio.toFixed(1)}% wasted
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground mb-2">
                  {order.items.join(", ")}
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex gap-4">
                    <span>Order: €{order.orderValue}</span>
                    <span className="text-red-600 font-semibold">Waste cost: €{order.wastedValue}</span>
                  </div>
                  {order.status === "completed" && (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Waste Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Waste Trend (Last 6 Months)</CardTitle>
          <CardDescription>Total waste volume and ratio over time</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="totalWasted" stroke="#ef4444" name="Waste (kg)" />
              <Line type="monotone" dataKey="wasteRatio" stroke="#f59e0b" name="Waste %" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Vendor Comparison Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Waste by Vendor (Monthly Average)</CardTitle>
          <CardDescription>Which vendors contribute most waste</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={vendors.map((v) => ({
                name: v.name.split(" ")[0],
                waste: v.monthlyWaste,
                ratio: v.wasteRatio,
              }))}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="waste" fill="#ef4444" name="Waste (kg)" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
    </>
  )
}
