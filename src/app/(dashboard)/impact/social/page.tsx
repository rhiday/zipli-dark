"use client"

import { useState, useEffect } from "react"
import { Calendar, Filter, TrendingUp } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface Donation {
  id: string
  quantity: number
  unit: string
  status: string
  createdAt: string
  donorName: string
}

interface Receiver {
  id: string
  name: string
  organization: string
  requestsCount: number
  avatarImage?: string
}

export default function SocialImpactPage() {
  const [donations, setDonations] = useState<Donation[]>([])
  const [receivers, setReceivers] = useState<Receiver[]>([])
  const [metrics, setMetrics] = useState({ totalMeals: 0, orgsHelped: 0 })
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 7

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/data/dashboard-data.json')
        const data = await response.json()
        
        // Get all donations and sort by quantity (highest first)
        const allDonations = (data.recentDonations || [])
          .map((d: Donation) => ({
            id: d.id,
            quantity: d.quantity,
            unit: d.unit,
            status: d.status,
            createdAt: d.createdAt,
            donorName: d.donorName
          }))
          .sort((a: Donation, b: Donation) => b.quantity - a.quantity)
        
        // Available receiver images
        const receiverImages = [
          '/logos/test/receiver 1.webp',
          '/logos/test/receiver 2.jpg',
          '/logos/test/receiver 3.webp',
          '/logos/test/receiver 4.webp'
        ]
        
        // Assign random avatar images to receivers
        const receiversWithAvatars = (data.receivers || []).map((r: Receiver) => {
          // Use Red Cross images for Red Cross organization
          if (r.organization === 'Red Cross Finland') {
            // Randomly pick between receiver 1 or 4 (both are webp, can be Red Cross themed)
            const redCrossImages = [receiverImages[0], receiverImages[3]]
            return {
              ...r,
              avatarImage: redCrossImages[Math.floor(Math.random() * redCrossImages.length)]
            }
          }
          // Randomly assign any receiver image to other organizations
          return {
            ...r,
            avatarImage: receiverImages[Math.floor(Math.random() * receiverImages.length)]
          }
        })
        
        setDonations(allDonations)
        setReceivers(receiversWithAvatars)
        
        // Calculate metrics - based on notes: "Total kilos / 2"
        const totalKg = allDonations.reduce((sum: number, d: Donation) => sum + d.quantity, 0)
        setMetrics({
          totalMeals: Math.floor(totalKg / 2), // Per the note in screenshot
          orgsHelped: data.receivers?.length || 0
        })
      } catch (error) {
        console.error('Failed to load social impact data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  if (loading) {
    return (
      <div className="px-6">
        <h1 className="text-2xl font-semibold mb-6">Social impact</h1>
        <div className="text-muted-foreground">Loading...</div>
      </div>
    )
  }

  // Pagination for donations table
  const totalPages = Math.ceil(donations.length / itemsPerPage)
  const paginatedDonations = donations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  return (
    <div className="px-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold">Social impact</h1>
        <p className="text-muted-foreground mt-1">Track meals provided and organizations helped</p>
      </div>

      {/* Top Metrics */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>
              Total Meals provided
            </CardDescription>
            <CardTitle className="text-4xl font-bold">{metrics.totalMeals.toLocaleString()}</CardTitle>
            <div className="flex items-center gap-2 text-sm text-green-600">
              <TrendingUp className="h-4 w-4" />
              <span>+9.2%</span>
            </div>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>
              Organisations helped
            </CardDescription>
            <CardTitle className="text-4xl font-bold">{metrics.orgsHelped.toLocaleString()}</CardTitle>
            <div className="flex items-center gap-2 text-sm text-green-600">
              <TrendingUp className="h-4 w-4" />
              <span>+9.2%</span>
            </div>
          </CardHeader>
        </Card>
      </div>

      {/* Two Column Layout */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left Column - Recipient Organizations */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recipient organisation</CardTitle>
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
              {receivers.map((receiver) => (
                <div 
                  key={receiver.id}
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={receiver.avatarImage || '/avatar.png'} alt={receiver.name} />
                      <AvatarFallback>
                        {receiver.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{receiver.name}</p>
                      <p className="text-xs text-muted-foreground">{receiver.organization}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Right Column - Kilos Donated Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Kilos donated</CardTitle>
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
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow className="border-b bg-muted/30">
                    <TableHead className="py-3 px-4 font-semibold">Kilos</TableHead>
                    <TableHead className="py-3 px-4 font-semibold text-right">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedDonations.map((donation) => (
                    <TableRow key={donation.id} className="hover:bg-muted/30 transition-colors">
                      <TableCell className="py-4 px-4 font-medium">
                        {donation.quantity} kg
                      </TableCell>
                      <TableCell className="py-4 px-4 text-right text-muted-foreground">
                        {new Date(donation.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            {/* Pagination */}
            <div className="flex items-center justify-between mt-4">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </span>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


