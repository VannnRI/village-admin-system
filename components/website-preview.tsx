"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
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
  Loader2,
  Menu,
  X,
  Home,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {
  getWebsiteContent,
  getVillageNews,
  getVillageServices,
  getWebsiteSettings,
  type WebsiteContent,
  type VillageNews,
  type VillageService,
  type WebsiteSettings,
} from "@/lib/website-data"

export default function WebsitePreview() {
  const [content, setContent] = useState<WebsiteContent[]>([])
  const [news, setNews] = useState<VillageNews[]>([])
  const [services, setServices] = useState<VillageService[]>([])
  const [settings, setSettings] = useState<WebsiteSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<"desktop" | "tablet" | "mobile">("desktop")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const { toast } = useToast()

  // Refs for scrolling
  const heroRef = useRef<HTMLDivElement>(null)
  const aboutRef = useRef<HTMLDivElement>(null)
  const servicesRef = useRef<HTMLDivElement>(null)
  const newsRef = useRef<HTMLDivElement>(null)
  const contactRef = useRef<HTMLDivElement>(null)

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
      const [contentData, newsData, servicesData, settingsData] = await Promise.all([
        getWebsiteContent(username),
        getVillageNews(username),
        getVillageServices(username),
        getWebsiteSettings(username),
      ])

      setContent(contentData)
      setNews(newsData)
      setServices(servicesData.filter((s) => s.is_active))
      setSettings(settingsData)
    } catch (error) {
      console.error("Error loading website data:", error)
      toast({
        title: "Error",
        description: "Gagal memuat data website",
        variant: "destructive",
      })
    }
    setLoading(false)
  }

  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: "smooth" })
    setMobileMenuOpen(false)
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

  const getContentBySection = (sectionName: string) => {
    return content.find((c) => c.section_name === sectionName && c.is_active)
  }

  const heroContent = getContentBySection("hero")
  const aboutContent = getContentBySection("about")
  const visionContent = getContentBySection("vision")
  const contactContent = getContentBySection("contact")

  // Get published news count
  const publishedNews = news.filter((n) => n.status === "published")

  // Mock population data (you can replace with real data from database)
  const villageStats = {
    population: 1234,
    households: 456,
    area: "500 Ha",
    services: services.length,
    news: publishedNews.length,
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p>Memuat preview website...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* View Mode Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center">
              <Globe className="mr-2 h-5 w-5" />
              Preview Website {settings?.village_name || "Desa"}
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
          <div className="text-white p-4 sm:p-6" style={{ backgroundColor: settings?.theme_color || "#4CAF50" }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                  {settings?.logo_url && settings.logo_url !== "/placeholder.svg?height=100&width=100" ? (
                    <img
                      src={settings.logo_url || "/placeholder.svg"}
                      alt="Logo"
                      className="w-6 h-6 sm:w-8 sm:h-8 object-contain"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.style.display = "none"
                        target.nextElementSibling?.classList.remove("hidden")
                      }}
                    />
                  ) : (
                    <Globe className="h-5 w-5 sm:h-6 sm:w-6" style={{ color: settings?.theme_color || "#4CAF50" }} />
                  )}
                </div>
                <div className="min-w-0">
                  <h1 className="text-lg sm:text-xl font-bold truncate">{settings?.village_name || "Desa Contoh"}</h1>
                  <p className="text-xs sm:text-sm opacity-90 hidden sm:block truncate">
                    {settings?.village_tagline || "Desa yang maju dan sejahtera"}
                  </p>
                </div>
              </div>

              {/* Mobile Menu Button */}
              {viewMode === "mobile" && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="text-white hover:bg-white/20"
                >
                  {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>
              )}

              {/* Desktop Navigation */}
              {viewMode !== "mobile" && (
                <div className="flex space-x-2 sm:space-x-4">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => scrollToSection(contactRef)}
                    className="hover:bg-white/90"
                  >
                    <Phone className="mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">Kontak</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => scrollToSection(servicesRef)}
                    className="text-white border-white hover:bg-white hover:text-gray-900"
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">Layanan</span>
                  </Button>
                </div>
              )}
            </div>

            {/* Mobile Menu */}
            {viewMode === "mobile" && mobileMenuOpen && (
              <div className="mt-4 pt-4 border-t border-white/20">
                <div className="space-y-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-white hover:bg-white/20"
                    onClick={() => scrollToSection(heroRef)}
                  >
                    <Home className="mr-2 h-4 w-4" />
                    Beranda
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-white hover:bg-white/20"
                    onClick={() => scrollToSection(servicesRef)}
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Layanan
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-white hover:bg-white/20"
                    onClick={() => scrollToSection(newsRef)}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    Berita
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-white hover:bg-white/20"
                    onClick={() => scrollToSection(contactRef)}
                  >
                    <Phone className="mr-2 h-4 w-4" />
                    Kontak
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Hero Section */}
          <div ref={heroRef} className="relative h-48 sm:h-64 bg-gradient-to-r from-green-500 to-blue-500">
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <div className="text-center text-white px-4 max-w-4xl">
                <h2 className="text-xl sm:text-3xl font-bold mb-2 sm:mb-4">
                  {heroContent?.title || "Selamat Datang di Website Desa"}
                </h2>
                <p className="text-sm sm:text-lg mb-4 sm:mb-6 max-w-2xl mx-auto leading-relaxed">
                  {heroContent?.content ||
                    settings?.village_description ||
                    "Melayani dengan sepenuh hati untuk kemajuan desa"}
                </p>
                <Button
                  className="bg-white text-gray-900 hover:bg-gray-100 font-semibold"
                  onClick={() => scrollToSection(servicesRef)}
                >
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
                <div className="text-xl sm:text-2xl font-bold text-green-600">
                  {villageStats.population.toLocaleString()}
                </div>
                <div className="text-xs sm:text-sm text-gray-600">Penduduk</div>
              </div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-blue-600">{villageStats.services}</div>
                <div className="text-xs sm:text-sm text-gray-600">Layanan</div>
              </div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-purple-600">{villageStats.news}</div>
                <div className="text-xs sm:text-sm text-gray-600">Berita</div>
              </div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-orange-600">24/7</div>
                <div className="text-xs sm:text-sm text-gray-600">Online</div>
              </div>
            </div>
          </div>

          {/* About Section */}
          {aboutContent && (
            <>
              <div ref={aboutRef} className="p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold mb-4 text-center sm:text-left">{aboutContent.title}</h3>
                <div className="prose prose-sm sm:prose max-w-none">
                  <p className="text-gray-600 leading-relaxed text-justify">{aboutContent.content}</p>
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Vision Section */}
          {visionContent && (
            <>
              <div className="p-4 sm:p-6 bg-gray-50">
                <h3 className="text-lg sm:text-xl font-bold mb-4 text-center sm:text-left">{visionContent.title}</h3>
                <div className="prose prose-sm sm:prose max-w-none">
                  <div className="text-gray-600 leading-relaxed whitespace-pre-line text-justify">
                    {visionContent.content}
                  </div>
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Services Section */}
          {services.length > 0 && (
            <>
              <div ref={servicesRef} className="p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold mb-4 flex items-center justify-center sm:justify-start">
                  <FileText className="mr-2 h-5 w-5" />
                  Layanan Desa
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {services.map((service) => (
                    <div key={service.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-white">
                      <h4 className="font-semibold text-sm sm:text-base mb-2 text-center sm:text-left">
                        {service.service_name}
                      </h4>
                      <p className="text-xs sm:text-sm text-gray-600 mb-3 line-clamp-2 text-justify">
                        {service.description}
                      </p>
                      <div className="flex justify-between items-center">
                        <Badge variant="secondary" className="text-xs">
                          {service.duration}
                        </Badge>
                        <Button size="sm" variant="outline" className="hover:bg-gray-100">
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* News Section */}
          {publishedNews.length > 0 && (
            <>
              <div ref={newsRef} className="p-4 sm:p-6 bg-gray-50">
                <h3 className="text-lg sm:text-xl font-bold mb-4 flex items-center justify-center sm:justify-start">
                  <Calendar className="mr-2 h-5 w-5" />
                  Berita Terbaru
                </h3>
                <div className="space-y-4">
                  {publishedNews.slice(0, 3).map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col sm:flex-row gap-4 p-4 border rounded-lg hover:shadow-md transition-shadow bg-white"
                    >
                      <div className="w-full sm:w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                        {item.image_url &&
                        item.image_url !== "/placeholder.svg?height=200&width=300" &&
                        !item.image_url.includes("placeholder") ? (
                          <img
                            src={item.image_url || "/placeholder.svg"}
                            alt={item.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.style.display = "none"
                              target.nextElementSibling?.classList.remove("hidden")
                            }}
                          />
                        ) : (
                          <Calendar className="h-6 w-6 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm sm:text-base mb-2 text-center sm:text-left line-clamp-2">
                          {item.title}
                        </h4>
                        <p className="text-xs sm:text-sm text-gray-600 mb-2 line-clamp-2 text-justify">
                          {item.content}
                        </p>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                          <div className="flex items-center text-xs text-gray-500 justify-center sm:justify-start">
                            <Clock className="mr-1 h-3 w-3" />
                            {formatDate(item.published_date)}
                          </div>
                          <Button size="sm" variant="ghost" className="self-center sm:self-auto hover:bg-gray-100">
                            Baca Selengkapnya
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Contact Section */}
          <div ref={contactRef} className="p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl font-bold mb-4 text-center sm:text-left">Kontak Kami</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {settings?.village_address && (
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div className="min-w-0">
                    <div className="font-medium text-sm">Alamat</div>
                    <div className="text-xs sm:text-sm text-gray-600 break-words">{settings.village_address}</div>
                  </div>
                </div>
              )}
              {settings?.village_phone && (
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <div className="min-w-0">
                    <div className="font-medium text-sm">Telepon</div>
                    <div className="text-xs sm:text-sm text-gray-600">{settings.village_phone}</div>
                  </div>
                </div>
              )}
              {settings?.village_email && (
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <div className="min-w-0">
                    <div className="font-medium text-sm">Email</div>
                    <div className="text-xs sm:text-sm text-gray-600 break-all">{settings.village_email}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Contact Content */}
            {contactContent && (
              <div className="mt-4 pt-4 border-t">
                <div className="prose prose-sm max-w-none">
                  <div className="text-gray-600 text-sm leading-relaxed whitespace-pre-line text-justify">
                    {contactContent.content}
                  </div>
                </div>
              </div>
            )}

            {/* Social Media */}
            {(settings?.social_facebook || settings?.social_twitter || settings?.social_instagram) && (
              <div className="mt-4 pt-4 border-t">
                <h4 className="font-medium text-sm mb-2 text-center sm:text-left">Ikuti Kami</h4>
                <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                  {settings?.social_facebook && (
                    <Button variant="outline" size="sm" asChild className="hover:bg-blue-50">
                      <a href={settings.social_facebook} target="_blank" rel="noopener noreferrer">
                        Facebook
                      </a>
                    </Button>
                  )}
                  {settings?.social_twitter && (
                    <Button variant="outline" size="sm" asChild className="hover:bg-blue-50">
                      <a href={settings.social_twitter} target="_blank" rel="noopener noreferrer">
                        Twitter
                      </a>
                    </Button>
                  )}
                  {settings?.social_instagram && (
                    <Button variant="outline" size="sm" asChild className="hover:bg-pink-50">
                      <a href={settings.social_instagram} target="_blank" rel="noopener noreferrer">
                        Instagram
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-800 text-white p-4 sm:p-6 text-center">
            <p className="text-xs sm:text-sm">
              © 2024 {settings?.village_name || "Desa Contoh"}. Semua hak dilindungi.
            </p>
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
                Semua navigasi dan tombol sudah berfungsi dengan smooth scrolling.
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-shrink-0" onClick={() => window.location.reload()}>
                <Globe className="mr-2 h-4 w-4" />
                Refresh Preview
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
