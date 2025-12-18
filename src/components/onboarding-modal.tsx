"use client"

import * as React from "react"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter 
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { 
  MapPin, 
  Leaf,
  Utensils,
  ArrowRight, 
  ArrowLeft,
  Sparkles,
  Building2,
  Heart,
} from "lucide-react"

const ONBOARDING_STEPS = [
  {
    icon: Sparkles,
    title: "Welcome to Zipli!",
    description: "Your food surplus management dashboard for Helsinki. Track donations, connect with receivers, and measure your environmental impact.",
    stats: [
      { label: "Active Donors", value: "10", icon: Building2 },
      { label: "Partner Receivers", value: "5", icon: Heart },
    ],
    highlight: "Join the network reducing food waste across Helsinki",
  },
  {
    icon: MapPin,
    title: "Track Surplus Locations",
    description: "The interactive map shows all Sodexo locations and partner receivers in real-time. Click on markers to see donation history and current status.",
    stats: [
      { label: "Sodexo Locations", value: "10", icon: Building2 },
      { label: "Food Banks", value: "5", icon: Heart },
    ],
    highlight: "All locations across Helsinki visible at a glance",
  },
  {
    icon: Leaf,
    title: "Measure Your Impact",
    description: "Every donation is tracked with precise CO₂ calculations. See meals saved, emissions avoided, and your contribution to sustainability goals.",
    stats: [
      { label: "Meals Saved", value: "69,000+", icon: Utensils },
      { label: "CO₂ Avoided", value: "138 tons", icon: Leaf },
    ],
    highlight: "Real environmental data based on FoodGWP methodology",
  },
]

interface OnboardingModalProps {
  open: boolean
  onComplete: () => void
}

export function OnboardingModal({ open, onComplete }: OnboardingModalProps) {
  const [step, setStep] = React.useState(0)
  const totalSteps = ONBOARDING_STEPS.length
  const currentStep = ONBOARDING_STEPS[step]
  const Icon = currentStep.icon
  const progress = ((step + 1) / totalSteps) * 100

  const handleNext = () => {
    if (step < totalSteps - 1) {
      setStep(step + 1)
    } else {
      onComplete()
    }
  }

  const handlePrev = () => {
    if (step > 0) {
      setStep(step - 1)
    }
  }

  const handleSkip = () => {
    onComplete()
  }

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent showCloseButton={false} className="sm:max-w-lg overflow-hidden">
        <DialogHeader className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {ONBOARDING_STEPS.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-2 w-2 rounded-full transition-colors ${
                    idx === step 
                      ? "bg-primary" 
                      : idx < step 
                        ? "bg-primary/50" 
                        : "bg-muted"
                  }`}
                />
              ))}
            </div>
            <Button variant="ghost" size="sm" onClick={handleSkip} className="text-muted-foreground">
              Skip tour
            </Button>
          </div>
          <Progress value={progress} className="h-1" />
        </DialogHeader>

        <div className="flex flex-col items-center text-center py-6 space-y-5">
          {/* Icon */}
          <div className="relative">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 ring-1 ring-primary/20">
              <Icon className="h-10 w-10 text-primary" />
            </div>
            <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary animate-pulse" />
          </div>

          {/* Title & Description */}
          <div className="space-y-2">
            <DialogTitle className="text-2xl font-bold">{currentStep.title}</DialogTitle>
            <DialogDescription className="text-base leading-relaxed max-w-sm mx-auto">
              {currentStep.description}
            </DialogDescription>
          </div>

          {/* Stats */}
          <div className="flex gap-4 pt-2">
            {currentStep.stats.map((stat, idx) => {
              const StatIcon = stat.icon
              return (
                <div 
                  key={idx} 
                  className="flex flex-col items-center gap-1.5 px-4 py-3 rounded-xl bg-muted/50 min-w-[120px]"
                >
                  <StatIcon className="h-5 w-5 text-primary" />
                  <span className="text-xl font-bold">{stat.value}</span>
                  <span className="text-xs text-muted-foreground">{stat.label}</span>
                </div>
              )
            })}
          </div>

          {/* Highlight badge */}
          <Badge variant="secondary" className="text-xs font-medium">
            {currentStep.highlight}
          </Badge>
        </div>

        <DialogFooter className="flex-row gap-2 sm:gap-2">
          {step > 0 ? (
            <Button variant="outline" onClick={handlePrev} className="flex-1">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          ) : (
            <div className="flex-1" />
          )}
          <Button onClick={handleNext} className="flex-1">
            {step === totalSteps - 1 ? (
              <>
                Get Started
                <Sparkles className="ml-2 h-4 w-4" />
              </>
            ) : (
              <>
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

