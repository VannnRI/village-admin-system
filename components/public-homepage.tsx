"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Newspaper, Phone, ArrowRight, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function PublicHomepage() {
  const services = [
    {
      icon: FileText,
      title: "Permohonan Surat",
      description: "Ajukan permohonan surat keterangan secara online",
      href: "/public/request-letter",
    },
    {
      icon: Newspaper,
      title: "Berita Desa",
      description: "Informasi terbaru dan pengumuman dari pemerintah desa",
      href: "/public/news",
    },
    {
      icon: Phone,
      title: "Kontak",
      description: "Hubungi pemerintah desa untuk informasi lebih lanjut",
      href: "/public/contact",
    },
  ]

  const features = ["Layanan 24/7 online", "Proses cepat dan mudah", "Transparan dan akuntabel", "Ramah lingkungan"]

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Selamat Datang di
            <span className="text-blue-600 block">Portal Desa</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Sistem informasi dan layanan administrasi desa yang memudahkan masyarakat dalam mengakses berbagai layanan
            pemerintahan desa secara online.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg px-8">
              <Link href="/public/request-letter">
                Ajukan Surat
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8">
              <Link href="/public/services">Lihat Layanan</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Layanan Kami</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Berbagai layanan administrasi desa yang dapat diakses dengan mudah
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <service.icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                  <CardDescription className="text-base">{service.description}</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Button asChild variant="outline" className="w-full">
                    <Link href={service.href}>
                      Akses Layanan
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Mengapa Memilih Portal Desa?</h2>
              <p className="text-lg text-gray-600 mb-8">
                Kami berkomitmen memberikan pelayanan terbaik untuk masyarakat dengan memanfaatkan teknologi digital
                yang modern dan mudah digunakan.
              </p>
              <div className="space-y-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0" />
                    <span className="text-lg text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Statistik Layanan</h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">1000+</div>
                  <div className="text-gray-600">Surat Diproses</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">98%</div>
                  <div className="text-gray-600">Kepuasan</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">24/7</div>
                  <div className="text-gray-600">Layanan Online</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600 mb-2">5000+</div>
                  <div className="text-gray-600">Warga Terdaftar</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Siap Menggunakan Layanan Kami?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Mulai ajukan permohonan surat atau akses layanan lainnya sekarang juga
          </p>
          <Button asChild size="lg" variant="secondary" className="text-lg px-8">
            <Link href="/public/request-letter">
              Mulai Sekarang
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
