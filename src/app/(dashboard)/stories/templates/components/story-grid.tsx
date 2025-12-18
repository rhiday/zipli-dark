"use client"

import { StoryCard } from "./story-card"
import type { Story } from "../types"

interface StoryGridProps {
  stories: Story[]
  onStoryClick: (story: Story) => void
}

export function StoryGrid({ stories, onStoryClick }: StoryGridProps) {
  if (stories.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 border border-dashed border-border rounded-lg">
        <div className="text-center">
          <p className="text-muted-foreground">No stories found</p>
          <p className="text-sm text-muted-foreground/70">
            Try adjusting your filters or search query
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {stories.map((story) => (
        <StoryCard
          key={story.id}
          story={story}
          onClick={() => onStoryClick(story)}
        />
      ))}
    </div>
  )
}
