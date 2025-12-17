"use client"

import { Upload } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { BrandSettings } from "../types"
import { FONT_OPTIONS } from "../types"

interface BrandGuidelinesFormProps {
  settings: BrandSettings
  onSettingsChange: (settings: BrandSettings) => void
  onSave: () => void
  isSaving: boolean
}

export function BrandGuidelinesForm({ 
  settings, 
  onSettingsChange, 
  onSave,
  isSaving 
}: BrandGuidelinesFormProps) {
  const updateColors = (key: keyof typeof settings.colors, value: string) => {
    onSettingsChange({
      ...settings,
      colors: { ...settings.colors, [key]: value },
    })
  }

  const updateTypography = (key: keyof typeof settings.typography, value: string) => {
    onSettingsChange({
      ...settings,
      typography: { ...settings.typography, [key]: value },
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Brand Guidelines</CardTitle>
        <CardDescription>
          Manage your organization&apos;s visual and textual identity.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Organization Logo */}
        <div className="space-y-3">
          <div>
            <h3 className="text-sm font-medium">Organization Logo</h3>
            <p className="text-xs text-muted-foreground">
              Upload your brand logo for consistent use across all assets.
            </p>
          </div>
          <div className="flex items-center justify-center w-full">
            <label
              htmlFor="logo-upload"
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer bg-muted/30 hover:bg-muted/50 transition-colors"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">
                  Accepted: PNG, JPG, SVG. Max 5MB.
                </p>
              </div>
              <input id="logo-upload" type="file" className="hidden" accept="image/*" />
            </label>
          </div>
        </div>

        {/* Color Palette */}
        <div className="space-y-3">
          <div>
            <h3 className="text-sm font-medium">Color Palette</h3>
            <p className="text-xs text-muted-foreground">
              Define your primary, secondary, and accent colors.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="primary-color" className="text-xs">Primary Color</Label>
              <div className="flex gap-2">
                <input
                  type="color"
                  id="primary-color"
                  value={settings.colors.primary}
                  onChange={(e) => updateColors("primary", e.target.value)}
                  className="w-10 h-9 rounded border border-border cursor-pointer"
                />
                <Input
                  value={settings.colors.primary}
                  onChange={(e) => updateColors("primary", e.target.value)}
                  className="flex-1 bg-muted/50 font-mono text-xs"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="secondary-color" className="text-xs">Secondary Color</Label>
              <div className="flex gap-2">
                <input
                  type="color"
                  id="secondary-color"
                  value={settings.colors.secondary}
                  onChange={(e) => updateColors("secondary", e.target.value)}
                  className="w-10 h-9 rounded border border-border cursor-pointer"
                />
                <Input
                  value={settings.colors.secondary}
                  onChange={(e) => updateColors("secondary", e.target.value)}
                  className="flex-1 bg-muted/50 font-mono text-xs"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="accent-color" className="text-xs">Accent Color</Label>
              <div className="flex gap-2">
                <input
                  type="color"
                  id="accent-color"
                  value={settings.colors.accent}
                  onChange={(e) => updateColors("accent", e.target.value)}
                  className="w-10 h-9 rounded border border-border cursor-pointer"
                />
                <Input
                  value={settings.colors.accent}
                  onChange={(e) => updateColors("accent", e.target.value)}
                  className="flex-1 bg-muted/50 font-mono text-xs"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Typography */}
        <div className="space-y-3">
          <div>
            <h3 className="text-sm font-medium">Typography</h3>
            <p className="text-xs text-muted-foreground">
              Select your brand fonts for headlines and body text.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="headline-font" className="text-xs">Headline Font</Label>
              <Select
                value={settings.typography.headlineFont}
                onValueChange={(value) => updateTypography("headlineFont", value)}
              >
                <SelectTrigger className="bg-muted/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FONT_OPTIONS.map((font) => (
                    <SelectItem key={font} value={font}>
                      {font}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="body-font" className="text-xs">Body Font</Label>
              <Select
                value={settings.typography.bodyFont}
                onValueChange={(value) => updateTypography("bodyFont", value)}
              >
                <SelectTrigger className="bg-muted/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FONT_OPTIONS.map((font) => (
                    <SelectItem key={font} value={font}>
                      {font}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Tone of Voice */}
        <div className="space-y-3">
          <div>
            <h3 className="text-sm font-medium">Tone of Voice</h3>
            <p className="text-xs text-muted-foreground">
              Describe your brand&apos;s communication style.
            </p>
          </div>
          <Textarea
            placeholder="Describe your brand's tone of voice..."
            value={settings.toneOfVoice}
            onChange={(e) => onSettingsChange({ ...settings, toneOfVoice: e.target.value })}
            className="min-h-[100px] bg-muted/50"
          />
        </div>

        {/* Save Button */}
        <Button 
          onClick={onSave} 
          disabled={isSaving}
          className="w-full"
        >
          {isSaving ? "Saving..." : "Save Brand Settings"}
        </Button>
      </CardContent>
    </Card>
  )
}
