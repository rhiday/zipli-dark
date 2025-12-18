"use client"

interface EmotionalToneSliderProps {
  value: number
  onChange: (value: number) => void
}

export function EmotionalToneSlider({ value, onChange }: EmotionalToneSliderProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium">Emotional Tone</h3>
      
      {/* Custom Slider */}
      <div className="relative pt-1">
        <input
          type="range"
          min="0"
          max="100"
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="w-full h-2 rounded-full appearance-none cursor-pointer
            bg-gradient-to-r from-emerald-600 via-emerald-400 to-emerald-300
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-4
            [&::-webkit-slider-thumb]:h-4
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:bg-white
            [&::-webkit-slider-thumb]:border-2
            [&::-webkit-slider-thumb]:border-emerald-500
            [&::-webkit-slider-thumb]:shadow-md
            [&::-webkit-slider-thumb]:cursor-pointer
            [&::-moz-range-thumb]:w-4
            [&::-moz-range-thumb]:h-4
            [&::-moz-range-thumb]:rounded-full
            [&::-moz-range-thumb]:bg-white
            [&::-moz-range-thumb]:border-2
            [&::-moz-range-thumb]:border-emerald-500
            [&::-moz-range-thumb]:shadow-md
            [&::-moz-range-thumb]:cursor-pointer"
        />
      </div>
      
      {/* Labels */}
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>Solitude</span>
        <span>Connection</span>
        <span>Celebration</span>
      </div>
    </div>
  )
}
