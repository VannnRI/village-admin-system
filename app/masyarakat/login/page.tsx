"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { loginCitizen, type CitizenLoginCredentials } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { LogIn, User, Calendar, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function MasyarakatLoginPage() {
  const router = useRouter()
  const [credentials, setCredentials] = useState<CitizenLoginCredentials>({ nik: "", tanggalLahir: "" })
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    if (credentials.nik.length !== 16) {
      setError("NIK harus 16 digit")
      setIsLoading(false)
      return
    }

    try {
      const user = await loginCitizen(credentials)
      if (user) {
        localStorage.setItem("user", JSON.stringify(user))
        router.push("/masyarakat/dashboard")
      } else {
        setError("NIK atau tanggal lahir tidak valid")
      }
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan saat login")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <User className="mx-auto h-12 w-12 text-green-600 mb-4" />
          <h1 className="text-3xl font-bold text-gray-900">Portal Masyarakat</h1>
          <p className="text-gray-600 mt-2">Login dengan NIK dan tanggal lahir</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Login Masyarakat</CardTitle>
            <CardDescription>Masukkan NIK dan tanggal lahir Anda</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nik">NIK (16 digit)</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="nik"
                    type="text"
                    value={credentials.nik}
                    onChange={(e) => setCredentials({ ...credentials, nik: e.target.value })}
                    placeholder="Masukkan NIK 16 digit"
                    className="pl-10"
                    maxLength={16}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="tanggalLahir">Tanggal Lahir</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="tanggalLahir"
                    type="date"
                    value={credentials.tanggalLahir}
                    onChange={(e) => setCredentials({ ...credentials, tanggalLahir: e.target.value })}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              {error && (
                <Alert variant="destructive">
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
                    <LogIn className="mr-2 h-4 w-4" />
                    Login
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="text-center">
          <Link href="/">
            <Button variant="outline" className="w-full">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali ke Login Admin
            </Button>
          </Link>
        </div>

        <div className="text-center text-sm text-gray-600">
          <p>Demo Account Masyarakat:</p>
          <p>NIK: 1234567890123456</p>
          <p>Tanggal Lahir: 1990-01-15</p>
        </div>
      </div>
    </div>
  )
}
