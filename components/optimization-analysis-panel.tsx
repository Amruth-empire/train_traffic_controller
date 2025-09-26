"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Zap, Brain, TrendingUp, Clock, Users } from "lucide-react"

interface AnalysisResult {
  suggestions: any[]
  metrics: {
    totalDelayReduction: number
    affectedTrains: number
    confidenceScore: number
    implementationComplexity: "low" | "medium" | "high"
  }
}

export function OptimizationAnalysisPanel() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)

  const runSystemAnalysis = async () => {
    setIsAnalyzing(true)
    try {
      const response = await fetch("/api/optimization/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ forceAnalysis: true }),
      })

      if (response.ok) {
        const data = await response.json()
        setAnalysisResult(data.data)
      }
    } catch (error) {
      console.error("Analysis failed:", error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case "low":
        return "bg-green-600"
      case "medium":
        return "bg-yellow-600"
      case "high":
        return "bg-red-600"
      default:
        return "bg-gray-600"
    }
  }

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Brain className="h-5 w-5 mr-2 text-purple-500" />
          AI System Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <p className="text-slate-300 text-sm">Run comprehensive system optimization analysis</p>
          <Button onClick={runSystemAnalysis} disabled={isAnalyzing} className="bg-purple-600 hover:bg-purple-700">
            {isAnalyzing ? (
              <>
                <Zap className="h-4 w-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Brain className="h-4 w-4 mr-2" />
                Analyze System
              </>
            )}
          </Button>
        </div>

        {analysisResult && (
          <div className="space-y-4 pt-4 border-t border-slate-700">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-700/50 rounded-lg p-3">
                <div className="flex items-center space-x-2 mb-1">
                  <Clock className="h-4 w-4 text-blue-400" />
                  <span className="text-sm text-slate-300">Delay Reduction</span>
                </div>
                <div className="text-xl font-bold text-blue-400">{analysisResult.metrics.totalDelayReduction} min</div>
              </div>

              <div className="bg-slate-700/50 rounded-lg p-3">
                <div className="flex items-center space-x-2 mb-1">
                  <Users className="h-4 w-4 text-green-400" />
                  <span className="text-sm text-slate-300">Affected Trains</span>
                </div>
                <div className="text-xl font-bold text-green-400">{analysisResult.metrics.affectedTrains}</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-300">Confidence Score</span>
                <span className="text-sm text-white">{(analysisResult.metrics.confidenceScore * 100).toFixed(0)}%</span>
              </div>
              <Progress value={analysisResult.metrics.confidenceScore * 100} className="h-2" />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-300">Implementation Complexity</span>
              <Badge className={`${getComplexityColor(analysisResult.metrics.implementationComplexity)} text-white`}>
                {analysisResult.metrics.implementationComplexity}
              </Badge>
            </div>

            <div className="bg-slate-700/30 rounded-lg p-3">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="h-4 w-4 text-purple-400" />
                <span className="text-sm font-medium text-white">Generated Suggestions</span>
              </div>
              <div className="text-2xl font-bold text-purple-400 mb-1">{analysisResult.suggestions.length}</div>
              <p className="text-xs text-slate-400">
                AI has identified {analysisResult.suggestions.length} optimization opportunities
              </p>
            </div>

            {analysisResult.suggestions.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-white">Top Suggestions:</h4>
                {analysisResult.suggestions.slice(0, 3).map((suggestion, index) => (
                  <div key={index} className="bg-slate-700/30 rounded p-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-slate-300 capitalize">
                        {suggestion.type.replace("_", " ")} - {suggestion.trainId}
                      </span>
                      <Badge className="bg-purple-600 text-white text-xs">
                        {(suggestion.confidence * 100).toFixed(0)}%
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-400">{suggestion.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
