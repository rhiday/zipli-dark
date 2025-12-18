"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, LineChart, ClipboardList } from "lucide-react"
import Link from "next/link"

export default function Dashboard() {
  return (
    <div className="flex-1 px-6 pt-0">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-medium tracking-tight">What would you like to do today?</h1>
        </div>

        {/* Action Cards */}
        <div className="grid gap-6 md:grid-cols-3">
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
                <CardDescription>Engage with your customers</CardDescription>
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
                <CardDescription>Understand your surplus food</CardDescription>
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
                <CardTitle className="text-xl">Daily operations</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription>Optimize kitchen operations</CardDescription>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  )
}
