"use client"

import { useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { QuickPresets } from "./components/quick-presets"
import { EmotionalTone } from "./components/emotional-tone"
import { AIPromptInput } from "./components/ai-prompt-input"
import { AssetContentPanel } from "./components/asset-content-panel"
import { PrivacyConsentPanel } from "./components/privacy-consent-panel"
import { ChannelCaptions } from "./components/channel-captions"
import { CampaignPreview } from "./components/campaign-preview"
import { useCampaignBuilder } from "./use-campaign-builder"
import storiesData from "../library/data/stories.json"
import type { Story } from "../library/types"

export default function CampaignBuilderPage() {
  const searchParams = useSearchParams()
  const storyId = searchParams.get("storyId")

  // Find story from ID if provided
  const initialStory = storyId 
    ? (storiesData as Story[]).find((s) => s.id === storyId) || null
    : null

  const {
    story,
    asset,
    privacy,
    prompt,
    selectedPreset,
    emotionalTone,
    isGenerating,
    error,
    setStory,
    setAsset,
    setPrivacy,
    setPrompt,
    setSelectedPreset,
    setEmotionalTone,
    generateCampaign,
  } = useCampaignBuilder(initialStory)

  // Update story when URL param changes
  useEffect(() => {
    if (storyId && !story) {
      const foundStory = (storiesData as Story[]).find((s) => s.id === storyId)
      if (foundStory) {
        setStory(foundStory)
      }
    }
  }, [storyId, story, setStory])

  const handleSave = () => {
    // TODO: Implement save functionality
    console.log("Saving campaign:", { asset, privacy })
  }

  return (
    <div className="flex-1 space-y-6 px-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/stories/library">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-semibold">Campaign Builder</h1>
            {story && (
              <p className="text-sm text-muted-foreground">
                Building campaign for: {story.title}
              </p>
            )}
          </div>
        </div>
        <Button onClick={handleSave} disabled={!asset.headline}>
          <Save className="h-4 w-4 mr-2" />
          Save Asset
        </Button>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* 3-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column - Quick Presets & AI Generation */}
        <div className="lg:col-span-3 space-y-4">
          <QuickPresets
            selectedPreset={selectedPreset}
            onPresetSelect={setSelectedPreset}
            isGenerating={isGenerating}
          />
          <EmotionalTone
            value={emotionalTone}
            onChange={setEmotionalTone}
          />
          <AIPromptInput
            prompt={prompt}
            onPromptChange={setPrompt}
            onGenerate={generateCampaign}
            isGenerating={isGenerating}
            hasStory={!!story}
          />
        </div>

        {/* Center Column - Asset Content */}
        <div className="lg:col-span-5">
          <AssetContentPanel
            asset={asset}
            onAssetChange={setAsset}
          />
        </div>

        {/* Right Column - Privacy, Captions, Preview */}
        <div className="lg:col-span-4 space-y-4">
          <PrivacyConsentPanel
            privacy={privacy}
            onPrivacyChange={setPrivacy}
          />
          <ChannelCaptions
            asset={asset}
            onAssetChange={setAsset}
          />
          <CampaignPreview asset={asset} />
        </div>
      </div>
    </div>
  )
}
