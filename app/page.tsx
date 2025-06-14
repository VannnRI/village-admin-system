// Main login page - app/page.tsx
"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { login, type AuthUser, type LoginCredentials } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { LogIn, User, Lock, Users } from "lucide-react"
import Link from "next/link"
import SetupInstructions from "@/components/setup-instructions" // Assuming this component exists

export default function LoginPage() {
  const router = useRouter()
  const [credentials, setCredentials] = useState<LoginCredentials>({ username: "", password: "" })
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showSetup, setShowSetup] = useState(false)

  // Redirect if already logged in
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      const user: AuthUser = JSON.parse(storedUser)
      redirectToDashboard(user.role)
    }
  }, [router])

  const redirectToDashboard = (role: string) => {
    switch (role) {
      case "super_admin":
        router.push("/super-admin/dashboard")
        break
      case "admin_desa":
        router.push("/admin-desa/dashboard")
        break
      case "perangkat_desa": // New role
        router.push("/perangkat-desa/dashboard")
        break
      case "masyarakat": // Should not happen here, masyarakat has own login
        router.push("/masyarakat/dashboard")
        break
      default:
        router.push("/") // Fallback
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value })
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
        setError("Username atau password salah, atau akun tidak aktif.")
      }
    } catch (err: any) {
      console.error("Login error:", err)
      if (err.message.includes("Database not set up")) {
        setError("Sistem belum siap. Klik 'Panduan Setup Database' untuk instruksi.")
        setShowSetup(true)
      } else {
        setError(err.message || "Terjadi kesalahan saat login.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  if (showSetup) {
    return <SetupInstructions onBackToLogin={() => setShowSetup(false)} />
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 to-slate-700 p-4">
      <Card className="w-full max-w-md shadow-2xl bg-white dark:bg-slate-800">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            {/* You can add a logo here */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-landmark mx-auto text-blue-600 dark:text-blue-500"
            >
              <line x1="3" x2="21" y1="22" y2="22" />
              <line x1="6" x2="6" y1="18" y2="11" />
              <line x1="10" x2="10" y1="18" y2="11" />
              <line x1="14" x2="14" y1="18" y2="11" />
              <line x1="18" x2="18" y1="18" y2="11" />
              <polygon points="12 2 20 7 4 7" />
            </svg>
          </div>
          <CardTitle className="text-3xl font-bold text-gray-900 dark:text-white">Sistem Informasi Desa</CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Login untuk melanjutkan ke dashboard Anda.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-gray-700 dark:text-gray-300">
                Username
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="username"
                  name="username"
                  type="text"
                  value={credentials.username}
                  onChange={handleChange}
                  placeholder="Masukkan username Anda"
                  required
                  className="pl-10 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 dark:bg-slate-700 dark:text-white"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700 dark:text-gray-300">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={credentials.password}
                  onChange={handleChange}
                  placeholder="Masukkan password Anda"
                  required
                  className="pl-10 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 dark:bg-slate-700 dark:text-white"
                />
              </div>
            </div>
            {error && (
              <Alert variant="destructive" className="bg-red-50 dark:bg-red-900 border-red-300 dark:border-red-700">
                <AlertTitle className="text-red-700 dark:text-red-300">Login Gagal</AlertTitle>
                <AlertDescription className="text-red-600 dark:text-red-400">{error}</AlertDescription>
              </Alert>
            )}
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600"
              disabled={isLoading}
            >
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
        <CardFooter className="flex flex-col items-center space-y-3 pt-6">
          <Link href="/masyarakat/login" passHref>
            <Button
              variant="outline"
              className="w-full border-green-500 text-green-600 hover:bg-green-50 dark:border-green-400 dark:text-green-400 dark:hover:bg-slate-700"
            >
              <Users className="mr-2 h-4 w-4" /> Login sebagai Masyarakat
            </Button>
          </Link>
          <Button
            variant="link"
            onClick={() => setShowSetup(true)}
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
          >
            Panduan Setup Database?
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
