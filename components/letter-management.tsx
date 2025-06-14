"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Search, Download, Eye, CheckCircle, XCircle, Clock } from "lucide-react"
import { getLetterRequests, updateLetterStatus, generateLetterNumber } from "@/lib/letter-data"

export default function LetterManagement() {
  const [letters, setLetters] = useState<any[]>([])
  const [filteredLetters, setFilteredLetters] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedLetter, setSelectedLetter] = useState<any>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
      fetchLetters(parsedUser.username)
    }
  }, [])

  useEffect(() => {
    // Filter letters based on search term and status
    let filtered = letters

    if (searchTerm) {
      filtered = filtered.filter((letter) => {
        const letterType = letter.jenis_surat || letter.letter_type || ""
        const purpose = letter.keperluan || letter.purpose || letter.tujuan_permohonan || ""
        const citizenName = letter.citizen?.nama || ""
        const citizenNik = letter.citizen?.nik || ""

        return (
          letterType.toLowerCase().includes(searchTerm.toLowerCase()) ||
          citizenName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          citizenNik.includes(searchTerm) ||
          purpose.toLowerCase().includes(searchTerm.toLowerCase())
        )
      })
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((letter) => letter.status === statusFilter)
    }

    setFilteredLetters(filtered)
  }, [searchTerm, statusFilter, letters])

  const fetchLetters = async (username: string) => {
    setLoading(true)
    try {
      const data = await getLetterRequests(username)
      setLetters(data)
      setFilteredLetters(data)
      setError("")
    } catch (error) {
      console.error("Error in fetchLetters:", error)
      setError("Gagal memuat data surat")
    }
    setLoading(false)
  }

  const handleStatusUpdate = async (letterId: number, newStatus: string, rejectionReason?: string) => {
    setLoading(true)
    try {
      let letterNumber = null
      if (newStatus === "approved") {
        const letter = letters.find((l) => l.id === letterId)
        if (letter) {
          const letterType = letter.jenis_surat || letter.letter_type || "Surat"
          letterNumber = await generateLetterNumber(letterType, user.username)
        }
      }

      const success = await updateLetterStatus(letterId, newStatus as any, user.id, rejectionReason, letterNumber)

      if (success) {
        await fetchLetters(user.username)
        setSuccess(`Status surat berhasil diperbarui`)
        setTimeout(() => setSuccess(""), 3000)
      } else {
        setError("Gagal memperbarui status surat")
        setTimeout(() => setError(""), 3000)
      }
    } catch (error) {
      console.error("Error updating status:", error)
      setError("Gagal memperbarui status surat")
      setTimeout(() => setError(""), 3000)
    }
    setLoading(false)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">
            <Clock className="mr-1 h-3 w-3" />
            Menunggu
          </Badge>
        )
      case "approved":
        return (
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle className="mr-1 h-3 w-3" />
            Disetujui
          </Badge>
        )
      case "rejected":
        return (
          <Badge className="bg-red-100 text-red-800">
            <XCircle className="mr-1 h-3 w-3" />
            Ditolak
          </Badge>
        )
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-"
    try {
      return new Date(dateString).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    } catch {
      return "-"
    }
  }

  const getLetterType = (letter: any) => {
    return letter.jenis_surat || letter.letter_type || "Tidak diketahui"
  }

  const getPurpose = (letter: any) => {
    return letter.keperluan || letter.purpose || letter.tujuan_permohonan || "Tidak ada keterangan"
  }

  const getRequestDate = (letter: any) => {
    return letter.tanggal_pengajuan || letter.request_date || letter.created_at
  }

  const getLetterNumber = (letter: any) => {
    return letter.nomor_surat || letter.no_surat || "-"
  }

  const exportData = () => {
    const headers = ["No Surat", "Jenis Surat", "Pemohon", "NIK", "Tanggal Permohonan", "Status", "Tujuan"]
    const csvContent = [
      headers.join(","),
      ...filteredLetters.map((letter) =>
        [
          getLetterNumber(letter),
          getLetterType(letter),
          letter.citizen?.nama || "-",
          letter.citizen?.nik || "-",
          getRequestDate(letter)?.split("T")[0] || "-",
          letter.status,
          `"${getPurpose(letter)}"`,
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `data-surat-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const handleViewDetail = (letter: any) => {
    setSelectedLetter(letter)
    setIsDetailOpen(true)
  }

  return (
    <div className="space-y-6">
      {success && (
        <Alert className="border-green-200 bg-green-50">
          <AlertDescription className="text-green-800">{success}</AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Cari berdasarkan jenis surat, nama, NIK..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Status</SelectItem>
              <SelectItem value="pending">Menunggu</SelectItem>
              <SelectItem value="approved">Disetujui</SelectItem>
              <SelectItem value="rejected">Ditolak</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button variant="outline" onClick={exportData}>
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {/* Letters Table */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Permohonan Surat</CardTitle>
          <CardDescription>
            Total {filteredLetters.length} permohonan
            {(searchTerm || statusFilter !== "all") && ` (dari ${letters.length} total permohonan)`}
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
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      Memuat data...
                    </TableCell>
                  </TableRow>
                ) : filteredLetters.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      {searchTerm || statusFilter !== "all"
                        ? "Tidak ada data yang sesuai dengan filter"
                        : "Belum ada permohonan surat"}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredLetters.map((letter) => (
                    <TableRow key={letter.id}>
                      <TableCell className="font-mono text-sm">{getLetterNumber(letter)}</TableCell>
                      <TableCell className="font-medium">{getLetterType(letter)}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{letter.citizen?.nama || "Data tidak tersedia"}</p>
                          <p className="text-sm text-gray-500">{letter.citizen?.nik || "-"}</p>
                        </div>
                      </TableCell>
                      <TableCell>{formatDate(getRequestDate(letter))}</TableCell>
                      <TableCell>{getStatusBadge(letter.status)}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" onClick={() => handleViewDetail(letter)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          {letter.status === "pending" && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-green-600 hover:text-green-700"
                                onClick={() => handleStatusUpdate(letter.id, "approved")}
                                disabled={loading}
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-600 hover:text-red-700"
                                onClick={() => handleStatusUpdate(letter.id, "rejected", "Dokumen tidak lengkap")}
                                disabled={loading}
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Detail Permohonan Surat</DialogTitle>
            <DialogDescription>Informasi lengkap permohonan surat</DialogDescription>
          </DialogHeader>

          {selectedLetter && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">No Surat</Label>
                  <p className="font-mono">{getLetterNumber(selectedLetter)}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Status</Label>
                  <div className="mt-1">{getStatusBadge(selectedLetter.status)}</div>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-600">Jenis Surat</Label>
                <p className="font-medium">{getLetterType(selectedLetter)}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">Nama Pemohon</Label>
                  <p>{selectedLetter.citizen?.nama || "Data tidak tersedia"}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">NIK</Label>
                  <p className="font-mono">{selectedLetter.citizen?.nik || "-"}</p>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-600">Tujuan Permohonan</Label>
                <p className="text-sm bg-gray-50 p-3 rounded-md">{getPurpose(selectedLetter)}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">Tanggal Permohonan</Label>
                  <p>{formatDate(getRequestDate(selectedLetter))}</p>
                </div>
                {(selectedLetter.tanggal_disetujui || selectedLetter.approved_date || selectedLetter.approved_at) && (
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Tanggal Disetujui</Label>
                    <p>
                      {formatDate(
                        selectedLetter.tanggal_disetujui || selectedLetter.approved_date || selectedLetter.approved_at,
                      )}
                    </p>
                  </div>
                )}
              </div>

              {(selectedLetter.alasan_penolakan || selectedLetter.rejection_reason) && (
                <div>
                  <Label className="text-sm font-medium text-gray-600">Alasan Penolakan</Label>
                  <p className="text-sm bg-red-50 p-3 rounded-md text-red-800">
                    {selectedLetter.alasan_penolakan || selectedLetter.rejection_reason}
                  </p>
                </div>
              )}

              {selectedLetter.status === "pending" && (
                <div className="flex space-x-2 pt-4 border-t">
                  <Button
                    className="flex-1"
                    onClick={() => {
                      handleStatusUpdate(selectedLetter.id, "approved")
                      setIsDetailOpen(false)
                    }}
                    disabled={loading}
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Setujui
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 text-red-600 hover:text-red-700"
                    onClick={() => {
                      handleStatusUpdate(selectedLetter.id, "rejected", "Dokumen tidak lengkap")
                      setIsDetailOpen(false)
                    }}
                    disabled={loading}
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Tolak
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
