"use client"

import type React from "react"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Edit, Trash2, Eye, ImageIcon, FileText, SettingsIcon } from "lucide-react"
import {
  getWebsiteContent,
  getVillageNews,
  getVillageServices,
  getWebsiteSettings,
  addWebsiteContent,
  updateWebsiteContent,
  addVillageNews,
  updateVillageNews,
  addVillageService,
  updateVillageService,
  updateWebsiteSettings,
} from "@/lib/website-data"

export default function WebsiteManagement() {
  const [activeTab, setActiveTab] = useState("content")
  const [isContentDialogOpen, setIsContentDialogOpen] = useState(false)
  const [isNewsDialogOpen, setIsNewsDialogOpen] = useState(false)
  const [isServiceDialogOpen, setIsServiceDialogOpen] = useState(false)
  const [isSettingsDialogOpen, setIsSettingsDialogOpen] = useState(false)

  const [websiteContent, setWebsiteContent] = useState(getWebsiteContent())
  const [villageNews, setVillageNews] = useState(getVillageNews())
  const [villageServices, setVillageServices] = useState(getVillageServices())
  const [websiteSettings, setWebsiteSettings] = useState(getWebsiteSettings())

  const [currentContent, setCurrentContent] = useState<any>(null)
  const [currentNews, setCurrentNews] = useState<any>(null)
  const [currentService, setCurrentService] = useState<any>(null)

  // Form handlers for content
  const handleAddContent = (e: React.FormEvent) => {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const formData = new FormData(form)

    const newContent = {
      id: currentContent?.id || Date.now(),
      section_name: formData.get("section_name") as string,
      title: formData.get("title") as string,
      content: formData.get("content") as string,
      is_active: formData.get("is_active") === "true",
      last_updated: new Date().toISOString(),
    }

    if (currentContent) {
      updateWebsiteContent(newContent)
      setWebsiteContent(getWebsiteContent())
    } else {
      addWebsiteContent(newContent)
      setWebsiteContent(getWebsiteContent())
    }

    setIsContentDialogOpen(false)
    setCurrentContent(null)
    form.reset()
  }

  // Form handlers for news
  const handleAddNews = (e: React.FormEvent) => {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const formData = new FormData(form)

    const newNews = {
      id: currentNews?.id || Date.now(),
      title: formData.get("title") as string,
      content: formData.get("content") as string,
      image_url: (formData.get("image_url") as string) || "/placeholder.svg?height=200&width=300",
      status: formData.get("status") as string,
      published_date: (formData.get("published_date") as string) || new Date().toISOString().split("T")[0],
      author: formData.get("author") as string,
    }

    if (currentNews) {
      updateVillageNews(newNews)
      setVillageNews(getVillageNews())
    } else {
      addVillageNews(newNews)
      setVillageNews(getVillageNews())
    }

    setIsNewsDialogOpen(false)
    setCurrentNews(null)
    form.reset()
  }

  // Form handlers for services
  const handleAddService = (e: React.FormEvent) => {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const formData = new FormData(form)

    const newService = {
      id: currentService?.id || Date.now(),
      service_name: formData.get("service_name") as string,
      description: formData.get("description") as string,
      requirements: formData.get("requirements") as string,
      procedure: formData.get("procedure") as string,
      is_active: formData.get("is_active") === "true",
    }

    if (currentService) {
      updateVillageService(newService)
      setVillageServices(getVillageServices())
    } else {
      addVillageService(newService)
      setVillageServices(getVillageServices())
    }

    setIsServiceDialogOpen(false)
    setCurrentService(null)
    form.reset()
  }

  // Form handlers for settings
  const handleUpdateSettings = (e: React.FormEvent) => {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const formData = new FormData(form)

    const updatedSettings = {
      village_name: formData.get("village_name") as string,
      village_tagline: formData.get("village_tagline") as string,
      village_description: formData.get("village_description") as string,
      village_address: formData.get("village_address") as string,
      village_phone: formData.get("village_phone") as string,
      village_email: formData.get("village_email") as string,
      social_facebook: formData.get("social_facebook") as string,
      social_twitter: formData.get("social_twitter") as string,
      social_instagram: formData.get("social_instagram") as string,
      logo_url: (formData.get("logo_url") as string) || "/placeholder.svg?height=100&width=100",
      theme_color: (formData.get("theme_color") as string) || "#4CAF50",
    }

    updateWebsiteSettings(updatedSettings)
    setWebsiteSettings(getWebsiteSettings())
    setIsSettingsDialogOpen(false)
  }

  return (
    <Tabs defaultValue="content" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="content">Konten Website</TabsTrigger>
        <TabsTrigger value="news">Berita Desa</TabsTrigger>
        <TabsTrigger value="services">Layanan Desa</TabsTrigger>
        <TabsTrigger value="settings">Pengaturan</TabsTrigger>
      </TabsList>

      {/* Content Tab */}
      <TabsContent value="content" className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Kelola Konten Website</h2>
          <Dialog open={isContentDialogOpen} onOpenChange={setIsContentDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setCurrentContent(null)}>
                <Plus className="mr-2 h-4 w-4" />
                Tambah Konten
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>{currentContent ? "Edit Konten" : "Tambah Konten Baru"}</DialogTitle>
                <DialogDescription>
                  Isi informasi konten website yang akan ditampilkan di halaman desa.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddContent} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="section_name">Nama Bagian</Label>
                    <Select name="section_name" defaultValue={currentContent?.section_name || "hero"} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih bagian" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hero">Hero (Beranda)</SelectItem>
                        <SelectItem value="about">Tentang Desa</SelectItem>
                        <SelectItem value="vision">Visi & Misi</SelectItem>
                        <SelectItem value="contact">Kontak</SelectItem>
                        <SelectItem value="footer">Footer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="is_active">Status</Label>
                    <Select name="is_active" defaultValue={currentContent?.is_active ? "true" : "false"}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">Aktif</SelectItem>
                        <SelectItem value="false">Tidak Aktif</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="title">Judul</Label>
                  <Input
                    id="title"
                    name="title"
                    defaultValue={currentContent?.title || ""}
                    placeholder="Masukkan judul konten"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="content">Konten</Label>
                  <Textarea
                    id="content"
                    name="content"
                    defaultValue={currentContent?.content || ""}
                    placeholder="Masukkan isi konten"
                    className="min-h-[150px]"
                    required
                  />
                </div>
                <DialogFooter>
                  <Button type="submit">{currentContent ? "Simpan Perubahan" : "Tambah Konten"}</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Bagian</TableHead>
                  <TableHead>Judul</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Terakhir Diperbarui</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {websiteContent.map((content) => (
                  <TableRow key={content.id}>
                    <TableCell className="font-medium capitalize">{content.section_name}</TableCell>
                    <TableCell>{content.title}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${content.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}
                      >
                        {content.is_active ? "Aktif" : "Tidak Aktif"}
                      </span>
                    </TableCell>
                    <TableCell>{new Date(content.last_updated).toLocaleDateString("id-ID")}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setCurrentContent(content)
                            setIsContentDialogOpen(true)
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>

      {/* News Tab */}
      <TabsContent value="news" className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Kelola Berita Desa</h2>
          <Dialog open={isNewsDialogOpen} onOpenChange={setIsNewsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setCurrentNews(null)}>
                <Plus className="mr-2 h-4 w-4" />
                Tambah Berita
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>{currentNews ? "Edit Berita" : "Tambah Berita Baru"}</DialogTitle>
                <DialogDescription>Isi informasi berita atau pengumuman desa.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddNews} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Judul Berita</Label>
                  <Input
                    id="title"
                    name="title"
                    defaultValue={currentNews?.title || ""}
                    placeholder="Masukkan judul berita"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="author">Penulis</Label>
                    <Input
                      id="author"
                      name="author"
                      defaultValue={currentNews?.author || "Admin Desa"}
                      placeholder="Nama penulis"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="published_date">Tanggal Publikasi</Label>
                    <Input
                      id="published_date"
                      name="published_date"
                      type="date"
                      defaultValue={currentNews?.published_date || new Date().toISOString().split("T")[0]}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="content">Isi Berita</Label>
                  <Textarea
                    id="content"
                    name="content"
                    defaultValue={currentNews?.content || ""}
                    placeholder="Masukkan isi berita"
                    className="min-h-[150px]"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="image_url">URL Gambar</Label>
                    <div className="flex gap-2">
                      <Input
                        id="image_url"
                        name="image_url"
                        defaultValue={currentNews?.image_url || "/placeholder.svg?height=200&width=300"}
                        placeholder="URL gambar"
                      />
                      <Button type="button" variant="outline" size="icon">
                        <ImageIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select name="status" defaultValue={currentNews?.status || "draft"}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="published">Dipublikasikan</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">{currentNews ? "Simpan Perubahan" : "Tambah Berita"}</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Judul</TableHead>
                  <TableHead>Penulis</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {villageNews.map((news) => (
                  <TableRow key={news.id}>
                    <TableCell className="font-medium">{news.title}</TableCell>
                    <TableCell>{news.author}</TableCell>
                    <TableCell>{new Date(news.published_date).toLocaleDateString("id-ID")}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${news.status === "published" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}
                      >
                        {news.status === "published" ? "Dipublikasikan" : "Draft"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setCurrentNews(news)
                            setIsNewsDialogOpen(true)
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-500 hover:text-red-700">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Services Tab */}
      <TabsContent value="services" className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Kelola Layanan Desa</h2>
          <Dialog open={isServiceDialogOpen} onOpenChange={setIsServiceDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setCurrentService(null)}>
                <Plus className="mr-2 h-4 w-4" />
                Tambah Layanan
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>{currentService ? "Edit Layanan" : "Tambah Layanan Baru"}</DialogTitle>
                <DialogDescription>Isi informasi layanan yang tersedia di desa.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddService} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="service_name">Nama Layanan</Label>
                    <Input
                      id="service_name"
                      name="service_name"
                      defaultValue={currentService?.service_name || ""}
                      placeholder="Masukkan nama layanan"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="is_active">Status</Label>
                    <Select name="is_active" defaultValue={currentService?.is_active ? "true" : "false"}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">Aktif</SelectItem>
                        <SelectItem value="false">Tidak Aktif</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Deskripsi</Label>
                  <Textarea
                    id="description"
                    name="description"
                    defaultValue={currentService?.description || ""}
                    placeholder="Masukkan deskripsi layanan"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="requirements">Persyaratan</Label>
                  <Textarea
                    id="requirements"
                    name="requirements"
                    defaultValue={currentService?.requirements || ""}
                    placeholder="Masukkan persyaratan layanan"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="procedure">Prosedur</Label>
                  <Textarea
                    id="procedure"
                    name="procedure"
                    defaultValue={currentService?.procedure || ""}
                    placeholder="Masukkan prosedur layanan"
                    required
                  />
                </div>
                <DialogFooter>
                  <Button type="submit">{currentService ? "Simpan Perubahan" : "Tambah Layanan"}</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama Layanan</TableHead>
                  <TableHead>Deskripsi</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {villageServices.map((service) => (
                  <TableRow key={service.id}>
                    <TableCell className="font-medium">{service.service_name}</TableCell>
                    <TableCell className="truncate max-w-[300px]">{service.description}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${service.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}
                      >
                        {service.is_active ? "Aktif" : "Tidak Aktif"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setCurrentService(service)
                            setIsServiceDialogOpen(true)
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <FileText className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-500 hover:text-red-700">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Settings Tab */}
      <TabsContent value="settings" className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Pengaturan Website</h2>
          <Dialog open={isSettingsDialogOpen} onOpenChange={setIsSettingsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <SettingsIcon className="mr-2 h-4 w-4" />
                Edit Pengaturan
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Edit Pengaturan Website</DialogTitle>
                <DialogDescription>Ubah pengaturan dasar website desa.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleUpdateSettings} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="village_name">Nama Desa</Label>
                  <Input
                    id="village_name"
                    name="village_name"
                    defaultValue={websiteSettings.village_name}
                    placeholder="Masukkan nama desa"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="village_tagline">Tagline Desa</Label>
                  <Input
                    id="village_tagline"
                    name="village_tagline"
                    defaultValue={websiteSettings.village_tagline}
                    placeholder="Masukkan tagline desa"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="village_description">Deskripsi Desa</Label>
                  <Textarea
                    id="village_description"
                    name="village_description"
                    defaultValue={websiteSettings.village_description}
                    placeholder="Masukkan deskripsi desa"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="village_address">Alamat</Label>
                    <Input
                      id="village_address"
                      name="village_address"
                      defaultValue={websiteSettings.village_address}
                      placeholder="Alamat desa"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="village_phone">Telepon</Label>
                    <Input
                      id="village_phone"
                      name="village_phone"
                      defaultValue={websiteSettings.village_phone}
                      placeholder="Nomor telepon"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="village_email">Email</Label>
                  <Input
                    id="village_email"
                    name="village_email"
                    defaultValue={websiteSettings.village_email}
                    placeholder="Email desa"
                    type="email"
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="social_facebook">Facebook</Label>
                    <Input
                      id="social_facebook"
                      name="social_facebook"
                      defaultValue={websiteSettings.social_facebook}
                      placeholder="URL Facebook"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="social_twitter">Twitter</Label>
                    <Input
                      id="social_twitter"
                      name="social_twitter"
                      defaultValue={websiteSettings.social_twitter}
                      placeholder="URL Twitter"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="social_instagram">Instagram</Label>
                    <Input
                      id="social_instagram"
                      name="social_instagram"
                      defaultValue={websiteSettings.social_instagram}
                      placeholder="URL Instagram"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="logo_url">URL Logo</Label>
                    <div className="flex gap-2">
                      <Input
                        id="logo_url"
                        name="logo_url"
                        defaultValue={websiteSettings.logo_url}
                        placeholder="URL logo"
                      />
                      <Button type="button" variant="outline" size="icon">
                        <ImageIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="theme_color">Warna Tema</Label>
                    <div className="flex gap-2">
                      <Input
                        id="theme_color"
                        name="theme_color"
                        defaultValue={websiteSettings.theme_color}
                        placeholder="Kode warna hex"
                      />
                      <div
                        className="w-10 h-10 rounded border"
                        style={{ backgroundColor: websiteSettings.theme_color }}
                      ></div>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Simpan Pengaturan</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Informasi Desa</CardTitle>
              <CardDescription>Informasi dasar tentang desa</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Nama Desa</h3>
                <p>{websiteSettings.village_name}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Tagline</h3>
                <p>{websiteSettings.village_tagline}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Deskripsi</h3>
                <p className="text-sm">{websiteSettings.village_description}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Alamat</h3>
                <p>{websiteSettings.village_address}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Kontak & Media Sosial</CardTitle>
              <CardDescription>Informasi kontak dan media sosial desa</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Email</h3>
                <p>{websiteSettings.village_email}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Telepon</h3>
                <p>{websiteSettings.village_phone}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Media Sosial</h3>
                <div className="flex gap-2 mt-1">
                  {websiteSettings.social_facebook && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={websiteSettings.social_facebook} target="_blank" rel="noopener noreferrer">
                        Facebook
                      </a>
                    </Button>
                  )}
                  {websiteSettings.social_twitter && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={websiteSettings.social_twitter} target="_blank" rel="noopener noreferrer">
                        Twitter
                      </a>
                    </Button>
                  )}
                  {websiteSettings.social_instagram && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={websiteSettings.social_instagram} target="_blank" rel="noopener noreferrer">
                        Instagram
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Tampilan Website</CardTitle>
              <CardDescription>Pengaturan tampilan website desa</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Logo Desa</h3>
                  <div className="mt-1 border rounded p-2 inline-block">
                    <img
                      src={websiteSettings.logo_url || "/placeholder.svg"}
                      alt="Logo Desa"
                      className="h-16 w-16 object-contain"
                    />
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Warna Tema</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <div
                      className="w-6 h-6 rounded-full border"
                      style={{ backgroundColor: websiteSettings.theme_color }}
                    ></div>
                    <span>{websiteSettings.theme_color}</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Preview Website</h3>
                <div className="mt-2">
                  <Button variant="outline">
                    <Eye className="mr-2 h-4 w-4" />
                    Lihat Preview Website
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </Tabs>
  )
}
