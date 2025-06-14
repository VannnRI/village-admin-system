import { supabase, type Citizen } from "./supabase" // Added Citizen type
import type { User } from "./supabase"

export interface LoginCredentials {
  username: string
  password: string
}

export interface AuthUser {
  id: number // Can be user.id or citizen.id
  username: string // user.username or citizen.nik
  email?: string // user.email or constructed for citizen
  role: User["role"] // Use the updated role type
  status: string
  village_id?: number // Add village_id if user is admin_desa or perangkat_desa
  citizen_details?: Citizen // Store full citizen details on citizen login
}

export async function login(credentials: LoginCredentials): Promise<AuthUser | null> {
  try {
    console.log("🔍 Attempting login with:", credentials.username)

    const { data: user, error } = await supabase.from("users").select("*").eq("username", credentials.username).single()

    if (error) {
      console.error("❌ User query error:", error)
      if (error.code === "PGRST116") {
        console.log("❌ User not found")
        return null
      }
      throw new Error(`Database error: ${error.message}`)
    }

    if (!user) {
      console.log("❌ No user data returned")
      return null
    }

    console.log("👤 User found:", user.username, user.role, user.status)

    const isValidPassword = credentials.password === user.password // Assuming plain text password 'admin' or actual hash check

    if (!isValidPassword) {
      console.log("❌ Invalid password")
      return null
    }

    if (user.status !== "aktif") {
      console.log("❌ User is not active:", user.status)
      return null
    }

    console.log("✅ Login successful for:", user.username)
    await logActivity(user.id, `User ${user.username} logged in`)

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role as User["role"],
      status: user.status,
      village_id: user.village_id,
    }
  } catch (error) {
    console.error("💥 Login error:", error)
    throw error
  }
}

export async function loginCitizen(nik: string, tanggalLahir: string): Promise<AuthUser | null> {
  try {
    console.log("🔍 Attempting citizen login with NIK:", nik, "Tanggal Lahir:", tanggalLahir)

    const { data: citizen, error } = await supabase.from("citizens").select("*").eq("nik", nik).single()

    if (error) {
      console.error("❌ Citizen query error:", error)
      if (error.code === "PGRST116") {
        console.log("❌ Citizen not found for NIK:", nik)
        return null
      }
      throw new Error(`Database error: ${error.message}`)
    }

    if (!citizen) {
      console.log("❌ No citizen data returned for NIK:", nik)
      return null
    }

    // Validate birth date (ensure format matches YYYY-MM-DD)
    // The input tanggalLahir should also be in YYYY-MM-DD format for direct comparison
    if (citizen.tanggal_lahir !== tanggalLahir) {
      console.log(`❌ Invalid birth date. Expected: ${citizen.tanggal_lahir}, Got: ${tanggalLahir}`)
      return null
    }

    console.log("✅ Citizen login successful for:", citizen.nama)
    await logActivity(null, `Citizen ${citizen.nama} (NIK: ${nik}) logged in`)

    return {
      id: citizen.id, // This is citizen.id from citizens table
      username: citizen.nik,
      email: `${citizen.nik}@citizen.desa.id`, // Placeholder email
      role: "masyarakat",
      status: "aktif", // Citizens are implicitly active if found
      village_id: citizen.village_id,
      citizen_details: citizen as Citizen, // Store full citizen details
    }
  } catch (error) {
    console.error("💥 Citizen login error:", error)
    throw error
  }
}

export async function logActivity(userId: number | null, action: string, details?: string) {
  try {
    await supabase.from("activity_logs").insert({
      user_id: userId,
      action,
      details,
      ip_address: "127.0.0.1", // Placeholder IP
    })
  } catch (error) {
    console.error("Error logging activity:", error)
  }
}
