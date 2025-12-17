"use client"

import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import type { CampaignAsset } from "../types"

interface AssetContentPanelProps {
  asset: CampaignAsset
  onAssetChange: (asset: CampaignAsset) => void
}

export function AssetContentPanel({ asset, onAssetChange }: AssetContentPanelProps) {
  const updateField = <K extends keyof CampaignAsset>(
    field: K,
    value: CampaignAsset[K]
  ) => {
    onAssetChange({ ...asset, [field]: value })
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Asset Content</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Headline */}
        <div className="space-y-2">
          <Label htmlFor="headline">Headline</Label>
          <Input
            id="headline"
            placeholder="Enter a catchy headline..."
            value={asset.headline}
            onChange={(e) => updateField("headline", e.target.value)}
            className="bg-muted/50"
          />
        </div>

        {/* Pull Quote */}
        <div className="space-y-2">
          <Label htmlFor="pullQuote">Pullquote</Label>
          <Textarea
            id="pullQuote"
            placeholder="A memorable quote that captures the essence..."
            value={asset.pullQuote}
            onChange={(e) => updateField("pullQuote", e.target.value)}
            className="bg-muted/50 min-h-[80px] resize-none"
          />
        </div>

        {/* Human Story */}
        <div className="space-y-2">
          <Label htmlFor="humanStory">Human Story</Label>
          <Textarea
            id="humanStory"
            placeholder="Tell the human story behind the impact..."
            value={asset.humanStory}
            onChange={(e) => updateField("humanStory", e.target.value)}
            className="bg-muted/50 min-h-[150px]"
          />
        </div>

        {/* Image Visual */}
        <div className="space-y-2">
          <Label>Image Visual</Label>
          {asset.imageUrl ? (
            <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-border">
              <Image
                src={asset.imageUrl}
                alt="Campaign visual"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          ) : (
            <div className="flex aspect-video w-full items-center justify-center rounded-lg border border-dashed border-border bg-muted/30">
              <p className="text-sm text-muted-foreground">No image selected</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
