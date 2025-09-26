"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, Train, AlertTriangle, TrendingUp, Users, Gauge } from "lucide-react"
import type { KPI } from "@/lib/types"

interface KPICardsProps {
  kpis: KPI
}

export function KPICards({ kpis }: KPICardsProps) {
  const kpiData = [
    {
      title: "On-Time Performance",
      value: `${kpis.onTimePerformance.toFixed(1)}%`,
      icon: Clock,
      color:
        kpis.onTimePerformance >= 90
          ? "text-green-500"
          : kpis.onTimePerformance >= 80
            ? "text-yellow-500"
            : "text-red-500",
      bgColor:
        kpis.onTimePerformance >= 90
          ? "bg-green-500/10"
          : kpis.onTimePerformance >= 80
            ? "bg-yellow-500/10"
            : "bg-red-500/10",
    },
    {
      title: "Active Trains",
      value: kpis.activeTrains.toString(),
      icon: Train,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      subtitle: `${kpis.totalTrainsToday} total today`,
    },
    {
      title: "Delayed Trains",
      value: kpis.delayedTrains.toString(),
      icon: AlertTriangle,
      color: kpis.delayedTrains <= 3 ? "text-green-500" : kpis.delayedTrains <= 8 ? "text-yellow-500" : "text-red-500",
      bgColor:
        kpis.delayedTrains <= 3 ? "bg-green-500/10" : kpis.delayedTrains <= 8 ? "bg-yellow-500/10" : "bg-red-500/10",
      subtitle: `${kpis.averageDelay.toFixed(1)} min avg delay`,
    },
    {
      title: "System Efficiency",
      value: `${kpis.systemEfficiency.toFixed(1)}%`,
      icon: TrendingUp,
      color:
        kpis.systemEfficiency >= 95
          ? "text-green-500"
          : kpis.systemEfficiency >= 85
            ? "text-yellow-500"
            : "text-red-500",
      bgColor:
        kpis.systemEfficiency >= 95
          ? "bg-green-500/10"
          : kpis.systemEfficiency >= 85
            ? "bg-yellow-500/10"
            : "bg-red-500/10",
    },
    {
      title: "Station Capacity",
      value: `${kpis.stationCapacityUtilization.toFixed(1)}%`,
      icon: Users,
      color:
        kpis.stationCapacityUtilization <= 70
          ? "text-green-500"
          : kpis.stationCapacityUtilization <= 85
            ? "text-yellow-500"
            : "text-red-500",
      bgColor:
        kpis.stationCapacityUtilization <= 70
          ? "bg-green-500/10"
          : kpis.stationCapacityUtilization <= 85
            ? "bg-yellow-500/10"
            : "bg-red-500/10",
    },
    {
      title: "Cancelled Trains",
      value: kpis.cancelledTrains.toString(),
      icon: Gauge,
      color:
        kpis.cancelledTrains === 0 ? "text-green-500" : kpis.cancelledTrains <= 2 ? "text-yellow-500" : "text-red-500",
      bgColor:
        kpis.cancelledTrains === 0
          ? "bg-green-500/10"
          : kpis.cancelledTrains <= 2
            ? "bg-yellow-500/10"
            : "bg-red-500/10",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {kpiData.map((kpi, index) => {
        const Icon = kpi.icon
        return (
          <Card key={index} className="bg-slate-800 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">{kpi.title}</CardTitle>
              <div className={`p-2 rounded-lg ${kpi.bgColor}`}>
                <Icon className={`h-4 w-4 ${kpi.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</div>
              {kpi.subtitle && <p className="text-xs text-slate-400 mt-1">{kpi.subtitle}</p>}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
