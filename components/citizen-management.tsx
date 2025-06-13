"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  UserPlus,
  Edit,
  Trash2,
  Search,
  Download,
  Upload,
  FileText,
  FileSpreadsheet,
  Printer,
  ChevronDown,
} from "lucide-react"
import { getCitizens, addCitizen, updateCitizen, deleteCitizen, importCitizensFromCSV } from "@/lib/admin-desa-data"
import { exportCitizensToExcel, exportCitizensToPDF, exportCitizensToWord } from "@/lib/export-utils"

export default function CitizenManagement() {
  const [citizens, setCitizens] = useState<any[]>([])
  const [filteredCitizens, setFilteredCitizens] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [editingCitizen, setEditingCitizen] = useState<any>(null)
  const [formData, setFormData] = useState({
    nik: "",
    no_kk: "",
    nama: "",
    tanggal_lahir: "",
    alamat: "",
    no_telepon: "",
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [importFile, setImportFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
      fetchCitizens(parsedUser.username)
    }
  }, [])

  useEffect(() => {
    // Filter citizens based on search term
    if (searchTerm) {
      const filtered = citizens.filter(
        (citizen) =>
          citizen.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
          citizen.nik.includes(searchTerm) ||
          citizen.alamat.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      setFilteredCitizens(filtered)
    } else {
      setFilteredCitizens(citizens)
    }
  }, [searchTerm, citizens])

  const fetchCitizens = async (username: string) => {
    setLoading(true)
    try {
      const data = await getCitizens(username)
      setCitizens(data)
      setFilteredCitizens(data)
    } catch (error) {
      setError("Gagal memuat data warga")
    }
    setLoading(false)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setError("")
  }

  const resetForm = () => {
    setFormData({
      nik: "",
      no_kk: "",
      nama: "",
      tanggal_lahir: "",
      alamat: "",
      no_telepon: "",
    })
    setIsEditMode(false)
    setEditingCitizen(null)
    setError("")
    setSuccess("")
  }

  const handleEdit = (citizen: any) => {
    setEditingCitizen(citizen)
    setIsEditMode(true)
    setFormData({
      nik: citizen.nik,
      no_kk: citizen.no_kk,
      nama: citizen.nama,
      tanggal_lahir: citizen.tanggal_lahir,
      alamat: citizen.alamat,
      no_telepon: citizen.no_telepon || "",
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (citizen: any) => {
    setLoading(true)
    try {
      await deleteCitizen(citizen.id)
      await fetchCitizens(user.username)
      setSuccess(`Data ${citizen.nama} berhasil dihapus`)
      setTimeout(() => setSuccess(""), 3000)
    } catch (error) {
      setError("Gagal menghapus data warga")
    }
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    // Validasi
    if (!formData.nik || !formData.no_kk || !formData.nama || !formData.tanggal_lahir || !formData.alamat) {
      setError("Semua field wajib diisi kecuali nomor telepon")
      setLoading(false)
      return
    }

    if (formData.nik.length !== 16) {
      setError("NIK harus 16 digit")
      setLoading(false)
      return
    }

    if (formData.no_kk.length !== 16) {
      setError("Nomor KK harus 16 digit")
      setLoading(false)
      return
    }

    try {
      if (isEditMode && editingCitizen) {
        await updateCitizen(editingCitizen.id, formData)
        setSuccess("Data warga berhasil diperbarui")
      } else {
        await addCitizen(user.username, formData)
        setSuccess("Data warga berhasil ditambahkan")
      }

      await fetchCitizens(user.username)
      resetForm()
      setTimeout(() => {
        setIsDialogOpen(false)
        setSuccess("")
      }, 2000)
    } catch (error: any) {
      setError(error.message || "Terjadi kesalahan")
    }

    setLoading(false)
  }

  const handleImportCSV = async () => {
    if (!importFile) {
      setError("Pilih file CSV terlebih dahulu")
      return
    }

    setLoading(true)
    try {
      const result = await importCitizensFromCSV(user.username, importFile)
      setSuccess(`Berhasil mengimport ${result.imported} data warga`)
      await fetchCitizens(user.username)
      setImportFile(null)
      setIsImportDialogOpen(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
      setTimeout(() => setSuccess(""), 3000)
    } catch (error: any) {
      setError(error.message || "Gagal mengimport data")
    }
    setLoading(false)
  }

  const handleExport = async (format: "excel" | "pdf" | "word") => {
    setLoading(true)
    try {
      switch (format) {
        case "excel":
          await exportCitizensToExcel(filteredCitizens, user.village_name || "Unknown")
          break
        case "pdf":
          await exportCitizensToPDF(filteredCitizens, user.village_name || "Unknown")
          break
        case "word":
          await exportCitizensToWord(filteredCitizens, user.village_name || "Unknown")
          break
      }
      setSuccess(`Data berhasil diexport ke ${format.toUpperCase()}`)
      setTimeout(() => setSuccess(""), 3000)
    } catch (error) {
      setError(`Gagal export ke ${format.toUpperCase()}`)
    }
    setLoading(false)
  }

  const handlePrint = () => {
    const printContent = `
      <html>
        <head>
          <title>Data Warga Desa</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { text-align: center; margin-bottom: 30px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; font-weight: bold; }
            tr:nth-child(even) { background-color: #f9f9f9; }
            .header { text-align: center; margin-bottom: 20px; }
            .date { text-align: right; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>DATA WARGA DESA</h1>
            <p>Total: ${filteredCitizens.length} warga</p>
          </div>
          <table>
            <thead>
              <tr>
                <th>No</th>
                <th>NIK</th>
                <th>Nama</th>
                <th>Tanggal Lahir</th>
                <th>Alamat</th>
                <th>No Telepon</th>
              </tr>
            </thead>
            <tbody>
              ${filteredCitizens
                .map(
                  (citizen, index) => `
                <tr>
                  <td>${index + 1}</td>
                  <td>${citizen.nik}</td>
                  <td>${citizen.nama}</td>
                  <td>${formatDate(citizen.tanggal_lahir)}</td>
                  <td>${citizen.alamat}</td>
                  <td>${citizen.no_telepon || "-"}</td>
                </tr>
              `,
                )
                .join("")}
            </tbody>
          </table>
          <div class="date">
            <p>Dicetak pada: ${new Date().toLocaleDateString("id-ID")}</p>
          </div>
        </body>
      </html>
    `

    const printWindow = window.open("", "_blank")
    if (printWindow) {
      printWindow.document.write(printContent)
      printWindow.document.close()
      printWindow.print()
    }
  }

  const downloadCSVTemplate = () => {
    const headers = ["nik", "no_kk", "nama", "tanggal_lahir", "alamat", "no_telepon"]
    const sampleData = [
      "1234567890123456",
      "1234567890123456",
      "Contoh Nama",
      "1990-01-01",
      "Jl. Contoh No. 1",
      "081234567890",
    ]
    const csvContent = [headers.join(","), sampleData.join(",")].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "template-data-warga.csv"
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID")
  }

  return (
    <div className="space-y-4 sm:space-y-6">
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

      {/* Header Actions */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 gap-4">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Cari berdasarkan nama, NIK, atau alamat..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {/* Export Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex-1 sm:flex-none">
                <Download className="mr-2 h-4 w-4" />
                Export
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleExport("excel")}>
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                Excel (.xlsx)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport("pdf")}>
                <FileText className="mr-2 h-4 w-4" />
                PDF
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport("word")}>
                <FileText className="mr-2 h-4 w-4" />
                Word (.docx)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Print Button */}
          <Button variant="outline" onClick={handlePrint} className="flex-1 sm:flex-none">
            <Printer className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Print</span>
          </Button>

          {/* Import Button */}
          <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex-1 sm:flex-none">
                <Upload className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Import CSV</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Import Data Warga dari CSV</DialogTitle>
                <DialogDescription>
                  Upload file CSV dengan format yang sesuai untuk mengimport data warga secara massal
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="csv-file">File CSV</Label>
                  <Input
                    id="csv-file"
                    type="file"
                    accept=".csv"
                    ref={fileInputRef}
                    onChange={(e) => setImportFile(e.target.files?.[0] || null)}
                  />
                  <p className="text-sm text-gray-500">
                    Format: NIK, No KK, Nama, Tanggal Lahir (YYYY-MM-DD), Alamat, No Telepon
                  </p>
                </div>
                <Button variant="outline" onClick={downloadCSVTemplate} className="w-full">
                  <Download className="mr-2 h-4 w-4" />
                  Download Template CSV
                </Button>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsImportDialogOpen(false)}>
                    Batal
                  </Button>
                  <Button onClick={handleImportCSV} disabled={!importFile || loading}>
                    {loading ? "Mengimport..." : "Import"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Add Citizen Button */}
          <Dialog
            open={isDialogOpen}
            onOpenChange={(open) => {
              setIsDialogOpen(open)
              if (!open) resetForm()
            }}
          >
            <DialogTrigger asChild>
              <Button className="flex-1 sm:flex-none">
                <UserPlus className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Tambah Warga</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{isEditMode ? "Edit Data Warga" : "Tambah Warga Baru"}</DialogTitle>
                <DialogDescription>
                  {isEditMode ? "Perbarui informasi warga" : "Tambahkan data warga baru ke sistem"}
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nik">NIK *</Label>
                    <Input
                      id="nik"
                      value={formData.nik}
                      onChange={(e) => handleInputChange("nik", e.target.value)}
                      placeholder="16 digit NIK"
                      maxLength={16}
                      disabled={loading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="no_kk">Nomor KK *</Label>
                    <Input
                      id="no_kk"
                      value={formData.no_kk}
                      onChange={(e) => handleInputChange("no_kk", e.target.value)}
                      placeholder="16 digit Nomor KK"
                      maxLength={16}
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nama">Nama Lengkap *</Label>
                  <Input
                    id="nama"
                    value={formData.nama}
                    onChange={(e) => handleInputChange("nama", e.target.value)}
                    placeholder="Masukkan nama lengkap"
                    disabled={loading}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="tanggal_lahir">Tanggal Lahir *</Label>
                    <Input
                      id="tanggal_lahir"
                      type="date"
                      value={formData.tanggal_lahir}
                      onChange={(e) => handleInputChange("tanggal_lahir", e.target.value)}
                      disabled={loading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="no_telepon">Nomor Telepon</Label>
                    <Input
                      id="no_telepon"
                      value={formData.no_telepon}
                      onChange={(e) => handleInputChange("no_telepon", e.target.value)}
                      placeholder="08xxxxxxxxxx"
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="alamat">Alamat Lengkap *</Label>
                  <Input
                    id="alamat"
                    value={formData.alamat}
                    onChange={(e) => handleInputChange("alamat", e.target.value)}
                    placeholder="Jl. Contoh No. 123, RT/RW 01/02"
                    disabled={loading}
                  />
                </div>

                <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                    disabled={loading}
                    className="w-full sm:w-auto"
                  >
                    Batal
                  </Button>
                  <Button type="submit" disabled={loading} className="w-full sm:w-auto">
                    {loading ? "Memproses..." : isEditMode ? "Perbarui" : "Tambah"} Data
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Citizens Table */}
      <Card>
        <CardHeader>
          <CardTitle>Data Warga Desa</CardTitle>
          <CardDescription>
            Total {filteredCitizens.length} warga
            {searchTerm && ` (dari ${citizens.length} total warga)`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px] sm:w-auto">NIK</TableHead>
                  <TableHead>Nama</TableHead>
                  <TableHead className="hidden sm:table-cell">Tanggal Lahir</TableHead>
                  <TableHead className="hidden md:table-cell">Alamat</TableHead>
                  <TableHead className="hidden lg:table-cell">No Telepon</TableHead>
                  <TableHead className="w-[100px]">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      Memuat data...
                    </TableCell>
                  </TableRow>
                ) : filteredCitizens.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      {searchTerm ? "Tidak ada data yang sesuai dengan pencarian" : "Belum ada data warga"}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCitizens.map((citizen) => (
                    <TableRow key={citizen.id}>
                      <TableCell className="font-mono text-xs sm:text-sm">{citizen.nik}</TableCell>
                      <TableCell className="font-medium">
                        <div>
                          <div>{citizen.nama}</div>
                          <div className="sm:hidden text-xs text-gray-500">{formatDate(citizen.tanggal_lahir)}</div>
                          <div className="md:hidden text-xs text-gray-500 truncate max-w-[150px]">{citizen.alamat}</div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">{formatDate(citizen.tanggal_lahir)}</TableCell>
                      <TableCell className="hidden md:table-cell max-w-xs truncate">{citizen.alamat}</TableCell>
                      <TableCell className="hidden lg:table-cell">{citizen.no_telepon || "-"}</TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          <Button variant="outline" size="sm" onClick={() => handleEdit(citizen)} disabled={loading}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-600 hover:text-red-700"
                                disabled={loading}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Hapus Data Warga</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Apakah Anda yakin ingin menghapus data <strong>{citizen.nama}</strong>? Tindakan ini
                                  tidak dapat dibatalkan dan akan menghapus semua data terkait.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Batal</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(citizen)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Hapus
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
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
    </div>
  )
}
