"use client"

import { useState } from "react"
import { Copy, Check } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { CampaignAsset, CampaignChannel, ChannelCaption } from "../types"
import { CHANNEL_LABELS } from "../types"

interface ChannelCaptionsProps {
  asset: CampaignAsset
  onAssetChange: (asset: CampaignAsset) => void
}

export function ChannelCaptions({ asset, onAssetChange }: ChannelCaptionsProps) {
  const [copiedChannel, setCopiedChannel] = useState<CampaignChannel | null>(null)

  const updateCaption = (channel: CampaignChannel, caption: string) => {
    const updatedCaptions = asset.channelCaptions.map((c) =>
      c.channel === channel ? { ...c, caption } : c
    )
    onAssetChange({ ...asset, channelCaptions: updatedCaptions })
  }

  const getCaption = (channel: CampaignChannel): ChannelCaption => {
    return (
      asset.channelCaptions.find((c) => c.channel === channel) || {
        channel,
        caption: "",
        hashtags: [],
      }
    )
  }

  const copyToClipboard = async (channel: CampaignChannel) => {
    const caption = getCaption(channel)
    const fullText = caption.caption + 
      (caption.hashtags.length > 0 ? "\n\n" + caption.hashtags.map(h => `#${h}`).join(" ") : "")
    
    await navigator.clipboard.writeText(fullText)
    setCopiedChannel(channel)
    setTimeout(() => setCopiedChannel(null), 2000)
  }

  const channels: CampaignChannel[] = ["facebook", "instagram", "email", "linkedin"]

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Channel Captions</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="facebook" className="w-full">
          <TabsList className="w-full grid grid-cols-4">
            {channels.map((channel) => (
              <TabsTrigger key={channel} value={channel} className="text-xs">
                {CHANNEL_LABELS[channel].icon} {CHANNEL_LABELS[channel].label}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {channels.map((channel) => {
            const caption = getCaption(channel)
            return (
              <TabsContent key={channel} value={channel} className="mt-4 space-y-3">
                <Textarea
                  placeholder={`Write your ${CHANNEL_LABELS[channel].label} caption...`}
                  value={caption.caption}
                  onChange={(e) => updateCaption(channel, e.target.value)}
                  className="min-h-[120px] bg-muted/50"
                />
                
                {/* Hashtags */}
                {caption.hashtags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {caption.hashtags.map((tag, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                )}
                
                {/* Copy Button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(channel)}
                  disabled={!caption.caption}
                  className="w-full"
                >
                  {copiedChannel === channel ? (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy to Clipboard
                    </>
                  )}
                </Button>
              </TabsContent>
            )
          })}
        </Tabs>
      </CardContent>
    </Card>
  )
}
