"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import { PenLine } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TemplateGrid } from "./components/template-grid"
import type { StoryTemplate } from "./types"

const STORY_TEMPLATES: StoryTemplate[] = [
  {
    id: "impact-report",
    title: "Impact Report",
    description: "Showcase meals saved and families helped",
    category: "impact",
    imageUrl: "/images/sodexo_2.jpg",
    dataPoints: ["Meals saved", "Families helped", "Kilos donated", "Organizations supported"],
    suggestedChannels: ["linkedin", "newsletter", "facebook"],
    color: "cyan"
  },
  {
    id: "climate-champion",
    title: "Climate Champion",
    description: "Highlight CO₂ emissions prevented and environmental impact",
    category: "sustainability",
    imageUrl: "/images/sodexo_6.jpg",
    dataPoints: ["CO₂ avoided", "Emissions saved", "Food waste reduced", "Sustainability goals"],
    suggestedChannels: ["linkedin", "instagram", "blog"],
    color: "green"
  },
  {
    id: "community-heroes",
    title: "Community Heroes",
    description: "Celebrate volunteers and partner organizations",
    category: "volunteer",
    imageUrl: "/images/sodexo_7.jpg",
    dataPoints: ["Volunteer hours", "Partner organizations", "Community reach", "Stories shared"],
    suggestedChannels: ["facebook", "instagram", "newsletter"],
    color: "orange"
  },
  {
    id: "business-impact",
    title: "Business Impact",
    description: "Demonstrate corporate responsibility and cost savings",
    category: "corporate",
    imageUrl: "/images/business_impact.jpg",
    dataPoints: ["Cost savings", "Operational efficiency", "CSR achievements", "Brand value"],
    suggestedChannels: ["linkedin", "newsletter", "blog"],
    color: "blue"
  },
  {
    id: "food-journey",
    title: "Food Journey",
    description: "Tell the story from surplus to table",
    category: "impact",
    imageUrl: "/images/monthly_highlights.jpeg",
    dataPoints: ["Donation sources", "Distribution network", "Recipient stories", "Impact timeline"],
    suggestedChannels: ["instagram", "facebook", "blog"],
    color: "purple"
  },
  {
    id: "monthly-highlights",
    title: "Monthly Highlights",
    description: "Share key metrics and achievements",
    category: "impact",
    imageUrl: "/images/food_journey.webp",
    dataPoints: ["Monthly metrics", "Top performers", "Milestones reached", "Growth trends"],
    suggestedChannels: ["linkedin", "newsletter", "twitter"],
    color: "indigo"
  }
]

export default function StoriesLibraryPage() {
  const router = useRouter()

  const filteredTemplates = STORY_TEMPLATES

  const handleTemplateClick = (template: StoryTemplate) => {
    // Navigate to campaign builder with this template
router.push(`/stories/builder?templateId=${template.id}`)
  }

  return (
    <div className="flex-1 space-y-6 sm:space-y-8 px-4 sm:px-6">
      {/* Page Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-semibold">Choose your story</h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Share your impact with compelling stories
        </p>
      </div>

      {/* Create from scratch and template divider */}
      <div className="relative flex items-center py-4 sm:py-6">
        {/* Left side - divider with text */}
        <div className="flex-1 relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-start">
            <span className="bg-background pr-4 text-lg font-medium text-muted-foreground">
              Choose from a template
            </span>
          </div>
        </div>
        
        {/* Right side - Create button */}
        <div className="ml-6">
          <Button asChild size="default" className="sm:size-lg">
            <Link href="/stories/builder">
              <PenLine className="h-4 w-4 mr-2" />
              Create from scratch
            </Link>
          </Button>
        </div>
      </div>

      {/* Template Grid */}
      <TemplateGrid
        templates={filteredTemplates}
        onTemplateClick={handleTemplateClick}
      />
    </div>
  )
}
