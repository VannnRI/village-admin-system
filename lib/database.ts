import { supabase, type User, type Village, type ActivityLog } from "./supabase"
import { logActivity } from "./auth"

// Users
export async function getUsers(): Promise<User[]> {
  const { data, error } = await supabase.from("users").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching users:", error)
    return []
  }

  return data || []
}

export async function createUser(userData: Omit<User, "id" | "created_at" | "updated_at">): Promise<User | null> {
  try {
    // Hash password (for demo, we'll use simple hashing)
    const passwordHash = "$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi" // 'admin'

    const { data, error } = await supabase
      .from("users")
      .insert({
        ...userData,
        password_hash: passwordHash,
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating user:", error)
      return null
    }

    await logActivity(null, `User ${userData.username} created`, `Role: ${userData.role}`)
    return data
  } catch (error) {
    console.error("Error creating user:", error)
    return null
  }
}

export async function updateUser(id: number, updates: Partial<User>): Promise<User | null> {
  try {
    const { data, error } = await supabase
      .from("users")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("Error updating user:", error)
      return null
    }

    await logActivity(null, `User ${data.username} updated`)
    return data
  } catch (error) {
    console.error("Error updating user:", error)
    return null
  }
}

export async function deleteUser(id: number): Promise<boolean> {
  try {
    // Get user info before deletion
    const { data: user } = await supabase.from("users").select("username").eq("id", id).single()

    const { error } = await supabase.from("users").delete().eq("id", id)

    if (error) {
      console.error("Error deleting user:", error)
      return false
    }

    await logActivity(null, `User ${user?.username} deleted`)
    return true
  } catch (error) {
    console.error("Error deleting user:", error)
    return false
  }
}

// Villages
export async function getVillages(): Promise<Village[]> {
  const { data, error } = await supabase
    .from("villages")
    .select(`
      *,
      admin:users(username),
      village_staff(
        user_id,
        position,
        user:users(username)
      )
    `)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching villages:", error)
    return []
  }

  return data || []
}

export async function createVillage(
  villageData: Omit<Village, "id" | "created_at" | "updated_at">,
): Promise<Village | null> {
  try {
    const { data, error } = await supabase.from("villages").insert(villageData).select().single()

    if (error) {
      console.error("Error creating village:", error)
      return null
    }

    await logActivity(null, `Village ${villageData.nama} created`)
    return data
  } catch (error) {
    console.error("Error creating village:", error)
    return null
  }
}

export async function updateVillage(id: number, updates: Partial<Village>): Promise<Village | null> {
  try {
    const { data, error } = await supabase
      .from("villages")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("Error updating village:", error)
      return null
    }

    await logActivity(null, `Village ${data.nama} updated`)
    return data
  } catch (error) {
    console.error("Error updating village:", error)
    return null
  }
}

export async function deleteVillage(id: number): Promise<boolean> {
  try {
    // Get village info before deletion
    const { data: village } = await supabase.from("villages").select("nama").eq("id", id).single()

    const { error } = await supabase.from("villages").delete().eq("id", id)

    if (error) {
      console.error("Error deleting village:", error)
      return false
    }

    await logActivity(null, `Village ${village?.nama} deleted`)
    return true
  } catch (error) {
    console.error("Error deleting village:", error)
    return false
  }
}

// Activity Logs
export async function getActivityLogs(limit = 10): Promise<ActivityLog[]> {
  const { data, error } = await supabase
    .from("activity_logs")
    .select(`
      *,
      user:users(username)
    `)
    .order("created_at", { ascending: false })
    .limit(limit)

  if (error) {
    console.error("Error fetching activity logs:", error)
    return []
  }

  return data || []
}

// Statistics
export async function getStats() {
  try {
    // Get villages count
    const { count: villagesCount } = await supabase
      .from("villages")
      .select("*", { count: "exact", head: true })
      .eq("status", "aktif")

    // Get admin count
    const { count: adminsCount } = await supabase
      .from("users")
      .select("*", { count: "exact", head: true })
      .eq("role", "admin_desa")
      .eq("status", "aktif")

    // Get perangkat count
    const { count: perangkatCount } = await supabase
      .from("users")
      .select("*", { count: "exact", head: true })
      .eq("role", "perangkat_desa")
      .eq("status", "aktif")

    // Get letters this month
    const currentMonth = new Date().toISOString().slice(0, 7) // YYYY-MM
    const { count: lettersCount } = await supabase
      .from("letter_requests")
      .select("*", { count: "exact", head: true })
      .gte("created_at", `${currentMonth}-01`)
      .lt("created_at", `${currentMonth}-32`)

    return {
      totalVillages: villagesCount || 0,
      totalAdmins: adminsCount || 0,
      totalPerangkat: perangkatCount || 0,
      totalLettersThisMonth: lettersCount || 0,
    }
  } catch (error) {
    console.error("Error getting stats:", error)
    return {
      totalVillages: 0,
      totalAdmins: 0,
      totalPerangkat: 0,
      totalLettersThisMonth: 0,
    }
  }
}
