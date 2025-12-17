"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { StoryCategory, SortOption } from "../types"
import { CATEGORY_LABELS } from "../types"

interface StoriesLibraryHeaderProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  category: StoryCategory | "all"
  onCategoryChange: (category: StoryCategory | "all") => void
  sortBy: SortOption
  onSortChange: (sort: SortOption) => void
}

export function StoriesLibraryHeader({
  searchQuery,
  onSearchChange,
  category,
  onCategoryChange,
  sortBy,
  onSortChange,
}: StoriesLibraryHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      {/* Search Input */}
      <div className="relative w-full sm:max-w-xs">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search stories..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 bg-muted/50 border-border"
        />
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        {/* Category Filter */}
        <Select
          value={category}
          onValueChange={(value) => onCategoryChange(value as StoryCategory | "all")}
        >
          <SelectTrigger className="w-[160px] bg-muted/50 border-border">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {(Object.keys(CATEGORY_LABELS) as StoryCategory[]).map((cat) => (
              <SelectItem key={cat} value={cat}>
                {CATEGORY_LABELS[cat]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Sort Order */}
        <Select
          value={sortBy}
          onValueChange={(value) => onSortChange(value as SortOption)}
        >
          <SelectTrigger className="w-[150px] bg-muted/50 border-border">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
            <SelectItem value="title">Title A-Z</SelectItem>
            <SelectItem value="impact">Highest Impact</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
