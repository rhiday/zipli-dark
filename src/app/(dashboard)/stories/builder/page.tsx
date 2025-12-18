"use client"

import { useEffect, useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Sparkles, Settings2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AssetContentPanel } from "./components/asset-content-panel"
import { PrivacyConsentPanel } from "./components/privacy-consent-panel"
import { ChannelCaptions } from "./components/channel-captions"
import { CampaignPreview } from "./components/campaign-preview"
import { GenerationSettingsDialog, DataCategory, DATA_CATEGORIES } from "./components/generation-settings-dialog"
import { useCampaignBuilder } from "./use-campaign-builder"
import storiesData from "../templates/data/stories.json"
import type { Story } from "../templates/types"

export default function StoryBuilderPage() {
  const searchParams = useSearchParams()
  const storyId = searchParams.get("storyId")
  const templateId = searchParams.get("templateId")
  const [templateTitle, setTemplateTitle] = useState<string | null>(null)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [hasGenerated, setHasGenerated] = useState(false)
  const [selectedCategories, setSelectedCategories] = useState<DataCategory[]>(
    DATA_CATEGORIES.map((c) => c.id) // All selected by default
  )

  // Find story from ID if provided
  const initialStory = storyId 
    ? (storiesData as Story[]).find((s) => s.id === storyId) || null
    : null

  const {
    story,
    asset,
    privacy,
    emotionalTone,
    isGenerating,
    error,
    setStory,
    setAsset,
    setPrivacy,
    setEmotionalTone,
    generateFromTemplate,
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

  const loadingMessages = useMemo(
    () => [
      "Fetching donation data…",
      "Calculating impact…",
      "Generating content…",
    ],
    []
  )

  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0)

  // Rotate loading message while template generation is running
  useEffect(() => {
    if (!templateId) return
    if (!isGenerating) return

    setLoadingMessageIndex(0)
    const id = window.setInterval(() => {
      setLoadingMessageIndex((i) => (i + 1) % loadingMessages.length)
    }, 1800)

    return () => window.clearInterval(id)
  }, [templateId, isGenerating, loadingMessages.length])

  // Template name mapping
  const templateNames: Record<string, string> = {
    "impact-report": "Impact Report",
    "climate-champion": "Climate Champion",
    "community-heroes": "Community Heroes",
    "business-impact": "Business Impact",
    "food-journey": "Food Journey",
    "monthly-highlights": "Monthly Highlights",
  }

  // Generate from template when templateId is provided (only on first load)
  useEffect(() => {
    if (templateId && !asset.headline && !hasGenerated) {
      setTemplateTitle(templateNames[templateId] || "Custom Template")
      setHasGenerated(true)
      generateFromTemplate(templateId, selectedCategories)
    }
  }, [templateId, asset.headline, generateFromTemplate, hasGenerated, selectedCategories])

  // Handle generate/regenerate
  const handleGenerate = () => {
    // Use templateId if available, otherwise use a default "impact-report" template
    const templateToUse = templateId || "impact-report"
    setHasGenerated(true)
    generateFromTemplate(templateToUse, selectedCategories)
  }

  // Determine button text - only show "Regenerate" after AI has generated content
  const generateButtonText = hasGenerated ? "Regenerate" : "Generate with AI"

  return (
    <div className="flex-1 space-y-4 sm:space-y-6 px-4 sm:px-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3 sm:gap-4">
          <Button variant="ghost" size="icon" asChild className="shrink-0">
            <Link href="/stories/templates">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-semibold truncate">Story Builder</h1>
            {templateTitle && (
              <p className="text-xs sm:text-sm text-muted-foreground truncate">
                Template: {templateTitle}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 ml-11 sm:ml-0">
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => setSettingsOpen(true)}
            className="shrink-0"
          >
            <Settings2 className="h-4 w-4" />
          </Button>
          <Button 
            onClick={handleGenerate} 
            disabled={isGenerating}
            size="sm"
            className="sm:size-default"
          >
            {isGenerating ? (
              <Loader2 className="h-4 w-4 sm:mr-2 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4 sm:mr-2" />
            )}
            <span className="hidden sm:inline">{isGenerating ? "Generating..." : generateButtonText}</span>
            <span className="sm:hidden">{isGenerating ? "..." : (hasGenerated ? "Regen" : "Generate")}</span>
          </Button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {isGenerating && !asset.headline ? (
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-center">
            <p className="text-lg font-medium">{loadingMessages[loadingMessageIndex]}</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Building your story from the selected template
            </p>
          </div>
        </div>
      ) : (
        /* 2-Column Layout */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Asset Content */}
          <div>
            <AssetContentPanel
              asset={asset}
              onAssetChange={setAsset}
            />
          </div>

          {/* Right Column - Privacy, Captions, Preview */}
          <div className="space-y-4">
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
      )}

      {/* Settings Dialog */}
      <GenerationSettingsDialog
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        emotionalTone={emotionalTone}
        onEmotionalToneChange={setEmotionalTone}
        selectedCategories={selectedCategories}
        onCategoriesChange={setSelectedCategories}
      />
    </div>
  )
}
