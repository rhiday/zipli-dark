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
  logoUrl: null,
  colors: {
    primary: '#115e59',
    secondary: '#475569',
    accent: '#f97316',
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
