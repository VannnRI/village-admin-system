"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, FileText, CheckCircle, Clock, XCircle, TrendingUp, Calendar, MapPin } from "lucide-react"
import { getVillageStats, getRecentLetterRequests, getVillageInfo } from "@/lib/admin-desa-data"

export default function AdminDesaDashboard() {
  const [stats, setStats] = useState({
    totalCitizens: 0,
    totalLetters: 0,
    pendingLetters: 0,
    approvedLetters: 0,
    rejectedLetters: 0,
    thisMonthLetters: 0,
  })
  const [recentLetters, setRecentLetters] = useState<any[]>([])
  const [villageInfo, setVillageInfo] = useState<any>(null)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)

      // Load data
      loadDashboardData(parsedUser.username)
    }
  }, [])

  const loadDashboardData = async (username: string) => {
    try {
      const [statsData, lettersData, villageData] = await Promise.all([
        getVillageStats(username),
        getRecentLetterRequests(username, 5),
        getVillageInfo(username),
      ])

      setStats(statsData)
      setRecentLetters(lettersData)
      setVillageInfo(villageData)
    } catch (error) {
      console.error("Error loading dashboard data:", error)
    }
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
      month: "long",
      year: "numeric",
    })
  }

  const statsCards = [
    {
      title: "Total Warga",
      value: stats.totalCitizens.toString(),
      description: "Warga terdaftar",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Total Surat",
      value: stats.totalLetters.toString(),
      description: "Semua permohonan",
      icon: FileText,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Menunggu Persetujuan",
      value: stats.pendingLetters.toString(),
      description: "Perlu ditindaklanjuti",
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
    },
    {
      title: "Bulan Ini",
      value: stats.thisMonthLetters.toString(),
      description: "Surat bulan ini",
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Admin Desa</h1>
          <p className="text-gray-600 mt-2">
            Selamat datang, {user?.username}
            {villageInfo && ` - ${villageInfo.nama}`}
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Button>
            <Calendar className="mr-2 h-4 w-4" />
            {new Date().toLocaleDateString("id-ID", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </Button>
        </div>
      </div>

      {/* Village Info Card */}
      {villageInfo && (
        <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center text-green-800">
              <MapPin className="mr-2 h-5 w-5" />
              Informasi Desa {villageInfo.nama}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Kecamatan:</p>
                <p className="font-medium">{villageInfo.kecamatan}</p>
              </div>
              <div>
                <p className="text-gray-600">Kabupaten:</p>
                <p className="font-medium">{villageInfo.kabupaten}</p>
              </div>
              <div>
                <p className="text-gray-600">Provinsi:</p>
                <p className="font-medium">{villageInfo.provinsi}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
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

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Letters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              Permohonan Surat Terbaru
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentLetters.length === 0 ? (
                <p className="text-gray-500 text-sm">Belum ada permohonan surat</p>
              ) : (
                recentLetters.map((letter) => (
                  <div key={letter.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{letter.jenis_surat}</p>
                      <p className="text-sm text-gray-500">
                        {letter.citizen?.nama} • {formatDate(letter.created_at)}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">{letter.tujuan_permohonan}</p>
                    </div>
                    {getStatusBadge(letter.status)}
                  </div>
                ))
              )}
            </div>
            {recentLetters.length > 0 && (
              <div className="mt-4">
                <Button variant="outline" className="w-full">
                  Lihat Semua Permohonan
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Aksi Cepat</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button className="w-full justify-start" variant="outline">
                <Users className="mr-2 h-4 w-4" />
                Tambah Data Warga Baru
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <FileText className="mr-2 h-4 w-4" />
                Proses Permohonan Surat
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <CheckCircle className="mr-2 h-4 w-4" />
                Kelola Perangkat Desa
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <TrendingUp className="mr-2 h-4 w-4" />
                Lihat Laporan Bulanan
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Status Permohonan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-sm">Disetujui</span>
                </div>
                <span className="font-medium">{stats.approvedLetters}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 text-yellow-500 mr-2" />
                  <span className="text-sm">Menunggu</span>
                </div>
                <span className="font-medium">{stats.pendingLetters}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <XCircle className="h-4 w-4 text-red-500 mr-2" />
                  <span className="text-sm">Ditolak</span>
                </div>
                <span className="font-medium">{stats.rejectedLetters}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Informasi Sistem</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Status Desa:</span>
                <span className="font-medium text-green-600">Aktif</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Website:</span>
                <span className="font-medium text-blue-600">Online</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Last Update:</span>
                <span className="font-medium">Hari ini</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Bantuan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button variant="outline" size="sm" className="w-full justify-start">
                📖 Panduan Penggunaan
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                💬 Hubungi Support
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                📊 Tutorial Video
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
