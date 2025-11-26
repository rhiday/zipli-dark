"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type CategoryKey = "casserole" | "sauce" | "side" | "soup" | "stew"
type ProteinKey = "beef" | "fish" | "pork" | "veg"

interface FlowFile {
  nodes: Array<{ id: string; mass?: number; co2eq?: number }>
  links: Array<{ source: string; target: string; mass?: number; co2eq?: number }>
}

// Category multipliers are a simple heuristic to account for typical density/portion
const CATEGORY_FACTOR: Record<CategoryKey, number> = {
  casserole: 1.0,
  soup: 0.8,
  stew: 1.0,
  sauce: 0.6,
  side: 0.3,
}

export function ROICalculator() {
  const [intensityKgPerKg, setIntensityKgPerKg] = useState<Record<ProteinKey, number>>({
    beef: 10,
    fish: 2.2,
    pork: 2.6,
    veg: 0.6,
  })
  const [category, setCategory] = useState<CategoryKey>("casserole")
  const [protein, setProtein] = useState<ProteinKey>("beef")
  const [amountKg, setAmountKg] = useState<string>("1")
  const [result, setResult] = useState<{ co2eKg: number; treesMonth: number } | null>(null)

  // Load intensities from the same JSON the Sankey uses (derived from node totals)
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/data/food-flow.json", { cache: "no-store" })
        if (!res.ok) return
        const json = (await res.json()) as FlowFile
        const map: Partial<Record<ProteinKey, number>> = {}
        for (const n of json.nodes) {
          const id = n.id as ProteinKey
          if ((["beef", "fish", "pork", "veg"] as string[]).includes(id)) {
            const mass = n.mass ?? 0
            const co2 = n.co2eq ?? 0
            map[id] = mass > 0 ? co2 / mass : 0
          }
        }
        setIntensityKgPerKg(prev => ({ ...prev, ...(map as Record<ProteinKey, number>) }))
      } catch {
        // keep defaults if fetch fails
      }
    }
    load()
  }, [])

  const canCalculate = useMemo(() => {
    const v = parseFloat(amountKg)
    return !Number.isNaN(v) && v > 0
  }, [amountKg])

  const onCalculate = () => {
    const amt = parseFloat(amountKg)
    if (Number.isNaN(amt) || amt <= 0) return
    const intensity = intensityKgPerKg[protein]
    const factor = CATEGORY_FACTOR[category]
    const co2eKg = amt * intensity * factor
    // Very rough equivalence: 1 mature tree absorbs ~1.6 kg CO2/month (speculative)
    const treesMonth = co2eKg / 1.6
    setResult({ co2eKg, treesMonth })
  }

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle>Calculate CO2 emissions of a dish type</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="category">Meal category</Label>
            <Select value={category} onValueChange={(v) => setCategory(v as CategoryKey)}>
              <SelectTrigger id="category"><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="casserole">Casserole</SelectItem>
                <SelectItem value="soup">Soup</SelectItem>
                <SelectItem value="stew">Stew</SelectItem>
                <SelectItem value="sauce">Sauce</SelectItem>
                <SelectItem value="side">Side</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="protein">Main protein</Label>
            <Select value={protein} onValueChange={(v) => setProtein(v as ProteinKey)}>
              <SelectTrigger id="protein"><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="beef">Beef</SelectItem>
                <SelectItem value="fish">Fish</SelectItem>
                <SelectItem value="pork">Pork</SelectItem>
                <SelectItem value="veg">Vegetarian</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (kilos)</Label>
            <div className="flex items-center gap-2">
              <Input id="amount" inputMode="decimal" value={amountKg} onChange={(e) => setAmountKg(e.target.value)} />
              <span className="text-muted-foreground text-sm">kg</span>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <Button onClick={onCalculate} disabled={!canCalculate} className="min-w-40 text-base">Calculate</Button>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border p-4">
            <div className="text-sm text-muted-foreground">CO₂e</div>
            <div className="text-xl font-semibold">{result ? `${result.co2eKg.toFixed(2)} kg` : "--"}</div>
          </div>
          <div className="rounded-lg border p-4">
            <div className="text-sm text-muted-foreground">Trees absorbing/month (rough)</div>
            <div className="text-xl font-semibold">{result ? result.treesMonth.toFixed(1) : "--"}</div>
          </div>
          <div className="rounded-lg border p-4">
            <div className="text-sm text-muted-foreground">Intensity</div>
            <div className="text-xl font-semibold">{result ? `${intensityKgPerKg[protein].toFixed(2)} kg/kg` : "--"}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default ROICalculator


