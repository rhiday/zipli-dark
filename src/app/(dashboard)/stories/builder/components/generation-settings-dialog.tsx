"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"

export type DataCategory = 
  | "feedback"
  | "impact"
  | "climate"
  | "partners"
  | "operations"
  | "business"

export const DATA_CATEGORIES: { id: DataCategory; label: string; description: string }[] = [
  { id: "feedback", label: "Customer feedback", description: "Reviews, testimonials" },
  { id: "impact", label: "Impact metrics", description: "Meals saved, families helped" },
  { id: "climate", label: "Climate data", description: "CO₂ reduced, waste diverted" },
  { id: "partners", label: "Partner network", description: "Organizations, distributions" },
  { id: "operations", label: "Operational data", description: "Locations, logistics" },
  { id: "business", label: "Business metrics", description: "Costs, efficiency" },
]

interface GenerationSettingsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  emotionalTone: number
  onEmotionalToneChange: (value: number) => void
  selectedCategories: DataCategory[]
  onCategoriesChange: (categories: DataCategory[]) => void
}

export function GenerationSettingsDialog({
  open,
  onOpenChange,
  emotionalTone,
  onEmotionalToneChange,
  selectedCategories,
  onCategoriesChange,
}: GenerationSettingsDialogProps) {
  const getToneLabel = (value: number) => {
    if (value < 33) return "Professional & Formal"
    if (value < 66) return "Warm & Engaging"
    return "Inspiring & Celebratory"
  }

  const toggleCategory = (category: DataCategory) => {
    if (selectedCategories.includes(category)) {
      onCategoriesChange(selectedCategories.filter((c) => c !== category))
    } else {
      onCategoriesChange([...selectedCategories, category])
    }
  }

  const selectAll = () => {
    onCategoriesChange(DATA_CATEGORIES.map((c) => c.id))
  }

  const clearAll = () => {
    onCategoriesChange([])
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Generation Settings</DialogTitle>
          <DialogDescription>
            Customize how AI generates your story content
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Emotional Tone */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Emotional Tone</Label>
              <span className="text-sm text-muted-foreground">
                {getToneLabel(emotionalTone)}
              </span>
            </div>
            <Slider
              value={[emotionalTone]}
              onValueChange={([value]) => onEmotionalToneChange(value)}
              max={100}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Professional</span>
              <span>Warm</span>
              <span>Celebratory</span>
            </div>
          </div>

          {/* Data Categories */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Include Data</Label>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={selectAll} className="h-7 text-xs">
                  Select all
                </Button>
                <Button variant="ghost" size="sm" onClick={clearAll} className="h-7 text-xs">
                  Clear
                </Button>
              </div>
            </div>
            <div className="space-y-1">
              {DATA_CATEGORIES.map((category) => (
                <div
                  key={category.id}
                  className="flex items-center space-x-2 py-1.5 cursor-pointer"
                  onClick={() => toggleCategory(category.id)}
                >
                  <Checkbox
                    id={category.id}
                    checked={selectedCategories.includes(category.id)}
                    onCheckedChange={() => toggleCategory(category.id)}
                    className="shrink-0"
                  />
                  <div className="flex flex-col sm:flex-row sm:items-center sm:gap-1 min-w-0">
                    <label htmlFor={category.id} className="text-sm cursor-pointer">
                      {category.label}
                    </label>
                    <span className="text-xs text-muted-foreground hidden sm:inline">({category.description})</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
