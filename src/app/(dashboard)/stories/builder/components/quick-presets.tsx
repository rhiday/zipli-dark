"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CAMPAIGN_PRESETS, type CampaignPreset } from "../types"

interface QuickPresetsProps {
  selectedPreset: CampaignPreset | null
  onPresetSelect: (preset: CampaignPreset) => void
  isGenerating: boolean
}

export function QuickPresets({ selectedPreset, onPresetSelect, isGenerating }: QuickPresetsProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Quick Presets</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {CAMPAIGN_PRESETS.map((preset) => (
          <Button
            key={preset.id}
            variant={selectedPreset === preset.id ? "default" : "outline"}
            className="w-full justify-start"
            onClick={() => onPresetSelect(preset.id)}
            disabled={isGenerating}
          >
            {preset.label}
          </Button>
        ))}
      </CardContent>
    </Card>
  )
}
