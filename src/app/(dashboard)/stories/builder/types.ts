import type { Story } from "../templates/types"

export type CampaignChannel = 'facebook' | 'instagram' | 'email' | 'linkedin'

export interface ChannelCaption {
  channel: CampaignChannel
  caption: string
  hashtags: string[]
}

export interface PrivacySettings {
  anonymizedStory: boolean
  explicitConsent: boolean
  personalDataApproved: boolean
}

export interface CampaignAsset {
  headline: string
  pullQuote: string
  humanStory: string
  imageUrl: string
  channelCaptions: ChannelCaption[]
}

export interface Campaign {
  id: string
  storyId: string | null
  asset: CampaignAsset
  privacy: PrivacySettings
  createdAt: string
  updatedAt: string
}

export interface GenerateCampaignRequest {
  story: Story | null
  prompt: string
  preset?: CampaignPreset
}

export interface GenerateCampaignResponse {
  asset: CampaignAsset
  suggestedPrivacy: PrivacySettings
}

export type CampaignPreset = 
  | 'empathy_post' 
  | 'newsletter_feature' 
  | 'impact_highlight' 
  | 'volunteer_spotlight'
  | 'custom'

export const CAMPAIGN_PRESETS: { id: CampaignPreset; label: string; description: string }[] = [
  { 
    id: 'empathy_post', 
    label: 'Create Empathy Post',
    description: 'Heartfelt social media post focusing on human connection'
  },
  { 
    id: 'newsletter_feature', 
    label: 'Create Newsletter Feature',
    description: 'Longer-form story for email newsletters'
  },
  { 
    id: 'impact_highlight', 
    label: 'Impact Highlight',
    description: 'Data-driven post showcasing measurable impact'
  },
  { 
    id: 'volunteer_spotlight', 
    label: 'Volunteer Spotlight',
    description: 'Celebrate the people making a difference'
  },
]

export const CHANNEL_LABELS: Record<CampaignChannel, { label: string }> = {
  facebook: { label: 'Facebook' },
  instagram: { label: 'Instagram' },
  email: { label: 'Email' },
  linkedin: { label: 'LinkedIn' },
}

export const DEFAULT_PRIVACY: PrivacySettings = {
  anonymizedStory: false,
  explicitConsent: true,
  personalDataApproved: false,
}

export const DEFAULT_CAMPAIGN_ASSET: CampaignAsset = {
  headline: '',
  pullQuote: '',
  humanStory: '',
  imageUrl: '',
  channelCaptions: [
    { channel: 'facebook', caption: '', hashtags: [] },
    { channel: 'instagram', caption: '', hashtags: [] },
    { channel: 'email', caption: '', hashtags: [] },
    { channel: 'linkedin', caption: '', hashtags: [] },
  ],
}
