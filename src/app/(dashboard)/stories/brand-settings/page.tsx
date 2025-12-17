"use client"

import { useState } from "react"
import { BrandGuidelinesForm } from "./components/brand-guidelines-form"
import { BrandPreview } from "./components/brand-preview"
import { ImportInstructions } from "./components/import-instructions"
import type { BrandSettings } from "./types"
import { DEFAULT_BRAND_SETTINGS } from "./types"

export default function BrandSettingsPage() {
  const [settings, setSettings] = useState<BrandSettings>(DEFAULT_BRAND_SETTINGS)
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    // Simulate save - in production this would call an API
    await new Promise((resolve) => setTimeout(resolve, 1000))
    console.log("Brand settings saved:", settings)
    setIsSaving(false)
  }

  return (
    <div className="flex-1 space-y-6 px-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold">Brand Settings</h1>
        <p className="text-sm text-muted-foreground">
          Configure your brand identity for consistent marketing campaigns.
        </p>
      </div>

      {/* 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Form */}
        <BrandGuidelinesForm
          settings={settings}
          onSettingsChange={setSettings}
          onSave={handleSave}
          isSaving={isSaving}
        />

        {/* Right Column - Preview */}
        <BrandPreview settings={settings} />
      </div>

      {/* Import Instructions */}
      <ImportInstructions />
    </div>
  )
}
