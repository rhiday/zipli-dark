"use client"

import Image from "next/image"
import { Pencil } from "lucide-react"
import { Card } from "@/components/ui/card"
import type { Story } from "../types"

interface StoryCardProps {
  story: Story
  onClick: () => void
}

export function StoryCard({ story, onClick }: StoryCardProps) {
  // Format date
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toISOString().split('T')[0]
  }

  return (
    <Card 
      className="group relative overflow-hidden bg-card border-border hover:border-primary/50 transition-colors cursor-pointer p-0"
      onClick={onClick}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={story.imageUrl}
          alt={story.title}
          fill
          className="object-cover transition-transform group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />
      </div>
      
      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <h3 className="font-semibold text-base leading-tight line-clamp-2">
          {story.title}
        </h3>
        
        {/* Consent Badges */}
        <div className="space-y-1 text-xs">
          {story.photoConsent && (
            <p className="text-muted-foreground">
              <span className="text-foreground">Photo Consent:</span> {story.photoConsent === 'signed' ? 'Signed' : story.photoConsent === 'verbal' ? 'Verbal' : 'Written'}
            </p>
          )}
          {story.storyConsent && (
            <p className="text-muted-foreground">
              <span className="text-foreground">Story Consent:</span> {story.storyConsent === 'signed' ? 'Signed' : story.storyConsent === 'verbal' ? 'Verbal' : 'Written'}
            </p>
          )}
          {story.consentNote && !story.photoConsent && !story.storyConsent && (
            <p className="text-muted-foreground">
              <span className="text-foreground">Consent:</span> {story.consentNote}
            </p>
          )}
        </div>
        
        {/* Footer: Approval Status + Date + Edit */}
        <div className="flex items-end justify-between pt-2 border-t border-border">
          <div className="space-y-0.5">
            <p className="text-xs text-muted-foreground">{story.approvalStatus}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">{formatDate(story.createdAt)}</span>
            <button 
              className="p-1 hover:bg-muted rounded transition-colors"
              onClick={(e) => {
                e.stopPropagation()
                // Edit action
              }}
            >
              <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
          </div>
        </div>
      </div>
    </Card>
  )
}
