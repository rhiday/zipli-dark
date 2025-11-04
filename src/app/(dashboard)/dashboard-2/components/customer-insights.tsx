"use client"

import { useState } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Users, MapPin, TrendingUp, Target, ArrowUpIcon, UserIcon, Utensils, Heart } from "lucide-react"

const receiverImpactData = [
  { month: "Jan", new: 12, active: 23, completed: 8 },
  { month: "Feb", new: 15, active: 28, completed: 12 },
  { month: "Mar", new: 18, active: 31, completed: 15 },
  { month: "Apr", new: 22, active: 35, completed: 18 },
  { month: "May", new: 25, active: 38, completed: 22 },
  { month: "Jun", new: 28, active: 42, completed: 25 },
]

const chartConfig = {
  new: {
    label: "New Receivers",
    color: "var(--chart-1)",
  },
  active: {
    label: "Active",
    color: "var(--chart-2)",
  },
  completed: {
    label: "Completed",
    color: "var(--chart-3)",
  },
}

const receiverTypesData = [
  { type: "Food Banks", receivers: 12, percentage: "35.3%", growth: "+15.2%", growthColor: "text-green-600" },
  { type: "Charities", receivers: 18, percentage: "52.9%", growth: "+8.7%", growthColor: "text-green-600" },
  { type: "Community Centers", receivers: 4, percentage: "11.8%", growth: "+3.4%", growthColor: "text-blue-600" },
]

const helsinkiDistrictsData = [
  { district: "Kampii", receivers: 8, meals: "2,847", growth: "+12.3%", growthColor: "text-green-600" },
  { district: "Kallio", receivers: 6, meals: "1,923", growth: "+9.7%", growthColor: "text-green-600" },
  { district: "Hakaniemi", receivers: 5, meals: "1,456", growth: "+18.4%", growthColor: "text-blue-600" },
  { district: "Punavuori", receivers: 4, meals: "1,123", growth: "+15.8%", growthColor: "text-green-600" },
  { district: "Others", receivers: 11, meals: "2,891", growth: "+5.2%", growthColor: "text-orange-600" },
]

export function CustomerInsights() {
  const [activeTab, setActiveTab] = useState("growth")

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
                  <h3 className="text-sm font-medium text-muted-foreground mb-6">Receiver Growth Trends</h3>
                  <ChartContainer config={chartConfig} className="h-[375px] w-full">
                    <BarChart data={receiverImpactData} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis
                        dataKey="month"
                        className="text-xs"
                        tick={{ fontSize: 12 }}
                        tickLine={{ stroke: 'var(--border)' }}
                        axisLine={{ stroke: 'var(--border)' }}
                      />
                      <YAxis
                        className="text-xs"
                        tick={{ fontSize: 12 }}
                        tickLine={{ stroke: 'var(--border)' }}
                        axisLine={{ stroke: 'var(--border)' }}
                        domain={[0, 'dataMax']}
                      />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="new" fill="var(--color-new)" radius={[2, 2, 0, 0]} />
                      <Bar dataKey="active" fill="var(--color-active)" radius={[2, 2, 0, 0]} />
                      <Bar dataKey="completed" fill="var(--color-completed)" radius={[2, 2, 0, 0]} />
                    </BarChart>
                  </ChartContainer>
                </div>

                {/* Key Metrics - 30% */}
                <div className="col-span-10 xl:col-span-3 space-y-5">
                  <h3 className="text-sm font-medium text-muted-foreground mb-6">Key Metrics</h3>
                  <div className="grid grid-cols-3 gap-5">
                    <div className="p-4 rounded-lg max-lg:col-span-3 xl:col-span-3 border">
                      <div className="flex items-center gap-2 mb-2">
                        <Heart className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">Active Receivers</span>
                      </div>
                      <div className="text-2xl font-bold">34</div>
                      <div className="text-xs text-green-600 flex items-center gap-1 mt-1">
                        <ArrowUpIcon className="h-3 w-3" />
                        +12.5% from last month
                      </div>
                    </div>

                    <div className="p-4 rounded-lg max-lg:col-span-3 xl:col-span-3 border">
                      <div className="flex items-center gap-2 mb-2">
                        <Utensils className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Meals Distributed</span>
                      </div>
                      <div className="text-2xl font-bold">8,200</div>
                      <div className="text-xs text-green-600 flex items-center gap-1 mt-1">
                        <ArrowUpIcon className="h-3 w-3" />
                        +2.1% improvement
                      </div>
                    </div>

                    <div className="p-4 rounded-lg max-lg:col-span-3 xl:col-span-3 border">
                      <div className="flex items-center gap-2 mb-2">
                        <Target className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Success Rate</span>
                      </div>
                      <div className="text-2xl font-bold">94.2%</div>
                      <div className="text-xs text-green-600 flex items-center gap-1 mt-1">
                        <ArrowUpIcon className="h-3 w-3" />
                        +8.3% growth
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
