"use client"

import { Plus, Settings, FileText, Download, Users, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function QuickActions() {
  return (
    <div className="flex items-center space-x-2">
      <Button className="cursor-pointer">
        <Plus className="h-4 w-4 mr-2" />
        Log Donation
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="cursor-pointer">
            <Settings className="h-4 w-4 mr-2" />
            Actions
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
