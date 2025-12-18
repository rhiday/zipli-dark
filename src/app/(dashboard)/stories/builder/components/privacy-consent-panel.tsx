"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import type { PrivacySettings } from "../types"

interface PrivacyConsentPanelProps {
  privacy: PrivacySettings
  onPrivacyChange: (privacy: PrivacySettings) => void
}

export function PrivacyConsentPanel({ privacy, onPrivacyChange }: PrivacyConsentPanelProps) {
  const updateField = (field: keyof PrivacySettings, value: boolean) => {
    onPrivacyChange({ ...privacy, [field]: value })
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Privacy & Consent</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Anonymized Story */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="anonymized" className="text-sm font-medium">
              Anonymized Story
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              id="anonymized"
              checked={privacy.anonymizedStory}
              onCheckedChange={(checked) => updateField("anonymizedStory", checked)}
            />
            <span className="text-xs text-muted-foreground w-12">
              {privacy.anonymizedStory ? "Active" : "Off"}
            </span>
          </div>
        </div>

        {/* Explicit Consent */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="consent" className="text-sm font-medium">
              Explicit Consent
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              id="consent"
              checked={privacy.explicitConsent}
              onCheckedChange={(checked) => updateField("explicitConsent", checked)}
            />
            <span className="text-xs text-muted-foreground w-12">
              {privacy.explicitConsent ? "Active" : "Off"}
            </span>
          </div>
        </div>

        {/* Personal Data Approved */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="personalData" className="text-sm font-medium">
              Personal Data Approved
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              id="personalData"
              checked={privacy.personalDataApproved}
              onCheckedChange={(checked) => updateField("personalDataApproved", checked)}
            />
            <span className="text-xs text-muted-foreground w-12">
              {privacy.personalDataApproved ? "Active" : "Off"}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
