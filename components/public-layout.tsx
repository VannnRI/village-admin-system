"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  Home,
  FileText,
  Phone,
  Newspaper,
  Menu,
  Building2,
  MapPin,
  Clock,
  Facebook,
  Twitter,
  Instagram,
} from "lucide-react"

interface PublicLayoutProps {
  children: React.ReactNode
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navigation = [
    { name: "Beranda", href: "/public", icon: Home },
    { name: "Layanan", href: "/public/services", icon: FileText },
    { name: "Berita", href: "/public/news", icon: Newspaper },
    { name: "Kontak", href: "/public/contact", icon: Phone },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <Link href="/public" className="flex items-center space-x-2">
              <Building2 className="h-8 w-8 text-green-600" />
              <div className="flex flex-col">
                <span className="text-lg font-bold text-gray-900">Desa Sukamaju</span>
                <span className="text-xs text-gray-500">Bersatu untuk Maju</span>
              </div>
            </Link>

            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col h-full">
                  <div className="flex items-center space-x-2 mb-6">
                    <Building2 className="h-8 w-8 text-green-600" />
                    <div>
                      <h2 className="text-lg font-bold">Desa Sukamaju</h2>
                      <p className="text-sm text-gray-500">Bersatu untuk Maju</p>
                    </div>
                  </div>

                  <nav className="flex-1 space-y-2">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center space-x-3 px-3 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        <item.icon className="h-5 w-5" />
                        <span className="font-medium">{item.name}</span>
                      </Link>
                    ))}

                    <div className="border-t pt-4 mt-4">
                      <Link
                        href="/public/request-letter"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center space-x-3 px-3 py-3 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 transition-colors"
                      >
                        <FileText className="h-5 w-5" />
                        <span className="font-medium">Ajukan Surat</span>
                      </Link>
                    </div>
                  </nav>

                  <div className="border-t pt-4 space-y-3">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span>Jl. Raya Sukamaju No. 123</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Phone className="h-4 w-4" />
                      <span>0812-3456-7890</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span>Senin - Jumat, 08:00 - 16:00</span>
                    </div>

                    <div className="flex space-x-2 pt-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Facebook className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Twitter className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Instagram className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:block border-t">
          <div className="px-4 py-2">
            <nav className="flex space-x-6">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-green-600 transition-colors"
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              ))}
              <Link
                href="/public/request-letter"
                className="flex items-center space-x-2 px-3 py-2 text-sm font-medium bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                <FileText className="h-4 w-4" />
                <span>Ajukan Surat</span>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pb-20">{children}</main>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg md:hidden">
        <div className="grid grid-cols-4 gap-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex flex-col items-center py-2 px-1 text-xs text-gray-600 hover:text-green-600 transition-colors"
            >
              <item.icon className="h-5 w-5 mb-1" />
              <span className="text-xs">{item.name}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Floating Action Button */}
      <Link
        href="/public/request-letter"
        className="fixed bottom-20 right-4 bg-green-600 text-white p-4 rounded-full shadow-lg hover:bg-green-700 transition-colors md:hidden"
      >
        <FileText className="h-6 w-6" />
      </Link>
    </div>
  )
}
