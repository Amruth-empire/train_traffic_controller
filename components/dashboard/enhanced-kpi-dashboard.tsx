"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { TrendingUp, TrendingDown, Clock, AlertTriangle, Users, Gauge, Target } from "lucide-react"
import type { KPI } from "@/lib/types"

interface EnhancedKPIDashboardProps {
  kpis: KPI
}

export function EnhancedKPIDashboard({ kpis }: EnhancedKPIDashboardProps) {
  // Mock historical data for charts
  const historicalData = [
    { time: "00:00", onTime: 92, efficiency: 88, delays: 3 },
    { time: "04:00", onTime: 95, efficiency: 91, delays: 2 },
    { time: "08:00", onTime: 85, efficiency: 87, delays: 8 },
    { time: "12:00", onTime: 88, efficiency: 89, delays: 6 },
    { time: "16:00", onTime: 82, efficiency: 85, delays: 12 },
    { time: "20:00", onTime: 90, efficiency: 92, delays: 4 },
  ]

  const sectionPerformance = [
    { section: "North", onTime: 92, trains: 15 },
    { section: "South", onTime: 85, trains: 12 },
    { section: "East", onTime: 88, trains: 18 },
    { section: "Central", onTime: 90, trains: 20 },
  ]

  const trainTypeData = [
    { name: "Express", value: 35, color: "#3b82f6" },
    { name: "Passenger", value: 45, color: "#10b981" },
    { name: "Freight", value: 20, color: "#f59e0b" },
  ]

  const delayReasons = [
    { reason: "Signal Issues", count: 8, percentage: 35 },
    { reason: "Weather", count: 5, percentage: 22 },
    { reason: "Maintenance", count: 4, percentage: 17 },
    { reason: "Traffic", count: 3, percentage: 13 },
    { reason: "Other", count: 3, percentage: 13 },
  ]

  const getPerformanceColor = (value: number, thresholds: { good: number; warning: number }) => {
    if (value >= thresholds.good) return "text-green-400"
    if (value >= thresholds.warning) return "text-yellow-400"
    return "text-red-400"
  }

  const getTrendIcon = (current: number, target: number) => {
    if (current >= target) return <TrendingUp className="h-4 w-4 text-green-400" />
    return <TrendingDown className="h-4 w-4 text-red-400" />
  }

  return (
    <div className="space-y-6">
      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">On-Time Performance</CardTitle>
            <div className="flex items-center space-x-1">
              {getTrendIcon(kpis.onTimePerformance, 90)}
              <Target className="h-4 w-4 text-slate-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${getPerformanceColor(kpis.onTimePerformance, { good: 90, warning: 80 })}`}
            >
              {kpis.onTimePerformance.toFixed(1)}%
            </div>
            <div className="flex items-center space-x-2 mt-1">
              <Badge variant="outline" className="text-xs">
                Target: 90%
              </Badge>
              <span className="text-xs text-slate-400">vs 85.2% yesterday</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">System Efficiency</CardTitle>
            <Gauge className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${getPerformanceColor(kpis.systemEfficiency, { good: 95, warning: 85 })}`}
            >
              {kpis.systemEfficiency.toFixed(1)}%
            </div>
            <div className="flex items-center space-x-2 mt-1">
              <Badge variant="outline" className="text-xs">
                Target: 95%
              </Badge>
              <span className="text-xs text-slate-400">+2.1% from last week</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Average Delay</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${getPerformanceColor(15 - kpis.averageDelay, { good: 10, warning: 5 })}`}
            >
              {kpis.averageDelay.toFixed(1)} min
            </div>
            <div className="flex items-center space-x-2 mt-1">
              <Badge variant="outline" className="text-xs">
                Target: &lt;5min
              </Badge>
              <span className="text-xs text-slate-400">-1.3min from peak</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Capacity Utilization</CardTitle>
            <Users className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${getPerformanceColor(85 - kpis.stationCapacityUtilization, { good: 15, warning: 5 })}`}
            >
              {kpis.stationCapacityUtilization.toFixed(1)}%
            </div>
            <div className="flex items-center space-x-2 mt-1">
              <Badge variant="outline" className="text-xs">
                Optimal: &lt;80%
              </Badge>
              <span className="text-xs text-slate-400">Peak: 92% at 8AM</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Performance Trends (24h)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={historicalData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="time" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                  }}
                />
                <Line type="monotone" dataKey="onTime" stroke="#10b981" strokeWidth={2} name="On-Time %" />
                <Line type="monotone" dataKey="efficiency" stroke="#3b82f6" strokeWidth={2} name="Efficiency %" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Delay Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={historicalData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="time" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="delays"
                  stroke="#ef4444"
                  fill="#ef4444"
                  fillOpacity={0.3}
                  name="Delayed Trains"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Section Performance & Train Types */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="bg-slate-800 border-slate-700 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-white">Section Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={sectionPerformance}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="section" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="onTime" fill="#10b981" name="On-Time %" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Train Types</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={trainTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {trainTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {trainTypeData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-slate-300 text-sm">{item.name}</span>
                  </div>
                  <span className="text-white font-semibold">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Delay Analysis */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2 text-yellow-500" />
            Delay Root Cause Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {delayReasons.map((reason, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="text-white font-medium">{reason.reason}</div>
                  <Badge variant="outline" className="text-xs">
                    {reason.count} incidents
                  </Badge>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-32 bg-slate-600 rounded-full h-2">
                    <div className="bg-red-500 h-2 rounded-full" style={{ width: `${reason.percentage}%` }} />
                  </div>
                  <span className="text-slate-300 text-sm w-12 text-right">{reason.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
