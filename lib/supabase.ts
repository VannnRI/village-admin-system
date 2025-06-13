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
    persistSession: false,
  },
})

// Types
export interface User {
  id: number
  username: string
  email: string
  role: "super_admin" | "admin_desa" | "perangkat_desa" | "masyarakat"
  status: "aktif" | "nonaktif"
  created_at: string
  updated_at: string
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
  tanggal_lahir: string
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
