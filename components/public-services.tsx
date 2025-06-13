"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, FileText, Clock, DollarSign, CheckCircle, AlertCircle, ChevronRight } from "lucide-react"
import Link from "next/link"

export default function PublicServices() {
  const [searchTerm, setSearchTerm] = useState("")

  const services = [
    {
      id: 1,
      name: "Surat Keterangan Domisili",
      description: "Surat keterangan tempat tinggal untuk keperluan administrasi",
      requirements: ["Fotokopi KTP", "Fotokopi Kartu Keluarga", "Surat Pengantar RT/RW"],
      duration: "1-2 hari kerja",
      cost: "Gratis",
      isActive: true,
      category: "Kependudukan",
    },
    {
      id: 2,
      name: "Surat Keterangan Tidak Mampu (SKTM)",
      description: "Surat keterangan untuk warga kurang mampu",
      requirements: [
        "Fotokopi KTP",
        "Fotokopi Kartu Keluarga",
        "Surat Pengantar RT/RW",
        "Surat Keterangan Penghasilan",
      ],
      duration: "2-3 hari kerja",
      cost: "Gratis",
      isActive: true,
      category: "Sosial",
    },
    {
      id: 3,
      name: "Surat Keterangan Usaha",
      description: "Surat keterangan untuk keperluan usaha dan bisnis",
      requirements: ["Fotokopi KTP", "Fotokopi Kartu Keluarga", "Surat Pengantar RT/RW", "Foto lokasi usaha"],
      duration: "2-3 hari kerja",
      cost: "Rp 10.000",
      isActive: true,
      category: "Ekonomi",
    },
    {
      id: 4,
      name: "Surat Pengantar Nikah",
      description: "Surat pengantar untuk keperluan pernikahan",
      requirements: [
        "Fotokopi KTP",
        "Fotokopi Kartu Keluarga",
        "Fotokopi Akta Kelahiran",
        "Surat Keterangan Belum Menikah",
      ],
      duration: "1 hari kerja",
      cost: "Gratis",
      isActive: true,
      category: "Kependudukan",
    },
    {
      id: 5,
      name: "Surat Keterangan Kelahiran",
      description: "Surat keterangan untuk pengurusan akta kelahiran",
      requirements: [
        "Surat Keterangan Lahir dari Bidan/RS",
        "Fotokopi KTP Orang Tua",
        "Fotokopi Kartu Keluarga",
        "Fotokopi Buku Nikah",
      ],
      duration: "1 hari kerja",
      cost: "Gratis",
      isActive: true,
      category: "Kependudukan",
    },
    {
      id: 6,
      name: "Surat Keterangan Kematian",
      description: "Surat keterangan untuk pengurusan akta kematian",
      requirements: [
        "Surat Keterangan Kematian dari RS/Dokter",
        "Fotokopi KTP Almarhum",
        "Fotokopi Kartu Keluarga",
        "Fotokopi KTP Pelapor",
      ],
      duration: "1 hari kerja",
      cost: "Gratis",
      isActive: true,
      category: "Kependudukan",
    },
  ]

  const categories = ["Semua", "Kependudukan", "Sosial", "Ekonomi"]
  const [selectedCategory, setSelectedCategory] = useState("Semua")

  const filteredServices = services.filter((service) => {
    const matchesSearch =
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "Semua" || service.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white px-4 py-6 border-b">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Layanan Desa</h1>
        <p className="text-gray-600">Temukan dan ajukan layanan yang Anda butuhkan</p>
      </div>

      {/* Search and Filter */}
      <div className="px-4 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            placeholder="Cari layanan..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex space-x-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className="whitespace-nowrap"
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Services List */}
      <div className="px-4 space-y-4">
        {filteredServices.length === 0 ? (
          <Card className="border-0 shadow-sm">
            <CardContent className="p-8 text-center">
              <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Layanan Tidak Ditemukan</h3>
              <p className="text-gray-600">Coba ubah kata kunci pencarian atau filter kategori</p>
            </CardContent>
          </Card>
        ) : (
          filteredServices.map((service) => (
            <Card key={service.id} className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="space-y-4">
                  {/* Service Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold text-gray-900">{service.name}</h3>
                        {service.isActive ? (
                          <Badge className="bg-green-100 text-green-800">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Aktif
                          </Badge>
                        ) : (
                          <Badge variant="secondary">Nonaktif</Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{service.description}</p>
                      <Badge variant="outline" className="text-xs">
                        {service.category}
                      </Badge>
                    </div>
                  </div>

                  {/* Service Details */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-700">{service.duration}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-700">{service.cost}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-700">{service.requirements.length} persyaratan</span>
                    </div>
                  </div>

                  {/* Requirements */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Persyaratan:</h4>
                    <ul className="space-y-1">
                      {service.requirements.map((req, index) => (
                        <li key={index} className="flex items-start space-x-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Action Button */}
                  <div className="pt-2 border-t">
                    <Link href="/public/request-letter">
                      <Button className="w-full" disabled={!service.isActive}>
                        <FileText className="h-4 w-4 mr-2" />
                        Ajukan Sekarang
                        <ChevronRight className="h-4 w-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Help Section */}
      <div className="px-4">
        <Card className="border-0 shadow-sm bg-blue-50">
          <CardContent className="p-4">
            <h3 className="font-bold text-blue-900 mb-2">Butuh Bantuan?</h3>
            <p className="text-sm text-blue-800 mb-3">
              Jika Anda kesulitan dalam mengajukan layanan, silakan hubungi kantor desa atau datang langsung.
            </p>
            <Link href="/public/contact">
              <Button variant="outline" size="sm" className="text-blue-700 border-blue-300">
                Hubungi Kami
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
