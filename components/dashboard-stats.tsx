"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, Users, UserCheck, FileText } from "lucide-react"
import { getStats } from "@/lib/database"

export default function DashboardStats() {
  const [stats, setStats] = useState({
    totalVillages: 0,
    totalAdmins: 0,
    totalPerangkat: 0,
    totalLettersThisMonth: 0,
  })

  useEffect(() => {
    const fetchStats = async () => {
      const data = await getStats()
      setStats(data)
    }
    fetchStats()
  }, [])

  const statsData = [
    {
      title: "Total Desa",
      value: stats.totalVillages.toString(),
      description: "Desa aktif",
      icon: Building2,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Admin Desa",
      value: stats.totalAdmins.toString(),
      description: "Admin aktif",
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Perangkat Desa",
      value: stats.totalPerangkat.toString(),
      description: "Perangkat aktif",
      icon: UserCheck,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Surat Diproses",
      value: stats.totalLettersThisMonth.toString(),
      description: "Bulan ini",
      icon: FileText,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsData.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
            <div className={`p-2 rounded-full ${stat.bgColor}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
