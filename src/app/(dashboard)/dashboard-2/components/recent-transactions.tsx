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
  '/logos/test/images.jpeg',
  '/logos/test/images (1).jpeg',
  '/logos/test/download.jpeg',
  '/logos/test/red_cross.webp',
  '/logos/test/sodexo.jpg',
  '/logos/unicafe.png',
  '/logos/roasberg.png',
  '/logos/compass.png'
]

function getCompanyLogo(donorName: string, receiverName: string, index: number): { src: string, isPerson: boolean } {
  const donorLower = donorName.toLowerCase()
  const receiverLower = receiverName.toLowerCase()
  
  // Match specific donor companies with photos
  if (donorLower.includes('sodexo')) {
    return { src: '/logos/test/sodexo.jpg', isPerson: true }
  }
  if (donorLower.includes('roasberg')) {
    return { src: '/logos/test/images.jpeg', isPerson: true }
  }
  if (donorLower.includes('compass') || donorLower.includes('sähkötalo')) {
    return { src: '/logos/test/download.jpeg', isPerson: true }
  }
  
  // Assign photos to UniCafe restaurants
  if (donorLower.includes('dipoli')) {
    return { src: '/logos/test/images (1).jpeg', isPerson: true }
  }
  if (donorLower.includes('alvari')) {
    return { src: '/logos/unicafe.png', isPerson: false }
  }
  if (donorLower.includes('kvarkki')) {
    return { src: '/logos/test/sodexo.jpg', isPerson: true }
  }
  if (donorLower.includes('metsätalo')) {
    return { src: '/logos/test/images.jpeg', isPerson: true }
  }
  if (donorLower.includes('unicafe') || donorLower.includes('olivia')) {
    return { src: '/logos/unicafe.png', isPerson: false }
  }
  
  // Match specific receiver organizations
  if (receiverLower.includes('red cross')) {
    return { src: '/logos/test/red_cross.webp', isPerson: true }
  }
  
  // If no match, rotate through available logos - always use photos
  const logo = availableLogos[index % availableLogos.length]
  const isPerson = logo.includes('/test/')
  return { src: logo, isPerson }
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
                const logo = getCompanyLogo(donation.donorName, donation.receiverName, index)
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
