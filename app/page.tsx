"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import LoginForm from "@/components/login-form"
import DatabaseSetup from "@/components/database-setup"

export default function HomePage() {
  const [user, setUser] = useState<any>(null)
  const [showSetup, setShowSetup] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check if user is already logged in
    const userData = localStorage.getItem("user")
    if (userData) {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)

      // Redirect based on role
      switch (parsedUser.role) {
        case "super_admin":
          router.push("/super-admin/dashboard")
          break
        case "admin_desa":
          router.push("/admin-desa/dashboard")
          break
        case "perangkat_desa":
          router.push("/admin-desa/dashboard")
          break
        case "masyarakat":
          router.push("/public")
          break
        default:
          router.push("/public")
      }
    }
  }, [router])

  const handleLoginSuccess = (userData: any) => {
    setUser(userData)
    localStorage.setItem("user", JSON.stringify(userData))

    // Redirect based on role
    switch (userData.role) {
      case "super_admin":
        router.push("/super-admin/dashboard")
        break
      case "admin_desa":
        router.push("/admin-desa/dashboard")
        break
      case "perangkat_desa":
        router.push("/admin-desa/dashboard")
        break
      case "masyarakat":
        router.push("/public")
        break
      default:
        router.push("/public")
    }
  }

  const handleDatabaseError = () => {
    setShowSetup(true)
  }

  if (showSetup) {
    return <DatabaseSetup onComplete={() => setShowSetup(false)} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Sistem Administrasi Desa</h1>
            <p className="text-gray-600">Masuk ke sistem untuk mengakses layanan administrasi desa</p>
          </div>

          <LoginForm onLoginSuccess={handleLoginSuccess} onDatabaseError={handleDatabaseError} />

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500 mb-4">Akses publik tersedia untuk masyarakat umum</p>
            <button onClick={() => router.push("/public")} className="text-blue-600 hover:text-blue-800 underline">
              Akses Layanan Publik
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
