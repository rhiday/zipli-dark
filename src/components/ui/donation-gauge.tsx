"use client"

import { RadialBarChart, RadialBar, PolarAngleAxis } from 'recharts'
import { ChartContainer } from '@/components/ui/chart'

interface DonationGaugeProps {
  donations: number
  meals: number
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
}

function calculatePotential(donations: number, meals: number): number {
  // Calculate donation potential score (0-100)
  const score = Math.min(100, Math.round((donations / 20) + (meals / 50)))
  return score
}

function getPotentialLabel(score: number): string {
  if (score >= 75) return 'Excellent'
  if (score >= 50) return 'Good'
  if (score >= 25) return 'Medium'
  return 'Low'
}

function getPotentialColor(score: number): string {
  if (score >= 75) return 'hsl(142, 76%, 36%)' // green
  if (score >= 50) return 'hsl(45, 93%, 47%)' // yellow
  if (score >= 25) return 'hsl(25, 95%, 53%)' // orange
  return 'hsl(0, 84%, 60%)' // red
}

export function DonationGauge({ donations, meals, size = 'md', showLabel = true }: DonationGaugeProps) {
  const potential = calculatePotential(donations, meals)
  const color = getPotentialColor(potential)

  const chartData = [
    {
      value: potential,
      fill: color,
    },
  ]

  const chartConfig = {
    value: {
      label: 'Potential',
    },
  }

  // Size configurations
  const sizeClasses = {
    sm: 'h-24 w-24',
    md: 'h-32 w-32',
    lg: 'h-40 w-40'
  }

  const textSizes = {
    sm: { percentage: 'text-xl', label: 'text-[10px]' },
    md: { percentage: 'text-2xl', label: 'text-xs' },
    lg: { percentage: 'text-3xl', label: 'text-sm' }
  }

  const barSizes = {
    sm: 10,
    md: 10,
    lg: 12
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <ChartContainer config={chartConfig} className={sizeClasses[size]}>
        <RadialBarChart
          data={chartData}
          startAngle={180}
          endAngle={0}
          innerRadius="60%"
          outerRadius="100%"
          barSize={barSizes[size]}
        >
          <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
          <RadialBar
            background
            dataKey="value"
            cornerRadius={10}
            fill={color}
          />
          <text
            x="50%"
            y="45%"
            textAnchor="middle"
            dominantBaseline="middle"
            className={`fill-foreground ${textSizes[size].percentage} font-bold`}
          >
            {potential}%
          </text>
          <text
            x="50%"
            y="65%"
            textAnchor="middle"
            dominantBaseline="middle"
            className={`fill-muted-foreground ${textSizes[size].label}`}
          >
            Donation Score
          </text>
        </RadialBarChart>
      </ChartContainer>
      {showLabel && (
        <p className="text-xs text-muted-foreground font-medium">Donation Potential</p>
      )}
    </div>
  )
}
