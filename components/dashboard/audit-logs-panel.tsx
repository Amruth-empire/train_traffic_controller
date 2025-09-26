"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { FileText, User, Clock, Download } from "lucide-react"
import { auditLogger } from "@/lib/audit-logger"
import { useAuth } from "@/contexts/auth-context"
import type { AuditLog } from "@/lib/types"

export function AuditLogsPanel() {
  const { user } = useAuth()
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [filteredLogs, setFilteredLogs] = useState<AuditLog[]>([])
  const [filters, setFilters] = useState({
    entityType: "all",
    userId: "all",
    search: "",
  })

  useEffect(() => {
    const allLogs = auditLogger.getLogs()
    setLogs(allLogs)
    setFilteredLogs(allLogs)
  }, [])

  useEffect(() => {
    let filtered = [...logs]

    if (filters.entityType !== "all") {
      filtered = filtered.filter((log) => log.entityType === filters.entityType)
    }

    if (filters.userId !== "all") {
      filtered = filtered.filter((log) => log.userId === filters.userId)
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filtered = filtered.filter(
        (log) =>
          log.action.toLowerCase().includes(searchLower) ||
          log.details.toLowerCase().includes(searchLower) ||
          log.userName.toLowerCase().includes(searchLower),
      )
    }

    setFilteredLogs(filtered)
  }, [logs, filters])

  const getEntityTypeColor = (entityType: AuditLog["entityType"]) => {
    switch (entityType) {
      case "train":
        return "bg-blue-600"
      case "alert":
        return "bg-red-600"
      case "optimization":
        return "bg-purple-600"
      case "system":
        return "bg-green-600"
      default:
        return "bg-gray-600"
    }
  }

  const exportLogs = () => {
    const csvContent = [
      ["Timestamp", "User", "Action", "Entity Type", "Entity ID", "Details"].join(","),
      ...filteredLogs.map((log) =>
        [
          log.timestamp.toISOString(),
          log.userName,
          log.action,
          log.entityType,
          log.entityId || "",
          `"${log.details.replace(/"/g, '""')}"`,
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `audit-logs-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center justify-between">
          <div className="flex items-center">
            <FileText className="h-5 w-5 mr-2 text-blue-500" />
            Audit Trail ({filteredLogs.length})
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={exportLogs}
            className="border-slate-600 text-slate-300 hover:text-white bg-transparent"
          >
            <Download className="h-4 w-4 mr-1" />
            Export
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            <Input
              placeholder="Search actions, details, or users..."
              value={filters.search}
              onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
              className="flex-1 min-w-[200px] bg-slate-700 border-slate-600 text-white"
            />
            <Select
              value={filters.entityType}
              onValueChange={(value) => setFilters((prev) => ({ ...prev, entityType: value }))}
            >
              <SelectTrigger className="w-[140px] bg-slate-700 border-slate-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600">
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="train">Trains</SelectItem>
                <SelectItem value="alert">Alerts</SelectItem>
                <SelectItem value="optimization">Optimization</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Logs List */}
          <ScrollArea className="h-[500px]">
            <div className="space-y-3">
              {filteredLogs.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-slate-500 mx-auto mb-3" />
                  <p className="text-slate-400">No audit logs found</p>
                  <p className="text-slate-500 text-sm">Try adjusting your filters</p>
                </div>
              ) : (
                filteredLogs.map((log) => (
                  <div
                    key={log.id}
                    className="bg-slate-700/50 rounded-lg p-4 border border-slate-600 hover:border-slate-500 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Badge className={getEntityTypeColor(log.entityType)}>{log.entityType}</Badge>
                        <span className="text-white font-semibold">{log.action}</span>
                      </div>
                      <div className="flex items-center text-slate-400 text-sm">
                        <Clock className="h-3 w-3 mr-1" />
                        {log.timestamp.toLocaleString()}
                      </div>
                    </div>

                    <p className="text-slate-300 text-sm mb-2">{log.details}</p>

                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <div className="flex items-center">
                        <User className="h-3 w-3 mr-1" />
                        {log.userName}
                      </div>
                      {log.entityId && <span>ID: {log.entityId}</span>}
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  )
}
