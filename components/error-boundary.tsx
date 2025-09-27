"use client"

import React from 'react'

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error Boundary caught an error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-red-50 dark:bg-red-900/20">
          <div className="max-w-md p-6 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-red-200 dark:border-red-800">
            <h2 className="text-xl font-bold text-red-800 dark:text-red-200 mb-4">
              Something went wrong
            </h2>
            <pre className="text-sm text-red-600 dark:text-red-300 bg-red-50 dark:bg-red-900/30 p-3 rounded overflow-auto">
              {this.state.error?.message}
            </pre>
            <details className="mt-4">
              <summary className="cursor-pointer text-sm text-red-600 dark:text-red-300">
                Stack trace
              </summary>
              <pre className="text-xs text-red-500 dark:text-red-400 mt-2 overflow-auto">
                {this.state.error?.stack}
              </pre>
            </details>
            <button 
              onClick={() => this.setState({ hasError: false, error: null })}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Try again
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}