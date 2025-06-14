import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Type definitions based on actual database structure
export interface User {
  id: number
  username: string
  email: string
  password: string // Plain text password (not secure for production)
  role: "super_admin" | "admin_desa" | "perangkat_desa" | "masyarakat"
  status: string
  village_id?: number
  created_at?: string
  updated_at?: string
}

export interface Village {
  id: number
  name: string
  kecamatan: string
  kabupaten: string
  provinsi: string
  kode_pos?: string
  kepala_desa?: string
  created_at?: string
  updated_at?: string
}

export interface Citizen {
  id: number
  nama: string
  nik: string
  alamat: string
  no_telepon?: string
  tanggal_lahir: string
  village_id: number
  created_at?: string
  updated_at?: string
}

// We'll define LetterRequest interface once we see the actual structure
export interface LetterRequest {
  id: number
  citizen_id: number
  village_id: number
  status: "pending" | "approved" | "rejected"
  created_at?: string
  updated_at?: string
  [key: string]: any // Allow additional properties
}
