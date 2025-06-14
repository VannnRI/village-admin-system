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
