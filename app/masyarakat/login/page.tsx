"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { loginCitizen } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { User, Calendar, LogIn } from "lucide-react"

export default function MasyarakatLoginPage() {
  const router = useRouter()
  const [nik, setNik] = useState("")
  const [tanggalLahir, setTanggalLahir] = useState("") // Expected format: YYYY-MM-DD
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    if (!nik || !tanggalLahir) {
      setError("NIK dan Tanggal Lahir harus diisi.")
      setIsLoading(false)
      return
    }

    // Basic validation for NIK length and date format
    if (nik.length !== 16) {
      setError("NIK harus 16 digit.")
      setIsLoading(false)
      return
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(tanggalLahir)) {
      setError("Format Tanggal Lahir harus YYYY-MM-DD (contoh: 1990-12-31).")
      setIsLoading(false)
      return
    }

    try {
      const user = await loginCitizen(nik, tanggalLahir)
      if (user) {
        localStorage.setItem("user", JSON.stringify(user)) // Store user session
        router.push("/masyarakat/dashboard")
      } else {
        setError("Login gagal. Periksa kembali NIK dan Tanggal Lahir Anda.")
      }
    } catch (err: any) {
      console.error("Login error:", err)
      setError(err.message || "Terjadi kesalahan saat login.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Login Masyarakat</CardTitle>
          <CardDescription className="text-center">
            Masukkan NIK dan Tanggal Lahir Anda untuk mengakses layanan.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="nik">NIK (Nomor Induk Kependudukan)</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="nik"
                  type="text"
                  value={nik}
                  onChange={(e) => setNik(e.target.value)}
                  placeholder="Masukkan 16 digit NIK Anda"
                  required
                  maxLength={16}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="tanggalLahir">Tanggal Lahir</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="tanggalLahir"
                  type="date" // Using type="date" for easier input, ensure value is formatted to YYYY-MM-DD
                  value={tanggalLahir}
                  onChange={(e) => setTanggalLahir(e.target.value)}
                  placeholder="YYYY-MM-DD"
                  required
                  className="pl-10"
                />
              </div>
              <p className="text-xs text-gray-500">Format: YYYY-MM-DD (Contoh: 1995-08-17)</p>
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Memproses...
                </>
              ) : (
                <>
                  <LogIn className="mr-2 h-4 w-4" /> Login
                </>
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center space-y-2">
          <p className="text-sm text-gray-600">Belum terdaftar atau data salah?</p>
          <Button variant="link" onClick={() => router.push("/")} className="text-sm">
            Kembali ke Halaman Utama
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
