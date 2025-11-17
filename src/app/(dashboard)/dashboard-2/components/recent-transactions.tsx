"use client"

import { useEffect, useState } from "react"
import { Eye, MoreHorizontal } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
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

const availableLogos = [
  '/logos/test/donor 1.jpeg',
  '/logos/test/donor 2.jpeg',
  '/logos/test/donor 3.jpeg',
  '/logos/test/sodexo.jpg',
  '/logos/test/sodexo_2.webp',
]

function getCompanyLogo(donorName: string, receiverName: string): { src: string, isPerson: boolean } {
  const donorLower = donorName.toLowerCase()
  
  // Match specific donor companies with logos
  if (donorLower.includes('sodexo')) {
    return { src: '/logos/test/sodexo.jpg', isPerson: true }
  }
  if (donorLower.includes('roasberg')) {
    return { src: '/logos/test/donor 1.jpeg', isPerson: true }
  }
  if (donorLower.includes('sähkötalo')) {
    return { src: '/logos/test/donor 3.jpeg', isPerson: true }
  }
  if (donorLower.includes('alvari')) {
    return { src: '/logos/test/donor 2.jpeg', isPerson: true }
  }
  if (donorLower.includes('kvarkki')) {
    return { src: '/logos/test/donor 3.jpeg', isPerson: true }
  }
  if (donorLower.includes('metsätalo')) {
    return { src: '/logos/test/donor 1.jpeg', isPerson: true }
  }
  if (donorLower.includes('unicafe') || donorLower.includes('olivia')) {
    return { src: '/logos/test/donor 2.jpeg', isPerson: true }
  }
  if (donorLower.includes('tuas')) {
    return { src: '/logos/test/sodexo_2.webp', isPerson: true }
  }
  
  // If no specific match, assign images based on a hash of the donor name for consistency
  // This ensures the same donor always gets the same image
  const hash = donorName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const logo = availableLogos[hash % availableLogos.length]
  return { src: logo, isPerson: true }
}

// Simulate recent donation times for demo purposes
const recentTimes = [
  "40 seconds ago",
  "2 minutes ago",
  "5 minutes ago",
  "12 minutes ago",
  "18 minutes ago",
  "25 minutes ago",
  "35 minutes ago",
  "48 minutes ago",
  "1 hour ago",
  "2 hours ago"
]

function getTimeAgo(dateString: string, index: number): string {
  // Use simulated recent times for demo
  return recentTimes[index % recentTimes.length]
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
        {donations.map((donation, index) => (
          <div key={donation.id} >
            <div className="flex p-3 rounded-lg border gap-2">
              {(() => {
                const logo = getCompanyLogo(donation.donorName, donation.receiverName)
                return (
                  <Avatar className={`h-8 w-8 shrink-0 ${logo.isPerson ? '' : 'bg-white'}`}>
                    <AvatarImage 
                      src={logo.src} 
                      alt={donation.donorName}
                      className={logo.isPerson ? "object-cover" : "object-contain p-1"}
                    />
                    <AvatarFallback>{donation.donorName.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                  </Avatar>
                )
              })()}
              <div className="flex flex-1 items-center justify-between gap-3 min-w-0">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{donation.donorName}</p>
                  <p className="text-xs text-muted-foreground truncate">{donation.donorType} → {donation.receiverName}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <p className="text-sm font-medium whitespace-nowrap">{donation.quantity} {donation.unit}</p>
                    <p className="text-xs text-muted-foreground whitespace-nowrap">{getTimeAgo(donation.createdAt, index)}</p>
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
