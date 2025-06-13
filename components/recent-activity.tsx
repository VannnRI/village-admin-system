"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock } from "lucide-react"
import { getActivityLogs } from "@/lib/database"

export default function RecentActivity() {
  const [activities, setActivities] = useState<any[]>([])

  useEffect(() => {
    const fetchActivities = async () => {
      const data = await getActivityLogs(5)
      setActivities(data)
    }
    fetchActivities()
  }, [])

  const getTypeBadge = (action: string) => {
    if (action.includes("created") || action.includes("logged in")) {
      return (
        <Badge variant="default" className="bg-green-100 text-green-800">
          Baru
        </Badge>
      )
    } else if (action.includes("updated")) {
      return (
        <Badge variant="default" className="bg-blue-100 text-blue-800">
          Update
        </Badge>
      )
    } else if (action.includes("deleted")) {
      return (
        <Badge variant="default" className="bg-red-100 text-red-800">
          Hapus
        </Badge>
      )
    }
    return <Badge variant="secondary">Lainnya</Badge>
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return "Baru saja"
    if (diffInMinutes < 60) return `${diffInMinutes} menit yang lalu`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} jam yang lalu`
    return `${Math.floor(diffInMinutes / 1440)} hari yang lalu`
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Clock className="mr-2 h-5 w-5" />
          Aktivitas Terbaru
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.length === 0 ? (
            <p className="text-gray-500 text-sm">Belum ada aktivitas</p>
          ) : (
            activities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-sm text-gray-500">
                    oleh {activity.user?.username || "System"} • {formatTime(activity.created_at)}
                  </p>
                  {activity.details && <p className="text-xs text-gray-400 mt-1">{activity.details}</p>}
                </div>
                {getTypeBadge(activity.action)}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
