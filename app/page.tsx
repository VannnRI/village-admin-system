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
import { LogIn, User, Lock, Users, Landmark, AlertCircle } from "lucide-react" // Added Landmark, AlertCircle
import Link from "next/link"
// Assuming SetupInstructions is for database setup guidance
// import SetupInstructions from "@/components/setup-instructions";

export default function LoginPage() {
  const router = useRouter()
  const [credentials, setCredentials] = useState<LoginCredentials>({ username: "", password: "" })
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  // const [showSetup, setShowSetup] = useState(false); // If you have a setup guide component

  // Redirect if already logged in
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      try {
        const user: AuthUser = JSON.parse(storedUser)
        if (user && user.role) {
          console.log("User found in localStorage, redirecting:", user)
          redirectToDashboard(user.role)
        } else {
          localStorage.removeItem("user") // Clear invalid stored user
        }
      } catch (e) {
        console.error("Error parsing user from localStorage:", e)
        localStorage.removeItem("user")
      }
    }
  }, [router])

  const redirectToDashboard = (role: User["role"]) => {
    console.log("Redirecting to dashboard for role:", role)
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
      case "masyarakat": // This case should ideally be handled by masyarakat login page
        router.push("/masyarakat/dashboard")
        break
      default:
        console.warn("Unknown role, redirecting to home:", role)
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
    console.log("Submitting login for:", credentials.username)
    try {
      const user = await login(credentials)
      if (user) {
        console.log("Login successful, user data:", user)
        localStorage.setItem("user", JSON.stringify(user))
        redirectToDashboard(user.role)
      } else {
        console.log("Login failed, no user object returned.")
        setError("Username atau password salah, atau akun tidak aktif/tidak ditemukan.")
      }
    } catch (err: any) {
      console.error("Login page handleSubmit error:", err)
      setError(err.message || "Terjadi kesalahan saat login. Periksa konsol untuk detail.")
      // if (err.message.includes("Database not set up")) {
      //   setShowSetup(true);
      // }
    } finally {
      setIsLoading(false)
    }
  }

  // if (showSetup) {
  //   return <SetupInstructions onBackToLogin={() => setShowSetup(false)} />;
  // }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-100 to-sky-100 dark:from-slate-900 dark:to-sky-900 p-4">
      <Card className="w-full max-w-md shadow-xl bg-white dark:bg-slate-800 rounded-lg">
        <CardHeader className="text-center p-6">
          <Landmark className="mx-auto h-16 w-16 text-sky-600 dark:text-sky-500 mb-4" />
          <CardTitle className="text-3xl font-bold text-slate-800 dark:text-white">Sistem Informasi Desa</CardTitle>
          <CardDescription className="text-slate-600 dark:text-slate-400 pt-1">
            Login untuk melanjutkan ke dashboard Anda.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-slate-700 dark:text-slate-300 font-medium">
                Username
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400 dark:text-slate-500" />
                <Input
                  id="username"
                  name="username"
                  type="text"
                  value={credentials.username}
                  onChange={handleChange}
                  placeholder="Masukkan username Anda"
                  required
                  className="pl-10 w-full border-slate-300 dark:border-slate-600 focus:border-sky-500 dark:focus:border-sky-500 dark:bg-slate-700 dark:text-white rounded-md py-2.5"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-700 dark:text-slate-300 font-medium">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400 dark:text-slate-500" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={credentials.password}
                  onChange={handleChange}
                  placeholder="Masukkan password Anda"
                  required
                  className="pl-10 w-full border-slate-300 dark:border-slate-600 focus:border-sky-500 dark:focus:border-sky-500 dark:bg-slate-700 dark:text-white rounded-md py-2.5"
                />
              </div>
            </div>
            {error && (
              <Alert
                variant="destructive"
                className="bg-red-50 dark:bg-red-900/50 border-red-300 dark:border-red-700 p-3 rounded-md"
              >
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-red-500 dark:text-red-400 mr-2 flex-shrink-0 mt-0.5" />
                  <div>
                    <AlertTitle className="font-semibold text-red-700 dark:text-red-300">Login Gagal</AlertTitle>
                    <AlertDescription className="text-sm text-red-600 dark:text-red-400">{error}</AlertDescription>
                  </div>
                </div>
              </Alert>
            )}
            <Button
              type="submit"
              className="w-full bg-sky-600 hover:bg-sky-700 text-white dark:bg-sky-500 dark:hover:bg-sky-600 rounded-md py-2.5 text-base font-semibold"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Memproses...
                </>
              ) : (
                <>
                  <LogIn className="mr-2 h-5 w-5" /> Login
                </>
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center space-y-4 p-6 border-t dark:border-slate-700 mt-2">
          <Link href="/masyarakat/login" passHref legacyBehavior>
            <a className="w-full">
              <Button
                variant="outline"
                className="w-full border-green-500 text-green-600 hover:bg-green-50 dark:border-green-400 dark:text-green-400 dark:hover:bg-slate-700 rounded-md py-2.5"
              >
                <Users className="mr-2 h-5 w-5" /> Login sebagai Masyarakat
              </Button>
            </a>
          </Link>
          {/* <Button
            variant="link"
            onClick={() => setShowSetup(true)} // If you have a setup guide component
            className="text-sm text-slate-600 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400"
          >
            Panduan Setup Database?
          </Button> */}
        </CardFooter>
      </Card>
    </div>
  )
}
