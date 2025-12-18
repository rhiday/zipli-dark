"use client"

import Image from "next/image"
import { Check } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { StoryTemplate } from "../types"

interface TemplateCardProps {
  template: StoryTemplate
  onClick: () => void
}

const colorStyles = {
  cyan: "from-cyan-500/20 to-cyan-500/5 border-cyan-500/20",
  green: "from-green-500/20 to-green-500/5 border-green-500/20",
  orange: "from-orange-500/20 to-orange-500/5 border-orange-500/20",
  blue: "from-blue-500/20 to-blue-500/5 border-blue-500/20",
  purple: "from-purple-500/20 to-purple-500/5 border-purple-500/20",
  indigo: "from-indigo-500/20 to-indigo-500/5 border-indigo-500/20",
}

const badgeColorStyles = {
  cyan: "bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border-cyan-500/20",
  green: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20",
  orange: "bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20",
  blue: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
  purple: "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20",
  indigo: "bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-500/20",
}

export function TemplateCard({ template, onClick }: TemplateCardProps) {
  return (
    <Card 
      className="group relative overflow-hidden bg-card border-border hover:border-primary/50 transition-all hover:shadow-lg p-0 flex flex-col h-full"
    >
      {/* Background Image with Overlay */}
      <div className="relative h-52 overflow-hidden flex-shrink-0">
        <Image
          src={template.imageUrl}
          alt={template.title}
          fill
          className={`object-cover ${
            template.id === 'business-impact' || template.id === 'food-journey' 
              ? 'object-center' 
              : 'object-top'
          }`}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className={`absolute inset-0 bg-gradient-to-br ${colorStyles[template.color]}`} />
      </div>
      
      {/* Content */}
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">
          {template.title}
        </CardTitle>
        <CardDescription className="text-sm min-h-[40px]">
          {template.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col flex-1 pb-4">
        {/* Data Points */}
        <div className="flex-1">
          <p className="text-xs font-medium text-muted-foreground mb-2">Includes:</p>
          <div className="space-y-1.5">
            {template.dataPoints.slice(0, 2).map((point, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <Check className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                <span className="text-muted-foreground">{point}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Select Template Button */}
        <Button 
          onClick={onClick}
          className="w-full cursor-pointer mt-4"
          size="sm"
        >
          Select template
        </Button>
      </CardContent>
    </Card>
  )
}
