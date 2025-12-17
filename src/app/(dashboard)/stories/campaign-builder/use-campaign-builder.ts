"use client"

import { useState, useCallback } from "react"
import type { Story } from "../library/types"
import type { 
  CampaignAsset, 
  PrivacySettings, 
  CampaignPreset 
} from "./types"
import { DEFAULT_CAMPAIGN_ASSET, DEFAULT_PRIVACY } from "./types"

export interface CampaignBuilderState {
  story: Story | null
  asset: CampaignAsset
  privacy: PrivacySettings
  prompt: string
  selectedPreset: CampaignPreset | null
  emotionalTone: number
  isGenerating: boolean
  error: string | null
}

export function useCampaignBuilder(initialStory: Story | null = null) {
  const [state, setState] = useState<CampaignBuilderState>({
    story: initialStory,
    asset: initialStory 
      ? { 
          ...DEFAULT_CAMPAIGN_ASSET, 
          imageUrl: initialStory.imageUrl,
          headline: initialStory.title,
          pullQuote: `"${initialStory.excerpt}"`,
          humanStory: `${initialStory.excerpt}\n\nThis story showcases the real-world impact of our food rescue initiatives and the dedicated individuals making it possible. Through collaboration and commitment, we're building stronger, more resilient communities.`,
        }
      : DEFAULT_CAMPAIGN_ASSET,
    privacy: DEFAULT_PRIVACY,
    prompt: "",
    selectedPreset: null,
    emotionalTone: 50,
    isGenerating: false,
    error: null,
  })

  const setStory = useCallback((story: Story | null) => {
    setState((prev) => ({
      ...prev,
      story,
      asset: story 
        ? { 
            ...prev.asset, 
            imageUrl: story.imageUrl,
            headline: story.title,
            pullQuote: `"${story.excerpt}"`,
            humanStory: `${story.excerpt}\n\nThis story showcases the real-world impact of our food rescue initiatives and the dedicated individuals making it possible. Through collaboration and commitment, we're building stronger, more resilient communities.`,
          }
        : prev.asset,
    }))
  }, [])

  const setAsset = useCallback((asset: CampaignAsset) => {
    setState((prev) => ({ ...prev, asset }))
  }, [])

  const setPrivacy = useCallback((privacy: PrivacySettings) => {
    setState((prev) => ({ ...prev, privacy }))
  }, [])

  const setPrompt = useCallback((prompt: string) => {
    setState((prev) => ({ ...prev, prompt }))
  }, [])

  const setSelectedPreset = useCallback((preset: CampaignPreset | null) => {
    setState((prev) => ({ ...prev, selectedPreset: preset }))
  }, [])

  const setEmotionalTone = useCallback((tone: number) => {
    setState((prev) => ({ ...prev, emotionalTone: tone }))
  }, [])

  const generateCampaign = useCallback(async () => {
    setState((prev) => ({ ...prev, isGenerating: true, error: null }))

    try {
      const response = await fetch("/api/generate-campaign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          story: state.story,
          prompt: state.prompt,
          preset: state.selectedPreset,
          emotionalTone: state.emotionalTone,
        }),
      })

      const data = await response.json()
      
      if (!response.ok) {
        const errorMsg = data.error || "Failed to generate campaign"
        const details = data.details ? ` (${data.details})` : ''
        throw new Error(`${errorMsg}${details}`)
      }

      // Validate response has required fields
      if (!data.asset) {
        throw new Error("Invalid response: missing asset data")
      }

      setState((prev) => ({
        ...prev,
        asset: data.asset,
        privacy: data.suggestedPrivacy,
        isGenerating: false,
      }))
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isGenerating: false,
        error: error instanceof Error ? error.message : "An error occurred",
      }))
    }
  }, [state.story, state.prompt, state.selectedPreset, state.emotionalTone])

  const resetCampaign = useCallback(() => {
    setState({
      story: null,
      asset: DEFAULT_CAMPAIGN_ASSET,
      privacy: DEFAULT_PRIVACY,
      prompt: "",
      selectedPreset: null,
      emotionalTone: 50,
      isGenerating: false,
      error: null,
    })
  }, [])

  return {
    ...state,
    setStory,
    setAsset,
    setPrivacy,
    setPrompt,
    setSelectedPreset,
    setEmotionalTone,
    generateCampaign,
    resetCampaign,
  }
}
