"use client"

import { useState, useCallback } from "react"
import type { Story } from "../templates/types"
import type { 
  CampaignAsset, 
  PrivacySettings, 
  CampaignPreset 
} from "./types"
import { DEFAULT_CAMPAIGN_ASSET, DEFAULT_PRIVACY } from "./types"
import type { DataCategory } from "./components/generation-settings-dialog"

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

  const generateFromTemplate = useCallback(async (templateId: string, selectedCategories?: DataCategory[]) => {
    setState((prev) => ({ ...prev, isGenerating: true, error: null }))

    // Default to all categories if none specified
    const categories = selectedCategories || ["impact", "climate", "partners", "operations", "business", "trends"]

    try {
      // Map template IDs to their image URLs
      const templateImages: Record<string, string> = {
        "impact-report": "/images/sodexo_2.jpg",
        "climate-champion": "/images/sodexo_6.jpg",
        "community-heroes": "/images/sodexo_7.jpg",
        "business-impact": "/images/sodexo_3.jpg?v=1",
        "food-journey": "/images/sodexo_5.jpg",
        "monthly-highlights": "/images/sodexo_4.jpg",
      }

      // Fetch real dashboard data
      const dashboardResponse = await fetch('/data/dashboard-data.json')
      const dashboardData = await dashboardResponse.json()

      // Calculate additional metrics from the data
      const metrics = dashboardData.metrics || {}
      const totalMeals = metrics.mealsSaved || 0
      const totalKg = metrics.totalDonationsKg || 0
      const co2Reduced = metrics.co2Reduced || 0
      const activeDonors = metrics.activeDonors || 0
      const activeReceivers = dashboardData.receivers?.length || 0
      
      // Get top 3 donors by total donations
      const topDonors = (dashboardData.donors || [])
        .sort((a: any, b: any) => b.totalDonations - a.totalDonations)
        .slice(0, 3)
        .map((d: any) => `${d.name} (${d.totalDonations} donations)`)
        .join(', ')
      
      // Get receiver names
      const receiverNames = (dashboardData.receivers || [])
        .map((r: any) => r.name)
        .slice(0, 3)
        .join(', ')
      
      // Get recent donations summary
      const recentDonations = (dashboardData.recentDonations || [])
        .slice(0, 3)
        .map((d: any) => `${d.quantity}kg from ${d.donorName} to ${d.receiverName}`)
        .join('; ')

      // Build data sections based on selected categories
      const buildDataSection = () => {
        const sections: string[] = []
        
        if (categories.includes("impact")) {
          sections.push(`## Impact Metrics:
- Total meals saved: ${totalMeals.toLocaleString()} meals
- Food rescued: ${totalKg.toLocaleString()} kg
- Families supported: ~${Math.floor(totalMeals / 84)} families (estimated at 21 meals per week)`)
        }
        
        if (categories.includes("climate")) {
          sections.push(`## Climate Data:
- CO₂ emissions prevented: ${co2Reduced.toLocaleString()} kg (${(co2Reduced / 1000).toFixed(1)} tons)
- Food waste diverted from landfill: ${totalKg.toLocaleString()} kg
- Equivalent impact: Removing ~${Math.floor(co2Reduced / 4000)} cars from the road for a year`)
        }
        
        if (categories.includes("partners")) {
          sections.push(`## Partner Network:
- Partner organizations: ${activeReceivers}
- Named partners: ${receiverNames}
- Key recipients: Red Cross Helsinki, Kohtaamispaikka Tsänssi, Andreas Congregation, Pelastusarmeija`)
        }
        
        if (categories.includes("operations")) {
          sections.push(`## Operational Data:
- Active Sodexo locations: ${activeDonors} restaurants across Helsinki
- Locations: Vilppulantie, University Main Building, Kamppi, Pasila, Helsinki Airport, Viikki
- Recent donations: ${recentDonations || "Daily pickups from all locations"}`)
        }
        
        if (categories.includes("business")) {
          sections.push(`## Business Metrics:
- Cost savings: ~€${(totalKg * 2).toLocaleString()} (estimated waste disposal costs avoided)
- CSR value: ~€${(totalMeals * 4).toLocaleString()} of community support provided
- Operational efficiency: ${activeDonors} locations integrated into program`)
        }
        
        if (categories.includes("trends")) {
          sections.push(`## Trends & Growth:
- Top performers: ${topDonors}
- Monthly trend: Steady growth in participation across locations
- Geographic reach: Helsinki metro area (city center, Pasila, Kamppi, Airport, University areas)`)
        }
        
        return sections.join('\n\n')
      }

      const dataSection = buildDataSection()
      const categoryNames = categories.map(c => {
        const names: Record<string, string> = {
          impact: "Impact metrics",
          climate: "Climate data",
          partners: "Partner network",
          operations: "Operational data",
          business: "Business metrics",
          trends: "Trends & growth"
        }
        return names[c]
      }).join(", ")

      // Build template-specific prompts with selected data categories
      const templatePrompts: Record<string, string> = {
        "impact-report": `You are creating a monthly Impact Report for Sodexo Finland's food rescue program in Helsinki.

${dataSection}

## Context:
Sodexo operates multiple locations in Helsinki that donate surplus food daily to local food banks and shelters.

## Story Requirements:
- Focus on: ${categoryNames}
- Use warm, community-focused tone that emphasizes both scale and personal impact
- Make it feel authentic to Sodexo's operations in Finland
- DO NOT use generic phrases like "our mission" - be specific about Sodexo's food rescue program
- Only include data points from the categories provided above`,

        "climate-champion": `You are creating a Climate Impact story for Sodexo Finland's environmental sustainability achievements.

${dataSection}

## Context:
Sodexo's Helsinki network transforms surplus food into meals instead of waste, preventing massive CO₂ emissions from food decomposition in landfills.

## Story Requirements:
- Focus on: ${categoryNames}
- Use inspiring, action-oriented tone
- Position Sodexo as a climate leader in corporate food service
- Make environmental impact feel concrete and measurable
- Only include data points from the categories provided above`,

        "community-heroes": `You are celebrating the partner organizations that receive food donations from Sodexo Helsinki.

${dataSection}

## Context:
These organizations collect surplus food daily from Sodexo locations across Helsinki and distribute it to vulnerable community members.

## Story Requirements:
- Focus on: ${categoryNames}
- Use heartfelt, grateful tone
- Make the volunteers and staff feel appreciated and recognized
- Only include data points from the categories provided above`,

        "business-impact": `You are creating a Corporate Social Responsibility (CSR) report for Sodexo Finland's business leadership.

${dataSection}

## Context:
Sodexo Finland has built a systematic food rescue program across Helsinki locations, turning operational surplus into measurable social and environmental impact.

## Story Requirements:
- Focus on: ${categoryNames}
- Use professional, achievement-oriented tone
- Frame as both good business AND good citizenship
- Only include data points from the categories provided above`,

        "food-journey": `You are telling the story of how surplus food travels from Sodexo kitchens to community tables.

${dataSection}

## Context:
Every day, surplus food from Sodexo's Helsinki network gets collected by food banks and distributed to families.

## Story Requirements:
- Focus on: ${categoryNames}
- Use narrative, storytelling tone that follows the food
- Make readers feel the transformation from "surplus" to "sustenance"
- Only include data points from the categories provided above`,

        "monthly-highlights": `You are creating a monthly celebration of Sodexo Helsinki's food rescue achievements.

${dataSection}

## Context:
Sodexo Helsinki has achieved significant milestones in their food rescue program this month.

## Story Requirements:
- Focus on: ${categoryNames}
- Use celebratory, data-driven tone
- Make achievements feel concrete and earned
- Only include data points from the categories provided above`,
      }

      const prompt = templatePrompts[templateId] || "Generate a compelling story based on available data."

      // Call the generate campaign API
      const response = await fetch("/api/generate-campaign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          story: null,
          prompt: prompt,
          preset: "impact_highlight",
          emotionalTone: 70,
        }),
      })

      const data = await response.json()
      
      if (!response.ok) {
        console.error('Campaign generation failed:', data)
        const errorMsg = data.error || "Failed to generate campaign"
        const details = data.details ? ` (${data.details})` : ''
        throw new Error(`${errorMsg}${details}`)
      }

      console.log('Received campaign data:', data)

      if (!data.asset) {
        console.error('Invalid response structure:', data)
        throw new Error("Invalid response: missing asset data")
      }

      // Add the template's image URL to the asset
      const assetWithImage = {
        ...data.asset,
        imageUrl: templateImages[templateId] || data.asset.imageUrl,
      }

      setState((prev) => ({
        ...prev,
        asset: assetWithImage,
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
  }, [])

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
    generateFromTemplate,
    resetCampaign,
  }
}
