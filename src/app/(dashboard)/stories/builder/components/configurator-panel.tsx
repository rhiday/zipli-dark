"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { DATA_CATEGORIES, type DataCategory } from "./generation-settings-dialog"

interface ConfiguratorPanelProps {
  emotionalTone: number
  onEmotionalToneChange: (value: number) => void
  selectedCategories: DataCategory[]
  onCategoriesChange: (categories: DataCategory[]) => void
}

export function ConfiguratorPanel({
  emotionalTone,
  onEmotionalToneChange,
  selectedCategories,
  onCategoriesChange,
}: ConfiguratorPanelProps) {
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
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Data Categories Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Data to Include</CardTitle>
              <CardDescription>
                Select the data categories for your story
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={selectAll} className="h-7 text-xs">
                Select all
              </Button>
              <Button variant="ghost" size="sm" onClick={clearAll} className="h-7 text-xs">
                Clear
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {DATA_CATEGORIES.map((category) => (
              <div
                key={category.id}
                className="flex items-start space-x-3 p-3 rounded-lg border bg-card hover:bg-accent/50 cursor-pointer transition-colors"
                onClick={() => toggleCategory(category.id)}
              >
                <Checkbox
                  id={category.id}
                  checked={selectedCategories.includes(category.id)}
                  onCheckedChange={() => toggleCategory(category.id)}
                  className="shrink-0 mt-0.5"
                />
                <div className="flex flex-col min-w-0">
                  <label htmlFor={category.id} className="text-sm font-medium cursor-pointer">
                    {category.label}
                  </label>
                  <span className="text-xs text-muted-foreground">
                    {category.description}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Emotional Tone Card */}
      <Card>
        <CardHeader>
          <CardTitle>Emotional Tone</CardTitle>
          <CardDescription>
            Set the mood for your story content
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Tone</Label>
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
        </CardContent>
      </Card>

      {selectedCategories.length === 0 && (
        <p className="text-center text-sm text-muted-foreground pt-4">
          Please select at least one data category to generate your story
        </p>
      )}
    </div>
  )
}
