// Sample data for website management

// Website content sections
interface WebsiteContent {
  id: number
  section_name: string
  title: string
  content: string
  is_active: boolean
  last_updated: string
}

// Village news
interface VillageNews {
  id: number
  title: string
  content: string
  image_url: string
  status: "published" | "draft"
  published_date: string
  author: string
}

// Village services
interface VillageService {
  id: number
  service_name: string
  description: string
  requirements: string
  procedure: string
  is_active: boolean
}

// Website settings
interface WebsiteSettings {
  village_name: string
  village_tagline: string
  village_description: string
  village_address: string
  village_phone: string
  village_email: string
  social_facebook: string
  social_twitter: string
  social_instagram: string
  logo_url: string
  theme_color: string
}

// Sample data
let websiteContent: WebsiteContent[] = [
  {
    id: 1,
    section_name: "hero",
    title: "Selamat Datang di Desa Sukamaju",
    content: "Desa Sukamaju adalah desa yang indah dan makmur dengan masyarakat yang ramah dan gotong royong.",
    is_active: true,
    last_updated: "2023-06-10T08:30:00Z",
  },
  {
    id: 2,
    section_name: "about",
    title: "Tentang Desa Sukamaju",
    content:
      "Desa Sukamaju terletak di kecamatan Cianjur, Jawa Barat. Desa ini memiliki luas wilayah sekitar 500 hektar dengan jumlah penduduk sekitar 5000 jiwa.",
    is_active: true,
    last_updated: "2023-06-09T10:15:00Z",
  },
  {
    id: 3,
    section_name: "vision",
    title: "Visi & Misi",
    content:
      "Visi: Mewujudkan Desa Sukamaju yang mandiri, sejahtera, dan berkeadilan.\n\nMisi:\n1. Meningkatkan kualitas sumber daya manusia\n2. Mengembangkan ekonomi lokal\n3. Meningkatkan infrastruktur desa\n4. Melestarikan lingkungan hidup",
    is_active: true,
    last_updated: "2023-06-08T14:20:00Z",
  },
  {
    id: 4,
    section_name: "contact",
    title: "Hubungi Kami",
    content:
      "Kantor Desa Sukamaju\nJl. Raya Sukamaju No. 123\nKecamatan Cianjur, Jawa Barat\nTelp: 0812-3456-7890\nEmail: info@desasukamaju.desa.id",
    is_active: true,
    last_updated: "2023-06-07T09:45:00Z",
  },
]

let villageNews: VillageNews[] = [
  {
    id: 1,
    title: "Pembangunan Jembatan Desa Sukamaju Telah Selesai",
    content:
      "Pembangunan jembatan yang menghubungkan Desa Sukamaju dengan Desa Sukasari telah selesai dilaksanakan. Jembatan ini diharapkan dapat memperlancar arus transportasi dan meningkatkan perekonomian kedua desa.",
    image_url: "/placeholder.svg?height=200&width=300",
    status: "published",
    published_date: "2023-06-15",
    author: "Admin Desa",
  },
  {
    id: 2,
    title: "Pelatihan Keterampilan untuk Pemuda Desa",
    content:
      "Pemerintah Desa Sukamaju mengadakan pelatihan keterampilan untuk pemuda desa. Pelatihan ini bertujuan untuk meningkatkan keterampilan dan daya saing pemuda desa di dunia kerja.",
    image_url: "/placeholder.svg?height=200&width=300",
    status: "published",
    published_date: "2023-06-10",
    author: "Admin Desa",
  },
  {
    id: 3,
    title: "Rencana Pembangunan Desa Tahun 2023",
    content:
      "Pemerintah Desa Sukamaju telah menyusun rencana pembangunan desa untuk tahun 2023. Rencana ini meliputi pembangunan infrastruktur, peningkatan kualitas pendidikan, dan pengembangan ekonomi lokal.",
    image_url: "/placeholder.svg?height=200&width=300",
    status: "draft",
    published_date: "2023-06-05",
    author: "Kepala Desa",
  },
]

let villageServices: VillageService[] = [
  {
    id: 1,
    service_name: "Pembuatan KTP",
    description: "Layanan pembuatan Kartu Tanda Penduduk (KTP) untuk warga desa.",
    requirements: "1. Fotokopi Kartu Keluarga\n2. Surat Pengantar RT/RW\n3. Pas foto 3x4 (2 lembar)",
    procedure:
      "1. Mengajukan permohonan ke RT/RW\n2. Mengisi formulir di kantor desa\n3. Melampirkan persyaratan\n4. Menunggu proses pembuatan\n5. Pengambilan KTP",
    is_active: true,
  },
  {
    id: 2,
    service_name: "Pembuatan Akta Kelahiran",
    description: "Layanan pembuatan Akta Kelahiran untuk warga desa.",
    requirements:
      "1. Surat Keterangan Lahir dari Bidan/Rumah Sakit\n2. Fotokopi KTP Orang Tua\n3. Fotokopi Kartu Keluarga\n4. Fotokopi Buku Nikah/Akta Perkawinan",
    procedure:
      "1. Mengajukan permohonan ke RT/RW\n2. Mengisi formulir di kantor desa\n3. Melampirkan persyaratan\n4. Menunggu proses pembuatan\n5. Pengambilan Akta Kelahiran",
    is_active: true,
  },
  {
    id: 3,
    service_name: "Surat Keterangan Tidak Mampu",
    description: "Layanan pembuatan Surat Keterangan Tidak Mampu (SKTM) untuk warga desa.",
    requirements: "1. Fotokopi KTP\n2. Fotokopi Kartu Keluarga\n3. Surat Pengantar RT/RW",
    procedure:
      "1. Mengajukan permohonan ke RT/RW\n2. Mengisi formulir di kantor desa\n3. Melampirkan persyaratan\n4. Menunggu proses pembuatan\n5. Pengambilan SKTM",
    is_active: true,
  },
]

let websiteSettings: WebsiteSettings = {
  village_name: "Desa Sukamaju",
  village_tagline: "Bersatu untuk Maju",
  village_description:
    "Desa Sukamaju adalah desa yang terletak di kecamatan Cianjur, Jawa Barat. Desa ini memiliki potensi pertanian dan pariwisata yang sangat baik.",
  village_address: "Jl. Raya Sukamaju No. 123, Kecamatan Cianjur, Jawa Barat",
  village_phone: "0812-3456-7890",
  village_email: "info@desasukamaju.desa.id",
  social_facebook: "https://facebook.com/desasukamaju",
  social_twitter: "https://twitter.com/desasukamaju",
  social_instagram: "https://instagram.com/desasukamaju",
  logo_url: "/placeholder.svg?height=100&width=100",
  theme_color: "#4CAF50",
}

// CRUD functions for website content
export function getWebsiteContent(): WebsiteContent[] {
  return [...websiteContent]
}

export function getWebsiteContentById(id: number): WebsiteContent | undefined {
  return websiteContent.find((content) => content.id === id)
}

export function addWebsiteContent(content: WebsiteContent): void {
  websiteContent.push(content)
}

export function updateWebsiteContent(updatedContent: WebsiteContent): void {
  const index = websiteContent.findIndex((content) => content.id === updatedContent.id)
  if (index !== -1) {
    websiteContent[index] = updatedContent
  }
}

export function deleteWebsiteContent(id: number): void {
  websiteContent = websiteContent.filter((content) => content.id !== id)
}

// CRUD functions for village news
export function getVillageNews(): VillageNews[] {
  return [...villageNews]
}

export function getVillageNewsById(id: number): VillageNews | undefined {
  return villageNews.find((news) => news.id === id)
}

export function addVillageNews(news: VillageNews): void {
  villageNews.push(news)
}

export function updateVillageNews(updatedNews: VillageNews): void {
  const index = villageNews.findIndex((news) => news.id === updatedNews.id)
  if (index !== -1) {
    villageNews[index] = updatedNews
  }
}

export function deleteVillageNews(id: number): void {
  villageNews = villageNews.filter((news) => news.id !== id)
}

// CRUD functions for village services
export function getVillageServices(): VillageService[] {
  return [...villageServices]
}

export function getVillageServiceById(id: number): VillageService | undefined {
  return villageServices.find((service) => service.id === id)
}

export function addVillageService(service: VillageService): void {
  villageServices.push(service)
}

export function updateVillageService(updatedService: VillageService): void {
  const index = villageServices.findIndex((service) => service.id === updatedService.id)
  if (index !== -1) {
    villageServices[index] = updatedService
  }
}

export function deleteVillageService(id: number): void {
  villageServices = villageServices.filter((service) => service.id !== id)
}

// Functions for website settings
export function getWebsiteSettings(): WebsiteSettings {
  return { ...websiteSettings }
}

export function updateWebsiteSettings(updatedSettings: WebsiteSettings): void {
  websiteSettings = { ...updatedSettings }
}
