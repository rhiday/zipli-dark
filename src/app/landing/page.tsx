import type { Metadata } from 'next'
import { LandingPageContent } from './landing-page-content'

export const metadata: Metadata = {
  title: 'Zipli - Food rescue dashboard',
  description: 'Improve sustainability and reduce food waste',
}

export default function LandingPage() {
  return <LandingPageContent />
}
