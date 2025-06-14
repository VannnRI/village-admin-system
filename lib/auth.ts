import { supabase } from "./supabase"

export interface User {
  id: number
  username: string
  email: string
  role: "super_admin" | "admin_desa" | "perangkat_desa" | "masyarakat"
  village_id?: number
  village_name?: string
}

export async function login(username: string, password: string): Promise<User | null> {
  try {
    // For admin users (username/password login)
    if (!username.match(/^\d{16}$/)) {
      const { data: users, error } = await supabase
        .from("users")
        .select(`
          id,
          username,
          email,
          role,
          villages!villages_admin_id_fkey(id, nama)
        `)
        .eq("username", username)
        .eq("password_hash", password) // Using password_hash from your database
        .single()

      if (error || !users) {
        console.error("Login error:", error)
        return null
      }

      return {
        id: users.id,
        username: users.username,
        email: users.email,
        role: users.role,
        village_id: users.villages?.id,
        village_name: users.villages?.nama,
      }
    }

    // For citizen login (NIK/birth date)
    const { data: citizen, error } = await supabase
      .from("citizens")
      .select(`
        id,
        nik,
        nama,
        tanggal_lahir,
        villages!citizens_village_id_fkey(id, nama)
      `)
      .eq("nik", username)
      .eq("tanggal_lahir", password)
      .single()

    if (error || !citizen) {
      console.error("Citizen login error:", error)
      return null
    }

    return {
      id: citizen.id,
      username: citizen.nik,
      email: `${citizen.nik}@citizen.local`,
      role: "masyarakat",
      village_id: citizen.villages.id,
      village_name: citizen.villages.nama,
    }
  } catch (error) {
    console.error("Login error:", error)
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
