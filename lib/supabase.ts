import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Clean Database Types - hanya yang diperlukan
export interface Village {
  id: number
  nama: string
  kode_pos?: string
  kecamatan?: string
  kabupaten?: string
  provinsi?: string
  status: "aktif" | "nonaktif"
  created_at: string
  updated_at: string
}

export interface User {
  id: number
  username: string
  email: string
  password: string
  role: "super_admin" | "admin_desa" | "perangkat_desa"
  status: "aktif" | "nonaktif"
  village_id?: number
  created_at: string
  updated_at: string
}

export interface Citizen {
  id: number
  village_id: number
  nik: string
  no_kk?: string
  nama: string
  tanggal_lahir: string
  alamat?: string
  no_telepon?: string
  created_at: string
  updated_at: string
}

export interface LetterRequest {
  id: number
  village_id: number
  citizen_id: number
  jenis_surat: string
  tujuan_permohonan: string
  status: "pending" | "diproses" | "selesai" | "ditolak"
  catatan?: string
  processed_by?: number
  processed_at?: string
  created_at: string
  updated_at: string
}

export interface VillageNews {
  id: number
  village_id: number
  title: string
  content: string
  image_url?: string
  status: "draft" | "published"
  created_by?: number
  created_at: string
  updated_at: string
}

export interface VillageService {
  id: number
  village_id: number
  nama_layanan: string
  deskripsi?: string
  persyaratan?: string
  is_active: boolean
  created_by?: number
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
