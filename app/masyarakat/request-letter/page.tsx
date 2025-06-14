"use client"

import type React from "react"

import { useState, useEffect } from "react"
import MasyarakatLayout from "@/components/masyarakat-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, FileText, Send, ArrowLeft } from "lucide-react"
import { supabase } from "@/lib/supabase"
import type { AuthUser } from "@/lib/auth"
import Link from "next/link"

export default function RequestLetterPage() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [formData, setFormData] = useState({
    letterType: "",
    purpose: "",
    additionalInfo: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const letterTypes = [
    { value: "Surat Keterangan Tidak Mampu", label: "Surat Keterangan Tidak Mampu (SKTM)" },
    { value: "Surat Keterangan Domisili", label: "Surat Keterangan Domisili" },
    { value: "Surat Keterangan Usaha", label: "Surat Keterangan Usaha" },
    { value: "Surat Pengantar Nikah", label: "Surat Pengantar Nikah" },
    { value: "Surat Keterangan Kelahiran", label: "Surat Keterangan Kelahiran" },
    { value: "Surat Keterangan Kematian", label: "Surat Keterangan Kematian" },
    { value: "Lainnya", label: "Jenis Surat Lainnya" },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!formData.letterType || !formData.purpose) {
      setError("Mohon lengkapi semua field yang wajib diisi")
      return
    }

    if (!user || !user.citizen_details) {
      setError("Data pengguna tidak lengkap")
      return
    }

    setIsSubmitting(true)

    try {
      const { error: insertError } = await supabase.from("letter_requests").insert({
        village_id: user.village_id,
        citizen_id: user.id,
        jenis_surat: formData.letterType,
        tujuan_permohonan: formData.purpose,
        status: "pending",
      })

      if (insertError) {
        throw insertError
      }

      setIsSubmitted(true)
    } catch (err: any) {
      setError(`Gagal mengirim permohonan: ${err.message}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setFormData({
      letterType: "",
      purpose: "",
      additionalInfo: "",
    })
    setIsSubmitted(false)
    setError(null)
  }

  if (isSubmitted) {
    return (
      <MasyarakatLayout>
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardContent className="p-8 text-center">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Permohonan Berhasil Dikirim!</h2>
              <p className="text-gray-600 mb-6">
                Permohonan surat Anda telah diterima dan akan segera diproses oleh petugas desa.
              </p>
              <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                <h3 className="font-semibold mb-3">Detail Permohonan:</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Jenis Surat:</span>
                    <span className="font-medium">{formData.letterType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Nama:</span>
                    <span className="font-medium">{user?.citizen_details?.nama}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">NIK:</span>
                    <span className="font-medium">{user?.username}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tanggal:</span>
                    <span className="font-medium">{new Date().toLocaleDateString("id-ID")}</span>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <Button onClick={resetForm} className="w-full">
                  <FileText className="h-4 w-4 mr-2" />
                  Ajukan Surat Lain
                </Button>
                <Link href="/masyarakat/dashboard">
                  <Button variant="outline" className="w-full">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Kembali ke Dashboard
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </MasyarakatLayout>
    )
  }

  return (
    <MasyarakatLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center space-x-2">
          <Link href="/masyarakat/dashboard">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Formulir Pengajuan Surat</h1>
            <p className="text-gray-600">Lengkapi form di bawah untuk mengajukan surat</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Jenis Surat</CardTitle>
              <CardDescription>Pilih jenis surat yang ingin Anda ajukan</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="letterType">Jenis Surat *</Label>
                <Select
                  value={formData.letterType}
                  onValueChange={(value) => setFormData({ ...formData, letterType: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih jenis surat" />
                  </SelectTrigger>
                  <SelectContent>
                    {letterTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Data Pemohon</CardTitle>
              <CardDescription>Data Anda akan terisi otomatis</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nama Lengkap</Label>
                  <Input value={user?.citizen_details?.nama || ""} disabled />
                </div>
                <div className="space-y-2">
                  <Label>NIK</Label>
                  <Input value={user?.username || ""} disabled />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Alamat</Label>
                <Input value={user?.citizen_details?.alamat || ""} disabled />
              </div>
              <div className="space-y-2">
                <Label>No. Telepon</Label>
                <Input value={user?.citizen_details?.no_telepon || ""} disabled />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Detail Permohonan</CardTitle>
              <CardDescription>Jelaskan tujuan dan keperluan surat</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="purpose">Tujuan/Keperluan Surat *</Label>
                <Textarea
                  id="purpose"
                  value={formData.purpose}
                  onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                  placeholder="Jelaskan untuk keperluan apa surat ini digunakan"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="additionalInfo">Informasi Tambahan</Label>
                <Textarea
                  id="additionalInfo"
                  value={formData.additionalInfo}
                  onChange={(e) => setFormData({ ...formData, additionalInfo: e.target.value })}
                  placeholder="Informasi tambahan yang perlu disampaikan (opsional)"
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Mengirim Permohonan...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Kirim Permohonan
              </>
            )}
          </Button>
        </form>
      </div>
    </MasyarakatLayout>
  )
}
