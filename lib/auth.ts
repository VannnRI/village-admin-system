import { supabase } from "./supabase"

export interface LoginCredentials {
  username: string
  password: string
}

export interface AuthUser {
  id: number
  username: string
  email: string
  role: string
  status: string
}

export async function login(credentials: LoginCredentials): Promise<AuthUser | null> {
  try {
    console.log("🔍 Attempting login with:", credentials.username)

    // First check if tables exist
    const { data: tableCheck, error: tableError } = await supabase.from("users").select("count").limit(1)

    if (tableError) {
      console.error("❌ Table check failed:", tableError)
      if (tableError.message.includes("does not exist")) {
        throw new Error("Database not set up. Please run the setup script first.")
      }
      throw new Error(`Database error: ${tableError.message}`)
    }

    console.log("✅ Tables exist, proceeding with login")

    // Now try to find user
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

    // For demo purposes, accept 'admin' as password for all accounts
    const isValidPassword = credentials.password === "admin"

    if (!isValidPassword) {
      console.log("❌ Invalid password")
      return null
    }

    // Check if user is active
    if (user.status !== "aktif") {
      console.log("❌ User is not active:", user.status)
      return null
    }

    console.log("✅ Login successful for:", user.username)

    // Log activity (don't fail login if this fails)
    try {
      await logActivity(user.id, `User ${user.username} logged in`)
    } catch (logError) {
      console.warn("⚠️ Failed to log activity:", logError)
    }

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      status: user.status,
    }
  } catch (error) {
    console.error("💥 Login error:", error)
    throw error
  }
}

export async function loginCitizen(nik: string, tanggalLahir: string): Promise<AuthUser | null> {
  try {
    console.log("🔍 Attempting citizen login with NIK:", nik)

    // Check if tables exist
    const { data: tableCheck, error: tableError } = await supabase.from("citizens").select("count").limit(1)

    if (tableError) {
      console.error("❌ Citizens table check failed:", tableError)
      if (tableError.message.includes("does not exist")) {
        throw new Error("Database not set up. Please run the setup script first.")
      }
      throw new Error(`Database error: ${tableError.message}`)
    }

    const { data: citizen, error } = await supabase.from("citizens").select("*").eq("nik", nik).single()

    if (error) {
      console.error("❌ Citizen query error:", error)
      if (error.code === "PGRST116") {
        console.log("❌ Citizen not found")
        return null
      }
      throw new Error(`Database error: ${error.message}`)
    }

    if (!citizen) {
      console.log("❌ No citizen data returned")
      return null
    }

    // Check if birth date matches (format: YYYY-MM-DD)
    const isValidDate = citizen.tanggal_lahir === tanggalLahir

    if (!isValidDate) {
      console.log("❌ Invalid birth date")
      return null
    }

    console.log("✅ Citizen login successful for:", citizen.nama)

    // Log activity (don't fail login if this fails)
    try {
      await logActivity(null, `Citizen ${citizen.nama} (NIK: ${nik}) logged in`)
    } catch (logError) {
      console.warn("⚠️ Failed to log activity:", logError)
    }

    return {
      id: citizen.id,
      username: citizen.nik,
      email: `${citizen.nik}@citizen.local`,
      role: "masyarakat",
      status: "aktif",
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
      ip_address: "127.0.0.1",
    })
  } catch (error) {
    console.error("Error logging activity:", error)
    // Don't throw error for logging failures
  }
}
