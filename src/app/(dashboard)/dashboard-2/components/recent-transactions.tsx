"use client"

import { useEffect, useState } from "react"
import { Eye, MoreHorizontal } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface Donation {
  id: string
  donorName: string
  donorType: string
  receiverName: string
  quantity: number
  unit: string
  status: string
  createdAt: string
}

function getTimeAgo(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffHours / 24)
  
  if (diffHours < 24) {
    return `${diffHours} hours ago`
  } else if (diffDays === 1) {
    return "1 day ago"
  } else {
    return `${diffDays} days ago`
  }
}

export function RecentTransactions() {
  const [donations, setDonations] = useState<Donation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadDonations = async () => {
      try {
        const response = await fetch('/data/dashboard-data.json')
        const data = await response.json()
        setDonations(data.recentDonations || [])
      } catch (error) {
        console.error('Failed to load donations:', error)
      } finally {
        setLoading(false)
      }
    }

    loadDonations()
  }, [])

  if (loading) {
    return (
      <Card className="cursor-pointer">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle>Recent Donations</CardTitle>
            <CardDescription>Latest food donations in Helsinki</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground text-center py-8">Loading...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="cursor-pointer">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle>Recent Donations</CardTitle>
          <CardDescription>Latest food donations in Helsinki</CardDescription>
        </div>
        <Button variant="outline" size="sm" className="cursor-pointer">
          <Eye className="h-4 w-4 mr-2" />
          View All
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {donations.map((donation) => (
          <div key={donation.id} >
            <div className="flex p-3 rounded-lg border gap-2">
              <Avatar className="h-8 w-8 shrink-0">
                <AvatarFallback>{donation.donorName.split(" ").map(n => n[0]).join("")}</AvatarFallback>
              </Avatar>
              <div className="flex flex-1 items-center justify-between gap-3 min-w-0">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{donation.donorName}</p>
                  <p className="text-xs text-muted-foreground truncate">{donation.donorType} → {donation.receiverName}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <Badge
                    variant={
                      donation.status === "completed" ? "default" :
                      donation.status === "pending" ? "secondary" : "destructive"
                    }
                    className="cursor-pointer"
                  >
                    {donation.status}
                  </Badge>
                  <div className="text-right">
                    <p className="text-sm font-medium whitespace-nowrap">{donation.quantity} {donation.unit}</p>
                    <p className="text-xs text-muted-foreground whitespace-nowrap">{getTimeAgo(donation.createdAt)}</p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 cursor-pointer">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem className="cursor-pointer">View Details</DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer">Track Delivery</DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer">Contact Donor</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
