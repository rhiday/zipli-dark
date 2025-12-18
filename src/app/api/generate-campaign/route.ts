import { openai } from '@ai-sdk/openai'
import { generateObject } from 'ai'
import { z } from 'zod'

const SYSTEM_PROMPT = `You are a marketing content specialist for Zipli, a Finnish food rescue platform that connects restaurants with food banks to reduce waste and fight hunger.

## Your Task
Generate compelling marketing campaign content based on impact stories. Your content should:
1. Be authentic and emotionally resonant
2. Highlight the human impact of food rescue
3. Include relevant metrics when available (meals provided, CO2 saved)
4. Be appropriate for different social media platforms

## Brand Voice
- Warm and empathetic
- Hopeful and inspiring
- Community-focused
- Data-backed but not cold

## Platform Guidelines
- **Facebook**: Longer posts welcome (up to 500 chars), focus on community and sharing
- **Instagram**: Visual-first, shorter captions (150-200 chars), heavy hashtag use
- **LinkedIn**: Professional tone, focus on impact metrics and corporate responsibility
- **Email**: Personal, storytelling format, call-to-action friendly

## Content Structure
- **Headline**: Catchy, emotional hook (max 80 chars)
- **Pull Quote**: A memorable quote that captures the essence (in quotes)
- **Human Story**: 2-3 paragraph narrative (150-250 words)
- **Channel Captions**: Platform-specific versions with appropriate tone and hashtags`

const CampaignAssetSchema = z.object({
  headline: z.string().describe('Emotional, catchy headline (max 80 chars)'),
  pullQuote: z.string().describe('Memorable quote capturing the story essence, in quotation marks'),
  humanStory: z.string().describe('2-3 paragraph narrative (150-250 words)'),
  imageUrl: z.string().describe('Always provide empty string "" for this field'),
  channelCaptions: z.array(z.object({
    channel: z.enum(['facebook', 'instagram', 'email', 'linkedin']),
    caption: z.string().describe('Platform-appropriate caption'),
    hashtags: z.array(z.string()).describe('Relevant hashtags without # symbol'),
  })),
})

const PrivacySettingsSchema = z.object({
  anonymizedStory: z.boolean().describe('Whether names/identifiable details should be changed'),
  explicitConsent: z.boolean().describe('Whether explicit consent has been given'),
  personalDataApproved: z.boolean().describe('Whether personal data usage is approved'),
})

const GenerateCampaignResponseSchema = z.object({
  asset: CampaignAssetSchema,
  suggestedPrivacy: PrivacySettingsSchema.optional().default({
    anonymizedStory: true,
    explicitConsent: false,
    personalDataApproved: false,
  }),
})

export type GenerateCampaignAPIResponse = z.infer<typeof GenerateCampaignResponseSchema>

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { story, prompt, preset } = body

    if (!prompt && !story) {
      return Response.json(
        { error: 'Either a story or a prompt is required' },
        { status: 400 }
      )
    }

    // Build context from story if provided
    let storyContext = ''
    if (story) {
      storyContext = `
## Story Details
- **Title**: ${story.title}
- **Summary**: ${story.excerpt}
- **Category**: ${story.category}
- **Consent Status**: ${story.consentStatus}
- **Emotional Tone**: ${story.emotionalTone}/100 (0=Solitude, 50=Connection, 100=Celebration)
- **Available Channels**: ${story.channels?.join(', ') || 'all'}
- **Image URL**: ${story.imageUrl}

## Impact Metrics
- Meals Provided: ${story.impactMetrics?.mealsProvided || 'N/A'}
- CO₂ Saved: ${story.impactMetrics?.co2SavedKg || 'N/A'} kg
- Volunteers Inspired: ${story.impactMetrics?.volunteersInspired || 'N/A'}
`
    }

    // Build preset instructions
    let presetInstructions = ''
    switch (preset) {
      case 'empathy_post':
        presetInstructions = `
## Preset: Empathy Post
Focus on emotional connection and human warmth. Lead with feelings, not data.
Tone: Heartfelt, personal, community-building
Length: Medium (social media friendly)`
        break
      case 'newsletter_feature':
        presetInstructions = `
## Preset: Newsletter Feature  
Create a longer-form story suitable for email newsletters.
Tone: Narrative, engaging, personal
Length: Longer human story (250+ words), detailed`
        break
      case 'impact_highlight':
        presetInstructions = `
## Preset: Impact Highlight
Lead with impressive numbers and measurable outcomes.
Tone: Inspiring, data-driven but warm
Length: Concise but impactful`
        break
      case 'volunteer_spotlight':
        presetInstructions = `
## Preset: Volunteer Spotlight
Celebrate the person/people making a difference.
Tone: Grateful, celebratory, inspiring
Length: Medium, focus on personal journey`
        break
    }

    const userPrompt = `${storyContext}
${presetInstructions}

## User Request
${prompt || 'Generate a compelling marketing campaign based on this story.'}

## Requirements
1. Generate a headline, pull quote, and human story
2. Create platform-specific captions for Facebook, Instagram, LinkedIn, and Email
3. Include relevant hashtags for each platform
4. Suggest appropriate privacy settings based on the consent status
5. For imageUrl field: use empty string "" (we will handle images separately)`

    let result
    try {
      result = await generateObject({
        model: openai('gpt-4o-mini'),
        schema: GenerateCampaignResponseSchema,
        system: SYSTEM_PROMPT,
        prompt: userPrompt,
      })
    } catch (validationError) {
      console.error('AI response validation error:', validationError)
      if (validationError instanceof Error) {
        console.error('Validation error details:', validationError.message)
      }
      throw new Error('The AI generated content that did not match the expected format. Please try again.')
    }

    // Ensure we have a valid response
    if (!result.object) {
      console.error('No object generated from AI')
      throw new Error('No object generated: could not parse the response')
    }

    // Log the generated object for debugging
    console.log('Generated campaign object:', JSON.stringify(result.object, null, 2))

    return Response.json(result.object)
  } catch (error) {
    console.error('Campaign generation error:', error)
    
    // Provide more detailed error info
    const errorMessage = error instanceof Error ? error.message : 'Campaign generation failed'
    const errorDetails = error instanceof Error && 'cause' in error ? String(error.cause) : undefined
    
    return Response.json(
      { 
        error: errorMessage,
        details: errorDetails,
      },
      { status: 500 }
    )
  }
}
