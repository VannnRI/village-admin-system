"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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
import { Edit, Trash2, Plus } from "lucide-react"
import { getVillages, addVillage, updateVillage, deleteVillage, getAccounts, type Village } from "@/lib/data-store"

export default function VillageManagement() {
  const [villages, setVillages] = useState<Village[]>([])
  const [accounts, setAccounts] = useState<any[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [editingVillage, setEditingVillage] = useState<Village | null>(null)
  const [formData, setFormData] = useState({
    nama: "",
    kodePos: "",
    kecamatan: "",
    kabupaten: "",
    provinsi: "",
    status: "aktif" as "aktif" | "nonaktif",
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    setVillages(getVillages())
    setAccounts(getAccounts())
  }, [])

  const refreshVillages = () => {
    setVillages(getVillages())
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setError("")
  }

  const resetForm = () => {
    setFormData({
      nama: "",
      kodePos: "",
      kecamatan: "",
      kabupaten: "",
      provinsi: "",
      status: "aktif",
    })
    setIsEditMode(false)
    setEditingVillage(null)
    setError("")
    setSuccess("")
  }

  const handleEdit = (village: Village) => {
    setEditingVillage(village)
    setIsEditMode(true)
    setFormData({
      nama: village.nama,
      kodePos: village.kodePos,
      kecamatan: village.kecamatan,
      kabupaten: village.kabupaten,
      provinsi: village.provinsi,
      status: village.status,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (village: Village) => {
    if (deleteVillage(village.id)) {
      refreshVillages()
      setSuccess(`Desa ${village.nama} berhasil dihapus`)
      setTimeout(() => setSuccess(""), 3000)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    // Validasi
    if (!formData.nama || !formData.kodePos || !formData.kecamatan || !formData.kabupaten || !formData.provinsi) {
      setError("Semua field harus diisi")
      return
    }

    // Cek nama desa sudah ada (kecuali saat edit)
    if (!isEditMode && villages.some((village) => village.nama.toLowerCase() === formData.nama.toLowerCase())) {
      setError("Nama desa sudah terdaftar")
      return
    }

    if (isEditMode && editingVillage) {
      // Update desa
      const updatedVillage = updateVillage(editingVillage.id, {
        nama: formData.nama,
        kodePos: formData.kodePos,
        kecamatan: formData.kecamatan,
        kabupaten: formData.kabupaten,
        provinsi: formData.provinsi,
        status: formData.status,
      })

      if (updatedVillage) {
        refreshVillages()
        setSuccess("Desa berhasil diperbarui")
      }
    } else {
      // Tambah desa baru
      const newVillage = addVillage({
        nama: formData.nama,
        kodePos: formData.kodePos,
        kecamatan: formData.kecamatan,
        kabupaten: formData.kabupaten,
        provinsi: formData.provinsi,
        status: formData.status,
        perangkatIds: [],
        createdAt: new Date().toISOString().split("T")[0],
      })

      if (newVillage) {
        refreshVillages()
        setSuccess("Desa berhasil ditambahkan")
      }
    }

    resetForm()
    setTimeout(() => {
      setIsDialogOpen(false)
      setSuccess("")
    }, 2000)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "aktif":
        return <Badge className="bg-green-100 text-green-800">Aktif</Badge>
      case "nonaktif":
        return <Badge className="bg-red-100 text-red-800">Nonaktif</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const getAdminName = (village: Village) => {
    if (!village.adminId) return "-"
    const admin = accounts.find((acc) => acc.id === village.adminId)
    return admin ? admin.username : "-"
  }

  const getPerangkatCount = (village: Village) => {
    return village.perangkatIds?.length || 0
  }

  return (
    <div className="space-y-6">
      {success && (
        <Alert className="border-green-200 bg-green-50">
          <AlertDescription className="text-green-800">{success}</AlertDescription>
        </Alert>
      )}

      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Daftar Desa</h2>
          <p className="text-gray-600">Kelola desa yang terdaftar dalam sistem</p>
        </div>

        <Dialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            setIsDialogOpen(open)
            if (!open) resetForm()
          }}
        >
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Tambah Desa
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{isEditMode ? "Edit Desa" : "Tambah Desa Baru"}</DialogTitle>
              <DialogDescription>
                {isEditMode ? "Perbarui informasi desa" : "Daftarkan desa baru ke dalam sistem"}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="border-green-200 bg-green-50">
                  <AlertDescription className="text-green-800">{success}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="nama">Nama Desa</Label>
                <Input
                  id="nama"
                  value={formData.nama}
                  onChange={(e) => handleInputChange("nama", e.target.value)}
                  placeholder="Masukkan nama desa"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="kodePos">Kode Pos</Label>
                <Input
                  id="kodePos"
                  value={formData.kodePos}
                  onChange={(e) => handleInputChange("kodePos", e.target.value)}
                  placeholder="Masukkan kode pos"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="kecamatan">Kecamatan</Label>
                <Input
                  id="kecamatan"
                  value={formData.kecamatan}
                  onChange={(e) => handleInputChange("kecamatan", e.target.value)}
                  placeholder="Masukkan kecamatan"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="kabupaten">Kabupaten</Label>
                <Input
                  id="kabupaten"
                  value={formData.kabupaten}
                  onChange={(e) => handleInputChange("kabupaten", e.target.value)}
                  placeholder="Masukkan kabupaten"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="provinsi">Provinsi</Label>
                <Input
                  id="provinsi"
                  value={formData.provinsi}
                  onChange={(e) => handleInputChange("provinsi", e.target.value)}
                  placeholder="Masukkan provinsi"
                />
              </div>

              {isEditMode && (
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="aktif">Aktif</SelectItem>
                      <SelectItem value="nonaktif">Nonaktif</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Batal
                </Button>
                <Button type="submit">{isEditMode ? "Perbarui" : "Tambah"} Desa</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Desa Terdaftar</CardTitle>
          <CardDescription>Total {villages.length} desa terdaftar</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Desa</TableHead>
                <TableHead>Kecamatan</TableHead>
                <TableHead>Kabupaten</TableHead>
                <TableHead>Provinsi</TableHead>
                <TableHead>Admin</TableHead>
                <TableHead>Perangkat</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {villages.map((village) => (
                <TableRow key={village.id}>
                  <TableCell className="font-medium">{village.nama}</TableCell>
                  <TableCell>{village.kecamatan}</TableCell>
                  <TableCell>{village.kabupaten}</TableCell>
                  <TableCell>{village.provinsi}</TableCell>
                  <TableCell>{getAdminName(village)}</TableCell>
                  <TableCell>{getPerangkatCount(village)} orang</TableCell>
                  <TableCell>{getStatusBadge(village.status)}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(village)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Hapus Desa</AlertDialogTitle>
                            <AlertDialogDescription>
                              Apakah Anda yakin ingin menghapus desa <strong>{village.nama}</strong>? Tindakan ini tidak
                              dapat dibatalkan dan akan menghapus semua data terkait.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Batal</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(village)}
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
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
