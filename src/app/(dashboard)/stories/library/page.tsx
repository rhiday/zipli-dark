"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Plus, Search, SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { StoryGrid } from "./components/story-grid"
import { FiltersSheet, type FilterState } from "./components/filters-sheet"
import storiesData from "./data/stories.json"
import type { Story, SortOption } from "./types"

export default function StoriesLibraryPage() {
  const router = useRouter()
  
  // Filter state
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy] = useState<SortOption>("newest")
  const [filters, setFilters] = useState<FilterState>({
    dateRange: "all",
    categories: [],
  })
  
  // Cast JSON data to typed stories
  const stories = storiesData as Story[]

  // Filter and sort stories
  const filteredStories = useMemo(() => {
    let result = [...stories]

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (story) =>
          story.title.toLowerCase().includes(query) ||
          story.excerpt.toLowerCase().includes(query) ||
          story.approvalStatus.toLowerCase().includes(query)
      )
    }

    // Date range filter
    if (filters.dateRange !== "all") {
      const now = new Date()
      const cutoffDate = new Date()
      
      switch (filters.dateRange) {
        case "today":
          cutoffDate.setHours(0, 0, 0, 0)
          break
        case "week":
          cutoffDate.setDate(now.getDate() - 7)
          break
        case "month":
          cutoffDate.setDate(now.getDate() - 30)
          break
        case "quarter":
          cutoffDate.setMonth(now.getMonth() - 3)
          break
        case "year":
          cutoffDate.setFullYear(now.getFullYear() - 1)
          break
      }
      
      result = result.filter((story) => new Date(story.createdAt) >= cutoffDate)
    }

    // Category filter
    if (filters.categories.length > 0) {
      result = result.filter((story) =>
        filters.categories.some((cat) => story.category.toLowerCase() === cat.toLowerCase())
      )
    }

    // Sort
    switch (sortBy) {
      case "newest":
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
      case "oldest":
        result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
        break
      case "title":
        result.sort((a, b) => a.title.localeCompare(b.title))
        break
    }

    return result
  }, [stories, searchQuery, sortBy, filters])

  const handleStoryClick = (story: Story) => {
    // Navigate to campaign builder with this story
    router.push(`/stories/campaign-builder?storyId=${story.id}`)
  }

  const handleCreateNewStory = () => {
    router.push("/stories/campaign-builder")
  }

  return (
    <div className="flex-1 space-y-6 px-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Stories Library</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Browse, filter, and manage all donated event photos and their accompanying impact stories. Prepare content for your next campaign.
          </p>
        </div>
        <Button onClick={handleCreateNewStory}>
          <Plus className="h-4 w-4 mr-2" />
          Create New Story
        </Button>
      </div>

      {/* Search and Filters Row */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search stories, tags, or keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-muted/50 border-border"
          />
        </div>
        <FiltersSheet filters={filters} onFiltersChange={setFilters}>
          <Button variant="outline" className="gap-2">
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </Button>
        </FiltersSheet>
      </div>

      {/* Story Grid */}
      <StoryGrid
        stories={filteredStories}
        onStoryClick={handleStoryClick}
      />
    </div>
  )
}
