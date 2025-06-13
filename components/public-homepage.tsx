"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Users, MapPin, Phone, Mail, Clock, ChevronRight, Calendar, Building2 } from "lucide-react"

export default function PublicHomepage() {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const quickServices = [
    {
      title: "Surat Keterangan",
      description: "Ajukan surat keterangan online",
      icon: FileText,
      href: "/public/request-letter",
      color: "bg-blue-500",
    },
    {
      title: "Info Layanan",
      description: "Lihat semua layanan desa",
      icon: Users,
      href: "/public/services",
      color: "bg-green-500",
    },
    {
      title: "Berita Terbaru",
      description: "Baca berita dan pengumuman",
      icon: Calendar,
      href: "/public/news",
      color: "bg-purple-500",
    },
    {
      title: "Hubungi Kami",
      description: "Kontak dan lokasi kantor desa",
      icon: Phone,
      href: "/public/contact",
      color: "bg-orange-500",
    },
  ]

  const recentNews = [
    {
      id: 1,
      title: "Pembangunan Jembatan Desa Sukamaju Telah Selesai",
      excerpt: "Jembatan penghubung antar desa telah selesai dibangun dan siap digunakan masyarakat.",
      date: "15 Juni 2024",
      image: "/placeholder.svg?height=100&width=150",
    },
    {
      id: 2,
      title: "Pelatihan Keterampilan untuk Pemuda Desa",
      excerpt: "Program pelatihan keterampilan untuk meningkatkan kemampuan pemuda desa.",
      date: "10 Juni 2024",
      image: "/placeholder.svg?height=100&width=150",
    },
    {
      id: 3,
      title: "Program Bantuan Sosial Tahun 2024",
      excerpt: "Penyaluran bantuan sosial untuk masyarakat kurang mampu telah dimulai.",
      date: "5 Juni 2024",
      image: "/placeholder.svg?height=100&width=150",
    },
  ]

  const villageStats = [
    { label: "Jumlah Penduduk", value: "5,234", icon: Users },
    { label: "Jumlah KK", value: "1,456", icon: Building2 },
    { label: "Luas Wilayah", value: "500 Ha", icon: MapPin },
    { label: "Layanan Aktif", value: "12", icon: FileText },
  ]

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-green-600 to-green-800 text-white">
        <div className="px-4 py-8">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center space-x-2 bg-white/20 rounded-full px-4 py-2">
              <Building2 className="h-5 w-5" />
              <span className="text-sm font-medium">Desa Sukamaju</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold">Selamat Datang di Portal Desa</h1>
            <p className="text-green-100 max-w-md mx-auto">
              Akses layanan desa dengan mudah dan cepat melalui platform digital kami
            </p>

            {/* Current Time */}
            <div className="bg-white/10 rounded-lg p-3 max-w-xs mx-auto">
              <div className="flex items-center justify-center space-x-2 text-sm">
                <Clock className="h-4 w-4" />
                <span>{currentTime.toLocaleTimeString("id-ID")}</span>
              </div>
              <div className="text-xs text-green-100 mt-1">
                {currentTime.toLocaleDateString("id-ID", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Services */}
      <div className="px-4">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Layanan Cepat</h2>
        <div className="grid grid-cols-2 gap-3">
          {quickServices.map((service, index) => (
            <Link key={index} href={service.href}>
              <Card className="hover:shadow-md transition-shadow border-0 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex flex-col items-center text-center space-y-3">
                    <div className={`${service.color} p-3 rounded-full text-white`}>
                      <service.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm text-gray-900">{service.title}</h3>
                      <p className="text-xs text-gray-600 mt-1">{service.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Village Statistics */}
      <div className="px-4">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Data Desa</h2>
        <div className="grid grid-cols-2 gap-3">
          {villageStats.map((stat, index) => (
            <Card key={index} className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-gray-100 p-2 rounded-lg">
                    <stat.icon className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-gray-900">{stat.value}</p>
                    <p className="text-xs text-gray-600">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent News */}
      <div className="px-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Berita Terbaru</h2>
          <Link href="/public/news">
            <Button variant="ghost" size="sm" className="text-green-600">
              Lihat Semua
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </div>

        <div className="space-y-3">
          {recentNews.map((news) => (
            <Card key={news.id} className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex space-x-3">
                  <img
                    src={news.image || "/placeholder.svg"}
                    alt={news.title}
                    className="w-20 h-16 object-cover rounded-lg flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm text-gray-900 line-clamp-2 mb-1">{news.title}</h3>
                    <p className="text-xs text-gray-600 line-clamp-2 mb-2">{news.excerpt}</p>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" className="text-xs">
                        {news.date}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Contact Info */}
      <div className="px-4">
        <Card className="border-0 shadow-sm bg-gradient-to-r from-blue-50 to-green-50">
          <CardContent className="p-4">
            <h3 className="font-bold text-gray-900 mb-3">Informasi Kontak</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-3 text-sm">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span className="text-gray-700">Jl. Raya Sukamaju No. 123, Cianjur</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <Phone className="h-4 w-4 text-gray-500" />
                <span className="text-gray-700">0812-3456-7890</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <Mail className="h-4 w-4 text-gray-500" />
                <span className="text-gray-700">info@desasukamaju.desa.id</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <Clock className="h-4 w-4 text-gray-500" />
                <span className="text-gray-700">Senin - Jumat, 08:00 - 16:00</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Emergency Contact */}
      <div className="px-4">
        <Card className="border-0 shadow-sm bg-red-50 border-red-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="bg-red-500 p-2 rounded-full">
                <Phone className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-red-900">Kontak Darurat</h3>
                <p className="text-sm text-red-700">Polsek: 110 | Pemadam: 113 | Ambulans: 118</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
