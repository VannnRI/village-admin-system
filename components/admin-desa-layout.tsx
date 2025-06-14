"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation" // Added usePathname
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Home, Users, FileText, Globe, LogOut, Menu, Building2, BarChart3, Archive } from "lucide-react" // Added Shield for consistency
import type { AuthUser } from "@/lib/auth" // Import AuthUser type

interface AdminDesaLayoutProps {
  children: React.ReactNode
}

export default function AdminDesaLayout({ children }: AdminDesaLayoutProps) {
  const [user, setUser] = useState<AuthUser | null>(null) // Use AuthUser type
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [villageName, setVillageName] = useState<string>("Admin Desa")
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      try {
        const parsedUser: AuthUser = JSON.parse(userData)
        if (parsedUser && parsedUser.role === "admin_desa" && parsedUser.village_id) {
          setUser(parsedUser)
          // Fetch village name if you have an endpoint or want to store it in localStorage during login
          // For now, using a generic name or username
          // Example: setVillageName(parsedUser.village_name || `Desa ${parsedUser.username}`);
        } else {
          console.warn("User data found, but not admin_desa or missing village_id. Redirecting.")
          router.push("/")
        }
      } catch (e) {
        console.error("Error parsing user data from localStorage:", e)
        localStorage.removeItem("user")
        router.push("/")
      }
    } else {
      console.log("No user data in localStorage. Redirecting to login.")
      router.push("/")
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("user")
    setUser(null)
    router.push("/")
  }

  const navigation = [
    { name: "Dashboard", href: "/admin-desa/dashboard", icon: Home },
    { name: "Data Warga", href: "/admin-desa/citizens", icon: Users },
    { name: "Surat Menyurat", href: "/admin-desa/letters", icon: FileText },
    { name: "Arsip", href: "/admin-desa/archives", icon: Archive },
    { name: "Website Desa", href: "/admin-desa/website", icon: Globe },
    { name: "Laporan", href: "/admin-desa/reports", icon: BarChart3 },
    // { name: "Pengaturan", href: "/admin-desa/settings", icon: Settings }, // Uncomment if settings page exists
  ]

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-lg font-medium text-gray-700">Memuat data admin desa...</p>
          <p className="text-sm text-gray-500">Mohon tunggu sebentar.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-900">
      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white dark:bg-slate-800 border-r border-gray-200 dark:border-slate-700 px-6 pb-4">
          <div className="flex h-16 shrink-0 items-center mt-4">
            <Building2 className="h-10 w-10 text-green-600 dark:text-green-500" />
            <span className="ml-3 text-2xl font-semibold text-gray-900 dark:text-white">{villageName}</span>
          </div>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigation.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={`
                          group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold
                          ${
                            pathname === item.href
                              ? "bg-green-100 dark:bg-green-700 text-green-600 dark:text-white"
                              : "text-gray-700 dark:text-slate-300 hover:text-green-600 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-slate-700"
                          }
                        `}
                      >
                        <item.icon className="h-6 w-6 shrink-0" aria-hidden="true" />
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
              <li className="mt-auto">
                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 dark:text-slate-300 hover:text-green-600 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-slate-700 w-full justify-start"
                >
                  <LogOut className="h-6 w-6 shrink-0" aria-hidden="true" />
                  Keluar
                </Button>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="lg:hidden">
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <div className="sticky top-0 z-40 flex items-center gap-x-6 bg-white dark:bg-slate-800 px-4 py-4 shadow-sm sm:px-6">
              <Button variant="ghost" size="sm" className="-m-2.5 p-2.5 text-gray-700 dark:text-slate-300">
                <span className="sr-only">Open sidebar</span>
                <Menu className="h-6 w-6" aria-hidden="true" />
              </Button>
              <div className="flex-1 text-lg font-semibold leading-6 text-gray-900 dark:text-white">{villageName}</div>
            </div>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 bg-white dark:bg-slate-800 p-0">
            <div className="flex grow flex-col gap-y-5 overflow-y-auto px-6 pb-4 h-full">
              <div className="flex h-16 shrink-0 items-center mt-4">
                <Building2 className="h-10 w-10 text-green-600 dark:text-green-500" />
                <span className="ml-3 text-2xl font-semibold text-gray-900 dark:text-white">{villageName}</span>
              </div>
              <nav className="flex flex-1 flex-col">
                <ul role="list" className="flex flex-1 flex-col gap-y-7">
                  <li>
                    <ul role="list" className="-mx-2 space-y-1">
                      {navigation.map((item) => (
                        <li key={item.name}>
                          <Link
                            href={item.href}
                            onClick={() => setIsSheetOpen(false)}
                            className={`
                              group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold
                              ${
                                pathname === item.href
                                  ? "bg-green-100 dark:bg-green-700 text-green-600 dark:text-white"
                                  : "text-gray-700 dark:text-slate-300 hover:text-green-600 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-slate-700"
                              }
                            `}
                          >
                            <item.icon className="h-6 w-6 shrink-0" aria-hidden="true" />
                            {item.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </li>
                  <li className="mt-auto">
                    <div className="border-t border-gray-200 dark:border-slate-700 pt-4">
                      <p className="px-2 text-sm font-medium text-gray-700 dark:text-slate-200">{user.username}</p>
                      <p className="px-2 text-xs text-gray-500 dark:text-slate-400">Admin Desa</p>
                    </div>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        handleLogout()
                        setIsSheetOpen(false)
                      }}
                      className="group -mx-2 mt-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 dark:text-slate-300 hover:text-green-600 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-slate-700 w-full justify-start"
                    >
                      <LogOut className="h-6 w-6 shrink-0" aria-hidden="true" />
                      Keluar
                    </Button>
                  </li>
                </ul>
              </nav>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        <div className="sticky top-0 z-40 hidden lg:flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="relative flex flex-1">{/* Optional: Search bar or other header elements */}</div>
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              {/* Optional: Notifications, etc. */}
              <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200 dark:lg:bg-slate-700" aria-hidden="true" />
              <div className="flex items-center">
                <img
                  className="h-8 w-8 rounded-full bg-gray-50 dark:bg-slate-700"
                  src={`https://ui-avatars.com/api/?name=${user.username}&background=random&color=fff`}
                  alt=""
                />
                <div className="ml-3">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{user.username}</p>
                  <p className="text-xs text-gray-500 dark:text-slate-400">Admin Desa</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <main className="py-10">
          <div className="px-4 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </div>
  )
}
