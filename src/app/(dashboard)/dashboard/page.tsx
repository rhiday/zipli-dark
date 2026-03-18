"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, LineChart, ClipboardList, Calculator } from "lucide-react"
import Link from "next/link"

export default function Dashboard() {
  return (
    <div className="flex-1 px-6 pt-12">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-medium tracking-tight">Zipli x Suppilog</h1>
          <p className="text-muted-foreground">Procurement meets waste data — what would you like to explore?</p>
        </div>

        {/* Action Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 pt-4">
          {/* Savings Calculator */}
          <Link href="/calculator">
            <Card className="h-full cursor-pointer transition-all hover:shadow-lg hover:border-primary/50 border-primary/30">
              <CardHeader className="items-center text-center pb-4">
                <div className="w-full flex justify-center mb-3">
                  <div className="p-4 rounded-2xl border-2 border-primary/50 inline-flex">
                    <Calculator className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <CardTitle className="text-xl">Savings calculator</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription>See instant ROI from cross-matching ordering + waste data</CardDescription>
              </CardContent>
            </Card>
          </Link>

          {/* Daily Operations */}
          <Link href="/daily-operations">
            <Card className="h-full cursor-pointer transition-all hover:shadow-lg hover:border-primary/50">
              <CardHeader className="items-center text-center pb-4">
                <div className="w-full flex justify-center mb-3">
                  <div className="p-4 rounded-2xl border-2 border-border inline-flex">
                    <ClipboardList className="h-8 w-8" />
                  </div>
                </div>
                <CardTitle className="text-xl">Live dashboard</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription>Real-time procurement vs. waste across restaurants</CardDescription>
              </CardContent>
            </Card>
          </Link>

          {/* Analyze Impact */}
          <Link href="/impact/analyzer">
            <Card className="h-full cursor-pointer transition-all hover:shadow-lg hover:border-primary/50">
              <CardHeader className="items-center text-center pb-4">
                <div className="w-full flex justify-center mb-3">
                  <div className="p-4 rounded-2xl border-2 border-border inline-flex">
                    <LineChart className="h-8 w-8" />
                  </div>
                </div>
                <CardTitle className="text-xl">Analyze impact</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription>CO2, CSRD reports, and sustainability scorecard</CardDescription>
              </CardContent>
            </Card>
          </Link>

          {/* Create Story */}
          <Link href="/stories/templates">
            <Card className="h-full cursor-pointer transition-all hover:shadow-lg hover:border-primary/50">
              <CardHeader className="items-center text-center pb-4">
                <div className="w-full flex justify-center mb-3">
                  <div className="p-4 rounded-2xl border-2 border-border inline-flex">
                    <BookOpen className="h-8 w-8" />
                  </div>
                </div>
                <CardTitle className="text-xl">Create story</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription>Engage customers with impact stories</CardDescription>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  )
}
