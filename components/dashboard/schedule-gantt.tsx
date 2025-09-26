"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock } from "lucide-react"
import type { Train } from "@/lib/types"

interface ScheduleGanttProps {
  trains: Train[]
}

export function ScheduleGantt({ trains }: ScheduleGanttProps) {
  // Create time slots for the next 4 hours
  const now = new Date()
  const timeSlots = Array.from({ length: 16 }, (_, i) => {
    const time = new Date(now.getTime() + i * 15 * 60 * 1000) // 15-minute intervals
    return time
  })

  const getStatusColor = (status: Train["status"]) => {
    switch (status) {
      case "running":
        return "bg-green-600"
      case "delayed":
        return "bg-yellow-600"
      case "cancelled":
        return "bg-red-600"
      case "scheduled":
        return "bg-blue-600"
      case "completed":
        return "bg-gray-600"
      default:
        return "bg-gray-600"
    }
  }

  const getTrainPosition = (train: Train) => {
    const startTime = train.actualDeparture || train.scheduledDeparture
    const endTime = train.estimatedArrival || train.scheduledArrival
    const duration = endTime.getTime() - startTime.getTime()
    const startOffset = startTime.getTime() - now.getTime()

    // Calculate position as percentage of the 4-hour window
    const windowDuration = 4 * 60 * 60 * 1000 // 4 hours in ms
    const left = Math.max(0, (startOffset / windowDuration) * 100)
    const width = Math.min(100 - left, (duration / windowDuration) * 100)

    return { left: `${left}%`, width: `${width}%` }
  }

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Calendar className="h-5 w-5 mr-2 text-blue-500" />
          Schedule Gantt Chart - Next 4 Hours
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Time header */}
          <div className="relative h-8 bg-slate-700 rounded-lg">
            <div className="flex items-center h-full px-4">
              {timeSlots
                .filter((_, i) => i % 4 === 0)
                .map((time, i) => (
                  <div key={i} className="flex-1 text-center">
                    <span className="text-slate-300 text-sm">
                      {time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                ))}
            </div>
            {/* Current time indicator */}
            <div className="absolute top-0 left-0 w-0.5 h-full bg-red-500 z-10">
              <div className="absolute -top-1 -left-1 w-2 h-2 bg-red-500 rounded-full"></div>
            </div>
          </div>

          {/* Train schedules */}
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {trains.map((train) => {
              const position = getTrainPosition(train)
              const isVisible = Number.parseFloat(position.width.replace("%", "")) > 0

              if (!isVisible) return null

              return (
                <div key={train.id} className="relative">
                  <div className="flex items-center mb-1">
                    <div className="w-24 flex-shrink-0">
                      <span className="text-white font-medium">{train.number}</span>
                      <Badge className={`ml-2 ${getStatusColor(train.status)} text-xs`}>{train.status}</Badge>
                    </div>
                  </div>

                  <div className="relative h-8 bg-slate-700/30 rounded">
                    <div
                      className={`absolute top-1 bottom-1 ${getStatusColor(train.status)} rounded flex items-center px-2 min-w-0`}
                      style={position}
                    >
                      <div className="flex items-center space-x-1 min-w-0">
                        <Clock className="h-3 w-3 flex-shrink-0" />
                        <span className="text-xs text-white truncate">
                          {train.origin} → {train.destination}
                        </span>
                        {train.delay > 0 && (
                          <span className="text-xs text-yellow-200 flex-shrink-0">+{train.delay}m</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>
                      Dep:{" "}
                      {(train.actualDeparture || train.scheduledDeparture).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    <span>
                      Arr:{" "}
                      {(train.estimatedArrival || train.scheduledArrival).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center space-x-6 pt-4 border-t border-slate-700">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-600 rounded"></div>
              <span className="text-slate-300 text-sm">Running</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-600 rounded"></div>
              <span className="text-slate-300 text-sm">Delayed</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-600 rounded"></div>
              <span className="text-slate-300 text-sm">Scheduled</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-600 rounded"></div>
              <span className="text-slate-300 text-sm">Cancelled</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
