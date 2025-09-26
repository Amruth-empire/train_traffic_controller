"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Zap,
  TrendingUp,
  Clock,
  Route,
  Settings,
  CheckCircle,
  X,
} from "lucide-react";
import type { OptimizationSuggestion } from "@/lib/types";

interface OptimizationPanelProps {
  suggestions: OptimizationSuggestion[];
  expanded?: boolean;
}

export function OptimizationPanel({
  suggestions,
  expanded = false,
}: OptimizationPanelProps) {
  const getTypeIcon = (type: OptimizationSuggestion["type"]) => {
    switch (type) {
      case "reroute":
        return <Route className="h-4 w-4" />;
      case "reschedule":
        return <Clock className="h-4 w-4" />;
      case "priority_change":
        return <TrendingUp className="h-4 w-4" />;
      case "platform_change":
        return <Settings className="h-4 w-4" />;
      default:
        return <Zap className="h-4 w-4" />;
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return "text-green-400";
    if (confidence >= 0.6) return "text-yellow-400";
    return "text-red-400";
  };

  const getStatusColor = (status: OptimizationSuggestion["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-600";
      case "accepted":
        return "bg-green-600";
      case "rejected":
        return "bg-red-600";
      case "implemented":
        return "bg-blue-600";
      default:
        return "bg-gray-600";
    }
  };

  const pendingSuggestions = suggestions.filter((s) => s.status === "pending");

  return (
    <Card className="bg-slate-800 border-slate-700 h-full">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Zap className="h-5 w-5 mr-2 text-purple-500" />
          AI Optimization Suggestions ({pendingSuggestions.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className={`space-y-4 ${
            expanded ? "max-h-none" : "max-h-96 overflow-y-auto"
          }`}
        >
          {pendingSuggestions.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
              <p className="text-slate-400">No pending suggestions</p>
              <p className="text-slate-500 text-sm">
                System is running optimally
              </p>
            </div>
          ) : (
            pendingSuggestions.map((suggestion) => (
              <div
                key={suggestion.id}
                className="bg-slate-700/50 rounded-lg p-4 border border-slate-600 hover:border-slate-500 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    {getTypeIcon(suggestion.type)}
                    <div>
                      <h3 className="text-white font-semibold capitalize">
                        {suggestion.type.replace("_", " ")} - Train{" "}
                        {suggestion.trainId}
                      </h3>
                      <Badge className={getStatusColor(suggestion.status)}>
                        {suggestion.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-slate-400">Confidence</div>
                    <div
                      className={`font-semibold ${getConfidenceColor(
                        suggestion.confidence
                      )}`}
                    >
                      {(suggestion.confidence * 100).toFixed(0)}%
                    </div>
                  </div>
                </div>

                <p className="text-slate-300 text-sm mb-3">
                  {suggestion.description}
                </p>

                <div className="bg-slate-800/50 rounded p-3 mb-3">
                  <div className="flex items-center space-x-2 mb-1">
                    <TrendingUp className="h-4 w-4 text-green-400" />
                    <span className="text-sm font-medium text-green-400">
                      Expected Improvement
                    </span>
                  </div>
                  <p className="text-slate-300 text-sm">
                    {suggestion.estimatedImprovement}
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                  <span>
                    Created:{" "}
                    {suggestion.createdAt.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  <span>Train: {suggestion.trainId}</span>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-red-600 text-red-400 hover:text-white hover:bg-red-600 bg-transparent"
                  >
                    <X className="h-3 w-3 mr-1" />
                    Reject
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-slate-600 text-slate-300 hover:text-black bg-transparent"
                  >
                    View Details
                  </Button>
                  <Button
                    size="sm"
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Accept
                  </Button>
                </div>
              </div>
            ))
          )}

          {expanded && (
            <div className="mt-6 p-4 bg-slate-700/30 rounded-lg">
              <h4 className="text-white font-semibold mb-3 flex items-center">
                <Zap className="h-4 w-4 mr-2 text-purple-500" />
                AI Optimization Metrics
              </h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-slate-400">Suggestions Today:</span>
                  <span className="text-white ml-2 font-semibold">12</span>
                </div>
                <div>
                  <span className="text-slate-400">Acceptance Rate:</span>
                  <span className="text-green-400 ml-2 font-semibold">85%</span>
                </div>
                <div>
                  <span className="text-slate-400">Avg. Improvement:</span>
                  <span className="text-blue-400 ml-2 font-semibold">
                    7.2 min
                  </span>
                </div>
                <div>
                  <span className="text-slate-400">System Learning:</span>
                  <span className="text-purple-400 ml-2 font-semibold">
                    Active
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
