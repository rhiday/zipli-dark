"use client"

import { useState } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { MapPin, TrendingUp, Target, ArrowUpIcon, Utensils, Heart } from "lucide-react"

// Based on: 1.2M kg/year, €0.71/kg operating cost, €3.6M economic value, 1.6x ROI
const receiverImpactData = [
  { month: "Jan", revenue: 44000, savings: 70000, economicValue: 280000 },
  { month: "Feb", revenue: 48000, savings: 77000, economicValue: 290000 },
  { month: "Mar", revenue: 52000, savings: 83000, economicValue: 295000 },
  { month: "Apr", revenue: 56000, savings: 90000, economicValue: 300000 },
  { month: "May", revenue: 60000, savings: 96000, economicValue: 305000 },
  { month: "Jun", revenue: 64000, savings: 102000, economicValue: 310000 },
]

const chartConfig = {
  revenue: {
    label: "Revenue Generated (€)",
    color: "#18E170", // Zipli lime green
  },
  savings: {
    label: "Cost Savings (€)",
    color: "#024209", // Dark green
  },
  economicValue: {
    label: "Economic Value (€)",
    color: "#5A0057", // Dark purple
  },
}

const receiverTypesData = [
  { type: "Food Banks", receivers: 24, percentage: "35.3%", growth: "+18.2%", growthColor: "text-green-600" },
  { type: "Charities", receivers: 36, percentage: "52.9%", growth: "+12.4%", growthColor: "text-green-600" },
  { type: "Community Centers", receivers: 8, percentage: "11.8%", growth: "+8.7%", growthColor: "text-blue-600" },
]

const helsinkiDistrictsData = [
  { district: "Kampii", receivers: 16, meals: "28,470", growth: "+15.8%", growthColor: "text-green-600" },
  { district: "Kallio", receivers: 12, meals: "19,230", growth: "+12.3%", growthColor: "text-green-600" },
  { district: "Hakaniemi", receivers: 10, meals: "14,560", growth: "+22.1%", growthColor: "text-blue-600" },
  { district: "Punavuori", receivers: 8, meals: "11,230", growth: "+18.4%", growthColor: "text-green-600" },
  { district: "Others", receivers: 22, meals: "28,910", growth: "+9.2%", growthColor: "text-orange-600" },
]

export function CustomerInsights() {
  const [activeTab, setActiveTab] = useState("growth")
  const [showRevenue, setShowRevenue] = useState(true)
  const [showSavings, setShowSavings] = useState(true)
  const [showEconomicValue, setShowEconomicValue] = useState(true)

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle>Receiver Impact</CardTitle>
        <CardDescription>Charity and food bank impact metrics</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-muted/50 p-1 rounded-lg h-12">
            <TabsTrigger
              value="growth"
              className="cursor-pointer flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-foreground"
            >
              <TrendingUp className="h-4 w-4" />
              <span className="hidden sm:inline">Growth</span>
            </TabsTrigger>
            <TabsTrigger
              value="demographics"
              className="cursor-pointer flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-foreground"
            >
              <Heart className="h-4 w-4" />
              <span className="hidden sm:inline">Types</span>
            </TabsTrigger>
            <TabsTrigger
              value="regions"
              className="cursor-pointer flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-foreground"
            >
              <MapPin className="h-4 w-4" />
              <span className="hidden sm:inline">Districts</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="growth" className="mt-8 space-y-6">
            <div className="grid gap-6">
              {/* Chart and Key Metrics Side by Side */}
              <div className="grid grid-cols-10 gap-6">
                {/* Chart Area - 70% */}
                <div className="col-span-10 xl:col-span-7">
                  <h3 className="text-sm font-medium text-muted-foreground mb-6">Financial Impact Over Time</h3>
                  <ChartContainer config={chartConfig} className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={receiverImpactData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis
                          dataKey="month"
                          tickLine={false}
                          axisLine={false}
                          className="text-xs"
                        />
                        <YAxis
                          tickLine={false}
                          axisLine={false}
                          className="text-xs"
                          tickFormatter={(value: number) => `€${value.toLocaleString()}`}
                        />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        
                        {showRevenue && (
                          <Line
                            type="monotone"
                            dataKey="revenue"
                            stroke="var(--color-revenue)"
                            strokeWidth={2}
                            dot={{ fill: "var(--color-revenue)", r: 4 }}
                            activeDot={{ r: 6 }}
                            name={chartConfig.revenue.label}
                          />
                        )}
                        
                        {showSavings && (
                          <Line
                            type="monotone"
                            dataKey="savings"
                            stroke="var(--color-savings)"
                            strokeWidth={2}
                            strokeDasharray="5 5"
                            dot={{ fill: "var(--color-savings)", r: 4 }}
                            activeDot={{ r: 6 }}
                            name={chartConfig.savings.label}
                          />
                        )}
                        
                        {showEconomicValue && (
                          <Line
                            type="monotone"
                            dataKey="economicValue"
                            stroke="var(--color-economicValue)"
                            strokeWidth={2}
                            strokeDasharray="8 4"
                            dot={{ fill: "var(--color-economicValue)", r: 4 }}
                            activeDot={{ r: 6 }}
                            name={chartConfig.economicValue.label}
                          />
                        )}
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>

                  {/* Toggle Controls */}
                  <div className="flex flex-wrap gap-6 mt-6 pt-6 border-t">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="revenue"
                        checked={showRevenue}
                        onCheckedChange={setShowRevenue}
                      />
                      <Label htmlFor="revenue" className="cursor-pointer">
                        Revenue Generated
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="savings"
                        checked={showSavings}
                        onCheckedChange={setShowSavings}
                      />
                      <Label htmlFor="savings" className="cursor-pointer">
                        Cost Savings
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="economicValue"
                        checked={showEconomicValue}
                        onCheckedChange={setShowEconomicValue}
                      />
                      <Label htmlFor="economicValue" className="cursor-pointer">
                        Economic Value
                      </Label>
                    </div>
                  </div>
                </div>

                {/* Key Metrics - 30% */}
                <div className="col-span-10 xl:col-span-3 space-y-5">
                  <h3 className="text-sm font-medium text-muted-foreground mb-6">Key Metrics</h3>
                  <div className="grid grid-cols-3 gap-5">
                    <div className="p-4 rounded-lg max-lg:col-span-3 xl:col-span-3 border">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">Annual ROI</span>
                      </div>
                      <div className="text-2xl font-bold">1.6x</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        For every €1 spent on Zipli, city saves ~€1.6
                      </div>
                    </div>

                    <div className="p-4 rounded-lg max-lg:col-span-3 xl:col-span-3 border">
                      <div className="flex items-center gap-2 mb-2">
                        <Target className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Operating Cost</span>
                      </div>
                      <div className="text-2xl font-bold">€0.71/kg</div>
                      <div className="text-xs text-green-600 flex items-center gap-1 mt-1">
                        <ArrowUpIcon className="h-3 w-3" />
                        -43% vs. before Zipli
                      </div>
                    </div>

                    <div className="p-4 rounded-lg max-lg:col-span-3 xl:col-span-3 border">
                      <div className="flex items-center gap-2 mb-2">
                        <Heart className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Economic Value</span>
                      </div>
                      <div className="text-2xl font-bold">€3.6M</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        1,200,000 kg kept in the system
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="demographics" className="mt-8">
            <div className="rounded-lg border bg-card">
              <Table>
                <TableHeader>
                  <TableRow className="border-b">
                    <TableHead className="py-5 px-6 font-semibold">Receiver Type</TableHead>
                    <TableHead className="text-right py-5 px-6 font-semibold">Count</TableHead>
                    <TableHead className="text-right py-5 px-6 font-semibold">Percentage</TableHead>
                    <TableHead className="text-right py-5 px-6 font-semibold">Growth</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {receiverTypesData.map((row, index) => (
                    <TableRow key={index} className="hover:bg-muted/30 transition-colors">
                      <TableCell className="font-medium py-5 px-6">{row.type}</TableCell>
                      <TableCell className="text-right py-5 px-6">{row.receivers.toLocaleString()}</TableCell>
                      <TableCell className="text-right py-5 px-6">{row.percentage}</TableCell>
                      <TableCell className="text-right py-5 px-6">
                        <span className={`font-medium ${row.growthColor}`}>{row.growth}</span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-6">
              <div className="text-muted-foreground text-sm hidden sm:block">
                0 of {receiverTypesData.length} row(s) selected.
              </div>
              <div className="space-x-2 space-y-2">
                <Button variant="outline" size="sm" disabled>
                  Previous
                </Button>
                <Button variant="outline" size="sm" disabled>
                  Next
                </Button>
              </div>
            </div>
          </TabsContent>


          <TabsContent value="regions" className="mt-8">
            <div className="rounded-lg border bg-card">
              <Table>
                <TableHeader>
                  <TableRow className="border-b">
                    <TableHead className="py-5 px-6 font-semibold">Helsinki District</TableHead>
                    <TableHead className="text-right py-5 px-6 font-semibold">Receivers</TableHead>
                    <TableHead className="text-right py-5 px-6 font-semibold">Meals</TableHead>
                    <TableHead className="text-right py-5 px-6 font-semibold">Growth</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {helsinkiDistrictsData.map((row, index) => (
                    <TableRow key={index} className="hover:bg-muted/30 transition-colors">
                      <TableCell className="font-medium py-5 px-6">{row.district}</TableCell>
                      <TableCell className="text-right py-5 px-6">{row.receivers.toLocaleString()}</TableCell>
                      <TableCell className="text-right py-5 px-6">{row.meals}</TableCell>
                      <TableCell className="text-right py-5 px-6">
                        <span className={`font-medium ${row.growthColor}`}>{row.growth}</span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-6">
              <div className="text-muted-foreground text-sm hidden sm:block">
                0 of {helsinkiDistrictsData.length} row(s) selected.
              </div>
              <div className="space-x-2 space-y-2">
                <Button variant="outline" size="sm" disabled>
                  Previous
                </Button>
                <Button variant="outline" size="sm" disabled>
                  Next
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
