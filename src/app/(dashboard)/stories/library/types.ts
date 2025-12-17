export type ConsentType = 'signed' | 'verbal' | 'written' | null
export type StoryCategory = 'corporate' | 'volunteer' | 'impact' | 'partnership' | 'education' | 'sustainability' | 'community'
export type Channel = 'linkedin' | 'instagram' | 'facebook' | 'twitter' | 'blog' | 'newsletter'

export interface Story {
  id: string
  title: string
  excerpt: string
  imageUrl: string
  photoConsent: ConsentType
  storyConsent: ConsentType
  consentNote?: string
  approvalStatus: string
  channels: Channel[]
  createdAt: string
  category: StoryCategory
}

export type SortOption = 'newest' | 'oldest' | 'title'

export interface StoryFilters {
  search: string
  category: StoryCategory | 'all'
  sortBy: SortOption
}

export const CHANNELS: { id: Channel; label: string }[] = [
  { id: 'linkedin', label: 'LinkedIn' },
  { id: 'instagram', label: 'Instagram' },
  { id: 'facebook', label: 'Facebook' },
  { id: 'twitter', label: 'Twitter' },
  { id: 'blog', label: 'Blog Post' },
  { id: 'newsletter', label: 'Newsletter' },
]

export const CATEGORY_LABELS: Record<StoryCategory, string> = {
  corporate: 'Corporate',
  volunteer: 'Volunteer',
  impact: 'Impact',
  partnership: 'Partnership',
  education: 'Education',
  sustainability: 'Sustainability',
  community: 'Community',
}
