"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { X, Package, AlertCircle } from "lucide-react"
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"

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

interface VendorDetailModalProps {
  vendorId: string
  onClose: () => void
  isOpen: boolean
}

export function VendorDetailModal({ vendorId, onClose, isOpen }: VendorDetailModalProps) {
  const [vendor, setVendor] = useState<Vendor | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isOpen) return

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
  }, [vendorId, isOpen])

  if (!isOpen) return null

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/50" onClick={onClose} />
        <div className="relative bg-background rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  if (!vendor) {
    return null
  }

  // Prepare data for waste reasons pie chart
  const aggregatedReasons: Record<string, number> = {}
  vendor.products.forEach(p => {
    Object.entries(p.wasteReasons).forEach(([reason, percentage]) => {
      aggregatedReasons[reason] = (aggregatedReasons[reason] || 0) + percentage
    })
  })

  const chartReasons = Object.entries(aggregatedReasons).map(([name, value]) => ({
    name,
    value: Math.round(value / vendor.products.length)
  }))

  const COLORS = ['#ef4444', '#f59e0b', '#3b82f6', '#10b981', '#8b5cf6', '#ec4899']

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-background rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto border border-border/50 bg-opacity-95 backdrop-blur-sm">
        {/* Close Button */}
        <div className="sticky top-0 flex items-center justify-between p-6 border-b border-border/50 bg-background/98 backdrop-blur">
          <div className="flex-1">
            <h2 className="text-2xl font-bold">{vendor.name}</h2>
            <p className="text-sm text-muted-foreground mt-1">{vendor.description}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0 ml-4 flex-shrink-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6">
          {/* Header Info */}
          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              <Badge variant="outline">{vendor.type}</Badge>
              <span className="text-sm text-muted-foreground">{vendor.location}</span>
            </div>
            <span className="text-sm font-semibold">Rating: {vendor.rating}/5</span>
          </div>

          {/* Key Metrics */}
          <div className="grid gap-4 grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Monthly Ordered</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold">€{vendor.monthlyOrders}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Monthly Wasted</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold text-amber-600">{vendor.monthlyWaste} kg</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Waste Ratio</CardDescription>
              </CardHeader>
              <CardContent>
                <div className={`text-lg font-bold ${vendor.wasteRatio < 5 ? 'text-green-600' : vendor.wasteRatio < 8 ? 'text-amber-600' : 'text-red-600'}`}>
                  {vendor.wasteRatio.toFixed(1)}%
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Total Orders</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold">{vendor.ordersCount}</div>
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
              <div className="space-y-3">
                {vendor.products.map((product) => (
                  <div key={product.id} className="p-3 border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-sm">{product.name}</h3>
                        <p className="text-xs text-muted-foreground">{product.category}</p>
                      </div>
                      <Badge variant={product.wasteRatio < 5 ? "default" : product.wasteRatio < 8 ? "secondary" : "destructive"}>
                        {product.wasteRatio.toFixed(1)}% waste
                      </Badge>
                    </div>

                    <div className="grid grid-cols-3 gap-3 mb-3 text-xs">
                      <div>
                        <span className="text-muted-foreground">Ordered:</span>
                        <p className="font-semibold">{product.monthlyOrdered} {product.unit}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Wasted:</span>
                        <p className="font-semibold text-amber-600">{product.monthlyWasted} {product.unit}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Top Reason:</span>
                        <p className="font-semibold">{product.topReason}</p>
                      </div>
                    </div>

                    {/* Waste Reasons */}
                    <div className="bg-muted/50 rounded p-2">
                      <p className="text-xs font-semibold mb-1 text-muted-foreground">Waste Reasons:</p>
                      <div className="flex flex-wrap gap-1">
                        {Object.entries(product.wasteReasons).map(([reason, percentage]) => (
                          <div key={reason} className="flex items-center gap-1 text-xs bg-background px-1.5 py-0.5 rounded">
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

          {/* Waste Reasons Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Primary Waste Reasons</CardTitle>
              <CardDescription>Distribution of waste causes</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={chartReasons}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.name}: ${entry.value}%`}
                    outerRadius={70}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {chartReasons.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Recommendation */}
          <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-900 dark:text-blue-100">
                <AlertCircle className="h-5 w-5" />
                Optimization Tip
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-blue-800 dark:text-blue-200">
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

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Vendor Information</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Type</p>
                <p className="font-semibold">{vendor.type}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Location</p>
                <p className="font-semibold">{vendor.location}</p>
              </div>
              <div className="col-span-2">
                <p className="text-muted-foreground">Contact</p>
                <p className="font-semibold">{vendor.contact}</p>
              </div>
              {vendor.website !== "-" && (
                <div className="col-span-2">
                  <p className="text-muted-foreground">Website</p>
                  <a href={`https://${vendor.website}`} target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-500 hover:underline">
                    {vendor.website}
                  </a>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
