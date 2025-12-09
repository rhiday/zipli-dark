"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileUpload } from "@/components/co2-analyzer/FileUpload"
import { DataPreview } from "@/components/co2-analyzer/DataPreview"
import { SummaryCards } from "@/components/co2-analyzer/SummaryCards"
import { AnalysisDonutChart } from "@/components/co2-analyzer/AnalysisDonutChart"
import { InsightsPanel } from "@/components/co2-analyzer/InsightsPanel"
import { ChatInterface } from "@/components/co2-analyzer/ChatInterface"
import { parseFile, type ParsedExcelData } from "@/lib/excel-parser"
import type { AnalysisResult } from "@/app/api/analyze-surplus/route"
import { 
  ArrowLeft, 
  Loader2, 
  Sparkles, 
  Download, 
  AlertCircle,
  FileSpreadsheet,
  Upload,
  Globe
} from "lucide-react"
import Link from "next/link"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

type Step = "choose-mode" | "upload" | "scrape" | "preview" | "analyzing" | "results"
type Mode = "upload" | "scrape" | null

// Available restaurants for scraping
const SODEXO_RESTAURANTS = [
  { id: "stadin-ao-vilppulantie", name: "Stadin AO Vilppulantie", location: "Helsinki" },
  // More can be added as we discover their JSON endpoint IDs
]

const TIME_PERIODS = [
  { id: "this-week", label: "This week" },
]

export default function CO2AnalyzerPage() {
  const [step, setStep] = useState<Step>("choose-mode")
  const [mode, setMode] = useState<Mode>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [parsedData, setParsedData] = useState<ParsedExcelData | null>(null)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [chartMetric, setChartMetric] = useState<"co2" | "mass">("co2")

  // Scrape mode state
  const [restaurantId, setRestaurantId] = useState<string>(SODEXO_RESTAURANTS[0].id)
  const [period, setPeriod] = useState<string>("this-week")
  const [isFetchingMenu, setIsFetchingMenu] = useState(false)

  const handleModeSelect = (selectedMode: Mode) => {
    setMode(selectedMode)
    setStep(selectedMode === "upload" ? "upload" : "scrape")
    setError(null)
  }

  const handleFileSelect = async (file: File) => {
    setSelectedFile(file)
    setError(null)
    
    try {
      const data = await parseFile(file)
      setParsedData(data)
      setStep("preview")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to parse file")
    }
  }

  const handleClear = () => {
    setSelectedFile(null)
    setParsedData(null)
    setAnalysisResult(null)
    setError(null)
    setMode(null)
    setStep("choose-mode")
  }

  const handleFetchMenu = async () => {
    setError(null)
    setIsFetchingMenu(true)
    
    try {
      const res = await fetch("/api/fetch-sodexo-menu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ restaurantId, period }),
      })
      
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || "Failed to fetch menu")
      }
      
      const payload = await res.json() as {
        data: { headers: string[]; rows: Record<string, unknown>[] }
        summary: string
        meta: { restaurant: string; period: string; totalItems: number }
      }

      const restaurant = SODEXO_RESTAURANTS.find(r => r.id === restaurantId)
      
      setParsedData({
        headers: payload.data.headers,
        rows: payload.data.rows,
        summary: payload.summary,
        fileName: `${restaurant?.name || restaurantId}-menu.json`,
        sheetName: "Sodexo Menu",
        totalRows: payload.data.rows.length,
      })
      setStep("preview")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Menu fetch failed")
    } finally {
      setIsFetchingMenu(false)
    }
  }

  const handleAnalyze = async () => {
    if (!parsedData) return
    
    setStep("analyzing")
    setError(null)
    
    try {
      const response = await fetch("/api/analyze-surplus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: {
            headers: parsedData.headers,
            rows: parsedData.rows,
          },
          summary: parsedData.summary,
        }),
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Analysis failed")
      }
      
      const result = await response.json()
      setAnalysisResult(result.analysis)
      setStep("results")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed")
      setStep("preview")
    }
  }

  const handleExportResults = () => {
    if (!analysisResult) return
    
    const blob = new Blob([JSON.stringify(analysisResult, null, 2)], {
      type: "application/json",
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `co2-analysis-${new Date().toISOString().split("T")[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
        <div className="container flex h-14 items-center px-6">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/impact/climate">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Climate Impact
            </Link>
          </Button>
        </div>
      </div>

      <div className="container px-6 py-8 max-w-6xl mx-auto">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Sparkles className="h-8 w-8 text-primary" />
            CO₂ Menu Analyzer
          </h1>
          <p className="text-muted-foreground mt-2">
            Upload your menu file or estimate emissions directly from restaurant menus
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Step: Choose Mode */}
        {step === "choose-mode" && (
          <div className="grid md:grid-cols-2 gap-6">
            <Card 
              className="cursor-pointer transition-all hover:border-primary hover:shadow-md"
              onClick={() => handleModeSelect("upload")}
            >
              <CardContent className="p-8 flex flex-col items-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 mb-4">
                  <Upload className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Upload File</h3>
                <p className="text-muted-foreground">
                  Upload your own menu data in Excel, CSV, or JSON format
                </p>
                <div className="flex flex-wrap justify-center gap-2 mt-4">
                  <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium">.xlsx</span>
                  <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium">.csv</span>
                  <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium">.json</span>
                </div>
              </CardContent>
            </Card>

            <Card 
              className="cursor-pointer transition-all hover:border-primary hover:shadow-md"
              onClick={() => handleModeSelect("scrape")}
            >
              <CardContent className="p-8 flex flex-col items-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30 mb-4">
                  <Globe className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Estimate from Menu</h3>
                <p className="text-muted-foreground">
                  Fetch menu data automatically from Sodexo restaurants
                </p>
                <div className="flex items-center gap-2 mt-4">
                  <img 
                    src="/logos/sodexo.png" 
                    alt="Sodexo" 
                    className="h-6 w-auto opacity-70"
                    onError={(e) => { e.currentTarget.style.display = 'none' }}
                  />
                  <span className="text-xs text-muted-foreground">Sodexo Finland</span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step: Upload */}
        {step === "upload" && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <Button variant="ghost" size="sm" onClick={handleClear}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </div>
            
            <FileUpload
              onFileSelect={handleFileSelect}
              selectedFile={selectedFile}
              onClear={() => setSelectedFile(null)}
            />
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileSpreadsheet className="h-5 w-5" />
                  Supported Data Formats
                </CardTitle>
                <CardDescription>
                  Upload your menu data in any of these formats
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium mb-2">Expected columns:</p>
                    <ul className="list-disc list-inside text-muted-foreground space-y-1">
                      <li>Food item name (required)</li>
                      <li>Mass/Weight in kg (recommended)</li>
                      <li>Date (optional)</li>
                      <li>Organization/Location (optional)</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-medium mb-2">Example:</p>
                    <div className="bg-muted p-3 rounded-md font-mono text-xs">
                      <p>Date, Food Type, Mass (kg)</p>
                      <p>2025-09-02, Beef stew, 12.5</p>
                      <p>2025-09-02, Vegetable soup, 8.0</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step: Scrape - Restaurant Selection */}
        {step === "scrape" && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <Button variant="ghost" size="sm" onClick={handleClear}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Fetch Menu from Restaurant
                </CardTitle>
                <CardDescription>
                  Select a restaurant and time period to automatically fetch their menu
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Restaurant</label>
                    <Select value={restaurantId} onValueChange={setRestaurantId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select restaurant" />
                      </SelectTrigger>
                      <SelectContent>
                        {SODEXO_RESTAURANTS.map((restaurant) => (
                          <SelectItem key={restaurant.id} value={restaurant.id}>
                            <div className="flex flex-col">
                              <span>{restaurant.name}</span>
                              <span className="text-xs text-muted-foreground">{restaurant.location}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Time Period</label>
                    <Select value={period} onValueChange={setPeriod}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select period" />
                      </SelectTrigger>
                      <SelectContent>
                        {TIME_PERIODS.map((p) => (
                          <SelectItem key={p.id} value={p.id}>
                            {p.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="rounded-lg border bg-muted/50 p-4">
                  <p className="text-sm text-muted-foreground">
                    <strong>How it works:</strong> We fetch the weekly menu data directly from Sodexo&apos;s 
                    public API. The AI will then categorize each dish and estimate CO₂ emissions based 
                    on typical portion sizes and ingredients.
                  </p>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleFetchMenu} disabled={isFetchingMenu} size="lg">
                    {isFetchingMenu ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Fetching menu...
                      </>
                    ) : (
                      <>
                        <Globe className="h-4 w-4 mr-2" />
                        Fetch Menu
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step: Preview */}
        {step === "preview" && parsedData && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <Button variant="ghost" size="sm" onClick={handleClear}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Start Over
              </Button>
              <span className="text-sm text-muted-foreground">
                {mode === "scrape" ? "Menu fetched from restaurant" : "File uploaded"}
              </span>
            </div>

            {mode === "upload" && (
              <FileUpload
                onFileSelect={handleFileSelect}
                selectedFile={selectedFile}
                onClear={() => {
                  setSelectedFile(null)
                  setParsedData(null)
                  setStep("upload")
                }}
              />
            )}

            {mode === "scrape" && (
              <Card className="border-2 border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-950/20">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                    <Globe className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="font-medium">{parsedData.fileName}</p>
                    <p className="text-sm text-muted-foreground">
                      {parsedData.totalRows} menu items fetched
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
            
            <DataPreview data={parsedData} />
            
            <div className="flex justify-end gap-4">
              <Button variant="outline" onClick={handleClear}>
                Cancel
              </Button>
              <Button onClick={handleAnalyze}>
                <Sparkles className="h-4 w-4 mr-2" />
                Analyze with AI
              </Button>
            </div>
          </div>
        )}

        {/* Step: Analyzing */}
        {step === "analyzing" && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
              <h3 className="text-lg font-medium mb-2">Analyzing your data...</h3>
              <p className="text-muted-foreground text-center max-w-md">
                Our AI is categorizing food items, calculating CO₂ emissions, 
                and generating insights. This usually takes 10-30 seconds.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Step: Results */}
        {step === "results" && analysisResult && (
          <div className="space-y-6">
            {/* Actions */}
            <div className="flex items-center justify-between">
              <Button variant="outline" onClick={handleClear}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Analyze New Data
              </Button>
              <Button variant="outline" onClick={handleExportResults}>
                <Download className="h-4 w-4 mr-2" />
                Export Results
              </Button>
            </div>

            {/* Summary Cards */}
            <SummaryCards data={analysisResult} />

            {/* Charts */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">Visualization</h2>
                  <Tabs value={chartMetric} onValueChange={(v) => setChartMetric(v as "co2" | "mass")}>
                    <TabsList>
                      <TabsTrigger value="co2">CO₂</TabsTrigger>
                      <TabsTrigger value="mass">Mass</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
                <AnalysisDonutChart data={analysisResult} metric={chartMetric} />
              </div>
              <ChatInterface analysisData={analysisResult} />
            </div>

            {/* Insights */}
            <InsightsPanel data={analysisResult} />
          </div>
        )}
      </div>
    </div>
  )
}
