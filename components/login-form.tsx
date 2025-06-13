"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, LogIn, AlertTriangle } from "lucide-react"
import { login, loginCitizen } from "@/lib/auth"

export default function LoginForm() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    console.log("🚀 Login attempt started:", { username, password })

    try {
      // Check if it's a NIK (16 digits) for citizen login
      if (/^\d{16}$/.test(username)) {
        console.log("👥 Attempting citizen login")
        const user = await loginCitizen(username, password)
        if (user) {
          console.log("✅ Citizen login successful:", user)
          localStorage.setItem("user", JSON.stringify(user))
          router.push("/masyarakat/dashboard")
        } else {
          console.log("❌ Citizen login failed")
          setError("NIK atau tanggal lahir salah. Format tanggal: YYYY-MM-DD (contoh: 1990-01-15)")
        }
      } else {
        console.log("👤 Attempting regular user login")
        // Regular user login
        const user = await login({ username, password })
        if (user) {
          console.log("✅ User login successful:", user)
          localStorage.setItem("user", JSON.stringify(user))

          // Redirect based on role
          switch (user.role) {
            case "super_admin":
              router.push("/super-admin/dashboard")
              break
            case "admin_desa":
              router.push("/admin-desa/dashboard")
              break
            case "perangkat_desa":
              router.push("/perangkat-desa/dashboard")
              break
            default:
              router.push("/")
          }
        } else {
          console.log("❌ User login failed")
          setError("Username atau password salah. Pastikan menggunakan password: admin")
        }
      }
    } catch (error) {
      console.error("💥 Login error:", error)
      const errorMessage = error instanceof Error ? error.message : "Terjadi kesalahan saat login"

      if (errorMessage.includes("Database not set up")) {
        setError("Database belum disetup. Silakan jalankan script setup terlebih dahulu.")
      } else {
        setError(errorMessage)
      }
    }

    setLoading(false)
  }

  return (
    <Card className="w-full shadow-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center">Masuk</CardTitle>
        <CardDescription className="text-center">Masukkan username dan password Anda</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLogin} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <div>{error}</div>
                {error.includes("Database belum disetup") && (
                  <div className="mt-2 text-sm">
                    Lihat panel "Database Setup & Status" di bawah untuk panduan setup.
                  </div>
                )}
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="username">Username / NIK</Label>
            <Input
              id="username"
              type="text"
              placeholder="Masukkan username atau NIK"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password / Tanggal Lahir</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Masukkan password atau tanggal lahir (YYYY-MM-DD)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              "Memproses..."
            ) : (
              <>
                <LogIn className="mr-2 h-4 w-4" />
                Masuk
              </>
            )}
          </Button>
        </form>

        <div className="mt-6 text-sm text-gray-600 space-y-1">
          <p>
            <strong>Super Admin:</strong> username: admin, password: admin
          </p>
          <p>
            <strong>Admin Desa:</strong> username: admin_sukamaju, password: admin
          </p>
          <p>
            <strong>Perangkat Desa:</strong> username: perangkat_sukamaju, password: admin
          </p>
          <p>
            <strong>Masyarakat:</strong> NIK: 1234567890123456, tanggal lahir: 1990-01-15
          </p>
          <p className="text-xs text-blue-600 mt-2">
            <strong>Debug:</strong> Buka Developer Tools (F12) → Console untuk melihat log detail
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
