"use client"

import { Loader2, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"

interface AIPromptInputProps {
  prompt: string
  onPromptChange: (prompt: string) => void
  onGenerate: () => void
  isGenerating: boolean
  hasStory: boolean
}

export function AIPromptInput({ 
  prompt, 
  onPromptChange, 
  onGenerate, 
  isGenerating,
  hasStory 
}: AIPromptInputProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Sparkles className="h-4 w-4" />
          AI Generation
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Textarea
          placeholder={hasStory 
            ? "Describe how you want this story to be presented... (optional)"
            : "Describe the campaign you want to create..."
          }
          value={prompt}
          onChange={(e) => onPromptChange(e.target.value)}
          className="min-h-[100px] resize-none"
          disabled={isGenerating}
        />
        <Button 
          onClick={onGenerate} 
          disabled={isGenerating || (!hasStory && !prompt.trim())}
          className="w-full"
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              Generate Campaign
            </>
          )}
        </Button>
        {!hasStory && !prompt.trim() && (
          <p className="text-xs text-muted-foreground text-center">
            Select a story from the library or enter a prompt
          </p>
        )}
      </CardContent>
    </Card>
  )
}
