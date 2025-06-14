"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, FileText, CheckCircle, Clock, Activity } from "lucide-react"
import { supabase } from "@/lib/supabase"

export default function AdminDesaDashboard() {
  const [stats, setStats] = useState({
    totalCitizens: 0,
    totalLetters: 0,
    pendingLetters: 0,
    approvedLetters: 0,
  })
  const [recentLetters, setRecentLetters] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
      fetchDashboardData(parsedUser.username)
    }
  }, [])

  const fetchDashboardData = async (username: string) => {
    try {
      // Get village ID for the admin
      const { data: villages } = await supabase
        .from("villages")
        .select("id")
        .eq("admin_id", (await supabase.from("users").select("id").eq("username", username).single()).data?.id)
        .single()

      if (!villages) return

      const villageId = villages.id

      // Fetch statistics
      const [citizensResult, lettersResult, pendingResult, approvedResult] = await Promise.all([
        supabase.from("citizens").select("count").eq("village_id", villageId),
        supabase.from("letter_requests").select("count").eq("village_id", villageId),
        supabase.from("letter_requests").select("count").eq("village_id", villageId).eq("status", "pending"),
        supabase.from("letter_requests").select("count").eq("village_id", villageId).eq("status", "approved"),
      ])

      setStats({
        totalCitizens: citizensResult.count || 0,
        totalLetters: lettersResult.count || 0,
        pendingLetters: pendingResult.count || 0,
        approvedLetters: approvedResult.count || 0,
      })

      // Fetch recent letters
      const { data: letters } = await supabase
        .from("letter_requests")
        .select(`
          *,
          citizens (nama, nik)
        `)
        .eq("village_id", villageId)
        .order("created_at", { ascending: false })
        .limit(5)

      setRecentLetters(letters || [])
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
    }
    setLoading(false)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Menunggu</Badge>
      case "approved":
        return <Badge className="bg-green-100 text-green-800">Disetujui</Badge>
      case "rejected":
        return <Badge className="bg-red-100 text-red-800">Ditolak</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Admin Desa</h1>
        <p className="text-gray-600 mt-2">Selamat datang, {user?.username}</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Warga</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCitizens}</div>
            <p className="text-xs text-muted-foreground">Warga terdaftar</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Surat</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalLetters}</div>
            <p className="text-xs text-muted-foreground">Permohonan surat</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Menunggu Persetujuan</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingLetters}</div>
            <p className="text-xs text-muted-foreground">Perlu ditindaklanjuti</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Surat Disetujui</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.approvedLetters}</div>
            <p className="text-xs text-muted-foreground">Bulan ini</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Letters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Permohonan Surat Terbaru
          </CardTitle>
          <CardDescription>Daftar permohonan surat yang baru masuk</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentLetters.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">Belum ada permohonan surat</p>
            ) : (
              recentLetters.map((letter) => (
                <div
                  key={letter.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                >
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{letter.jenis_surat}</h4>
                    <p className="text-sm text-gray-600">
                      {letter.citizens?.nama} - {letter.citizens?.nik}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{formatDate(letter.created_at)}</p>
                  </div>
                  <div className="flex items-center gap-3">{getStatusBadge(letter.status)}</div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
