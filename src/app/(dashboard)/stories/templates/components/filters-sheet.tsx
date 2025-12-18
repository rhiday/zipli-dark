"use client"

import { Calendar } from "lucide-react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export interface FilterState {
  dateRange: string
  categories: string[]
}

interface FiltersPopoverProps {
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
  children: React.ReactNode
}

const CATEGORIES = [
  "Corporate",
  "Volunteer",
  "Impact",
  "Partnership",
  "Education",
  "Sustainability",
  "Community",
]

export function FiltersSheet({ filters, onFiltersChange, children }: FiltersPopoverProps) {
  const toggleCategory = (category: string) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter((c) => c !== category)
      : [...filters.categories, category]
    onFiltersChange({ ...filters, categories: newCategories })
  }

  const clearAllFilters = () => {
    onFiltersChange({
      dateRange: "all",
      categories: [],
    })
  }

  const hasActiveFilters = 
    filters.dateRange !== "all" ||
    filters.categories.length > 0

  return (
    <Popover>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Filter Stories</h4>
            <p className="text-xs text-muted-foreground">
              Refine your story library
            </p>
          </div>

          {/* Date Range */}
          <div className="space-y-2">
            <Label className="text-xs font-medium">Date Range</Label>
            <Select
              value={filters.dateRange}
              onValueChange={(value) => onFiltersChange({ ...filters, dateRange: value })}
            >
              <SelectTrigger className="h-9 bg-muted/50">
                <Calendar className="h-3.5 w-3.5 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">Last 7 Days</SelectItem>
                <SelectItem value="month">Last 30 Days</SelectItem>
                <SelectItem value="quarter">Last 3 Months</SelectItem>
                <SelectItem value="year">Last Year</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label className="text-xs font-medium">Category</Label>
            <div className="space-y-2 max-h-[200px] overflow-y-auto">
              {CATEGORIES.map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox
                    id={`category-${category}`}
                    checked={filters.categories.includes(category)}
                    onCheckedChange={() => toggleCategory(category)}
                  />
                  <label
                    htmlFor={`category-${category}`}
                    className="text-sm cursor-pointer leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {category}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <Button
              variant="outline"
              onClick={clearAllFilters}
              size="sm"
              className="w-full h-8"
            >
              Clear All
            </Button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
