"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"
import { testSupabaseConnection } from "@/lib/supabase-test"

export default function ConnectionTest() {
  const [connectionStatus, setConnectionStatus] = useState<{
    status: "idle" | "testing" | "success" | "error"
    message?: string
    details?: any
  }>({ status: "idle" })

  const testConnection = async () => {
    setConnectionStatus({ status: "testing" })

    try {
      const result = await testSupabaseConnection()

      if (result.success) {
        setConnectionStatus({
          status: "success",
          message: "Database connected successfully!",
          details: result.data,
        })
      } else {
        setConnectionStatus({
          status: "error",
          message: result.error || "Connection failed",
        })
      }
    } catch (error) {
      setConnectionStatus({
        status: "error",
        message: error instanceof Error ? error.message : "Unknown error",
      })
    }
  }

  useEffect(() => {
    // Auto test on component mount
    testConnection()
  }, [])

  const getStatusIcon = () => {
    switch (connectionStatus.status) {
      case "testing":
        return <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "error":
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return null
    }
  }

  const getStatusAlert = () => {
    if (connectionStatus.status === "success") {
      return (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">{connectionStatus.message}</AlertDescription>
        </Alert>
      )
    }

    if (connectionStatus.status === "error") {
      return (
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertDescription>{connectionStatus.message}</AlertDescription>
        </Alert>
      )
    }

    return null
  }

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {getStatusIcon()}
          Database Connection Test
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm text-gray-600">Environment Variables:</p>
          <div className="text-xs bg-gray-100 p-2 rounded">
            <p>
              <strong>SUPABASE_URL:</strong> {process.env.NEXT_PUBLIC_SUPABASE_URL ? "✅ Set" : "❌ Missing"}
            </p>
            <p>
              <strong>SUPABASE_ANON_KEY:</strong> {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "✅ Set" : "❌ Missing"}
            </p>
          </div>
        </div>

        {getStatusAlert()}

        <Button onClick={testConnection} disabled={connectionStatus.status === "testing"} className="w-full">
          {connectionStatus.status === "testing" ? "Testing..." : "Test Connection"}
        </Button>

        {connectionStatus.details && (
          <div className="mt-4">
            <p className="text-sm font-medium">Connection Details:</p>
            <pre className="text-xs bg-gray-100 p-2 rounded mt-2 overflow-auto">
              {JSON.stringify(connectionStatus.details, null, 2)}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
