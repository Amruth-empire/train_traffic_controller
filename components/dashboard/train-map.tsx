"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin } from "lucide-react"
import type { Train } from "@/lib/types"

interface TrainMapProps {
  trains: Train[]
}

export function TrainMap({ trains }: TrainMapProps) {
  const getStatusColor = (status: Train["status"]) => {
    switch (status) {
      case "running":
        return "bg-green-500"
      case "delayed":
        return "bg-yellow-500"
      case "cancelled":
        return "bg-red-500"
      case "scheduled":
        return "bg-blue-500"
      case "completed":
        return "bg-gray-500"
      default:
        return "bg-gray-500"
    }
  }

  const getTypeColor = (type: Train["type"]) => {
    switch (type) {
      case "express":
        return "text-purple-400"
      case "passenger":
        return "text-blue-400"
      case "freight":
        return "text-orange-400"
      default:
        return "text-gray-400"
    }
  }

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <MapPin className="h-5 w-5 mr-2 text-blue-500" />
          Live Train Map
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Simulated map view with train positions */}
        <div className="relative bg-slate-900 rounded-lg p-6 h-96 overflow-hidden">
          {/* Map background grid */}
          <div className="absolute inset-0 opacity-20">
            <div className="grid grid-cols-8 grid-rows-6 h-full w-full">
              {Array.from({ length: 48 }).map((_, i) => (
                <div key={i} className="border border-slate-600" />
              ))}
            </div>
          </div>

          {/* Railway lines */}
          <svg className="absolute inset-0 w-full h-full">
            <defs>
              <pattern id="railway" patternUnits="userSpaceOnUse" width="10" height="10">
                <rect width="10" height="2" fill="#475569" y="4" />
                <rect width="2" height="10" fill="#475569" x="4" />
              </pattern>
            </defs>
            {/* Main railway lines */}
            <line x1="10%" y1="20%" x2="90%" y2="20%" stroke="#475569" strokeWidth="3" />
            <line x1="10%" y1="50%" x2="90%" y2="50%" stroke="#475569" strokeWidth="3" />
            <line x1="10%" y1="80%" x2="90%" y2="80%" stroke="#475569" strokeWidth="3" />
            <line x1="20%" y1="10%" x2="20%" y2="90%" stroke="#475569" strokeWidth="3" />
            <line x1="80%" y1="10%" x2="80%" y2="90%" stroke="#475569" strokeWidth="3" />
          </svg>

          {/* Station markers */}
          <div className="absolute top-[15%] left-[15%] w-3 h-3 bg-slate-400 rounded-full"></div>
          <div className="absolute top-[15%] right-[15%] w-3 h-3 bg-slate-400 rounded-full"></div>
          <div className="absolute bottom-[15%] left-[15%] w-3 h-3 bg-slate-400 rounded-full"></div>
          <div className="absolute bottom-[15%] right-[15%] w-3 h-3 bg-slate-400 rounded-full"></div>

          {/* Train positions */}
          {trains.map((train, index) => {
            // Simulate positions based on train data
            const x = 20 + ((index * 15) % 60)
            const y = 20 + ((index * 20) % 60)

            return (
              <div
                key={train.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
                style={{ left: `${x}%`, top: `${y}%` }}
              >
                <div className={`w-4 h-4 rounded-full ${getStatusColor(train.status)} animate-pulse`}>
                  <div className="absolute inset-0 rounded-full bg-white opacity-30"></div>
                </div>

                {/* Train info tooltip */}
                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-slate-700 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                  <div className="font-semibold">{train.number}</div>
                  <div className={getTypeColor(train.type)}>{train.type}</div>
                  <div>{train.speed} km/h</div>
                  {train.delay > 0 && <div className="text-yellow-400">+{train.delay}min</div>}
                </div>
              </div>
            )
          })}

          {/* Legend */}
          <div className="absolute bottom-4 right-4 bg-slate-800/90 rounded-lg p-3 text-xs">
            <div className="text-white font-semibold mb-2">Status</div>
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-slate-300">Running</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span className="text-slate-300">Delayed</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-slate-300">Scheduled</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="text-slate-300">Cancelled</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
