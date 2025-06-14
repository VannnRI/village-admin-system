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

export interface LoginCredentials {
  username: string
  password: string
}

export interface CitizenLoginCredentials {
  nik: string
  tanggalLahir: string
}

export async function login(credentials: LoginCredentials): Promise<AuthUser | null> {
  try {
    const { data: users, error } = await supabase
      .from("users")
      .select("*")
      .eq("username", credentials.username)
      .eq("status", "aktif")

    if (error || !users || users.length === 0) {
      return null
    }

    const user = users[0]

    // Simple password check - accept "admin" for demo
    if (credentials.password !== "admin") {
      return null
    }

    // Get village_id for admin_desa
    let village_id = null
    if (user.role === "admin_desa") {
      const { data: village } = await supabase.from("villages").select("id").eq("admin_id", user.id).single()
      village_id = village?.id || null
    }

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      village_id: village_id,
    }
  } catch (error) {
    console.error("Login error:", error)
    return null
  }
}

export async function loginCitizen(credentials: CitizenLoginCredentials): Promise<AuthUser | null> {
  try {
    const { data: citizens, error } = await supabase
      .from("citizens")
      .select("*")
      .eq("nik", credentials.nik)
      .eq("tanggal_lahir", credentials.tanggalLahir)

    if (error || !citizens || citizens.length === 0) {
      return null
    }

    const citizen = citizens[0]

    return {
      id: citizen.id,
      username: citizen.nik,
      email: `${citizen.nik}@citizen.local`,
      role: "masyarakat",
      village_id: citizen.village_id,
      citizen_details: citizen,
    }
  } catch (error) {
    console.error("Citizen login error:", error)
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
    return JSON.parse(userData)
  } catch (error) {
    return null
  }
}

export function saveUserSession(user: AuthUser): void {
  localStorage.setItem("user", JSON.stringify(user))
}
