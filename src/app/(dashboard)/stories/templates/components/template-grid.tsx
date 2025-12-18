"use client"

import { TemplateCard } from "./template-card"
import type { StoryTemplate } from "../types"

interface TemplateGridProps {
  templates: StoryTemplate[]
  onTemplateClick: (template: StoryTemplate) => void
}

export function TemplateGrid({ templates, onTemplateClick }: TemplateGridProps) {
  if (templates.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 border border-dashed border-border rounded-lg">
        <div className="text-center">
          <p className="text-muted-foreground">No templates found</p>
          <p className="text-sm text-muted-foreground/70">
            Try adjusting your search query
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {templates.map((template) => (
        <TemplateCard
          key={template.id}
          template={template}
          onClick={() => onTemplateClick(template)}
        />
      ))}
    </div>
  )
}
