"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Calendar, User, Eye, Share2 } from "lucide-react"

export default function PublicNews() {
  const [searchTerm, setSearchTerm] = useState("")

  const news = [
    {
      id: 1,
      title: "Pembangunan Jembatan Desa Sukamaju Telah Selesai",
      excerpt:
        "Pembangunan jembatan yang menghubungkan Desa Sukamaju dengan Desa Sukasari telah selesai dilaksanakan. Jembatan ini diharapkan dapat memperlancar arus transportasi dan meningkatkan perekonomian kedua desa.",
      content:
        "Pembangunan jembatan yang menghubungkan Desa Sukamaju dengan Desa Sukasari telah selesai dilaksanakan setelah 6 bulan masa pembangunan. Jembatan sepanjang 50 meter ini dibangun dengan anggaran dari Dana Desa sebesar Rp 2,5 miliar...",
      image: "/placeholder.svg?height=200&width=300",
      publishedDate: "2024-06-15",
      author: "Admin Desa",
      category: "Pembangunan",
      views: 245,
      isHighlight: true,
    },
    {
      id: 2,
      title: "Pelatihan Keterampilan untuk Pemuda Desa",
      excerpt:
        "Pemerintah Desa Sukamaju mengadakan pelatihan keterampilan untuk pemuda desa. Pelatihan ini bertujuan untuk meningkatkan keterampilan dan daya saing pemuda desa di dunia kerja.",
      content:
        "Program pelatihan keterampilan untuk pemuda desa akan dilaksanakan selama 2 minggu dengan berbagai materi seperti keterampilan digital, wirausaha, dan soft skills...",
      image: "/placeholder.svg?height=200&width=300",
      publishedDate: "2024-06-10",
      author: "Admin Desa",
      category: "Pendidikan",
      views: 189,
      isHighlight: false,
    },
    {
      id: 3,
      title: "Program Bantuan Sosial Tahun 2024",
      excerpt:
        "Penyaluran bantuan sosial untuk masyarakat kurang mampu telah dimulai. Program ini merupakan bagian dari upaya pemerintah desa dalam meningkatkan kesejahteraan masyarakat.",
      content:
        "Program bantuan sosial tahun 2024 akan disalurkan kepada 150 keluarga kurang mampu di Desa Sukamaju. Bantuan berupa sembako dan uang tunai...",
      image: "/placeholder.svg?height=200&width=300",
      publishedDate: "2024-06-05",
      author: "Kepala Desa",
      category: "Sosial",
      views: 312,
      isHighlight: false,
    },
    {
      id: 4,
      title: "Gotong Royong Pembersihan Lingkungan",
      excerpt:
        "Kegiatan gotong royong pembersihan lingkungan dilaksanakan setiap hari Minggu pagi. Seluruh warga diharapkan dapat berpartisipasi aktif dalam menjaga kebersihan desa.",
      content:
        "Kegiatan gotong royong rutin setiap hari Minggu pagi dimulai pukul 07.00 WIB. Kegiatan ini meliputi pembersihan jalan, saluran air, dan taman desa...",
      image: "/placeholder.svg?height=200&width=300",
      publishedDate: "2024-06-01",
      author: "Admin Desa",
      category: "Lingkungan",
      views: 156,
      isHighlight: false,
    },
    {
      id: 5,
      title: "Peluncuran Website Resmi Desa Sukamaju",
      excerpt:
        "Website resmi Desa Sukamaju telah diluncurkan untuk memudahkan masyarakat dalam mengakses informasi dan layanan desa secara online.",
      content:
        "Website resmi Desa Sukamaju dapat diakses 24 jam untuk berbagai keperluan seperti pengajuan surat, informasi layanan, dan berita terkini...",
      image: "/placeholder.svg?height=200&width=300",
      publishedDate: "2024-05-28",
      author: "Admin Desa",
      category: "Teknologi",
      views: 423,
      isHighlight: true,
    },
  ]

  const categories = ["Semua", "Pembangunan", "Pendidikan", "Sosial", "Lingkungan", "Teknologi"]
  const [selectedCategory, setSelectedCategory] = useState("Semua")

  const filteredNews = news.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "Semua" || item.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white px-4 py-6 border-b">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Berita & Pengumuman</h1>
        <p className="text-gray-600">Informasi terkini dari Desa Sukamaju</p>
      </div>

      {/* Search and Filter */}
      <div className="px-4 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            placeholder="Cari berita..."
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

      {/* Highlight News */}
      {filteredNews.some((item) => item.isHighlight) && (
        <div className="px-4">
          <h2 className="text-lg font-bold text-gray-900 mb-3">Berita Utama</h2>
          <div className="space-y-4">
            {filteredNews
              .filter((item) => item.isHighlight)
              .map((item) => (
                <Card key={item.id} className="border-0 shadow-sm overflow-hidden">
                  <div className="relative">
                    <img src={item.image || "/placeholder.svg"} alt={item.title} className="w-full h-48 object-cover" />
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-red-500 text-white">Berita Utama</Badge>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>{formatDate(item.publishedDate)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <User className="h-3 w-3" />
                          <span>{item.author}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Eye className="h-3 w-3" />
                          <span>{item.views}</span>
                        </div>
                      </div>

                      <h3 className="font-bold text-gray-900 text-lg leading-tight">{item.title}</h3>

                      <p className="text-gray-600 text-sm line-clamp-3">{item.excerpt}</p>

                      <div className="flex items-center justify-between pt-2">
                        <Badge variant="outline" className="text-xs">
                          {item.category}
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      )}

      {/* Regular News */}
      <div className="px-4">
        <h2 className="text-lg font-bold text-gray-900 mb-3">Berita Lainnya</h2>
        <div className="space-y-4">
          {filteredNews
            .filter((item) => !item.isHighlight)
            .map((item) => (
              <Card key={item.id} className="border-0 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex space-x-4">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.title}
                      className="w-24 h-20 object-cover rounded-lg flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex items-center space-x-3 text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>{formatDate(item.publishedDate)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Eye className="h-3 w-3" />
                          <span>{item.views}</span>
                        </div>
                      </div>

                      <h3 className="font-semibold text-gray-900 text-sm leading-tight line-clamp-2">{item.title}</h3>

                      <p className="text-gray-600 text-xs line-clamp-2">{item.excerpt}</p>

                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-xs">
                          {item.category}
                        </Badge>
                        <Button variant="ghost" size="sm" className="h-6 px-2">
                          <Share2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      </div>

      {/* Load More */}
      <div className="px-4 text-center">
        <Button variant="outline" className="w-full">
          Muat Lebih Banyak
        </Button>
      </div>
    </div>
  )
}
