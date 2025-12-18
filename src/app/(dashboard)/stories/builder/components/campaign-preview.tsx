"use client"

import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { CampaignAsset } from "../types"

interface CampaignPreviewProps {
  asset: CampaignAsset
}

export function CampaignPreview({ asset }: CampaignPreviewProps) {
  const hasContent = asset.headline || asset.pullQuote || asset.humanStory

  if (!hasContent) {
    return (
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="py-8">
          <div className="text-center text-muted-foreground">
            <p className="text-sm">Campaign preview will appear here</p>
            <p className="text-xs mt-1">Generate content to see the preview</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-primary/5 border-primary/20 overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm text-muted-foreground">Preview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Image */}
        {asset.imageUrl && (
          <div className="relative aspect-video w-full overflow-hidden rounded-lg">
            <Image
              src={asset.imageUrl}
              alt="Campaign preview"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </div>
        )}

        {/* Headline */}
        {asset.headline && (
          <h3 className="font-semibold text-lg leading-tight">
            {asset.headline}
          </h3>
        )}

        {/* Pull Quote */}
        {asset.pullQuote && (
          <blockquote className="border-l-2 border-primary pl-3 italic text-sm text-muted-foreground">
            {asset.pullQuote}
          </blockquote>
        )}

        {/* Human Story (truncated) */}
        {asset.humanStory && (
          <p className="text-sm text-muted-foreground line-clamp-4">
            {asset.humanStory}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
