import { createClient } from "@supabase/supabase-js"

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Validate environment variables
if (!supabaseUrl) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL environment variable")
}

if (!supabaseAnonKey) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable")
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false, // Consider changing this if you want session persistence
  },
})

// Types
export interface User {
  id: number
  username: string
  email: string
  role: "super_admin" | "admin_desa" | "perangkat_desa" | "masyarakat" // Updated roles
  status: "aktif" | "nonaktif"
  village_id?: number
  created_at: string
  updated_at: string
  created_by?: number
}

export interface Village {
  id: number
  nama: string
  kode_pos: string
  kecamatan: string
  kabupaten: string
  provinsi: string
  admin_id?: number
  status: "aktif" | "nonaktif"
  created_at: string
  updated_at: string
}

export interface Citizen {
  id: number
  village_id: number
  nik: string
  no_kk: string
  nama: string
  tanggal_lahir: string // Format YYYY-MM-DD
  alamat: string
  no_telepon?: string
  created_at: string
  updated_at: string
}

export interface LetterRequest {
  id: number
  village_id: number
  citizen_id: number
  jenis_surat: string
  no_surat?: string
  tujuan_permohonan: string
  status: "pending" | "approved" | "rejected"
  approved_by?: number
  approved_at?: string
  rejection_reason?: string
  file_path?: string
  created_at: string
  updated_at: string
}

export interface ActivityLog {
  id: number
  user_id?: number
  action: string
  details?: string
  ip_address?: string
  created_at: string
}

// Add types for new tables if any from script 05, 06, 08
export interface VillageRegulation {
  id: number
  village_id: number
  nomor_peraturan: string
  tentang: string
  tanggal_penetapan: string // Date
  file_path?: string
  status: "aktif" | "tidak_aktif"
  created_by?: number
  created_at: string // Timestamp
  updated_at: string // Timestamp
}

export interface VillageDecision {
  id: number
  village_id: number
  nomor_keputusan: string
  tentang: string
  tanggal_keputusan: string // Date
  file_path?: string
  status: "aktif" | "tidak_aktif"
  created_by?: number
  created_at: string // Timestamp
  updated_at: string // Timestamp
}

export interface VillageWebsiteContent {
  id: number
  village_id: number
  section: string
  title?: string
  content?: string
  image_url?: string
  is_published: boolean
  sort_order: number
  created_by?: number
  created_at: string // Timestamp
  updated_at: string // Timestamp
}

export interface VillageNews {
  id: number
  village_id: number
  title: string
  content: string
  excerpt?: string
  featured_image?: string
  status: "draft" | "published" | "archived" // Added from script 09
  is_published: boolean // This might be redundant if status is used
  published_at?: string // Timestamp
  created_by?: number
  created_at: string // Timestamp
  updated_at: string // Timestamp
}

export interface VillageService {
  id: number
  village_id: number
  nama_layanan: string
  deskripsi?: string
  persyaratan?: string
  waktu_pelayanan?: string
  biaya?: string
  is_active: boolean
  created_by?: number
  created_at: string // Timestamp
  updated_at: string // Timestamp
}

export interface VillageSetting {
  id: number
  village_id: number
  setting_key: string
  setting_value?: string
  setting_type: string
  description?: string
  updated_by?: number
  updated_at: string // Timestamp
}
