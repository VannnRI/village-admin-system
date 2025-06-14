import { supabase, type Citizen } from "./supabase"
import type { User } from "./supabase"

export interface LoginCredentials {
  username: string
  password: string
}

export interface AuthUser {
  id: number
  username: string
  email?: string
  role: User["role"]
  status: string
  village_id?: number | null // village_id bisa null untuk super_admin
  citizen_details?: Citizen
}

export async function login(credentials: LoginCredentials): Promise<AuthUser | null> {
  try {
    console.log("Attempting login for:", credentials.username)

    const { data: user, error } = await supabase.from("users").select("*").eq("username", credentials.username).single()

    if (error) {
      console.error("Supabase user query error:", error)
      if (error.code === "PGRST116") {
        // "PGRST116" means no rows found
        console.log("User not found:", credentials.username)
        return null
      }
      // For other errors, it's a more generic database issue
      throw new Error(`Database error: ${error.message}. Pastikan tabel 'users' ada dan bisa diakses.`)
    }

    if (!user) {
      console.log("No user data returned for:", credentials.username)
      return null
    }

    console.log(
      "User found in DB:",
      user.username,
      "Role:",
      user.role,
      "Status:",
      user.status,
      "DB Password:",
      user.password ? "****" : "NULL",
    )

    // IMPORTANT: This assumes plain text passwords are stored in the database.
    // This is NOT secure for a production environment.
    // For a real application, use password hashing (e.g., bcrypt).
    if (user.password !== credentials.password) {
      console.log("Invalid password for user:", user.username)
      return null
    }

    if (user.status !== "aktif") {
      console.log("User is not active:", user.username, "Status:", user.status)
      return null
    }

    console.log("Login successful for:", user.username)
    await logActivity(user.id, `User ${user.username} logged in`)

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role as User["role"],
      status: user.status,
      village_id: user.village_id, // Ensure this is correctly selected and passed
    }
  } catch (err: any) {
    console.error("Login function error:", err)
    // Check if it's a Supabase specific error or a general one
    if (err.message.includes("fetch")) {
      throw new Error(
        `Network error or Supabase service unavailable. Periksa koneksi internet dan status Supabase. Detail: ${err.message}`,
      )
    }
    throw err // Re-throw other errors
  }
}

export async function loginCitizen(nik: string, tanggalLahir: string): Promise<AuthUser | null> {
  try {
    console.log("Attempting citizen login with NIK:", nik, "Tanggal Lahir:", tanggalLahir)

    const { data: citizen, error } = await supabase
      .from("citizens")
      .select("*, villages (nama)") // Fetch village name too
      .eq("nik", nik)
      .single()

    if (error) {
      console.error("Supabase citizen query error:", error)
      if (error.code === "PGRST116") {
        console.log("Citizen not found for NIK:", nik)
        return null
      }
      throw new Error(`Database error: ${error.message}. Pastikan tabel 'citizens' ada.`)
    }

    if (!citizen) {
      console.log("No citizen data returned for NIK:", nik)
      return null
    }

    // Ensure tanggalLahir from input and DB are in YYYY-MM-DD format for comparison
    if (citizen.tanggal_lahir !== tanggalLahir) {
      console.log(`Invalid birth date for NIK ${nik}. Expected: ${citizen.tanggal_lahir}, Got: ${tanggalLahir}`)
      return null
    }

    console.log("Citizen login successful for:", citizen.nama)
    await logActivity(null, `Citizen ${citizen.nama} (NIK: ${nik}) logged in from village ID ${citizen.village_id}`)

    return {
      id: citizen.id,
      username: citizen.nik,
      email: `${citizen.nik}@citizen.desa.id`,
      role: "masyarakat",
      status: "aktif",
      village_id: citizen.village_id,
      citizen_details: citizen as Citizen,
    }
  } catch (err: any) {
    console.error("Citizen login function error:", err)
    if (err.message.includes("fetch")) {
      throw new Error(`Network error or Supabase service unavailable. Detail: ${err.message}`)
    }
    throw err
  }
}

export async function logActivity(userId: number | null, action: string, details?: string) {
  try {
    const { error } = await supabase.from("activity_logs").insert({
      user_id: userId,
      action,
      details,
      ip_address: "127.0.0.1", // Placeholder
    })
    if (error) {
      console.warn("Failed to log activity:", error.message)
    }
  } catch (err: any) {
    console.warn("Error in logActivity:", err.message)
  }
}
