import { supabase } from "./supabase"

export interface AuthUser {
  id: number
  username: string
  email: string
  role: "super_admin" | "admin_desa" | "perangkat_desa" | "masyarakat"
  village_id?: number | null
}

export interface LoginCredentials {
  username: string
  password: string
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

    // Simple password check
    if (user.password !== credentials.password) {
      return null
    }

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      village_id: user.village_id,
    }
  } catch (error) {
    console.error("Login error:", error)
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
