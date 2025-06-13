"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { BarChart3, Download, Calendar, FileText, TrendingUp, Users } from "lucide-react"
import { getLetterReports, getMonthlyStats } from "@/lib/reports-data"

export default function ReportsManagement() {
  const [reports, setReports] = useState<any[]>([])
  const [monthlyStats, setMonthlyStats] = useState<any[]>([])
  const [selectedMonth, setSelectedMonth] = useState("")
  const [selectedYear, setSelectedYear] = useState("")
  const [selectedType, setSelectedType] = useState("all")
  const [filteredReports, setFilteredReports] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)

      // Set default month and year
      const now = new Date()
      setSelectedMonth(String(now.getMonth() + 1).padStart(2, "0"))
      setSelectedYear(String(now.getFullYear()))

      loadReportsData(parsedUser.username)
    }
  }, [])

  useEffect(() => {
    filterReports()
  }, [reports, selectedMonth, selectedYear, selectedType])

  const loadReportsData = async (username: string) => {
    setLoading(true)
    try {
      const [reportsData, statsData] = await Promise.all([getLetterReports(username), getMonthlyStats(username)])

      setReports(reportsData)
      setMonthlyStats(statsData)
    } catch (error) {
      setError("Gagal memuat data laporan")
    }
    setLoading(false)
  }

  const filterReports = () => {
    let filtered = reports

    if (selectedMonth && selectedYear) {
      const targetDate = `${selectedYear}-${selectedMonth}`
      filtered = filtered.filter((report) => report.created_at.startsWith(targetDate))
    }

    if (selectedType !== "all") {
      filtered = filtered.filter((report) => report.jenis_surat === selectedType)
    }

    setFilteredReports(filtered)
  }

  const exportReport = () => {
    const headers = [
      "No Surat",
      "Jenis Surat",
      "Pemohon",
      "NIK",
      "Tanggal Permohonan",
      "Tanggal Disetujui",
      "Status",
      "Tujuan",
    ]

    const csvContent = [
      headers.join(","),
      ...filteredReports.map((report) =>
        [
          report.no_surat || "-",
          report.jenis_surat,
          report.citizen?.nama,
          report.citizen?.nik,
          report.created_at.split("T")[0],
          report.approved_at?.split("T")[0] || "-",
          report.status,
          `"${report.tujuan_permohonan}"`,
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `laporan-surat-${selectedMonth}-${selectedYear}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
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

  const getUniqueLetterTypes = () => {
    const types = [...new Set(reports.map((report) => report.jenis_surat))]
    return types.sort()
  }

  const calculateStats = () => {
    const total = filteredReports.length
    const approved = filteredReports.filter((r) => r.status === "approved").length
    const pending = filteredReports.filter((r) => r.status === "pending").length
    const rejected = filteredReports.filter((r) => r.status === "rejected").length

    return { total, approved, pending, rejected }
  }

  const stats = calculateStats()

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Permohonan</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Periode yang dipilih</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Disetujui</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
            <p className="text-xs text-muted-foreground">
              {stats.total > 0 ? Math.round((stats.approved / stats.total) * 100) : 0}% dari total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Menunggu</CardTitle>
            <Calendar className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">
              {stats.total > 0 ? Math.round((stats.pending / stats.total) * 100) : 0}% dari total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ditolak</CardTitle>
            <Users className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
            <p className="text-xs text-muted-foreground">
              {stats.total > 0 ? Math.round((stats.rejected / stats.total) * 100) : 0}% dari total
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="mr-2 h-5 w-5" />
            Filter Laporan
          </CardTitle>
          <CardDescription>Pilih periode dan jenis surat untuk melihat laporan</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="month">Bulan</Label>
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Bulan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="01">Januari</SelectItem>
                  <SelectItem value="02">Februari</SelectItem>
                  <SelectItem value="03">Maret</SelectItem>
                  <SelectItem value="04">April</SelectItem>
                  <SelectItem value="05">Mei</SelectItem>
                  <SelectItem value="06">Juni</SelectItem>
                  <SelectItem value="07">Juli</SelectItem>
                  <SelectItem value="08">Agustus</SelectItem>
                  <SelectItem value="09">September</SelectItem>
                  <SelectItem value="10">Oktober</SelectItem>
                  <SelectItem value="11">November</SelectItem>
                  <SelectItem value="12">Desember</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="year">Tahun</Label>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Tahun" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2023">2023</SelectItem>
                  <SelectItem value="2022">2022</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Jenis Surat</Label>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Jenis" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Jenis</SelectItem>
                  {getUniqueLetterTypes().map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>&nbsp;</Label>
              <Button onClick={exportReport} className="w-full">
                <Download className="mr-2 h-4 w-4" />
                Export Laporan
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reports Table */}
      <Card>
        <CardHeader>
          <CardTitle>Detail Laporan Permohonan Surat</CardTitle>
          <CardDescription>
            Menampilkan {filteredReports.length} permohonan untuk periode{" "}
            {selectedMonth && selectedYear && `${selectedMonth}/${selectedYear}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>No Surat</TableHead>
                  <TableHead>Jenis Surat</TableHead>
                  <TableHead>Pemohon</TableHead>
                  <TableHead>Tanggal Permohonan</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Tanggal Disetujui</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      Memuat data...
                    </TableCell>
                  </TableRow>
                ) : filteredReports.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      Tidak ada data untuk periode yang dipilih
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredReports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell className="font-mono text-sm">{report.no_surat || "-"}</TableCell>
                      <TableCell className="font-medium">{report.jenis_surat}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{report.citizen?.nama}</p>
                          <p className="text-sm text-gray-500">{report.citizen?.nik}</p>
                        </div>
                      </TableCell>
                      <TableCell>{formatDate(report.created_at)}</TableCell>
                      <TableCell>{getStatusBadge(report.status)}</TableCell>
                      <TableCell>{report.approved_at ? formatDate(report.approved_at) : "-"}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
