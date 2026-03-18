"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Package, TrendingUp, AlertCircle } from "lucide-react"
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar } from "recharts"

interface Product {
  id: string
  name: string
  category: string
  monthlyOrdered: number
  monthlyWasted: number
  wasteRatio: number
  unit: string
  wasteReasons: Record<string, number>
  topReason: string
}

interface Vendor {
  id: string
  name: string
  type: string
  location: string
  coordinates: [number, number]
  contact: string
  website: string
  description: string
  monthlyOrders: number
  monthlyWaste: number
  wasteRatio: number
  rating: number
  ordersCount: number
  products: Product[]
}

export default function VendorDetailPage() {
  const params = useParams()
  const vendorId = params.vendorId as string
  const [vendor, setVendor] = useState<Vendor | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/data/dashboard-data.json')
        const data = await response.json()
        const foundVendor = data.vendors.find((v: Vendor) => v.id === vendorId)
        setVendor(foundVendor)
      } catch (error) {
        console.error('Failed to load vendor data:', error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [vendorId])

  if (loading) {
    return (
      <div className="flex-1 space-y-6 px-6 pt-6">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!vendor) {
    return (
      <div className="flex-1 space-y-6 px-6 pt-6">
        <div>Vendor not found</div>
      </div>
    )
  }

  // Prepare data for waste reasons pie chart
  const wasteReasonsData = vendor.products.flatMap(p =>
    Object.entries(p.wasteReasons).map(([reason, percentage]) => ({
      name: reason,
      value: percentage
    }))
  )

  const aggregatedReasons: Record<string, number> = {}
  wasteReasonsData.forEach(item => {
    aggregatedReasons[item.name] = (aggregatedReasons[item.name] || 0) + item.value
  })

  const chartReasons = Object.entries(aggregatedReasons).map(([name, value]) => ({
    name,
    value: Math.round(value / vendor.products.length)
  }))

  const COLORS = ['#ef4444', '#f59e0b', '#3b82f6', '#10b981', '#8b5cf6', '#ec4899']

  return (
    <div className="flex-1 space-y-6 px-6 pt-6 pb-12">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/daily-operations">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{vendor.name}</h1>
          <p className="text-muted-foreground mt-1">{vendor.description}</p>
          <div className="flex items-center gap-4 mt-3">
            <Badge variant="outline">{vendor.type}</Badge>
            <span className="text-sm text-muted-foreground">{vendor.location}</span>
            <span className="text-sm font-semibold">Rating: {vendor.rating}/5</span>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-6 grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Monthly Ordered</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€{vendor.monthlyOrders}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Monthly Wasted</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{vendor.monthlyWaste} kg</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Waste Ratio</CardDescription>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${vendor.wasteRatio < 5 ? 'text-green-600' : vendor.wasteRatio < 8 ? 'text-amber-600' : 'text-red-600'}`}>
              {vendor.wasteRatio.toFixed(1)}%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Orders</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{vendor.ordersCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Product Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Product Breakdown
          </CardTitle>
          <CardDescription>Detailed waste analysis for each product</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {vendor.products.map((product) => (
              <div key={product.id} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-base">{product.name}</h3>
                    <p className="text-xs text-muted-foreground">{product.category}</p>
                  </div>
                  <Badge variant={product.wasteRatio < 5 ? "default" : product.wasteRatio < 8 ? "secondary" : "destructive"}>
                    {product.wasteRatio.toFixed(1)}% waste
                  </Badge>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Monthly Ordered:</span>
                    <p className="font-semibold">{product.monthlyOrdered} {product.unit}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Monthly Wasted:</span>
                    <p className="font-semibold text-amber-600">{product.monthlyWasted} {product.unit}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Top Reason:</span>
                    <p className="font-semibold">{product.topReason}</p>
                  </div>
                </div>

                {/* Waste Reasons */}
                <div className="bg-muted/50 rounded p-3">
                  <p className="text-xs font-semibold mb-2 text-muted-foreground">Waste Reasons:</p>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(product.wasteReasons).map(([reason, percentage]) => (
                      <div key={reason} className="flex items-center gap-1 text-xs bg-background px-2 py-1 rounded">
                        <span>{reason}:</span>
                        <span className="font-semibold">{percentage}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Waste Reasons Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Primary Waste Reasons</CardTitle>
          <CardDescription>Distribution of waste causes across all products</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartReasons}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => `${entry.name}: ${entry.value}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {chartReasons.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle>Vendor Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="text-sm text-muted-foreground">Type</p>
            <p className="font-semibold">{vendor.type}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Location</p>
            <p className="font-semibold">{vendor.location}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Contact</p>
            <p className="font-semibold">{vendor.contact}</p>
          </div>
          {vendor.website !== "-" && (
            <div>
              <p className="text-sm text-muted-foreground">Website</p>
              <p className="font-semibold"><a href={`https://${vendor.website}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{vendor.website}</a></p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recommendation */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-900">
            <AlertCircle className="h-5 w-5" />
            Optimization Tip
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-blue-800">
          {vendor.wasteRatio > 10 ? (
            <p>
              This vendor has a high waste ratio ({vendor.wasteRatio.toFixed(1)}%). Consider reviewing order quantities or storage conditions.
              The main waste driver is <strong>{vendor.products[0]?.topReason}</strong>.
            </p>
          ) : vendor.wasteRatio > 5 ? (
            <p>
              This vendor has a moderate waste ratio. Focus on reducing <strong>{vendor.products[0]?.topReason}</strong> issues through
              better storage or reduced order volumes.
            </p>
          ) : (
            <p>
              This vendor performs well with a low waste ratio of {vendor.wasteRatio.toFixed(1)}%. Consider ordering more from this supplier
              to improve overall efficiency.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
