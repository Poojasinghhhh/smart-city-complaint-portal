"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import type { Complaint } from "@/lib/types"

interface AnalyticsChartsProps {
  complaints: Complaint[]
}

const STATUS_COLORS: Record<string, string> = {
  pending: "var(--status-pending)",
  in_progress: "var(--status-in-progress)",
  resolved: "var(--status-resolved)",
  rejected: "var(--status-rejected)",
}

const CATEGORY_LABELS: Record<string, string> = {
  roads: "Roads",
  water: "Water",
  electricity: "Electricity",
  sanitation: "Sanitation",
  streetlights: "Streetlights",
  drainage: "Drainage",
}

export function AnalyticsCharts({ complaints }: AnalyticsChartsProps) {
  // Status distribution data
  const statusData = [
    { name: "Pending", value: complaints.filter(c => c.status === "pending").length, fill: STATUS_COLORS.pending },
    { name: "In Progress", value: complaints.filter(c => c.status === "in_progress").length, fill: STATUS_COLORS.in_progress },
    { name: "Resolved", value: complaints.filter(c => c.status === "resolved").length, fill: STATUS_COLORS.resolved },
    { name: "Rejected", value: complaints.filter(c => c.status === "rejected").length, fill: STATUS_COLORS.rejected },
  ].filter(d => d.value > 0)

  // Category distribution data
  const categoryData = Object.entries(
    complaints.reduce((acc, c) => {
      acc[c.category] = (acc[c.category] || 0) + 1
      return acc
    }, {} as Record<string, number>)
  ).map(([category, count]) => ({
    name: CATEGORY_LABELS[category] || category,
    count,
  })).sort((a, b) => b.count - a.count)

  // Weekly trends (last 7 days)
  const weeklyData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (6 - i))
    const dateStr = date.toISOString().split("T")[0]
    const count = complaints.filter(c => 
      c.created_at.startsWith(dateStr)
    ).length
    return {
      day: date.toLocaleDateString("en-US", { weekday: "short" }),
      complaints: count,
    }
  })

  if (complaints.length === 0) {
    return (
      <Card className="border-border bg-card">
        <CardContent className="pt-6 text-center text-muted-foreground">
          No data available for analytics
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
      {/* Status Distribution Pie Chart */}
      <Card className="border-border bg-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-foreground text-base">Status Distribution</CardTitle>
          <CardDescription className="text-muted-foreground">
            Breakdown by complaint status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={70}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "var(--card)", 
                    borderColor: "var(--border)",
                    borderRadius: "var(--radius)",
                    color: "var(--foreground)"
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-3 mt-2">
            {statusData.map((item) => (
              <div key={item.name} className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.fill }} />
                <span className="text-muted-foreground">{item.name}: {item.value}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Category Distribution Bar Chart */}
      <Card className="border-border bg-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-foreground text-base">By Category</CardTitle>
          <CardDescription className="text-muted-foreground">
            Complaints per department
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} layout="vertical">
                <XAxis type="number" hide />
                <YAxis 
                  type="category" 
                  dataKey="name" 
                  width={80} 
                  tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "var(--card)", 
                    borderColor: "var(--border)",
                    borderRadius: "var(--radius)",
                    color: "var(--foreground)"
                  }}
                />
                <Bar 
                  dataKey="count" 
                  fill="var(--primary)" 
                  radius={[0, 4, 4, 0]}
                  barSize={20}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Trends */}
      <Card className="border-border bg-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-foreground text-base">Weekly Trends</CardTitle>
          <CardDescription className="text-muted-foreground">
            Complaints in the last 7 days
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <XAxis 
                  dataKey="day" 
                  tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  width={30}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "var(--card)", 
                    borderColor: "var(--border)",
                    borderRadius: "var(--radius)",
                    color: "var(--foreground)"
                  }}
                />
                <Bar 
                  dataKey="complaints" 
                  fill="var(--primary)" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
