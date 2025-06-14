"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Home, FileText, Newspaper, Phone, Menu, LogIn } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface PublicLayoutProps {
  children: React.ReactNode
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const router = useRouter()

  const menuItems = [
    {
      href: "/public",
      icon: Home,
      label: "Beranda",
    },
    {
      href: "/public/services",
      icon: FileText,
      label: "Layanan",
    },
    {
      href: "/public/news",
      icon: Newspaper,
      label: "Berita",
    },
    {
      href: "/public/contact",
      icon: Phone,
      label: "Kontak",
    },
  ]

  const Navigation = ({ className = "" }: { className?: string }) => (
    <nav className={`${className}`}>
      <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-8 space-y-4 lg:space-y-0">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  )

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">Portal Desa</h1>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:block">
              <Navigation />
            </div>

            {/* Desktop Login Button */}
            <div className="hidden lg:block">
              <Button onClick={() => router.push("/")} variant="outline">
                <LogIn className="mr-2 h-4 w-4" />
                Login
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Menu className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-64">
                  <div className="py-6">
                    <Navigation className="mb-6" />
                    <Button
                      onClick={() => {
                        router.push("/")
                        setIsMobileMenuOpen(false)
                      }}
                      className="w-full"
                    >
                      <LogIn className="mr-2 h-4 w-4" />
                      Login
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>{children}</main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Portal Desa</h3>
              <p className="text-gray-400">Sistem informasi dan layanan administrasi desa untuk masyarakat.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Layanan</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Permohonan Surat</li>
                <li>Informasi Desa</li>
                <li>Berita & Pengumuman</li>
                <li>Kontak Pemerintah Desa</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Kontak</h3>
              <div className="text-gray-400 space-y-2">
                <p>Email: info@desa.go.id</p>
                <p>Telepon: (021) 123-4567</p>
                <p>Alamat: Jl. Desa No. 123</p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Portal Desa. Semua hak dilindungi.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
