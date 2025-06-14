// This file is now components/masyarakat/letter-request-form.tsx
// Original content from components/letter-request.tsx, with modifications
"use client"

import { AlertTitle } from "@/components/ui/alert"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, FileText, User, Calendar, Send, AlertCircle, Phone, MapPin } from "lucide-react"
import type { AuthUser } from "@/lib/auth"
import { supabase } from "@/lib/supabase" // For submitting actual request

export default function LetterRequestForm() {
  const [authUser, setAuthUser] = useState<AuthUser | null>(null)
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
  const [submitError, setSubmitError] = useState<string | null>(null)

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      const parsedUser: AuthUser = JSON.parse(storedUser)
      setAuthUser(parsedUser)
      if (parsedUser.citizen_details) {
        setFormData((prev) => ({
          ...prev,
          fullName: parsedUser.citizen_details?.nama || "",
          nik: parsedUser.citizen_details?.nik || "",
          phoneNumber: parsedUser.citizen_details?.no_telepon || "",
          address: parsedUser.citizen_details?.alamat || "",
        }))
      }
    }
  }, [])

  const letterTypes = [
    { value: "Surat Keterangan Domisili", label: "Surat Keterangan Domisili" },
    { value: "Surat Keterangan Tidak Mampu", label: "Surat Keterangan Tidak Mampu (SKTM)" },
    { value: "Surat Keterangan Usaha", label: "Surat Keterangan Usaha" },
    { value: "Surat Pengantar Nikah", label: "Surat Pengantar Nikah" },
    { value: "Surat Keterangan Kelahiran", label: "Surat Keterangan Kelahiran" },
    { value: "Surat Keterangan Kematian", label: "Surat Keterangan Kematian" },
    { value: "Lainnya", label: "Jenis Surat Lainnya" },
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
    setSubmitError(null)
    if (!validateForm()) return
    if (!authUser || !authUser.citizen_details || !authUser.village_id) {
      setSubmitError("Informasi pengguna tidak lengkap. Silakan login ulang.")
      return
    }

    setIsSubmitting(true)

    try {
      const { data, error } = await supabase
        .from("letter_requests")
        .insert({
          village_id: authUser.village_id,
          citizen_id: authUser.id, // This is citizen.id
          jenis_surat: formData.letterType,
          tujuan_permohonan: formData.purpose,
          status: "pending", // Default status
          // Optional: Add more fields from formData if your table supports them
          // e.g., no_telepon_pemohon: formData.phoneNumber,
          //       alamat_pemohon: formData.address,
          //       catatan_pemohon: formData.additionalInfo
        })
        .select()
        .single()

      if (error) {
        throw error
      }

      console.log("Letter request submitted:", data)
      setIsSubmitted(true)
    } catch (error: any) {
      console.error("Error submitting letter request:", error)
      setSubmitError(`Gagal mengirim permohonan: ${error.message}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setFormData({
      letterType: "",
      fullName: authUser?.citizen_details?.nama || "",
      nik: authUser?.citizen_details?.nik || "",
      phoneNumber: authUser?.citizen_details?.no_telepon || "",
      address: authUser?.citizen_details?.alamat || "",
      purpose: "",
      additionalInfo: "",
    })
    setIsSubmitted(false)
    setErrors({})
    setSubmitError(null)
  }

  if (isSubmitted) {
    return (
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 px-4 py-6 border-b dark:border-gray-700">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Permohonan Berhasil</h1>
          <p className="text-gray-600 dark:text-gray-300">Permohonan surat Anda telah diterima</p>
        </div>
        <div className="px-4">
          <Card className="border-0 shadow-sm dark:bg-gray-800">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-300" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Permohonan Berhasil Dikirim!</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Permohonan surat Anda telah diterima dan akan segera diproses. Anda akan dihubungi jika ada informasi
                lebih lanjut.
              </p>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6 text-left">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Detail Permohonan:</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Jenis Surat:</span>
                    <span className="font-medium text-gray-800 dark:text-gray-100">{formData.letterType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Nama:</span>
                    <span className="font-medium text-gray-800 dark:text-gray-100">{formData.fullName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">NIK:</span>
                    <span className="font-medium text-gray-800 dark:text-gray-100">{formData.nik}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Tanggal Pengajuan:</span>
                    <span className="font-medium text-gray-800 dark:text-gray-100">
                      {new Date().toLocaleDateString("id-ID")}
                    </span>
                  </div>
                </div>
              </div>
              <Alert className="mb-6 text-left dark:bg-gray-700 dark:border-gray-600">
                <AlertCircle className="h-4 w-4 text-yellow-500" />
                <AlertDescription className="dark:text-gray-300">
                  <strong>Catatan Penting:</strong>
                  <ul className="mt-2 space-y-1 text-sm">
                    <li>• Pantau status permohonan Anda melalui notifikasi (jika tersedia).</li>
                    <li>• Siapkan dokumen persyaratan asli yang mungkin diperlukan saat pengambilan surat.</li>
                  </ul>
                </AlertDescription>
              </Alert>
              <div className="space-y-3">
                <Button onClick={resetForm} className="w-full">
                  <FileText className="h-4 w-4 mr-2" /> Ajukan Surat Lain
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => (window.location.href = "/masyarakat/dashboard")}
                >
                  Kembali ke Dashboard
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
      <div className="bg-white dark:bg-gray-800 px-4 py-6 border-b dark:border-gray-700">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Formulir Pengajuan Surat</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Lengkapi data di bawah ini untuk mengajukan permohonan surat.
        </p>
      </div>
      <div className="px-4">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="border-0 shadow-sm dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-gray-800 dark:text-gray-100">
                <FileText className="h-5 w-5 text-blue-600" />
                <span>Jenis Surat</span>
              </CardTitle>
              <CardDescription className="dark:text-gray-400">
                Pilih jenis surat yang ingin Anda ajukan.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="letterType" className="dark:text-gray-300">
                  Jenis Surat *
                </Label>
                <Select value={formData.letterType} onValueChange={(value) => handleInputChange("letterType", value)}>
                  <SelectTrigger
                    className={`${errors.letterType ? "border-red-500" : ""} dark:bg-gray-700 dark:border-gray-600 dark:text-white`}
                  >
                    <SelectValue placeholder="Pilih jenis surat" />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-gray-700 dark:text-white">
                    {letterTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value} className="dark:hover:bg-gray-600">
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.letterType && <p className="text-sm text-red-600">{errors.letterType}</p>}
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-gray-800 dark:text-gray-100">
                <User className="h-5 w-5 text-green-600" />
                <span>Data Pemohon</span>
              </CardTitle>
              <CardDescription className="dark:text-gray-400">
                Data pribadi Anda akan terisi otomatis jika sudah login.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                {
                  id: "fullName",
                  label: "Nama Lengkap *",
                  icon: User,
                  placeholder: "Nama lengkap sesuai KTP",
                  type: "text",
                },
                {
                  id: "nik",
                  label: "NIK *",
                  icon: User,
                  placeholder: "16 digit NIK",
                  type: "text",
                  maxLength: 16,
                  disabled: true,
                },
                { id: "phoneNumber", label: "Nomor Telepon *", icon: Phone, placeholder: "08xxxxxxxxxx", type: "tel" },
                {
                  id: "address",
                  label: "Alamat Lengkap *",
                  icon: MapPin,
                  placeholder: "Alamat lengkap sesuai KTP",
                  type: "textarea",
                  rows: 3,
                },
              ].map((field) => (
                <div className="space-y-2" key={field.id}>
                  <Label htmlFor={field.id} className="dark:text-gray-300">
                    {field.label}
                  </Label>
                  {field.type === "textarea" ? (
                    <Textarea
                      id={field.id}
                      value={formData[field.id as keyof typeof formData]}
                      onChange={(e) => handleInputChange(field.id, e.target.value)}
                      placeholder={field.placeholder}
                      rows={field.rows}
                      className={`${errors[field.id] ? "border-red-500" : ""} dark:bg-gray-700 dark:border-gray-600 dark:text-white`}
                      disabled={field.disabled}
                    />
                  ) : (
                    <Input
                      id={field.id}
                      type={field.type}
                      value={formData[field.id as keyof typeof formData]}
                      onChange={(e) => handleInputChange(field.id, e.target.value)}
                      placeholder={field.placeholder}
                      maxLength={field.maxLength}
                      className={`${errors[field.id] ? "border-red-500" : ""} dark:bg-gray-700 dark:border-gray-600 dark:text-white`}
                      disabled={field.disabled}
                    />
                  )}
                  {errors[field.id] && <p className="text-sm text-red-600">{errors[field.id]}</p>}
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-gray-800 dark:text-gray-100">
                <Calendar className="h-5 w-5 text-purple-600" />
                <span>Detail Permohonan</span>
              </CardTitle>
              <CardDescription className="dark:text-gray-400">Jelaskan tujuan dan keperluan surat.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="purpose" className="dark:text-gray-300">
                  Tujuan/Keperluan Surat *
                </Label>
                <Textarea
                  id="purpose"
                  value={formData.purpose}
                  onChange={(e) => handleInputChange("purpose", e.target.value)}
                  placeholder="Jelaskan untuk keperluan apa surat ini digunakan"
                  rows={3}
                  className={`${errors.purpose ? "border-red-500" : ""} dark:bg-gray-700 dark:border-gray-600 dark:text-white`}
                />
                {errors.purpose && <p className="text-sm text-red-600">{errors.purpose}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="additionalInfo" className="dark:text-gray-300">
                  Informasi Tambahan
                </Label>
                <Textarea
                  id="additionalInfo"
                  value={formData.additionalInfo}
                  onChange={(e) => handleInputChange("additionalInfo", e.target.value)}
                  placeholder="Informasi tambahan yang perlu disampaikan (opsional)"
                  rows={2}
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
            </CardContent>
          </Card>

          {submitError && (
            <Alert variant="destructive">
              <AlertTitle>Gagal Mengirim</AlertTitle>
              <AlertDescription>{submitError}</AlertDescription>
            </Alert>
          )}

          <Alert className="dark:bg-gray-700 dark:border-gray-600">
            <AlertCircle className="h-4 w-4 text-yellow-500" />
            <AlertDescription className="dark:text-gray-300">
              <strong>Perhatian:</strong> Pastikan semua data yang diisi sudah benar. Anda mungkin akan diminta untuk
              membawa dokumen asli saat pengambilan surat di kantor desa.
            </AlertDescription>
          </Alert>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Mengirim Permohonan...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" /> Kirim Permohonan
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  )
}
