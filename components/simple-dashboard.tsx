"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useWebSocket } from "@/contexts/websocket-context"

export function SimpleDashboard() {
  const { user } = useAuth()
  const { isConnected, trainUpdates } = useWebSocket()
  const [selectedView, setSelectedView] = useState("overview")

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 transition-colors duration-300 dark:bg-slate-900 dark:text-white">
      <header className="bg-white dark:bg-slate-800 p-4">
        <h1 className="text-xl font-bold">Railway Control Dashboard</h1>
        <p>Welcome, {user?.name}</p>
        <p>WebSocket Connected: {isConnected ? "Yes" : "No"}</p>
        <p>Train Updates: {trainUpdates.length}</p>
      </header>
      <main className="p-6">
        <p>Dashboard content - View: {selectedView}</p>
      </main>
    </div>
  )
}