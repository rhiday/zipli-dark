export interface BrandColors {
  primary: string
  secondary: string
  accent: string
}

export interface BrandTypography {
  headlineFont: string
  bodyFont: string
}

export interface BrandSettings {
  logoUrl: string | null
  colors: BrandColors
  typography: BrandTypography
  toneOfVoice: string
}

export const DEFAULT_BRAND_SETTINGS: BrandSettings = {
  logoUrl: '/logos/suppilog.png',
  colors: {
    primary: '#6b21a8', // Suppilog purple
    secondary: '#2563eb', // Suppilog blue
    accent: '#f97316', // Orange accent
  },
  typography: {
    headlineFont: 'Arial',
    bodyFont: 'Verdana',
  },
  toneOfVoice: 'Professional, direct, and empathetic. We speak with clarity and purpose, focusing on positive impact and community empowerment.',
}

export const FONT_OPTIONS = [
  'Arial',
  'Verdana',
  'Georgia',
  'Times New Roman',
  'Helvetica',
  'Inter',
  'Roboto',
  'Open Sans',
  'Lato',
  'Montserrat',
]
