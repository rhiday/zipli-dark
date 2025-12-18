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

  const generateFromTemplate = useCallback(async (templateId: string) => {
    setState((prev) => ({ ...prev, isGenerating: true, error: null }))

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

      // Build template-specific prompts with real Sodexo data
      const templatePrompts: Record<string, string> = {
        "impact-report": `You are creating a monthly Impact Report for Sodexo Finland's food rescue program in Helsinki.

## Real Data (January 2025):
- Total meals saved: ${totalMeals.toLocaleString()} meals
- Food rescued: ${totalKg.toLocaleString()} kg
- Families supported: ~${Math.floor(totalMeals / 84)} families (estimated at 21 meals per week)
- Partner organizations: ${activeReceivers} (including Red Cross Helsinki, Kohtaamispaikka Tsänssi, Andreas Congregation)
- Active Sodexo locations: ${activeDonors} restaurants across Helsinki
- CO₂ emissions prevented: ${co2Reduced.toLocaleString()} kg

## Context:
Sodexo operates multiple locations in Helsinki (Vilppulantie, University Main Building, Kamppi, Pasila, Helsinki Airport, Viikki, etc.) that donate surplus food daily to local food banks and shelters.

## Story Requirements:
- Lead with the impressive meal count and human impact
- Mention specific Sodexo locations in Helsinki 
- Highlight partnerships with named organizations like Red Cross Helsinki and Kohtaamispaikka Tsänssi
- Include the environmental benefit (CO₂ saved)
- Use warm, community-focused tone that emphasizes both scale and personal impact
- Make it feel authentic to Sodexo's operations in Finland
- DO NOT use generic phrases like "our mission" - be specific about Sodexo's food rescue program`,

        "climate-champion": `You are creating a Climate Impact story for Sodexo Finland's environmental sustainability achievements.

## Real Data (January 2025):
- CO₂ emissions prevented: ${co2Reduced.toLocaleString()} kg (${(co2Reduced / 1000).toFixed(1)} tons)
- Food waste diverted: ${totalKg.toLocaleString()} kg
- Equivalent impact: Removing ~${Math.floor(co2Reduced / 4000)} cars from the road for a year
- Network: ${activeDonors} Sodexo locations participating daily
- Environmental partnerships: Helsinki food banks and community centers

## Context:
Sodexo's Helsinki network transforms surplus food into meals instead of waste, preventing massive CO₂ emissions from food decomposition in landfills. Each kilogram of food rescued prevents approximately 2.5kg of CO₂ emissions.

## Story Requirements:
- Lead with the dramatic CO₂ reduction figure
- Explain WHY this matters for climate (food waste = methane in landfills)
- Mention Sodexo's daily operations across ${activeDonors} Helsinki locations
- Include tangible comparisons (cars off road, trees planted equivalent)
- Use inspiring, action-oriented tone
- Position Sodexo as a climate leader in corporate food service
- Make environmental impact feel concrete and measurable`,

        "community-heroes": `You are celebrating the partner organizations that receive food donations from Sodexo Helsinki.

## Real Data (January 2025):
- Partner organizations: ${activeReceivers}
- Named partners: ${receiverNames}
- Total meals distributed by partners: ${totalMeals.toLocaleString()}
- Red Cross Helsinki: ~3,200 meals distributed
- Kohtaamispaikka Tsänssi: ~900 meals distributed  
- Andreas Congregation: ~1,850 meals distributed
- Pelastusarmeija: ~2,400 meals distributed
- Helsinki Food Bank: ~650 meals distributed

## Context:
These organizations collect surplus food daily from ${activeDonors} Sodexo locations across Helsinki and distribute it to vulnerable community members. They are the heroes who transform Sodexo's donations into direct support for families in need.

## Story Requirements:
- Celebrate these specific organizations by name (Red Cross Helsinki, Kohtaamispaikka Tsänssi, etc.)
- Highlight their dedication and daily commitment
- Share how they serve different communities (shelters, food banks, community centers)
- Include the meal counts they've distributed
- Use heartfelt, grateful tone
- Make the volunteers and staff feel appreciated and recognized
- Show the partnership between Sodexo's ${activeDonors} locations and these heroes`,

        "business-impact": `You are creating a Corporate Social Responsibility (CSR) report for Sodexo Finland's business leadership.

## Real Data (January 2025):
- Food waste reduced: ${totalKg.toLocaleString()} kg 
- Cost savings: ~€${(totalKg * 2).toLocaleString()} (estimated waste disposal costs avoided)
- Operational efficiency: ${activeDonors} Sodexo locations integrated into program
- Community partnerships: ${activeReceivers} active organizations
- Meals provided: ${totalMeals.toLocaleString()}
- CSR value: ~€${(totalMeals * 4).toLocaleString()} of community support provided
- Environmental compliance: ${co2Reduced.toLocaleString()} kg CO₂ prevented

## Context:
Sodexo Finland has built a systematic food rescue program across ${activeDonors} Helsinki locations (corporate restaurants, student restaurants, and airport facilities), turning operational surplus into measurable social and environmental impact.

## Story Requirements:
- Lead with business value: cost savings, efficiency, CSR metrics
- Emphasize systematic approach across ${activeDonors} locations
- Include environmental compliance benefits
- Highlight partnership network with ${activeReceivers} organizations
- Use professional, achievement-oriented tone
- Frame as both good business AND good citizenship
- Include specific location types: corporate, student, airport restaurants`,

        "food-journey": `You are telling the story of how surplus food travels from Sodexo kitchens to community tables.

## Real Data (Recent Donations):
${recentDonations}

## Journey Details:
- Starting points: ${activeDonors} Sodexo locations across Helsinki
- Top donors: ${topDonors}
- Destinations: ${receiverNames}, and others
- Volume: ${totalKg.toLocaleString()} kg total, ${(totalKg / activeDonors).toFixed(0)} kg per location average
- Timeline: Daily pickups, typically 2-4 hour window from kitchen to table

## Context:
Every day, surplus food from Sodexo's Helsinki network (university restaurants, corporate cafeterias, airport locations) gets collected by food banks and distributed to families. Show the actual journey with specific locations and recipients.

## Story Requirements:
- Tell a narrative journey: from Sodexo kitchen → pickup → distribution → family table
- Use specific location names (Sodexo Vilppulantie, Helsinki Airport, University Main Building, etc.)
- Use specific recipient names (Red Cross Helsinki, Kohtaamispaikka Tsänssi, etc.)
- Include the timeline (morning prep → lunch surplus → afternoon pickup → evening meals)
- Use narrative, storytelling tone that follows the food
- Make readers feel the transformation from "surplus" to "sustenance"
- Include real donation quantities: ${totalKg.toLocaleString()} kg moved`,

        "monthly-highlights": `You are creating a monthly celebration of Sodexo Helsinki's food rescue achievements.

## January 2025 Highlights:
- Meals saved: ${totalMeals.toLocaleString()} (↑ from previous months)
- Food rescued: ${totalKg.toLocaleString()} kg
- CO₂ prevented: ${co2Reduced.toLocaleString()} kg
- Active locations: ${activeDonors} Sodexo restaurants
- Top performers: ${topDonors}
- Partner growth: ${activeReceivers} active organizations
- Geographic reach: Helsinki metro area (city center, Pasila, Kamppi, Airport, University areas)

## Monthly Trends:
- Steady growth in participation across locations
- December achieved 22,500kg (90% of target)
- January on track to exceed previous month

## Story Requirements:
- Lead with celebration of ${totalMeals.toLocaleString()} meals milestone
- Recognize top-performing Sodexo locations by name
- Show month-over-month growth
- Include geographic spread across Helsinki
- Highlight both scale (total numbers) and consistency (daily operations)
- Use celebratory, data-driven tone
- Make achievements feel concrete and earned
- Thank the ${activeDonors} participating Sodexo teams`,
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
