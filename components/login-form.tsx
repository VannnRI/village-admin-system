"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, Users, LogIn } from "lucide-react"
import { login, loginCitizen } from "@/lib/auth"

interface LoginFormProps {
  onLoginSuccess: (user: any) => void
  onDatabaseError: () => void
}

export default function LoginForm({ onLoginSuccess, onDatabaseError }: LoginFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Admin/Staff login form
  const [adminCredentials, setAdminCredentials] = useState({
    username: "",
    password: "",
  })

  // Citizen login form
  const [citizenCredentials, setCitizenCredentials] = useState({
    nik: "",
    tanggalLahir: "",
  })

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const user = await login(adminCredentials)
      if (user) {
        onLoginSuccess(user)
      } else {
        setError("Username atau password salah")
      }
    } catch (error: any) {
      console.error("Login error:", error)
      if (error.message.includes("Database not set up")) {
        onDatabaseError()
      } else {
        setError(error.message || "Terjadi kesalahan saat login")
      }
    }

    setLoading(false)
  }

  const handleCitizenLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const user = await loginCitizen(citizenCredentials.nik, citizenCredentials.tanggalLahir)
      if (user) {
        onLoginSuccess(user)
      } else {
        setError("NIK atau tanggal lahir salah")
      }
    } catch (error: any) {
      console.error("Citizen login error:", error)
      if (error.message.includes("Database not set up")) {
        onDatabaseError()
      } else {
        setError(error.message || "Terjadi kesalahan saat login")
      }
    }

    setLoading(false)
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <LogIn className="h-5 w-5" />
          Login Sistem
        </CardTitle>
        <CardDescription>Pilih jenis akun untuk masuk ke sistem</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="admin" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="admin" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Admin/Staff
            </TabsTrigger>
            <TabsTrigger value="citizen" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Warga
            </TabsTrigger>
          </TabsList>

          <TabsContent value="admin" className="space-y-4">
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={adminCredentials.username}
                  onChange={(e) => setAdminCredentials((prev) => ({ ...prev, username: e.target.value }))}
                  placeholder="Masukkan username"
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={adminCredentials.password}
                  onChange={(e) => setAdminCredentials((prev) => ({ ...prev, password: e.target.value }))}
                  placeholder="Masukkan password"
                  required
                  disabled={loading}
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Memproses..." : "Login"}
              </Button>
            </form>

            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
              <p className="font-medium mb-1">Akun Demo:</p>
              <p>
                • Super Admin: <code>admin</code> / <code>admin</code>
              </p>
              <p>
                • Admin Desa: <code>admin_sukamaju</code> / <code>admin</code>
              </p>
            </div>
          </TabsContent>

          <TabsContent value="citizen" className="space-y-4">
            <form onSubmit={handleCitizenLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nik">NIK</Label>
                <Input
                  id="nik"
                  type="text"
                  value={citizenCredentials.nik}
                  onChange={(e) => setCitizenCredentials((prev) => ({ ...prev, nik: e.target.value }))}
                  placeholder="Masukkan 16 digit NIK"
                  maxLength={16}
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tanggalLahir">Tanggal Lahir</Label>
                <Input
                  id="tanggalLahir"
                  type="date"
                  value={citizenCredentials.tanggalLahir}
                  onChange={(e) => setCitizenCredentials((prev) => ({ ...prev, tanggalLahir: e.target.value }))}
                  required
                  disabled={loading}
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Memproses..." : "Login"}
              </Button>
            </form>

            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
              <p className="font-medium mb-1">Akun Demo Warga:</p>
              <p>
                NIK: <code>1234567890123456</code>
              </p>
              <p>
                Tanggal Lahir: <code>1990-01-15</code>
              </p>
            </div>
          </TabsContent>
        </Tabs>

        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}
