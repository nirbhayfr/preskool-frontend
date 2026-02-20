'use client'

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from '@/components/ui/card'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { LabelList, RadialBar, RadialBarChart } from 'recharts'

// Revenue data (area chart)
const revenueData = [
  { month: 'Jan', revenue: 12000 },
  { month: 'Feb', revenue: 15000 },
  { month: 'Mar', revenue: 14000 },
  { month: 'Apr', revenue: 18000 },
  { month: 'May', revenue: 20000 },
  { month: 'Jun', revenue: 22000 },
]

// Book category data (radial chart)
const categoryData = [
  { category: 'Fiction', value: 400, fill: '#1e40af' },
  { category: 'Non-Fiction', value: 300, fill: '#1e3a8a' },
  { category: 'Science & Tech', value: 200, fill: '#2563eb' },
  { category: 'History', value: 150, fill: '#3b82f6' },
  { category: 'Children', value: 100, fill: '#60a5fa' },
  { category: 'Others', value: 50, fill: '#93c5fd' },
]

export default function LibraryAnalytics() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
      {/* Area Chart - Revenue */}
      <Card className="lg:col-span-3 h-102 rounded-sm">
        <CardHeader>
          <CardTitle>Library Revenue</CardTitle>
        </CardHeader>
        <CardContent className="h-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={revenueData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Area
                type="step"
                dataKey="revenue"
                stroke="#3b82f6"
                fill="#bfdbfe"
                fillOpacity={0.5}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Radial Chart - Book Categories */}
      <Card className="flex flex-col lg:col-span-2 rounded-sm">
        <CardHeader className="pb-0">
          <CardTitle>Books by Category</CardTitle>
          <CardDescription>Library Inventory Overview</CardDescription>
        </CardHeader>

        <CardContent className="pb-0 h-72 flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
              data={categoryData}
              startAngle={-90}
              endAngle={270}
              innerRadius="20%"
              outerRadius="90%"
            >
              <RadialBar
                dataKey="value"
                cornerRadius={12}
                background={{
                  fill:
                    getComputedStyle(document.documentElement).getPropertyValue(
                      '--background-accent'
                    ) || '#e5e7eb',
                }}
              >
                <LabelList
                  position="insideStart"
                  dataKey="category"
                  className="fill-white capitalize font-medium"
                  fontSize={12}
                />
              </RadialBar>
              <Tooltip
                content={({ payload }) => {
                  if (!payload || payload.length === 0) return null
                  const data = payload[0].payload
                  return (
                    <div className="bg-accent shadow-md p-2 rounded border text-sm">
                      <strong>{data.category}</strong>: {data.value}
                    </div>
                  )
                }}
              />
            </RadialBarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
