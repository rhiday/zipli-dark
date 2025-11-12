"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Calendar, Filter, TrendingUp } from "lucide-react"

interface Donation {
  id: string
  quantity: number
  unit: string
  status: string
  createdAt: string
  donorName?: string
}

interface Receiver {
  id: string
  name: string
  organization: string
  type: string
  requestsCount: number
}

export default function DailyOperationsPage() {
  const [donations, setDonations] = useState<Donation[]>([])
  const [receivers, setReceivers] = useState<Receiver[]>([])
  const [metrics, setMetrics] = useState({ totalMeals: 0, orgsHelped: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/data/dashboard-data.json')
        const data = await response.json()
        
        // Get recent donations
        const recentDonations = (data.recentDonations || []).map((d: Donation) => ({
          id: d.id,
          quantity: d.quantity,
          unit: d.unit,
          status: d.status,
          createdAt: d.createdAt,
          donorName: d.donorName
        }))
        
        setDonations(recentDonations)
        setReceivers(data.receivers || [])
        
        // Calculate metrics
        const totalKg = recentDonations.reduce((sum: number, d: Donation) => sum + d.quantity, 0)
        setMetrics({
          totalMeals: Math.floor(totalKg * 2.5), // 1 kg ≈ 2.5 meals
          orgsHelped: data.receivers?.length || 0
        })
      } catch (error) {
        console.error('Failed to load operations data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  if (loading) {
    return (
      <div className="px-6">
        <h1 className="text-2xl font-semibold mb-6">Daily Operations</h1>
        <div className="text-muted-foreground">Loading...</div>
      </div>
    )
  }

  return (
    <div className="px-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold">Daily Operations</h1>
        <p className="text-muted-foreground mt-1">Real-time donation tracking and recipient coordination</p>
      </div>

      {/* Top Metrics */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Meals provided</CardDescription>
            <CardTitle className="text-3xl font-bold">{metrics.totalMeals.toLocaleString()}</CardTitle>
            <div className="flex items-center gap-2 text-sm text-green-600">
              <TrendingUp className="h-4 w-4" />
              <span>+9.2%</span>
            </div>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Organisations helped</CardDescription>
            <CardTitle className="text-3xl font-bold">{metrics.orgsHelped}</CardTitle>
            <div className="flex items-center gap-2 text-sm text-green-600">
              <TrendingUp className="h-4 w-4" />
              <span>+9.2%</span>
            </div>
          </CardHeader>
        </Card>
      </div>

      {/* Two Column Layout */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Left Column - Donations */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Kilos donated</CardTitle>
                <CardDescription className="mt-1">Recent food donations</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Calendar className="h-4 w-4 mr-2" />
                  Select dates
                </Button>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {donations.map((donation) => (
                <div 
                  key={donation.id}
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                      <span className="text-sm font-medium">{donation.quantity}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">{donation.donorName}</p>
                      <p className="text-xs text-muted-foreground">
                        {donation.quantity} {donation.unit}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge 
                      variant={donation.status === 'completed' ? 'default' : 'secondary'}
                      className="mb-1"
                    >
                      {donation.status}
                    </Badge>
                    <p className="text-xs text-muted-foreground">
                      {new Date(donation.createdAt).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Right Column - Receivers */}
        <div className="space-y-6">
          {/* Recipient Organizations */}
          <Card>
            <CardHeader>
              <CardTitle>Recipient organisation</CardTitle>
              <CardDescription>Active food bank partners</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {receivers.map((receiver) => (
                  <div 
                    key={receiver.id}
                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>
                          {receiver.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{receiver.name}</p>
                        <p className="text-xs text-muted-foreground">{receiver.organization}</p>
                      </div>
                    </div>
                    <Badge variant="outline">
                      {receiver.requestsCount} requests
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Type of Operations */}
          <Card>
            <CardHeader>
              <CardTitle>Type of operations</CardTitle>
              <CardDescription>Service categories</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                  <p className="text-sm font-medium text-cyan-700 dark:text-cyan-400">Community building</p>
                  <p className="text-xs text-muted-foreground mt-1">Social support services</p>
                </div>
                <div className="p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                  <p className="text-sm font-medium text-cyan-700 dark:text-cyan-400">Food-aid</p>
                  <p className="text-xs text-muted-foreground mt-1">Emergency food distribution</p>
                </div>
                <div className="p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                  <p className="text-sm font-medium text-cyan-700 dark:text-cyan-400">Shelter services</p>
                  <p className="text-xs text-muted-foreground mt-1">Temporary housing support</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
