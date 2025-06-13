"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { FileText, Download, Plus, Users, BookOpen, Archive, Edit, FileSpreadsheet, Trash2 } from "lucide-react"
import {
  getVillageRegulations,
  getVillageDecisions,
  addVillageRegulation,
  addVillageDecision,
  updateVillageRegulation,
  updateVillageDecision,
  exportRegulationsToExcel,
  exportDecisionsToExcel,
  deleteVillageRegulation,
  deleteVillageDecision,
} from "@/lib/archive-data"
import { getCitizens } from "@/lib/admin-desa-data"
import { getLetterRequests } from "@/lib/letter-data"

export default function ArchiveManagement() {
  const [regulations, setRegulations] = useState<any[]>([])
  const [decisions, setDecisions] = useState<any[]>([])
  const [citizens, setCitizens] = useState<any[]>([])
  const [letters, setLetters] = useState<any[]>([])
  const [isRegulationDialogOpen, setIsRegulationDialogOpen] = useState(false)
  const [isDecisionDialogOpen, setIsDecisionDialogOpen] = useState(false)
  const [editingRegulation, setEditingRegulation] = useState<any>(null)
  const [editingDecision, setEditingDecision] = useState<any>(null)
  const [regulationForm, setRegulationForm] = useState({
    nomor_peraturan: "",
    tanggal_peraturan: "",
    nomor_kesepakatan: "",
    tanggal_kesepakatan: "",
    tentang: "",
  })
  const [decisionForm, setDecisionForm] = useState({
    nomor_keputusan: "",
    tanggal_keputusan: "",
    nomor_diundangkan: "",
    tanggal_diundangkan: "",
    tentang: "",
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    type: "regulation" | "decision" | null
    id: number | null
    title: string
  }>({ type: null, id: null, title: "" })

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
      loadAllData(parsedUser.username)
    }
  }, [])

  const loadAllData = async (username: string) => {
    setLoading(true)
    try {
      const [regulationsData, decisionsData, citizensData, lettersData] = await Promise.all([
        getVillageRegulations(username),
        getVillageDecisions(username),
        getCitizens(username),
        getLetterRequests(username),
      ])

      setRegulations(regulationsData)
      setDecisions(decisionsData)
      setCitizens(citizensData)
      setLetters(lettersData.filter((l: any) => l.status === "approved"))
    } catch (error) {
      setError("Gagal memuat data arsip")
    }
    setLoading(false)
  }

  const resetRegulationForm = () => {
    setRegulationForm({
      nomor_peraturan: "",
      tanggal_peraturan: "",
      nomor_kesepakatan: "",
      tanggal_kesepakatan: "",
      tentang: "",
    })
    setEditingRegulation(null)
  }

  const resetDecisionForm = () => {
    setDecisionForm({
      nomor_keputusan: "",
      tanggal_keputusan: "",
      nomor_diundangkan: "",
      tanggal_diundangkan: "",
      tentang: "",
    })
    setEditingDecision(null)
  }

  const handleEditRegulation = (regulation: any) => {
    setEditingRegulation(regulation)
    setRegulationForm({
      nomor_peraturan: regulation.nomor_peraturan,
      tanggal_peraturan: regulation.tanggal_peraturan,
      nomor_kesepakatan: regulation.nomor_kesepakatan,
      tanggal_kesepakatan: regulation.tanggal_kesepakatan,
      tentang: regulation.tentang,
    })
    setIsRegulationDialogOpen(true)
  }

  const handleEditDecision = (decision: any) => {
    setEditingDecision(decision)
    setDecisionForm({
      nomor_keputusan: decision.nomor_keputusan,
      tanggal_keputusan: decision.tanggal_keputusan,
      nomor_diundangkan: decision.nomor_diundangkan,
      tanggal_diundangkan: decision.tanggal_diundangkan,
      tentang: decision.tentang,
    })
    setIsDecisionDialogOpen(true)
  }

  const handleAddOrUpdateRegulation = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (editingRegulation) {
        await updateVillageRegulation(user.username, editingRegulation.id, regulationForm)
        setSuccess("Peraturan desa berhasil diperbarui")
      } else {
        await addVillageRegulation(user.username, regulationForm)
        setSuccess("Peraturan desa berhasil ditambahkan")
      }

      await loadAllData(user.username)
      resetRegulationForm()
      setIsRegulationDialogOpen(false)
      setTimeout(() => setSuccess(""), 3000)
    } catch (error) {
      setError(editingRegulation ? "Gagal memperbarui peraturan desa" : "Gagal menambahkan peraturan desa")
    }
    setLoading(false)
  }

  const handleAddOrUpdateDecision = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (editingDecision) {
        await updateVillageDecision(user.username, editingDecision.id, decisionForm)
        setSuccess("Keputusan kepala desa berhasil diperbarui")
      } else {
        await addVillageDecision(user.username, decisionForm)
        setSuccess("Keputusan kepala desa berhasil ditambahkan")
      }

      await loadAllData(user.username)
      resetDecisionForm()
      setIsDecisionDialogOpen(false)
      setTimeout(() => setSuccess(""), 3000)
    } catch (error) {
      setError(editingDecision ? "Gagal memperbarui keputusan kepala desa" : "Gagal menambahkan keputusan kepala desa")
    }
    setLoading(false)
  }

  const handleExportRegulations = async () => {
    try {
      setLoading(true)
      await exportRegulationsToExcel(user.username)
      setSuccess("Data peraturan desa berhasil didownload")
      setTimeout(() => setSuccess(""), 3000)
    } catch (error) {
      setError("Gagal mengexport data peraturan desa")
    }
    setLoading(false)
  }

  const handleExportDecisions = async () => {
    try {
      setLoading(true)
      await exportDecisionsToExcel(user.username)
      setSuccess("Data keputusan kepala desa berhasil didownload")
      setTimeout(() => setSuccess(""), 3000)
    } catch (error) {
      setError("Gagal mengexport data keputusan kepala desa")
    }
    setLoading(false)
  }

  const handleDeleteRegulation = async (regulation: any) => {
    setDeleteConfirmation({
      type: "regulation",
      id: regulation.id,
      title: regulation.nomor_peraturan,
    })
  }

  const handleDeleteDecision = async (decision: any) => {
    setDeleteConfirmation({
      type: "decision",
      id: decision.id,
      title: decision.nomor_keputusan,
    })
  }

  const confirmDelete = async () => {
    if (!deleteConfirmation.id || !deleteConfirmation.type) return

    setLoading(true)
    try {
      if (deleteConfirmation.type === "regulation") {
        await deleteVillageRegulation(user.username, deleteConfirmation.id)
        setSuccess("Peraturan desa berhasil dihapus")
      } else {
        await deleteVillageDecision(user.username, deleteConfirmation.id)
        setSuccess("Keputusan kepala desa berhasil dihapus")
      }

      await loadAllData(user.username)
      setDeleteConfirmation({ type: null, id: null, title: "" })
      setTimeout(() => setSuccess(""), 3000)
    } catch (error) {
      setError("Gagal menghapus data")
    }
    setLoading(false)
  }

  const exportCitizensData = () => {
    const headers = ["NIK", "No KK", "Nama", "Tanggal Lahir", "Alamat", "No Telepon"]
    const csvContent = [
      headers.join(","),
      ...citizens.map((citizen) =>
        [
          citizen.nik,
          citizen.no_kk,
          citizen.nama,
          citizen.tanggal_lahir,
          `"${citizen.alamat}"`,
          citizen.no_telepon || "",
        ].join(","),
      ),
    ].join("\n")

    downloadCSV(csvContent, "data-penduduk")
  }

  const exportLettersData = () => {
    const headers = ["No Surat", "Jenis Surat", "Pemohon", "NIK", "Tanggal Permohonan", "Tanggal Disetujui", "Tujuan"]
    const csvContent = [
      headers.join(","),
      ...letters.map((letter) =>
        [
          letter.no_surat || "-",
          letter.jenis_surat,
          letter.citizen?.nama,
          letter.citizen?.nik,
          letter.created_at.split("T")[0],
          letter.approved_at?.split("T")[0] || "-",
          `"${letter.tujuan_permohonan}"`,
        ].join(","),
      ),
    ].join("\n")

    downloadCSV(csvContent, "arsip-surat-menyurat")
  }

  const downloadCSV = (content: string, filename: string) => {
    const blob = new Blob([content], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${filename}-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
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

      <Tabs defaultValue="administration" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="administration">Administrasi Umum</TabsTrigger>
          <TabsTrigger value="population">Administrasi Penduduk</TabsTrigger>
          <TabsTrigger value="letters">Arsip Surat Menyurat</TabsTrigger>
        </TabsList>

        {/* Administrasi Umum */}
        <TabsContent value="administration" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Peraturan Desa */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <BookOpen className="mr-2 h-5 w-5" />
                    Buku Peraturan Desa
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" onClick={handleExportRegulations} disabled={loading}>
                      <FileSpreadsheet className="mr-2 h-4 w-4" />
                      Excel
                    </Button>
                    <Dialog
                      open={isRegulationDialogOpen}
                      onOpenChange={(open) => {
                        setIsRegulationDialogOpen(open)
                        if (!open) resetRegulationForm()
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button size="sm">
                          <Plus className="mr-2 h-4 w-4" />
                          Tambah
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>
                            {editingRegulation ? "Edit Peraturan Desa" : "Tambah Peraturan Desa"}
                          </DialogTitle>
                          <DialogDescription>
                            {editingRegulation
                              ? "Perbarui data peraturan desa"
                              : "Tambahkan peraturan desa baru ke dalam arsip"}
                          </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleAddOrUpdateRegulation} className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="nomor_peraturan">Nomor Peraturan</Label>
                              <Input
                                id="nomor_peraturan"
                                value={regulationForm.nomor_peraturan}
                                onChange={(e) =>
                                  setRegulationForm({ ...regulationForm, nomor_peraturan: e.target.value })
                                }
                                placeholder="PERDES NO. 01/2024"
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="tanggal_peraturan">Tanggal Peraturan</Label>
                              <Input
                                id="tanggal_peraturan"
                                type="date"
                                value={regulationForm.tanggal_peraturan}
                                onChange={(e) =>
                                  setRegulationForm({ ...regulationForm, tanggal_peraturan: e.target.value })
                                }
                                required
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="nomor_kesepakatan">Nomor Kesepakatan</Label>
                              <Input
                                id="nomor_kesepakatan"
                                value={regulationForm.nomor_kesepakatan}
                                onChange={(e) =>
                                  setRegulationForm({ ...regulationForm, nomor_kesepakatan: e.target.value })
                                }
                                placeholder="KESEP NO. 01/2024"
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="tanggal_kesepakatan">Tanggal Kesepakatan</Label>
                              <Input
                                id="tanggal_kesepakatan"
                                type="date"
                                value={regulationForm.tanggal_kesepakatan}
                                onChange={(e) =>
                                  setRegulationForm({ ...regulationForm, tanggal_kesepakatan: e.target.value })
                                }
                                required
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="tentang">Tentang</Label>
                            <Textarea
                              id="tentang"
                              value={regulationForm.tentang}
                              onChange={(e) => setRegulationForm({ ...regulationForm, tentang: e.target.value })}
                              placeholder="Anggaran Pendapatan dan Belanja Desa"
                              rows={3}
                              required
                            />
                          </div>
                          <div className="flex justify-end space-x-2">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => {
                                setIsRegulationDialogOpen(false)
                                resetRegulationForm()
                              }}
                            >
                              Batal
                            </Button>
                            <Button type="submit" disabled={loading}>
                              {editingRegulation ? "Perbarui" : "Simpan"}
                            </Button>
                          </div>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardTitle>
                <CardDescription>Daftar peraturan desa yang telah ditetapkan</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {regulations.map((regulation) => (
                    <div key={regulation.id} className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1 space-y-1">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="font-medium text-gray-600">Nomor Peraturan:</p>
                            <p className="font-semibold">{regulation.nomor_peraturan}</p>
                          </div>
                          <div>
                            <p className="font-medium text-gray-600">Tanggal:</p>
                            <p>{formatDate(regulation.tanggal_peraturan)}</p>
                          </div>
                          <div>
                            <p className="font-medium text-gray-600">Nomor Kesepakatan:</p>
                            <p className="font-semibold">{regulation.nomor_kesepakatan}</p>
                          </div>
                          <div>
                            <p className="font-medium text-gray-600">Tanggal Kesepakatan:</p>
                            <p>{formatDate(regulation.tanggal_kesepakatan)}</p>
                          </div>
                        </div>
                        <div className="pt-2">
                          <p className="font-medium text-gray-600">Tentang:</p>
                          <p className="text-sm text-gray-800">{regulation.tentang}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleEditRegulation(regulation)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteRegulation(regulation)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {regulations.length === 0 && (
                    <p className="text-gray-500 text-sm text-center py-4">Belum ada peraturan desa</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Keputusan Kepala Desa */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FileText className="mr-2 h-5 w-5" />
                    Buku Keputusan Kepala Desa
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" onClick={handleExportDecisions} disabled={loading}>
                      <FileSpreadsheet className="mr-2 h-4 w-4" />
                      Excel
                    </Button>
                    <Dialog
                      open={isDecisionDialogOpen}
                      onOpenChange={(open) => {
                        setIsDecisionDialogOpen(open)
                        if (!open) resetDecisionForm()
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button size="sm">
                          <Plus className="mr-2 h-4 w-4" />
                          Tambah
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>
                            {editingDecision ? "Edit Keputusan Kepala Desa" : "Tambah Keputusan Kepala Desa"}
                          </DialogTitle>
                          <DialogDescription>
                            {editingDecision
                              ? "Perbarui data keputusan kepala desa"
                              : "Tambahkan keputusan kepala desa baru ke dalam arsip"}
                          </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleAddOrUpdateDecision} className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="nomor_keputusan">Nomor Keputusan</Label>
                              <Input
                                id="nomor_keputusan"
                                value={decisionForm.nomor_keputusan}
                                onChange={(e) => setDecisionForm({ ...decisionForm, nomor_keputusan: e.target.value })}
                                placeholder="KEPDES NO. 01/2024"
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="tanggal_keputusan">Tanggal Keputusan</Label>
                              <Input
                                id="tanggal_keputusan"
                                type="date"
                                value={decisionForm.tanggal_keputusan}
                                onChange={(e) =>
                                  setDecisionForm({ ...decisionForm, tanggal_keputusan: e.target.value })
                                }
                                required
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="nomor_diundangkan">Nomor Diundangkan</Label>
                              <Input
                                id="nomor_diundangkan"
                                value={decisionForm.nomor_diundangkan}
                                onChange={(e) =>
                                  setDecisionForm({ ...decisionForm, nomor_diundangkan: e.target.value })
                                }
                                placeholder="LEMBARAN NO. 01/2024"
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="tanggal_diundangkan">Tanggal Diundangkan</Label>
                              <Input
                                id="tanggal_diundangkan"
                                type="date"
                                value={decisionForm.tanggal_diundangkan}
                                onChange={(e) =>
                                  setDecisionForm({ ...decisionForm, tanggal_diundangkan: e.target.value })
                                }
                                required
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="tentang_decision">Tentang</Label>
                            <Textarea
                              id="tentang_decision"
                              value={decisionForm.tentang}
                              onChange={(e) => setDecisionForm({ ...decisionForm, tentang: e.target.value })}
                              placeholder="Penetapan Pengurus Karang Taruna"
                              rows={3}
                              required
                            />
                          </div>
                          <div className="flex justify-end space-x-2">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => {
                                setIsDecisionDialogOpen(false)
                                resetDecisionForm()
                              }}
                            >
                              Batal
                            </Button>
                            <Button type="submit" disabled={loading}>
                              {editingDecision ? "Perbarui" : "Simpan"}
                            </Button>
                          </div>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardTitle>
                <CardDescription>Daftar keputusan kepala desa yang telah ditetapkan</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {decisions.map((decision) => (
                    <div key={decision.id} className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1 space-y-1">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="font-medium text-gray-600">Nomor Keputusan:</p>
                            <p className="font-semibold">{decision.nomor_keputusan}</p>
                          </div>
                          <div>
                            <p className="font-medium text-gray-600">Tanggal:</p>
                            <p>{formatDate(decision.tanggal_keputusan)}</p>
                          </div>
                          <div>
                            <p className="font-medium text-gray-600">Nomor Diundangkan:</p>
                            <p className="font-semibold">{decision.nomor_diundangkan}</p>
                          </div>
                          <div>
                            <p className="font-medium text-gray-600">Tanggal Diundangkan:</p>
                            <p>{formatDate(decision.tanggal_diundangkan)}</p>
                          </div>
                        </div>
                        <div className="pt-2">
                          <p className="font-medium text-gray-600">Tentang:</p>
                          <p className="text-sm text-gray-800">{decision.tentang}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleEditDecision(decision)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteDecision(decision)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {decisions.length === 0 && (
                    <p className="text-gray-500 text-sm text-center py-4">Belum ada keputusan kepala desa</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Administrasi Penduduk */}
        <TabsContent value="population">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Users className="mr-2 h-5 w-5" />
                  Data Penduduk Desa
                </div>
                <Button onClick={exportCitizensData}>
                  <Download className="mr-2 h-4 w-4" />
                  Download Data Penduduk
                </Button>
              </CardTitle>
              <CardDescription>Total {citizens.length} warga terdaftar</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>NIK</TableHead>
                      <TableHead>Nama</TableHead>
                      <TableHead>Tanggal Lahir</TableHead>
                      <TableHead>Alamat</TableHead>
                      <TableHead>No Telepon</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {citizens.map((citizen) => (
                      <TableRow key={citizen.id}>
                        <TableCell className="font-mono text-sm">{citizen.nik}</TableCell>
                        <TableCell className="font-medium">{citizen.nama}</TableCell>
                        <TableCell>{formatDate(citizen.tanggal_lahir)}</TableCell>
                        <TableCell className="max-w-xs truncate">{citizen.alamat}</TableCell>
                        <TableCell>{citizen.no_telepon || "-"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Arsip Surat Menyurat */}
        <TabsContent value="letters">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Archive className="mr-2 h-5 w-5" />
                  Arsip Surat Menyurat
                </div>
                <Button onClick={exportLettersData}>
                  <Download className="mr-2 h-4 w-4" />
                  Download Arsip Surat
                </Button>
              </CardTitle>
              <CardDescription>Total {letters.length} surat yang telah disetujui</CardDescription>
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
                      <TableHead>Tanggal Disetujui</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {letters.map((letter) => (
                      <TableRow key={letter.id}>
                        <TableCell className="font-mono text-sm">{letter.no_surat}</TableCell>
                        <TableCell className="font-medium">{letter.jenis_surat}</TableCell>
                        <TableCell>{letter.citizen?.nama}</TableCell>
                        <TableCell>{formatDate(letter.created_at)}</TableCell>
                        <TableCell>{letter.approved_at ? formatDate(letter.approved_at) : "-"}</TableCell>
                        <TableCell>
                          <Badge className="bg-green-100 text-green-800">Disetujui</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmation.type !== null}
        onOpenChange={() => setDeleteConfirmation({ type: null, id: null, title: "" })}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Hapus</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus{" "}
              {deleteConfirmation.type === "regulation" ? "peraturan desa" : "keputusan kepala desa"} "
              {deleteConfirmation.title}"?
              <br />
              <span className="text-red-600 font-medium">Tindakan ini tidak dapat dibatalkan.</span>
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setDeleteConfirmation({ type: null, id: null, title: "" })}>
              Batal
            </Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={loading}>
              Hapus
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
