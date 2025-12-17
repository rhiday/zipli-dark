"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"

interface EmotionalToneProps {
  value: number
  onChange: (value: number) => void
}

export function EmotionalTone({ value, onChange }: EmotionalToneProps) {
  const getToneLabel = (value: number) => {
    if (value <= 20) return "Factual & Professional"
    if (value <= 40) return "Informative & Balanced"
    if (value <= 60) return "Warm & Engaging"
    if (value <= 80) return "Heartfelt & Emotional"
    return "Deeply Moving"
  }

  return (
    <Card className="border-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Emotional Tone</CardTitle>
        <CardDescription>
          Adjust the emotional intensity of generated content
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-center">
          <span className="text-sm font-medium">{getToneLabel(value)}</span>
        </div>
        <Slider
          value={[value]}
          onValueChange={(values) => onChange(values[0])}
          min={0}
          max={100}
          step={5}
          className="w-full"
        />
      </CardContent>
    </Card>
  )
}
