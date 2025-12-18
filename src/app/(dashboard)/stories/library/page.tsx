"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Plus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
    imageUrl: "/images/sodexo_3.jpg?v=1",
    dataPoints: ["Cost savings", "Operational efficiency", "CSR achievements", "Brand value"],
    suggestedChannels: ["linkedin", "newsletter", "blog"],
    color: "blue"
  },
  {
    id: "food-journey",
    title: "Food Journey",
    description: "Tell the story from surplus to table",
    category: "impact",
    imageUrl: "/images/sodexo_5.jpg",
    dataPoints: ["Donation sources", "Distribution network", "Recipient stories", "Impact timeline"],
    suggestedChannels: ["instagram", "facebook", "blog"],
    color: "purple"
  },
  {
    id: "monthly-highlights",
    title: "Monthly Highlights",
    description: "Share key metrics and achievements",
    category: "impact",
    imageUrl: "/images/sodexo_4.jpg",
    dataPoints: ["Monthly metrics", "Top performers", "Milestones reached", "Growth trends"],
    suggestedChannels: ["linkedin", "newsletter", "twitter"],
    color: "indigo"
  },
]

export default function StoriesLibraryPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")

  // Filter templates by search
  const filteredTemplates = searchQuery
    ? STORY_TEMPLATES.filter(
        (template) =>
          template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          template.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : STORY_TEMPLATES

  const handleTemplateClick = (template: StoryTemplate) => {
    // Navigate to campaign builder with this template
    router.push(`/stories/campaign-builder?templateId=${template.id}`)
  }

  return (
    <div className="flex-1 space-y-6 px-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold">Story Templates</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Choose a template to create compelling stories about your impact. Each template is designed to highlight different aspects of your food surplus program.
        </p>
      </div>

      {/* Search + New Template */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-muted/50 border-border"
          />
        </div>
        <Button asChild className="shrink-0">
          <Link href="/stories/campaign-builder">
            <Plus className="h-4 w-4 mr-2" />
            New template
          </Link>
        </Button>
      </div>

      {/* Template Grid */}
      <TemplateGrid
        templates={filteredTemplates}
        onTemplateClick={handleTemplateClick}
      />
    </div>
  )
}
