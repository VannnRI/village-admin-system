import { supabase } from "./supabase"
import type { Citizen } from "./supabase"

export interface LoginCredentials {
  username: string
  password: string
}

export interface CitizenLoginCredentials {
  nik: string
  tanggalLahir: string
}

export interface AuthUser {
  id: number
  username: string
  email?: string
  role: "super_admin" | "admin_desa" | "perangkat_desa" | "masyarakat"
  status: string
  village_id?: number
  citizen_details?: Citizen
}

// Login untuk admin
export async function login(credentials: LoginCredentials): Promise<AuthUser | null> {
  try {
    console.log("🔍 Attempting login for:", credentials.username)

    const { data: user, error } = await supabase.from("users").select("*").eq("username", credentials.username).single()

    if (error || !user) {
      console.log("❌ User not found or error:", error?.message)
      return null
    }

    if (user.password !== credentials.password) {
      console.log("❌ Invalid password")
      return null
    }

    if (user.status !== "aktif") {
      console.log("❌ User not active")
      return null
    }

    console.log("✅ Login successful for:", user.username)
    await logActivity(user.id, `User ${user.username} logged in`)

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      status: user.status,
      village_id: user.village_id,
    }
  } catch (error) {
    console.error("💥 Login error:", error)
    throw error
  }
}

// Login untuk masyarakat
export async function loginCitizen(credentials: CitizenLoginCredentials): Promise<AuthUser | null> {
  try {
    console.log("🔍 Attempting citizen login with NIK:", credentials.nik)

    const { data: citizen, error } = await supabase.from("citizens").select("*").eq("nik", credentials.nik).single()

    if (error || !citizen) {
      console.log("❌ Citizen not found or error:", error?.message)
      return null
    }

    if (citizen.tanggal_lahir !== credentials.tanggalLahir) {
      console.log("❌ Invalid birth date")
      return null
    }

    console.log("✅ Citizen login successful for:", citizen.nama)
    await logActivity(null, `Citizen ${citizen.nama} (NIK: ${credentials.nik}) logged in`)

    return {
      id: citizen.id,
      username: citizen.nik,
      email: `${citizen.nik}@citizen.desa.id`,
      role: "masyarakat",
      status: "aktif",
      village_id: citizen.village_id,
      citizen_details: citizen,
    }
  } catch (error) {
    console.error("💥 Citizen login error:", error)
    throw error
  }
}

export async function logActivity(userId: number | null, action: string) {
  try {
    await supabase.from("activity_logs").insert({
      user_id: userId,
      action,
      ip_address: "127.0.0.1",
    })
  } catch (error) {
    console.warn("Failed to log activity:", error)
  }
}
