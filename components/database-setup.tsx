"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, XCircle, Loader2, Database, AlertTriangle, RefreshCw } from "lucide-react"
import { supabase } from "@/lib/supabase"

interface TableCheck {
  name: string
  exists: boolean
  rowCount?: number
  error?: string
}

export default function DatabaseSetup() {
  const [setupStatus, setSetupStatus] = useState<{
    status: "idle" | "checking" | "setup_needed" | "partial" | "success" | "error"
    message?: string
    tables?: TableCheck[]
    canLogin?: boolean
  }>({ status: "idle" })

  const requiredTables = ["users", "villages", "citizens", "letter_requests", "activity_logs", "system_settings"]

  const checkTables = async () => {
    setSetupStatus({ status: "checking" })

    try {
      const tableChecks: TableCheck[] = []
      let allTablesExist = true
      let hasData = true

      // Check each table
      for (const tableName of requiredTables) {
        try {
          const { data, error, count } = await supabase.from(tableName).select("*", { count: "exact", head: true })

          if (error) {
            tableChecks.push({
              name: tableName,
              exists: false,
              error: error.message,
            })
            allTablesExist = false
          } else {
            tableChecks.push({
              name: tableName,
              exists: true,
              rowCount: count || 0,
            })
            if (tableName === "users" && (count || 0) === 0) {
              hasData = false
            }
          }
        } catch (err) {
          tableChecks.push({
            name: tableName,
            exists: false,
            error: err instanceof Error ? err.message : "Unknown error",
          })
          allTablesExist = false
        }
      }

      // Test login capability
      let canLogin = false
      if (allTablesExist && hasData) {
        try {
          const { data: adminUser } = await supabase.from("users").select("*").eq("username", "admin").single()
          canLogin = !!adminUser
        } catch (err) {
          console.log("Admin user check failed:", err)
        }
      }

      // Determine status
      if (allTablesExist && hasData && canLogin) {
        setSetupStatus({
          status: "success",
          message: "Database is ready! You can now login.",
          tables: tableChecks,
          canLogin: true,
        })
      } else if (allTablesExist && hasData) {
        setSetupStatus({
          status: "partial",
          message: "Tables exist but there might be data issues.",
          tables: tableChecks,
          canLogin: false,
        })
      } else if (allTablesExist) {
        setSetupStatus({
          status: "partial",
          message: "Tables exist but no data found.",
          tables: tableChecks,
          canLogin: false,
        })
      } else {
        setSetupStatus({
          status: "setup_needed",
          message: "Database tables not found. Please run the setup script.",
          tables: tableChecks,
          canLogin: false,
        })
      }
    } catch (error) {
      setSetupStatus({
        status: "error",
        message: error instanceof Error ? error.message : "Unknown error",
        canLogin: false,
      })
    }
  }

  useEffect(() => {
    checkTables()
  }, [])

  const getStatusIcon = () => {
    switch (setupStatus.status) {
      case "checking":
        return <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "error":
        return <XCircle className="h-5 w-5 text-red-500" />
      case "setup_needed":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      case "partial":
        return <AlertTriangle className="h-5 w-5 text-orange-500" />
      default:
        return <Database className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusAlert = () => {
    if (setupStatus.status === "success") {
      return (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            <div className="font-medium">{setupStatus.message}</div>
            <div className="mt-2 text-sm">
              <strong>Ready to login with:</strong>
              <ul className="list-disc list-inside mt-1">
                <li>Username: admin, Password: admin</li>
                <li>Username: admin_sukamaju, Password: admin</li>
              </ul>
            </div>
          </AlertDescription>
        </Alert>
      )
    }

    if (setupStatus.status === "setup_needed") {
      return (
        <Alert className="border-yellow-200 bg-yellow-50">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            <div className="font-medium">{setupStatus.message}</div>
            <div className="mt-2 text-sm">
              <strong>Setup Steps:</strong>
              <ol className="list-decimal list-inside mt-1 space-y-1">
                <li>Go to your Supabase Dashboard</li>
                <li>Open SQL Editor</li>
                <li>Create a new query</li>
                <li>
                  Copy and paste the script:{" "}
                  <code className="bg-yellow-100 px-1 rounded">01-disable-rls-and-create-tables.sql</code>
                </li>
                <li>Click "Run" to execute</li>
                <li>Click "Refresh Check" below</li>
              </ol>
            </div>
          </AlertDescription>
        </Alert>
      )
    }

    if (setupStatus.status === "partial") {
      return (
        <Alert className="border-orange-200 bg-orange-50">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            <div className="font-medium">{setupStatus.message}</div>
            <div className="mt-2 text-sm">
              Try running the setup script again to ensure all data is properly inserted.
            </div>
          </AlertDescription>
        </Alert>
      )
    }

    if (setupStatus.status === "error") {
      return (
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="font-medium">{setupStatus.message}</div>
            <div className="mt-2 text-sm">
              <strong>Troubleshooting:</strong>
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li>Check your Supabase project is active</li>
                <li>Verify environment variables in .env.local</li>
                <li>Ensure you have the correct permissions</li>
                <li>Try running the setup script</li>
              </ul>
            </div>
          </AlertDescription>
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
          Database Setup & Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm text-gray-600">Environment Status:</p>
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

        {setupStatus.tables && (
          <div className="mt-4">
            <p className="text-sm font-medium mb-2">Table Status:</p>
            <div className="space-y-1">
              {setupStatus.tables.map((table) => (
                <div key={table.name} className="flex items-center justify-between text-xs bg-gray-50 p-2 rounded">
                  <span className="font-mono">{table.name}</span>
                  <span className="flex items-center gap-2">
                    {table.exists ? (
                      <>
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        <span className="text-green-600">{table.rowCount} rows</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="h-3 w-3 text-red-500" />
                        <span className="text-red-600">Missing</span>
                      </>
                    )}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <Button
          onClick={checkTables}
          disabled={setupStatus.status === "checking"}
          className="w-full"
          variant={setupStatus.status === "success" ? "outline" : "default"}
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          {setupStatus.status === "checking" ? "Checking..." : "Refresh Check"}
        </Button>

        {setupStatus.status === "setup_needed" && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">🚀 Quick Setup Guide:</h4>
            <div className="text-sm text-blue-800 space-y-2">
              <p>
                <strong>1.</strong> Open{" "}
                <a
                  href="https://supabase.com/dashboard"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  Supabase Dashboard
                </a>
              </p>
              <p>
                <strong>2.</strong> Select your project
              </p>
              <p>
                <strong>3.</strong> Go to <strong>SQL Editor</strong> (left sidebar)
              </p>
              <p>
                <strong>4.</strong> Click <strong>New Query</strong>
              </p>
              <p>
                <strong>5.</strong> Copy the script from{" "}
                <code className="bg-blue-100 px-1 rounded">scripts/01-disable-rls-and-create-tables.sql</code>
              </p>
              <p>
                <strong>6.</strong> Paste and click <strong>Run</strong>
              </p>
              <p>
                <strong>7.</strong> Come back and click <strong>Refresh Check</strong>
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
