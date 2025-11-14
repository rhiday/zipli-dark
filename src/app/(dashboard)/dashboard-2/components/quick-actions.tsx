"use client"

import { Plus, Settings, Download, Users, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { LogDonationDialog } from "./log-donation-dialog"

export function QuickActions() {
  const handleDonationLogged = (donation: {
    donor: string
    receiver: string
    amount: string
    foodType?: string
    notes?: string
  }) => {
    // In a real app, this would send to an API
    console.log("Donation logged:", donation)
    // You could also show a toast notification here
  }

  return (
    <div className="flex items-center space-x-2">
      <LogDonationDialog
        trigger={
          <Button className="cursor-pointer">
            <Plus className="h-4 w-4 mr-2" />
            Log Donation
          </Button>
        }
        onDonationLogged={handleDonationLogged}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="cursor-pointer">
            <Settings className="h-4 w-4 mr-2" />
            Edit Target
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem className="cursor-pointer">
            <Users className="h-4 w-4 mr-2" />
            Add Receiver
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer">
            <BarChart3 className="h-4 w-4 mr-2" />
            View Reports
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="cursor-pointer">
            <Settings className="h-4 w-4 mr-2" />
            Dashboard Settings
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
