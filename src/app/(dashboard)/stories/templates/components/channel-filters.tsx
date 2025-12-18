"use client"

import { Button } from "@/components/ui/button"
import { CHANNELS, type Channel } from "../types"

interface ChannelFiltersProps {
  selectedChannels: Channel[]
  onChannelToggle: (channel: Channel) => void
}

export function ChannelFilters({ selectedChannels, onChannelToggle }: ChannelFiltersProps) {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-muted-foreground">
        Channel-Specific Caption Templates
      </h3>
      <div className="flex flex-wrap gap-2">
        {CHANNELS.map((channel) => {
          const isSelected = selectedChannels.includes(channel.id)
          return (
            <Button
              key={channel.id}
              variant={isSelected ? "default" : "outline"}
              size="sm"
              onClick={() => onChannelToggle(channel.id)}
              className={
                isSelected 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-muted/50 border-border hover:bg-muted"
              }
            >
              {channel.label}
            </Button>
          )
        })}
      </div>
    </div>
  )
}
