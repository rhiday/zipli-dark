"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { BrandSettings } from "../types"

interface BrandPreviewProps {
  settings: BrandSettings
}

export function BrandPreview({ settings }: BrandPreviewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Brand Preview</CardTitle>
        <CardDescription>
          See how your brand elements appear on sample content.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Logo Preview */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Logo</h3>
          <div className="h-16 rounded-lg flex items-center justify-center bg-white border border-border px-3 py-2">
            {settings.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img 
                src={settings.logoUrl} 
                alt="Brand logo" 
                className="max-h-12 max-w-full object-contain"
              />
            ) : (
              <span className="text-muted-foreground text-sm">Logo will appear here</span>
            )}
          </div>
        </div>

        {/* Colors in Action */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Colors in Action</h3>
          <div className="flex gap-3">
            <button
              className="flex-1 py-2 px-4 rounded-lg text-white text-sm font-medium transition-opacity hover:opacity-90"
              style={{ backgroundColor: settings.colors.primary }}
            >
              Primary
            </button>
            <button
              className="flex-1 py-2 px-4 rounded-lg text-white text-sm font-medium transition-opacity hover:opacity-90"
              style={{ backgroundColor: settings.colors.secondary }}
            >
              Secondary
            </button>
            <button
              className="flex-1 py-2 px-4 rounded-lg text-white text-sm font-medium transition-opacity hover:opacity-90"
              style={{ backgroundColor: settings.colors.accent }}
            >
              Accent
            </button>
          </div>
        </div>

        {/* Typography Example */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Typography Example</h3>
          <div className="p-4 rounded-lg bg-muted/50 border border-border">
            <h4 
              className="text-xl font-bold mb-2"
              style={{ fontFamily: settings.typography.headlineFont }}
            >
              Impactful Stories for a Better Tomorrow
            </h4>
            <p 
              className="text-sm text-muted-foreground"
              style={{ fontFamily: settings.typography.bodyFont }}
            >
              Supporting communities by reducing food waste. Every meal saved makes a difference.
            </p>
          </div>
        </div>

        {/* Sample Message */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Sample Message</h3>
          <div className="p-4 rounded-lg bg-muted/50 border border-border">
            <p 
              className="text-sm"
              style={{ fontFamily: settings.typography.bodyFont }}
            >
              Our latest campaign &apos;Nourish & Thrive&apos; highlights the incredible work of our partners in distributing surplus food. Together, we are building stronger, healthier communities and reducing our environmental footprint.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
