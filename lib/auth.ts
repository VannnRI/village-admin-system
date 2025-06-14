import { supabase } from "./supabase"

export interface User {
  id: number
  username: string
  email: string
  role: "super_admin" | "admin_desa" | "perangkat_desa" | "masyarakat"
  village_id?: number
  village_name?: string
}

export interface LoginCredentials {
  username: string
  password: string
}

export interface AuthUser {
  id: number
  username: string
  email: string
  role: "super_admin" | "admin_desa" | "perangkat_desa" | "masyarakat"
  village_id?: number | null
  citizen_details?: {
    id: number
    nama: string
    nik: string
    alamat: string
    no_telepon?: string
    tanggal_lahir: string
    village_id: number
  }
}

export async function login(credentials: LoginCredentials): Promise<AuthUser | null> {
  try {
    console.log("🔐 Attempting login for username:", credentials.username)

    // Validate input
    if (!credentials.username || !credentials.password) {
      throw new Error("Username and password are required")
    }

    // Query users with password_hash (based on your database structure)
    const { data: users, error } = await supabase
      .from("users")
      .select("*")
      .eq("username", credentials.username)
      .eq("status", "aktif")

    if (error) {
      console.error("❌ Database error during login:", error)
      throw new Error("Database error")
    }

    if (!users || users.length === 0) {
      console.log("❌ User not found:", credentials.username)
      throw new Error("User not found")
    }

    const user = users[0]
    console.log("✅ User found:", user.username, "Role:", user.role)

    // For demo purposes, accept 'admin' as password for all accounts
    if (credentials.password !== "admin") {
      console.log("❌ Invalid password for user:", credentials.username)
      throw new Error("Invalid password")
    }

    console.log("✅ Password verified for user:", credentials.username)

    // Get village_id for admin_desa users
    let village_id = null
    if (user.role === "admin_desa") {
      const { data: village } = await supabase.from("villages").select("id").eq("admin_id", user.id).single()

      village_id = village?.id || null
      console.log("✅ Village ID for admin:", village_id)
    }

    const authUser: AuthUser = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      village_id: village_id,
    }

    console.log("✅ Login successful:", authUser)
    return authUser
  } catch (error) {
    console.error("❌ Login error:", error)
    return null
  }
}

export async function loginCitizen(credentials: { nik: string; tanggal_lahir: string }): Promise<AuthUser | null> {
  try {
    console.log("🔐 Attempting citizen login for NIK:", credentials.nik)

    // Validate input
    if (!credentials.nik || !credentials.tanggal_lahir) {
      throw new Error("NIK and birth date are required")
    }

    const { data: citizens, error } = await supabase
      .from("citizens")
      .select("*")
      .eq("nik", credentials.nik)
      .eq("tanggal_lahir", credentials.tanggal_lahir)

    if (error) {
      console.error("❌ Database error during citizen login:", error)
      throw new Error("Database error")
    }

    if (!citizens || citizens.length === 0) {
      console.log("❌ Citizen not found with NIK:", credentials.nik)
      throw new Error("Citizen not found")
    }

    const citizen = citizens[0]
    console.log("✅ Citizen found:", citizen.nama, "NIK:", citizen.nik)

    const authUser: AuthUser = {
      id: citizen.id,
      username: citizen.nik,
      email: `${citizen.nik}@citizen.local`,
      role: "masyarakat",
      village_id: citizen.village_id,
      citizen_details: citizen,
    }

    console.log("✅ Citizen login successful:", authUser)
    return authUser
  } catch (error) {
    console.error("❌ Citizen login error:", error)
    return null
  }
}

export async function getCurrentUser(): Promise<User | null> {
  if (typeof window === "undefined") return null

  const userStr = localStorage.getItem("currentUser")
  if (!userStr) return null

  try {
    return JSON.parse(userStr)
  } catch {
    return null
  }
}

export async function logout(): Promise<void> {
  if (typeof window !== "undefined") {
    localStorage.removeItem("currentUser")
  }
}
