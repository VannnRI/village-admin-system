"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase } from "@/lib/supabase"

export default function DebugPanel() {
  const [users, setUsers] = useState<any[]>([])
  const [citizens, setCitizens] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const checkDatabase = async () => {
    setLoading(true)
    try {
      // Check users
      const { data: usersData, error: usersError } = await supabase.from("users").select("*").order("id")

      console.log("Users data:", usersData)
      console.log("Users error:", usersError)
      setUsers(usersData || [])

      // Check citizens
      const { data: citizensData, error: citizensError } = await supabase.from("citizens").select("*").order("id")

      console.log("Citizens data:", citizensData)
      console.log("Citizens error:", citizensError)
      setCitizens(citizensData || [])
    } catch (error) {
      console.error("Database check error:", error)
    }
    setLoading(false)
  }

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Debug Database</CardTitle>
      </CardHeader>
      <CardContent>
        <Button onClick={checkDatabase} disabled={loading}>
          {loading ? "Checking..." : "Check Database"}
        </Button>

        {users.length > 0 && (
          <div className="mt-4">
            <h3 className="font-semibold">Users:</h3>
            <pre className="text-xs bg-gray-100 p-2 rounded mt-2 overflow-auto">{JSON.stringify(users, null, 2)}</pre>
          </div>
        )}

        {citizens.length > 0 && (
          <div className="mt-4">
            <h3 className="font-semibold">Citizens:</h3>
            <pre className="text-xs bg-gray-100 p-2 rounded mt-2 overflow-auto">
              {JSON.stringify(citizens, null, 2)}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
