"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Globe,
  Phone,
  Mail,
  MapPin,
  Clock,
  FileText,
  Calendar,
  ExternalLink,
  Smartphone,
  Monitor,
  Tablet,
} from "lucide-react"
import { getWebsiteContent, getVillageNews, getVillageServices } from "@/lib/website-data"

export default function WebsitePreview() {
  const [content, setContent] = useState<any>(null)
  const [news, setNews] = useState<any[]>([])
  const [services, setServices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<"desktop" | "tablet" | "mobile">("desktop")
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
      loadWebsiteData(parsedUser.username)
    }
  }, [])

  const loadWebsiteData = async (username: string) => {
    setLoading(true)
    try {
      const [contentData, newsData, servicesData] = await Promise.all([
        getWebsiteContent(username),
        getVillageNews(username),
        getVillageServices(username),
      ])

      setContent(contentData)
      setNews(newsData.slice(0, 3)) // Show only 3 latest news
      setServices(servicesData.slice(0, 6)) // Show only 6 services
    } catch (error) {
      console.error("Error loading website data:", error)
    }
    setLoading(false)
  }

  const getViewModeClass = () => {
    switch (viewMode) {
      case "mobile":
        return "max-w-sm mx-auto"
      case "tablet":
        return "max-w-2xl mx-auto"
      default:
        return "w-full"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p>Memuat preview website...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* View Mode Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Globe className="mr-2 h-5 w-5" />
              Preview Website Desa
            </div>
            <div className="flex gap-2">
              <Button
                variant={viewMode === "desktop" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("desktop")}
              >
                <Monitor className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Desktop</span>
              </Button>
              <Button
                variant={viewMode === "tablet" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("tablet")}
              >
                <Tablet className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Tablet</span>
              </Button>
              <Button
                variant={viewMode === "mobile" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("mobile")}
              >
                <Smartphone className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Mobile</span>
              </Button>
            </div>
          </CardTitle>
          <CardDescription>Preview tampilan website desa Anda dalam berbagai ukuran layar</CardDescription>
        </CardHeader>
      </Card>

      {/* Website Preview */}
      <div className={`transition-all duration-300 ${getViewModeClass()}`}>
        <div className="border rounded-lg overflow-hidden bg-white shadow-lg">
          {/* Header */}
          <div className="bg-green-600 text-white p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white rounded-full flex items-center justify-center">
                  <Globe className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
                </div>
                <div className="text-center sm:text-left">
                  <h1 className="text-lg sm:text-2xl font-bold">{content?.village_name || "Desa Contoh"}</h1>
                  <p className="text-sm sm:text-base text-green-100">
                    {content?.village_description || "Desa yang maju dan sejahtera"}
                  </p>
                </div>
              </div>
              <div className="flex space-x-2 sm:space-x-4">
                <Button variant="secondary" size="sm">
                  <Phone className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Kontak</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-white border-white hover:bg-white hover:text-green-600"
                >
                  <FileText className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Layanan</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Hero Section */}
          <div className="relative h-48 sm:h-64 bg-gradient-to-r from-green-500 to-blue-500">
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <div className="text-center text-white px-4">
                <h2 className="text-xl sm:text-3xl font-bold mb-2 sm:mb-4">
                  {content?.hero_title || "Selamat Datang di Website Desa"}
                </h2>
                <p className="text-sm sm:text-lg mb-4 sm:mb-6">
                  {content?.hero_subtitle || "Melayani dengan sepenuh hati untuk kemajuan desa"}
                </p>
                <Button className="bg-white text-green-600 hover:bg-gray-100">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Jelajahi Layanan
                </Button>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="p-4 sm:p-6 bg-gray-50">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-green-600">1,234</div>
                <div className="text-xs sm:text-sm text-gray-600">Penduduk</div>
              </div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-blue-600">15</div>
                <div className="text-xs sm:text-sm text-gray-600">Layanan</div>
              </div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-purple-600">8</div>
                <div className="text-xs sm:text-sm text-gray-600">Berita</div>
              </div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-orange-600">24/7</div>
                <div className="text-xs sm:text-sm text-gray-600">Online</div>
              </div>
            </div>
          </div>

          {/* Services Section */}
          <div className="p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl font-bold mb-4 flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              Layanan Desa
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {services.map((service, index) => (
                <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h4 className="font-semibold text-sm sm:text-base mb-2">{service.name}</h4>
                  <p className="text-xs sm:text-sm text-gray-600 mb-3">{service.description}</p>
                  <div className="flex justify-between items-center">
                    <Badge variant="secondary" className="text-xs">
                      {service.duration}
                    </Badge>
                    <Button size="sm" variant="outline">
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* News Section */}
          <div className="p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl font-bold mb-4 flex items-center">
              <Calendar className="mr-2 h-5 w-5" />
              Berita Terbaru
            </h3>
            <div className="space-y-4">
              {news.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row gap-4 p-4 border rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="w-full sm:w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm sm:text-base mb-2">{item.title}</h4>
                    <p className="text-xs sm:text-sm text-gray-600 mb-2 line-clamp-2">{item.content}</p>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div className="flex items-center text-xs text-gray-500">
                        <Clock className="mr-1 h-3 w-3" />
                        {formatDate(item.created_at)}
                      </div>
                      <Button size="sm" variant="ghost" className="self-start sm:self-auto">
                        Baca Selengkapnya
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Contact Section */}
          <div className="p-4 sm:p-6 bg-gray-50">
            <h3 className="text-lg sm:text-xl font-bold mb-4">Kontak Kami</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-green-600" />
                <div>
                  <div className="font-medium text-sm">Alamat</div>
                  <div className="text-xs sm:text-sm text-gray-600">
                    {content?.contact_address || "Jl. Desa No. 123"}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-green-600" />
                <div>
                  <div className="font-medium text-sm">Telepon</div>
                  <div className="text-xs sm:text-sm text-gray-600">{content?.contact_phone || "(021) 1234-5678"}</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-green-600" />
                <div>
                  <div className="font-medium text-sm">Email</div>
                  <div className="text-xs sm:text-sm text-gray-600">{content?.contact_email || "info@desa.go.id"}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-800 text-white p-4 sm:p-6 text-center">
            <p className="text-xs sm:text-sm">© 2024 {content?.village_name || "Desa Contoh"}. Semua hak dilindungi.</p>
            <p className="text-xs text-gray-400 mt-2">Sistem Administrasi Desa Digital</p>
          </div>
        </div>
      </div>

      {/* Preview Info */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <p className="text-sm text-gray-600">
                Preview ini menampilkan tampilan website desa berdasarkan konten yang telah Anda kelola.
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Website sebenarnya akan memiliki fitur interaktif dan navigasi yang lengkap.
              </p>
            </div>
            <Button variant="outline" className="flex-shrink-0">
              <ExternalLink className="mr-2 h-4 w-4" />
              Lihat Website Live
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
