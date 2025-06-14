import { supabase } from "./supabase"

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

export async function login(credentials: { username: string; password: string }): Promise<AuthUser | null> {
  try {
    console.log("🔐 Attempting login for username:", credentials.username)

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
    // In production, you should use bcrypt to compare with password_hash
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
      username: citizen.nik, // Use NIK as username for citizens
      email: `${citizen.nik}@citizen.local`, // Dummy email
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

export function logout(): void {
  localStorage.removeItem("user")
  window.location.href = "/"
}

export function getCurrentUser(): AuthUser | null {
  try {
    const userData = localStorage.getItem("user")
    if (!userData) return null

    const user = JSON.parse(userData)
    return user
  } catch (error) {
    console.error("Error getting current user:", error)
    return null
  }
}

export function saveUserSession(user: AuthUser): void {
  localStorage.setItem("user", JSON.stringify(user))
}
