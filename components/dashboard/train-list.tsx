"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PermissionGuard } from "@/components/permission-guard";
import {
  Train,
  Clock,
  MapPin,
  Users,
  Gauge,
  Settings,
  AlertTriangle,
} from "lucide-react";
import type { Train as TrainType } from "@/lib/types";

interface TrainListProps {
  trains: TrainType[];
  showDetails?: boolean;
}

export function TrainList({ trains, showDetails = false }: TrainListProps) {
  const getStatusColor = (status: TrainType["status"]) => {
    switch (status) {
      case "running":
        return "bg-green-600";
      case "delayed":
        return "bg-yellow-600";
      case "cancelled":
        return "bg-red-600";
      case "scheduled":
        return "bg-blue-600";
      case "completed":
        return "bg-gray-600";
      default:
        return "bg-gray-600";
    }
  };

  const getTypeIcon = (type: TrainType["type"]) => {
    switch (type) {
      case "express":
        return "🚄";
      case "passenger":
        return "🚆";
      case "freight":
        return "🚂";
      default:
        return "🚆";
    }
  };

  const getPriorityColor = (priority: number) => {
    if (priority >= 8) return "text-red-400";
    if (priority >= 6) return "text-yellow-400";
    return "text-green-400";
  };

  const handleTrainControl = async (trainId: string, action: string) => {
    try {
      const response = await fetch("/api/trains", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trainId, action }),
      });

      if (response.ok) {
        console.log(`Train ${trainId} ${action} successful`);
      }
    } catch (error) {
      console.error("Train control failed:", error);
    }
  };

  return (
    <Card className="bg-slate-800 border-slate-700 h-full flex flex-col">
      <CardHeader className="flex-shrink-0">
        <CardTitle className="text-white flex items-center">
          <Train className="h-5 w-5 mr-2 text-blue-500" />
          Active Trains ({trains.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 min-h-0">
        <div className="space-y-3 h-120 overflow-y-auto">
          {trains.map((train) => (
            <div
              key={train.id}
              className="bg-slate-700/50 rounded-lg p-4 border border-slate-600 hover:border-slate-500 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{getTypeIcon(train.type)}</span>
                  <div>
                    <h3 className="text-white font-semibold">{train.number}</h3>
                    <p className="text-slate-400 text-sm capitalize">
                      {train.type}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge
                    className={`${getStatusColor(train.status)} text-white`}
                  >
                    {train.status}
                  </Badge>
                  {train.delay > 0 && (
                    <Badge
                      variant="outline"
                      className="border-yellow-500 text-yellow-500 dark:text-yellow-400"
                    >
                      +{train.delay}min
                    </Badge>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-slate-300">
                    <MapPin className="h-4 w-4" />
                    <span>{train.currentLocation}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-slate-300">
                    <Gauge className="h-4 w-4" />
                    <span>{parseFloat(train.speed.toFixed(5))} km/h</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-slate-300">
                    <Clock className="h-4 w-4" />
                    <span>
                      {train.estimatedArrival
                        ? train.estimatedArrival.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : train.scheduledArrival.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                    </span>
                  </div>
                  {train.type !== "freight" && (
                    <div className="flex items-center space-x-2 text-slate-300">
                      <Users className="h-4 w-4" />
                      <span>
                        {train.occupancy}/{train.capacity}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {showDetails && (
                <div className="mt-4 pt-3 border-t border-slate-600">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-4">
                      <span className="text-slate-400">Priority:</span>
                      <span
                        className={`font-semibold ${getPriorityColor(
                          train.priority
                        )}`}
                      >
                        {train.priority}/10
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-slate-400">Route:</span>
                      <span className="text-white">
                        {train.origin} → {train.destination}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-end mt-3 space-x-2">
                    {/* View Details - Available to all authenticated users */}
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-slate-600 text-slate-300 hover:text-white bg-transparent"
                    >
                      View Details
                    </Button>

                    {/* Track - Available to all authenticated users */}
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-slate-600 text-slate-300 hover:text-white bg-transparent"
                    >
                      Track
                    </Button>

                    {/* Control Actions - Only for controllers and admins */}
                    <PermissionGuard permission="control_trains">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          handleTrainControl(train.id, "update_priority")
                        }
                        className="border-blue-600 text-blue-400 hover:text-white hover:bg-blue-600 bg-transparent"
                      >
                        <Settings className="h-3 w-3 mr-1" />
                        Control
                      </Button>
                    </PermissionGuard>

                    {/* Emergency Stop - Only for controllers and admins with emergency control */}
                    <PermissionGuard permission="emergency_control">
                      {train.status === "running" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            handleTrainControl(train.id, "emergency_stop")
                          }
                          className="border-red-600 text-red-400 hover:text-white hover:bg-red-600 bg-transparent"
                        >
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Emergency
                        </Button>
                      )}
                    </PermissionGuard>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
