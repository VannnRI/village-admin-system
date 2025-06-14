"use client"

import type React from "react"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Home, LogOut, Building } from "lucide-react"
import type { AuthUser } from "@/lib/auth"

export default function PerangkatDesaLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      const parsedUser: AuthUser = JSON.parse(storedUser)
      if (parsedUser.role === "perangkat_desa") {
        setUser(parsedUser)
      } else {
        localStorage.removeItem("user")
        router.push("/") // Redirect to main login if not perangkat_desa
      }
    } else {
      router.push("/")
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("user")
    setUser(null)
    router.push("/")
  }

  if (!isClient || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    )
  }

  const navItems = [
    { href: "/perangkat-desa/dashboard", label: "Dashboard", icon: Home },
    // Add more specific nav items for perangkat_desa later
    // { href: "/perangkat-desa/citizens", label: "Data Warga", icon: Users },
    // { href: "/perangkat-desa/letters", label: "Kelola Surat", icon: FileText },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link
            href="/perangkat-desa/dashboard"
            className="flex items-center gap-2 text-xl font-bold text-gray-800 dark:text-white"
          >
            <Building className="h-7 w-7 text-green-600" />
            Perangkat Desa
          </Link>

          <nav className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors px-3 py-2 rounded-md text-sm font-medium"
              >
                <item.icon className="inline-block h-4 w-4 mr-1" />
                {item.label}
              </Link>
            ))}
            <Button onClick={handleLogout} variant="outline" size="sm">
              <LogOut className="mr-2 h-4 w-4" /> Logout
            </Button>
          </nav>

          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <div className="p-4">
                  <Link href="/perangkat-desa/dashboard" className="flex items-center gap-2 text-lg font-bold mb-6">
                    <Building className="h-6 w-6 text-green-600" />
                    Perangkat Desa
                  </Link>
                  <nav className="flex flex-col space-y-2">
                    {navItems.map((item) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        className="flex items-center space-x-2 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-200 dark:text-gray-200 dark:hover:bg-gray-700"
                      >
                        <item.icon className="h-5 w-5" />
                        <span>{item.label}</span>
                      </Link>
                    ))}
                  </nav>
                  <Button onClick={handleLogout} variant="destructive" className="w-full mt-8">
                    <LogOut className="mr-2 h-4 w-4" /> Logout
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
      <main className="flex-grow container mx-auto p-4 md:p-6">{children}</main>
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-4 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          &copy; {new Date().getFullYear()} Sistem Informasi Desa. All rights reserved.
        </p>
      </footer>
    </div>
  )
}
