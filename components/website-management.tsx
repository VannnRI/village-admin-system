"use client"

import type React from "react"

import { useState, useEffect } from "react"
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
import { Plus, Edit, Trash2, SettingsIcon, Loader2, Globe } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {
  getWebsiteContent,
  getVillageNews,
  getVillageServices,
  getWebsiteSettings,
  addWebsiteContent,
  updateWebsiteContent,
  deleteWebsiteContent,
  addVillageNews,
  updateVillageNews,
  deleteVillageNews,
  addVillageService,
  updateVillageService,
  deleteVillageService,
  updateWebsiteSettings,
  type WebsiteContent,
  type VillageNews,
  type VillageService,
  type WebsiteSettings,
} from "@/lib/website-data"

export default function WebsiteManagement() {
  const [activeTab, setActiveTab] = useState("content")
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const { toast } = useToast()

  // Dialog states
  const [isContentDialogOpen, setIsContentDialogOpen] = useState(false)
  const [isNewsDialogOpen, setIsNewsDialogOpen] = useState(false)
  const [isServiceDialogOpen, setIsServiceDialogOpen] = useState(false)
  const [isSettingsDialogOpen, setIsSettingsDialogOpen] = useState(false)

  // Data states
  const [websiteContent, setWebsiteContent] = useState<WebsiteContent[]>([])
  const [villageNews, setVillageNews] = useState<VillageNews[]>([])
  const [villageServices, setVillageServices] = useState<VillageService[]>([])
  const [websiteSettings, setWebsiteSettings] = useState<WebsiteSettings | null>(null)

  // Current editing states
  const [currentContent, setCurrentContent] = useState<WebsiteContent | null>(null)
  const [currentNews, setCurrentNews] = useState<VillageNews | null>(null)
  const [currentService, setCurrentService] = useState<VillageService | null>(null)

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
      loadAllData(parsedUser.username)
    }
  }, [])

  const loadAllData = async (username: string) => {
    setLoading(true)
    try {
      const [contentData, newsData, servicesData, settingsData] = await Promise.all([
        getWebsiteContent(username),
        getVillageNews(username),
        getVillageServices(username),
        getWebsiteSettings(username),
      ])

      setWebsiteContent(contentData)
      setVillageNews(newsData)
      setVillageServices(servicesData)
      setWebsiteSettings(settingsData)
    } catch (error) {
      console.error("Error loading data:", error)
      toast({
        title: "Error",
        description: "Gagal memuat data website",
        variant: "destructive",
      })
    }
    setLoading(false)
  }

  // Content handlers
  const handleAddContent = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    const form = e.target as HTMLFormElement
    const formData = new FormData(form)

    try {
      const contentData = {
        section_name: formData.get("section_name") as string,
        title: formData.get("title") as string,
        content: formData.get("content") as string,
        is_active: formData.get("is_active") === "true",
      }

      if (currentContent) {
        await updateWebsiteContent(currentContent.id, contentData)
        toast({
          title: "Berhasil",
          description: "Konten berhasil diperbarui",
        })
      } else {
        await addWebsiteContent(user.username, contentData)
        toast({
          title: "Berhasil",
          description: "Konten berhasil ditambahkan",
        })
      }

      await loadAllData(user.username)
      setIsContentDialogOpen(false)
      setCurrentContent(null)
      form.reset()
    } catch (error) {
      console.error("Error saving content:", error)
      toast({
        title: "Error",
        description: "Gagal menyimpan konten",
        variant: "destructive",
      })
    }
  }

  const handleDeleteContent = async (contentId: number) => {
    if (!user || !confirm("Apakah Anda yakin ingin menghapus konten ini?")) return

    try {
      await deleteWebsiteContent(contentId)
      await loadAllData(user.username)
      toast({
        title: "Berhasil",
        description: "Konten berhasil dihapus",
      })
    } catch (error) {
      console.error("Error deleting content:", error)
      toast({
        title: "Error",
        description: "Gagal menghapus konten",
        variant: "destructive",
      })
    }
  }

  // News handlers
  const handleAddNews = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    const form = e.target as HTMLFormElement
    const formData = new FormData(form)

    try {
      const newsData = {
        title: formData.get("title") as string,
        content: formData.get("content") as string,
        image_url: (formData.get("image_url") as string) || "",
        status: formData.get("status") as "published" | "draft",
        published_date: (formData.get("published_date") as string) || new Date().toISOString().split("T")[0],
        author: (formData.get("author") as string) || "Admin Desa",
      }

      if (currentNews) {
        await updateVillageNews(currentNews.id, newsData)
        toast({
          title: "Berhasil",
          description: "Berita berhasil diperbarui",
        })
      } else {
        await addVillageNews(user.username, newsData)
        toast({
          title: "Berhasil",
          description: "Berita berhasil ditambahkan",
        })
      }

      await loadAllData(user.username)
      setIsNewsDialogOpen(false)
      setCurrentNews(null)
      form.reset()
    } catch (error) {
      console.error("Error saving news:", error)
      toast({
        title: "Error",
        description: "Gagal menyimpan berita",
        variant: "destructive",
      })
    }
  }

  const handleDeleteNews = async (newsId: number) => {
    if (!user || !confirm("Apakah Anda yakin ingin menghapus berita ini?")) return

    try {
      await deleteVillageNews(newsId)
      await loadAllData(user.username)
      toast({
        title: "Berhasil",
        description: "Berita berhasil dihapus",
      })
    } catch (error) {
      console.error("Error deleting news:", error)
      toast({
        title: "Error",
        description: "Gagal menghapus berita",
        variant: "destructive",
      })
    }
  }

  // Service handlers
  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    const form = e.target as HTMLFormElement
    const formData = new FormData(form)

    try {
      const serviceData = {
        service_name: formData.get("service_name") as string,
        description: formData.get("description") as string,
        requirements: formData.get("requirements") as string,
        procedure: formData.get("procedure") as string,
        duration: (formData.get("duration") as string) || "1-3 hari",
        is_active: formData.get("is_active") === "true",
      }

      if (currentService) {
        await updateVillageService(currentService.id, serviceData)
        toast({
          title: "Berhasil",
          description: "Layanan berhasil diperbarui",
        })
      } else {
        await addVillageService(user.username, serviceData)
        toast({
          title: "Berhasil",
          description: "Layanan berhasil ditambahkan",
        })
      }

      await loadAllData(user.username)
      setIsServiceDialogOpen(false)
      setCurrentService(null)
      form.reset()
    } catch (error) {
      console.error("Error saving service:", error)
      toast({
        title: "Error",
        description: "Gagal menyimpan layanan",
        variant: "destructive",
      })
    }
  }

  const handleDeleteService = async (serviceId: number) => {
    if (!user || !confirm("Apakah Anda yakin ingin menghapus layanan ini?")) return

    try {
      await deleteVillageService(serviceId)
      await loadAllData(user.username)
      toast({
        title: "Berhasil",
        description: "Layanan berhasil dihapus",
      })
    } catch (error) {
      console.error("Error deleting service:", error)
      toast({
        title: "Error",
        description: "Gagal menghapus layanan",
        variant: "destructive",
      })
    }
  }

  // Settings handlers
  const handleUpdateSettings = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    const form = e.target as HTMLFormElement
    const formData = new FormData(form)

    try {
      const settingsData = {
        village_name: formData.get("village_name") as string,
        village_tagline: formData.get("village_tagline") as string,
        village_description: formData.get("village_description") as string,
        village_address: formData.get("village_address") as string,
        village_phone: formData.get("village_phone") as string,
        village_email: formData.get("village_email") as string,
        social_facebook: formData.get("social_facebook") as string,
        social_twitter: formData.get("social_twitter") as string,
        social_instagram: formData.get("social_instagram") as string,
        logo_url: (formData.get("logo_url") as string) || "",
        theme_color: (formData.get("theme_color") as string) || "#4CAF50",
      }

      await updateWebsiteSettings(user.username, settingsData)
      await loadAllData(user.username)
      setIsSettingsDialogOpen(false)
      toast({
        title: "Berhasil",
        description: "Pengaturan berhasil disimpan",
      })
    } catch (error) {
      console.error("Error updating settings:", error)
      toast({
        title: "Error",
        description: "Gagal menyimpan pengaturan",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p>Memuat data website...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <Tabs defaultValue="content" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
          <TabsTrigger value="content" className="text-xs sm:text-sm">
            Konten
          </TabsTrigger>
          <TabsTrigger value="news" className="text-xs sm:text-sm">
            Berita
          </TabsTrigger>
          <TabsTrigger value="services" className="text-xs sm:text-sm">
            Layanan
          </TabsTrigger>
          <TabsTrigger value="settings" className="text-xs sm:text-sm">
            Pengaturan
          </TabsTrigger>
        </TabsList>

        {/* Content Tab */}
        <TabsContent value="content" className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="text-lg sm:text-xl font-semibold">Kelola Konten Website</h2>
            <Dialog open={isContentDialogOpen} onOpenChange={setIsContentDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => setCurrentContent(null)} className="w-full sm:w-auto">
                  <Plus className="mr-2 h-4 w-4" />
                  Tambah Konten
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{currentContent ? "Edit Konten" : "Tambah Konten Baru"}</DialogTitle>
                  <DialogDescription>
                    Isi informasi konten website yang akan ditampilkan di halaman desa.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddContent} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[100px]">Bagian</TableHead>
                      <TableHead className="min-w-[150px]">Judul</TableHead>
                      <TableHead className="min-w-[80px]">Status</TableHead>
                      <TableHead className="text-right min-w-[100px]">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {websiteContent.map((content) => (
                      <TableRow key={content.id}>
                        <TableCell className="font-medium capitalize">{content.section_name}</TableCell>
                        <TableCell className="max-w-[200px] truncate">{content.title}</TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${content.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}
                          >
                            {content.is_active ? "Aktif" : "Tidak Aktif"}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1 sm:gap-2">
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
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteContent(content.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* News Tab */}
        <TabsContent value="news" className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="text-lg sm:text-xl font-semibold">Kelola Berita Desa</h2>
            <Dialog open={isNewsDialogOpen} onOpenChange={setIsNewsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => setCurrentNews(null)} className="w-full sm:w-auto">
                  <Plus className="mr-2 h-4 w-4" />
                  Tambah Berita
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="image_url">URL Gambar (Opsional)</Label>
                      <Input
                        id="image_url"
                        name="image_url"
                        defaultValue={currentNews?.image_url || ""}
                        placeholder="https://example.com/image.jpg"
                      />
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
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[150px]">Judul</TableHead>
                      <TableHead className="min-w-[100px]">Penulis</TableHead>
                      <TableHead className="hidden sm:table-cell min-w-[100px]">Tanggal</TableHead>
                      <TableHead className="min-w-[80px]">Status</TableHead>
                      <TableHead className="text-right min-w-[100px]">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {villageNews.map((news) => (
                      <TableRow key={news.id}>
                        <TableCell className="font-medium max-w-[200px] truncate">{news.title}</TableCell>
                        <TableCell>{news.author}</TableCell>
                        <TableCell className="hidden sm:table-cell">
                          {new Date(news.published_date).toLocaleDateString("id-ID")}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${news.status === "published" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}
                          >
                            {news.status === "published" ? "Dipublikasikan" : "Draft"}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1 sm:gap-2">
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
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteNews(news.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Services Tab */}
        <TabsContent value="services" className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="text-lg sm:text-xl font-semibold">Kelola Layanan Desa</h2>
            <Dialog open={isServiceDialogOpen} onOpenChange={setIsServiceDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => setCurrentService(null)} className="w-full sm:w-auto">
                  <Plus className="mr-2 h-4 w-4" />
                  Tambah Layanan
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{currentService ? "Edit Layanan" : "Tambah Layanan Baru"}</DialogTitle>
                  <DialogDescription>Isi informasi layanan yang tersedia di desa.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddService} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                      <Label htmlFor="duration">Durasi</Label>
                      <Input
                        id="duration"
                        name="duration"
                        defaultValue={currentService?.duration || "1-3 hari"}
                        placeholder="Durasi layanan"
                      />
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
                      placeholder="Masukkan persyaratan layanan (pisahkan dengan enter)"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="procedure">Prosedur</Label>
                    <Textarea
                      id="procedure"
                      name="procedure"
                      defaultValue={currentService?.procedure || ""}
                      placeholder="Masukkan prosedur layanan (pisahkan dengan enter)"
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
                  <DialogFooter>
                    <Button type="submit">{currentService ? "Simpan Perubahan" : "Tambah Layanan"}</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[150px]">Nama Layanan</TableHead>
                      <TableHead className="min-w-[200px]">Deskripsi</TableHead>
                      <TableHead className="hidden sm:table-cell min-w-[80px]">Durasi</TableHead>
                      <TableHead className="min-w-[80px]">Status</TableHead>
                      <TableHead className="text-right min-w-[100px]">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {villageServices.map((service) => (
                      <TableRow key={service.id}>
                        <TableCell className="font-medium">{service.service_name}</TableCell>
                        <TableCell className="max-w-[300px] truncate">{service.description}</TableCell>
                        <TableCell className="hidden sm:table-cell">{service.duration}</TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${service.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}
                          >
                            {service.is_active ? "Aktif" : "Tidak Aktif"}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1 sm:gap-2">
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
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteService(service.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="text-lg sm:text-xl font-semibold">Pengaturan Website</h2>
            <Dialog open={isSettingsDialogOpen} onOpenChange={setIsSettingsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full sm:w-auto">
                  <SettingsIcon className="mr-2 h-4 w-4" />
                  Edit Pengaturan
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
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
                      defaultValue={websiteSettings?.village_name || ""}
                      placeholder="Masukkan nama desa"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="village_tagline">Tagline Desa</Label>
                    <Input
                      id="village_tagline"
                      name="village_tagline"
                      defaultValue={websiteSettings?.village_tagline || ""}
                      placeholder="Masukkan tagline desa"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="village_description">Deskripsi Desa</Label>
                    <Textarea
                      id="village_description"
                      name="village_description"
                      defaultValue={websiteSettings?.village_description || ""}
                      placeholder="Masukkan deskripsi desa"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="village_address">Alamat</Label>
                      <Input
                        id="village_address"
                        name="village_address"
                        defaultValue={websiteSettings?.village_address || ""}
                        placeholder="Alamat desa"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="village_phone">Telepon</Label>
                      <Input
                        id="village_phone"
                        name="village_phone"
                        defaultValue={websiteSettings?.village_phone || ""}
                        placeholder="Nomor telepon"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="village_email">Email</Label>
                    <Input
                      id="village_email"
                      name="village_email"
                      defaultValue={websiteSettings?.village_email || ""}
                      placeholder="Email desa"
                      type="email"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="social_facebook">Facebook</Label>
                      <Input
                        id="social_facebook"
                        name="social_facebook"
                        defaultValue={websiteSettings?.social_facebook || ""}
                        placeholder="URL Facebook"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="social_twitter">Twitter</Label>
                      <Input
                        id="social_twitter"
                        name="social_twitter"
                        defaultValue={websiteSettings?.social_twitter || ""}
                        placeholder="URL Twitter"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="social_instagram">Instagram</Label>
                      <Input
                        id="social_instagram"
                        name="social_instagram"
                        defaultValue={websiteSettings?.social_instagram || ""}
                        placeholder="URL Instagram"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="logo_url">URL Logo (Opsional)</Label>
                      <Input
                        id="logo_url"
                        name="logo_url"
                        defaultValue={websiteSettings?.logo_url || ""}
                        placeholder="https://example.com/logo.png"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="theme_color">Warna Tema</Label>
                      <div className="flex gap-2">
                        <Input
                          id="theme_color"
                          name="theme_color"
                          defaultValue={websiteSettings?.theme_color || "#4CAF50"}
                          placeholder="Kode warna hex"
                        />
                        <div
                          className="w-10 h-10 rounded border flex-shrink-0"
                          style={{ backgroundColor: websiteSettings?.theme_color || "#4CAF50" }}
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Informasi Desa</CardTitle>
                <CardDescription>Informasi dasar tentang desa</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Nama Desa</h3>
                  <p className="break-words">{websiteSettings?.village_name || "-"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Tagline</h3>
                  <p className="break-words">{websiteSettings?.village_tagline || "-"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Deskripsi</h3>
                  <p className="text-sm break-words">{websiteSettings?.village_description || "-"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Alamat</h3>
                  <p className="break-words">{websiteSettings?.village_address || "-"}</p>
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
                  <p className="break-all">{websiteSettings?.village_email || "-"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Telepon</h3>
                  <p>{websiteSettings?.village_phone || "-"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Media Sosial</h3>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {websiteSettings?.social_facebook && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={websiteSettings.social_facebook} target="_blank" rel="noopener noreferrer">
                          Facebook
                        </a>
                      </Button>
                    )}
                    {websiteSettings?.social_twitter && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={websiteSettings.social_twitter} target="_blank" rel="noopener noreferrer">
                          Twitter
                        </a>
                      </Button>
                    )}
                    {websiteSettings?.social_instagram && (
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

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Tampilan Website</CardTitle>
                <CardDescription>Pengaturan tampilan website desa</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Logo Desa</h3>
                    <div className="mt-1 border rounded p-2 inline-block">
                      {websiteSettings?.logo_url && websiteSettings.logo_url !== "" ? (
                        <img
                          src={websiteSettings.logo_url || "/placeholder.svg"}
                          alt="Logo Desa"
                          className="h-16 w-16 object-contain"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.style.display = "none"
                            target.nextElementSibling?.classList.remove("hidden")
                          }}
                        />
                      ) : (
                        <div className="h-16 w-16 bg-gray-100 rounded flex items-center justify-center">
                          <Globe className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Warna Tema</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <div
                        className="w-6 h-6 rounded-full border"
                        style={{ backgroundColor: websiteSettings?.theme_color || "#4CAF50" }}
                      ></div>
                      <span>{websiteSettings?.theme_color || "#4CAF50"}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Preview Website</h3>
                  <div className="mt-2">
                    <p className="text-xs text-gray-500 mb-2">
                      Lihat preview website di tab "Preview" untuk melihat hasil perubahan.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
