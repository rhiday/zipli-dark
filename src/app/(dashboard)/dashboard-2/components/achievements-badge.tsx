"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Award, Trophy, Utensils, Leaf, Target, Shield } from "lucide-react"
import { cn } from "@/lib/utils"

interface Achievement {
  id: string
  icon: typeof Award
  title: string
  dateAchieved: string | null
  color: string
  unlocked: boolean
}

export function AchievementsBadge() {
  const achievements: Achievement[] = [
    {
      id: "ten-tonne-titan",
      icon: Trophy,
      title: "Ten-Tonne Titan",
      dateAchieved: "Oct 15, 2025",
      color: "#18E170", // Zipli lime green
      unlocked: true
    },
    {
      id: "meal-maker",
      icon: Utensils,
      title: "Meal-Maker 20K",
      dateAchieved: "Sep 22, 2025",
      color: "#024209", // Dark green
      unlocked: true
    },
    {
      id: "co2-cutter",
      icon: Leaf,
      title: "CO₂ Cutter",
      dateAchieved: "Aug 8, 2025",
      color: "#5A0057", // Dark purple
      unlocked: true
    },
    {
      id: "network-hero",
      icon: Target,
      title: "Network Hero",
      dateAchieved: null,
      color: "#gray",
      unlocked: false
    },
  ]

  const currentLevel = 8
  const totalAchievements = achievements.filter(a => a.unlocked).length

  return (
    <Card className="col-span-2 from-primary/5 to-card bg-gradient-to-t shadow-xs">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              Achievements & Badges
            </CardTitle>
            <CardDescription className="mt-1.5">
              Track your impact and unlock new levels
            </CardDescription>
          </div>
          <div className="flex flex-col items-end gap-1">
            <Badge variant="default" className="bg-primary/10 text-primary border-primary/20">
              Level {currentLevel}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {totalAchievements}/{achievements.length} unlocked
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 grid-cols-4">
          {achievements.map((achievement) => {
            const Icon = achievement.icon
            
            return (
              <div
                key={achievement.id}
                className={cn(
                  "relative group rounded-lg border p-3 transition-all",
                  achievement.unlocked
                    ? "border-primary/20 bg-card cursor-pointer hover:shadow-md hover:scale-105"
                    : "border-border/50 bg-muted/30 opacity-60"
                )}
              >
                {/* Badge Icon */}
                <div className="mx-auto w-14 h-14 flex items-center justify-center mb-2 relative">
                  <Shield 
                    className={cn(
                      "absolute inset-0 w-full h-full transition-all",
                      achievement.unlocked && "drop-shadow-lg"
                    )}
                    style={{ 
                      color: achievement.unlocked ? achievement.color : undefined,
                      fill: achievement.unlocked ? achievement.color : '#71717a',
                      stroke: achievement.unlocked ? achievement.color : '#71717a'
                    }}
                  />
                  <Icon className={cn(
                    "h-6 w-6 relative z-10",
                    achievement.unlocked ? "text-white" : "text-muted-foreground"
                  )} />
                </div>

                {/* Badge Name */}
                <div className="text-center space-y-1">
                  <h4 className={cn(
                    "font-semibold text-sm",
                    achievement.unlocked ? "text-foreground" : "text-muted-foreground"
                  )}>
                    {achievement.title}
                  </h4>
                  
                  {/* Date Achieved */}
                  {achievement.unlocked && achievement.dateAchieved && (
                    <p className="text-xs text-muted-foreground">
                      {achievement.dateAchieved}
                    </p>
                  )}
                </div>

                {/* Locked Overlay */}
                {!achievement.unlocked && (
                  <div className="absolute inset-0 flex items-end justify-center pb-2">
                    <div className="text-xs font-medium text-muted-foreground bg-background/80 px-2 py-1 rounded">
                      Locked
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

