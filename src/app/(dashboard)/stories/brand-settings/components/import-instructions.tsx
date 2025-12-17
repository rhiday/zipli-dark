"use client"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { ChevronDown } from "lucide-react"
import { useState } from "react"

export function ImportInstructions() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
      <CollapsibleTrigger className="flex items-center justify-between w-full py-4 text-left">
        <h2 className="text-lg font-semibold">Step-by-Step Import Instructions</h2>
        <ChevronDown 
          className={`h-5 w-5 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`} 
        />
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-4 pb-4">
        {/* Logo Upload */}
        <div className="space-y-2">
          <h3 className="font-medium">1. Logo Upload:</h3>
          <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-4">
            <li>Ensure your logo is in PNG, JPG, or SVG format for best results.</li>
            <li>Maintain a transparent background for versatile use across assets.</li>
          </ul>
        </div>

        {/* Color Palette */}
        <div className="space-y-2">
          <h3 className="font-medium">2. Color Palette:</h3>
          <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-4">
            <li>Input exact hex codes for your primary, secondary, and accent colors using the color pickers.</li>
            <li>These colors will dynamically update the preview panel on the right.</li>
          </ul>
        </div>

        {/* Typography */}
        <div className="space-y-2">
          <h3 className="font-medium">3. Typography:</h3>
          <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-4">
            <li>Specify your brand&apos;s preferred fonts by name. The system will attempt to match or use default fallbacks.</li>
            <li>Consider using web-safe fonts for broader compatibility.</li>
          </ul>
        </div>

        {/* Tone of Voice */}
        <div className="space-y-2">
          <h3 className="font-medium">4. Tone of Voice:</h3>
          <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-4">
            <li>Provide a concise description of your brand&apos;s communication style (e.g., professional, empathetic, inspiring).</li>
          </ul>
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}
