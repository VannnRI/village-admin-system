"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { login, type AuthUser, type LoginCredentials } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { LogIn, User, Lock, Users, Building2 } from "lucide-react"
import Link from "next/link"

export default function LoginPage() {
  const router = useRouter()
  const [credentials, setCredentials] = useState<LoginCredentials>({ username: "", password: "" })
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      try {
        const user: AuthUser = JSON.parse(storedUser)
        redirectToDashboard(user.role)
      } catch (e) {
        localStorage.removeItem("user")
      }
    }
  }, [])

  const redirectToDashboard = (role: string) => {
    switch (role) {
      case "super_admin":
        router.push("/super-admin/dashboard")
        break
      case "admin_desa":
        router.push("/admin-desa/dashboard")
        break
      case "perangkat_desa":
        router.push("/perangkat-desa/dashboard")
        break
      case "masyarakat":
        router.push("/masyarakat/dashboard")
        break
      default:
        router.push("/")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const user = await login(credentials)
      if (user) {
        localStorage.setItem("user", JSON.stringify(user))
        redirectToDashboard(user.role)
      } else {
        setError("Username atau password salah")
      }
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan saat login")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <Building2 className="mx-auto h-12 w-12 text-blue-600 mb-4" />
          <h1 className="text-3xl font-bold text-gray-900">Sistem Informasi Desa</h1>
          <p className="text-gray-600 mt-2">Login untuk mengakses dashboard</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Login Admin</CardTitle>
            <CardDescription>Masukkan username dan password Anda</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="username"
                    type="text"
                    value={credentials.username}
                    onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                    placeholder="Masukkan username"
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    value={credentials.password}
                    onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                    placeholder="Masukkan password"
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
          <Link href="/masyarakat/login">
            <Button variant="outline" className="w-full">
              <Users className="mr-2 h-4 w-4" />
              Login sebagai Masyarakat
            </Button>
          </Link>
        </div>

        <div className="text-center text-sm text-gray-600">
          <p>Demo Accounts:</p>
          <p>Super Admin: super_admin / admin</p>
          <p>Admin Desa: admin_sukamaju / admin</p>
          <p>Perangkat Desa: perangkat_sukamaju / admin</p>
        </div>
      </div>
    </div>
  )
}
