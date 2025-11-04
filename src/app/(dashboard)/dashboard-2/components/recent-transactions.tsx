"use client"

import { Eye, MoreHorizontal } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const donations = [
  {
    id: "DON-001",
    donor: {
      name: "Ravintola Savoy",
      type: "Restaurant",
      avatar: "/avatars/01.png",
    },
    receiver: "Helsinki Food Bank",
    amount: "45 kg",
    status: "completed",
    date: "2 hours ago",
  },
  {
    id: "DON-002",
    donor: {
      name: "K-Supermarket Kamppi",
      type: "Supermarket",
      avatar: "/avatars/02.png",
    },
    receiver: "Hyvä Jää Hyötykäyttöön",
    amount: "78 kg",
    status: "pending",
    date: "5 hours ago",
  },
  {
    id: "DON-003",
    donor: {
      name: "Fazer Café",
      type: "Bakery",
      avatar: "/avatars/03.png",
    },
    receiver: "Pelastusarmeija",
    amount: "23 kg",
    status: "completed",
    date: "1 day ago",
  },
  {
    id: "DON-004",
    donor: {
      name: "Hotel Kämp Kitchen",
      type: "Hotel",
      avatar: "/avatars/04.png",
    },
    receiver: "Ruokajakelu Helsinki",
    amount: "156 kg",
    status: "completed",
    date: "2 days ago",
  },
  {
    id: "DON-005",
    donor: {
      name: "S-Market Hakaniemi",
      type: "Supermarket",
      avatar: "/avatars/05.png",
    },
    receiver: "Helsinki Missio",
    amount: "89 kg",
    status: "completed",
    date: "3 days ago",
  },
]

export function RecentTransactions() {
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
      <CardContent className="space-y-4">
        {donations.map((donation) => (
          <div key={donation.id} >
            <div className="flex p-3 rounded-lg border gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={donation.donor.avatar} alt={donation.donor.name} />
                <AvatarFallback>{donation.donor.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
              </Avatar>
              <div className="flex flex-1 items-center flex-wrap justify-between gap-1">
                <div className="flex items-center space-x-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{donation.donor.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{donation.donor.type} → {donation.receiver}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
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
                    <p className="text-sm font-medium">{donation.amount}</p>
                    <p className="text-xs text-muted-foreground">{donation.date}</p>
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
