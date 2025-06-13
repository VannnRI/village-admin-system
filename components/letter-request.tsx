"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, FileText, User, Calendar, Send, AlertCircle } from "lucide-react"

export default function LetterRequest() {
  const [formData, setFormData] = useState({
    letterType: "",
    fullName: "",
    nik: "",
    phoneNumber: "",
    address: "",
    purpose: "",
    additionalInfo: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  const letterTypes = [
    { value: "domisili", label: "Surat Keterangan Domisili" },
    { value: "sktm", label: "Surat Keterangan Tidak Mampu" },
    { value: "usaha", label: "Surat Keterangan Usaha" },
    { value: "nikah", label: "Surat Pengantar Nikah" },
    { value: "kelahiran", label: "Surat Keterangan Kelahiran" },
    { value: "kematian", label: "Surat Keterangan Kematian" },
  ]

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    if (!formData.letterType) newErrors.letterType = "Jenis surat harus dipilih"
    if (!formData.fullName) newErrors.fullName = "Nama lengkap harus diisi"
    if (!formData.nik) newErrors.nik = "NIK harus diisi"
    else if (formData.nik.length !== 16) newErrors.nik = "NIK harus 16 digit"
    if (!formData.phoneNumber) newErrors.phoneNumber = "Nomor telepon harus diisi"
    if (!formData.address) newErrors.address = "Alamat harus diisi"
    if (!formData.purpose) newErrors.purpose = "Tujuan permohonan harus diisi"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)
    }, 2000)
  }

  const resetForm = () => {
    setFormData({
      letterType: "",
      fullName: "",
      nik: "",
      phoneNumber: "",
      address: "",
      purpose: "",
      additionalInfo: "",
    })
    setIsSubmitted(false)
    setErrors({})
  }

  if (isSubmitted) {
    return (
      <div className="space-y-6">
        <div className="bg-white px-4 py-6 border-b">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Permohonan Berhasil</h1>
          <p className="text-gray-600">Permohonan surat Anda telah diterima</p>
        </div>

        <div className="px-4">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>

              <h2 className="text-xl font-bold text-gray-900 mb-2">Permohonan Berhasil Dikirim!</h2>
              <p className="text-gray-600 mb-6">
                Permohonan surat Anda telah diterima dan akan diproses dalam 1-3 hari kerja.
              </p>

              <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                <h3 className="font-semibold text-gray-900 mb-3">Detail Permohonan:</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Jenis Surat:</span>
                    <span className="font-medium">
                      {letterTypes.find((type) => type.value === formData.letterType)?.label}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Nama:</span>
                    <span className="font-medium">{formData.fullName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">NIK:</span>
                    <span className="font-medium">{formData.nik}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tanggal Pengajuan:</span>
                    <span className="font-medium">{new Date().toLocaleDateString("id-ID")}</span>
                  </div>
                </div>
              </div>

              <Alert className="mb-6 text-left">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Catatan Penting:</strong>
                  <ul className="mt-2 space-y-1 text-sm">
                    <li>• Siapkan dokumen persyaratan yang diperlukan</li>
                    <li>• Datang ke kantor desa untuk verifikasi dan pengambilan surat</li>
                    <li>• Bawa KTP asli dan dokumen pendukung lainnya</li>
                  </ul>
                </AlertDescription>
              </Alert>

              <div className="space-y-3">
                <Button onClick={resetForm} className="w-full">
                  <FileText className="h-4 w-4 mr-2" />
                  Ajukan Surat Lain
                </Button>
                <Button variant="outline" className="w-full" onClick={() => window.history.back()}>
                  Kembali ke Beranda
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white px-4 py-6 border-b">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Ajukan Surat</h1>
        <p className="text-gray-600">Isi formulir di bawah untuk mengajukan surat keterangan</p>
      </div>

      {/* Form */}
      <div className="px-4">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Letter Type Selection */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-blue-600" />
                <span>Jenis Surat</span>
              </CardTitle>
              <CardDescription>Pilih jenis surat yang ingin Anda ajukan</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="letterType">Jenis Surat *</Label>
                <Select value={formData.letterType} onValueChange={(value) => handleInputChange("letterType", value)}>
                  <SelectTrigger className={errors.letterType ? "border-red-500" : ""}>
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
                {errors.letterType && <p className="text-sm text-red-600">{errors.letterType}</p>}
              </div>
            </CardContent>
          </Card>

          {/* Personal Information */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5 text-green-600" />
                <span>Data Pribadi</span>
              </CardTitle>
              <CardDescription>Masukkan data pribadi Anda dengan benar</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Nama Lengkap *</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange("fullName", e.target.value)}
                  placeholder="Masukkan nama lengkap sesuai KTP"
                  className={errors.fullName ? "border-red-500" : ""}
                />
                {errors.fullName && <p className="text-sm text-red-600">{errors.fullName}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="nik">NIK (Nomor Induk Kependudukan) *</Label>
                <Input
                  id="nik"
                  value={formData.nik}
                  onChange={(e) => handleInputChange("nik", e.target.value)}
                  placeholder="16 digit NIK"
                  maxLength={16}
                  className={errors.nik ? "border-red-500" : ""}
                />
                {errors.nik && <p className="text-sm text-red-600">{errors.nik}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Nomor Telepon *</Label>
                <Input
                  id="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                  placeholder="08xxxxxxxxxx"
                  className={errors.phoneNumber ? "border-red-500" : ""}
                />
                {errors.phoneNumber && <p className="text-sm text-red-600">{errors.phoneNumber}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Alamat Lengkap *</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  placeholder="Masukkan alamat lengkap sesuai KTP"
                  rows={3}
                  className={errors.address ? "border-red-500" : ""}
                />
                {errors.address && <p className="text-sm text-red-600">{errors.address}</p>}
              </div>
            </CardContent>
          </Card>

          {/* Request Details */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-purple-600" />
                <span>Detail Permohonan</span>
              </CardTitle>
              <CardDescription>Jelaskan tujuan dan keperluan surat</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="purpose">Tujuan/Keperluan Surat *</Label>
                <Textarea
                  id="purpose"
                  value={formData.purpose}
                  onChange={(e) => handleInputChange("purpose", e.target.value)}
                  placeholder="Jelaskan untuk keperluan apa surat ini digunakan"
                  rows={3}
                  className={errors.purpose ? "border-red-500" : ""}
                />
                {errors.purpose && <p className="text-sm text-red-600">{errors.purpose}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="additionalInfo">Informasi Tambahan</Label>
                <Textarea
                  id="additionalInfo"
                  value={formData.additionalInfo}
                  onChange={(e) => handleInputChange("additionalInfo", e.target.value)}
                  placeholder="Informasi tambahan yang perlu disampaikan (opsional)"
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          {/* Important Notice */}
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Perhatian:</strong> Pastikan semua data yang diisi sudah benar. Anda akan diminta untuk membawa
              dokumen asli saat pengambilan surat di kantor desa.
            </AlertDescription>
          </Alert>

          {/* Submit Button */}
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
    </div>
  )
}
