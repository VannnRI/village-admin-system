import { supabase } from "./supabase"

// Types
export interface WebsiteContent {
  id: number
  village_id: number
  section_name: string
  title: string
  content: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface VillageNews {
  id: number
  village_id: number
  title: string
  content: string
  image_url?: string
  status: "published" | "draft"
  published_date: string
  author: string
  created_at: string
  updated_at: string
}

export interface VillageService {
  id: number
  village_id: number
  service_name: string
  description: string
  requirements: string
  procedure: string
  duration: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface WebsiteSettings {
  id: number
  village_id: number
  village_name: string
  village_tagline?: string
  village_description?: string
  village_address?: string
  village_phone?: string
  village_email?: string
  social_facebook?: string
  social_twitter?: string
  social_instagram?: string
  logo_url: string
  theme_color: string
  created_at: string
  updated_at: string
}

// Helper function to get village ID from admin username
async function getVillageIdFromAdmin(adminUsername: string): Promise<number | null> {
  try {
    const { data: admin, error: adminError } = await supabase
      .from("users")
      .select("id")
      .eq("username", adminUsername)
      .single()

    if (adminError || !admin) {
      throw new Error("Admin not found")
    }

    const { data: village, error: villageError } = await supabase
      .from("villages")
      .select("id")
      .eq("admin_id", admin.id)
      .single()

    if (villageError || !village) {
      throw new Error("Village not found")
    }

    return village.id
  } catch (error) {
    console.error("Error getting village ID:", error)
    return null
  }
}

// Website Content Functions
export async function getWebsiteContent(adminUsername: string): Promise<WebsiteContent[]> {
  try {
    const villageId = await getVillageIdFromAdmin(adminUsername)
    if (!villageId) return []

    const { data, error } = await supabase
      .from("website_content")
      .select("*")
      .eq("village_id", villageId)
      .order("section_name", { ascending: true })

    if (error) {
      console.error("Error fetching website content:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error getting website content:", error)
    return []
  }
}

export async function addWebsiteContent(
  adminUsername: string,
  content: Omit<WebsiteContent, "id" | "village_id" | "created_at" | "updated_at">,
): Promise<WebsiteContent | null> {
  try {
    const villageId = await getVillageIdFromAdmin(adminUsername)
    if (!villageId) throw new Error("Village not found")

    const { data, error } = await supabase
      .from("website_content")
      .insert({
        ...content,
        village_id: villageId,
      })
      .select()
      .single()

    if (error) {
      throw new Error(error.message)
    }

    return data
  } catch (error) {
    console.error("Error adding website content:", error)
    throw error
  }
}

export async function updateWebsiteContent(
  contentId: number,
  updates: Partial<WebsiteContent>,
): Promise<WebsiteContent | null> {
  try {
    const { data, error } = await supabase
      .from("website_content")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", contentId)
      .select()
      .single()

    if (error) {
      throw new Error(error.message)
    }

    return data
  } catch (error) {
    console.error("Error updating website content:", error)
    throw error
  }
}

export async function deleteWebsiteContent(contentId: number): Promise<boolean> {
  try {
    const { error } = await supabase.from("website_content").delete().eq("id", contentId)

    if (error) {
      throw new Error(error.message)
    }

    return true
  } catch (error) {
    console.error("Error deleting website content:", error)
    throw error
  }
}

// Village News Functions
export async function getVillageNews(adminUsername: string): Promise<VillageNews[]> {
  try {
    const villageId = await getVillageIdFromAdmin(adminUsername)
    if (!villageId) return []

    const { data, error } = await supabase
      .from("village_news")
      .select("*")
      .eq("village_id", villageId)
      .order("published_date", { ascending: false })

    if (error) {
      console.error("Error fetching village news:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error getting village news:", error)
    return []
  }
}

export async function addVillageNews(
  adminUsername: string,
  news: Omit<VillageNews, "id" | "village_id" | "created_at" | "updated_at">,
): Promise<VillageNews | null> {
  try {
    const villageId = await getVillageIdFromAdmin(adminUsername)
    if (!villageId) throw new Error("Village not found")

    const { data, error } = await supabase
      .from("village_news")
      .insert({
        ...news,
        village_id: villageId,
        image_url: news.image_url || "/placeholder.svg?height=200&width=300",
      })
      .select()
      .single()

    if (error) {
      throw new Error(error.message)
    }

    return data
  } catch (error) {
    console.error("Error adding village news:", error)
    throw error
  }
}

export async function updateVillageNews(newsId: number, updates: Partial<VillageNews>): Promise<VillageNews | null> {
  try {
    const { data, error } = await supabase
      .from("village_news")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", newsId)
      .select()
      .single()

    if (error) {
      throw new Error(error.message)
    }

    return data
  } catch (error) {
    console.error("Error updating village news:", error)
    throw error
  }
}

export async function deleteVillageNews(newsId: number): Promise<boolean> {
  try {
    const { error } = await supabase.from("village_news").delete().eq("id", newsId)

    if (error) {
      throw new Error(error.message)
    }

    return true
  } catch (error) {
    console.error("Error deleting village news:", error)
    throw error
  }
}

// Village Services Functions
export async function getVillageServices(adminUsername: string): Promise<VillageService[]> {
  try {
    const villageId = await getVillageIdFromAdmin(adminUsername)
    if (!villageId) return []

    const { data, error } = await supabase
      .from("village_services")
      .select("*")
      .eq("village_id", villageId)
      .order("service_name", { ascending: true })

    if (error) {
      console.error("Error fetching village services:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error getting village services:", error)
    return []
  }
}

export async function addVillageService(
  adminUsername: string,
  service: Omit<VillageService, "id" | "village_id" | "created_at" | "updated_at">,
): Promise<VillageService | null> {
  try {
    const villageId = await getVillageIdFromAdmin(adminUsername)
    if (!villageId) throw new Error("Village not found")

    const { data, error } = await supabase
      .from("village_services")
      .insert({
        ...service,
        village_id: villageId,
      })
      .select()
      .single()

    if (error) {
      throw new Error(error.message)
    }

    return data
  } catch (error) {
    console.error("Error adding village service:", error)
    throw error
  }
}

export async function updateVillageService(
  serviceId: number,
  updates: Partial<VillageService>,
): Promise<VillageService | null> {
  try {
    const { data, error } = await supabase
      .from("village_services")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", serviceId)
      .select()
      .single()

    if (error) {
      throw new Error(error.message)
    }

    return data
  } catch (error) {
    console.error("Error updating village service:", error)
    throw error
  }
}

export async function deleteVillageService(serviceId: number): Promise<boolean> {
  try {
    const { error } = await supabase.from("village_services").delete().eq("id", serviceId)

    if (error) {
      throw new Error(error.message)
    }

    return true
  } catch (error) {
    console.error("Error deleting village service:", error)
    throw error
  }
}

// Website Settings Functions
export async function getWebsiteSettings(adminUsername: string): Promise<WebsiteSettings | null> {
  try {
    const villageId = await getVillageIdFromAdmin(adminUsername)
    if (!villageId) return null

    const { data, error } = await supabase.from("website_settings").select("*").eq("village_id", villageId).single()

    if (error) {
      console.error("Error fetching website settings:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Error getting website settings:", error)
    return null
  }
}

export async function updateWebsiteSettings(
  adminUsername: string,
  settings: Partial<WebsiteSettings>,
): Promise<WebsiteSettings | null> {
  try {
    const villageId = await getVillageIdFromAdmin(adminUsername)
    if (!villageId) throw new Error("Village not found")

    const { data, error } = await supabase
      .from("website_settings")
      .upsert({
        ...settings,
        village_id: villageId,
        updated_at: new Date().toISOString(),
      })
      .eq("village_id", villageId)
      .select()
      .single()

    if (error) {
      throw new Error(error.message)
    }

    return data
  } catch (error) {
    console.error("Error updating website settings:", error)
    throw error
  }
}

// Public functions for website display (by village ID)
export async function getPublicWebsiteContent(villageId: number): Promise<WebsiteContent[]> {
  try {
    const { data, error } = await supabase
      .from("website_content")
      .select("*")
      .eq("village_id", villageId)
      .eq("is_active", true)
      .order("section_name", { ascending: true })

    if (error) {
      console.error("Error fetching public website content:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error getting public website content:", error)
    return []
  }
}

export async function getPublicVillageNews(villageId: number, limit?: number): Promise<VillageNews[]> {
  try {
    let query = supabase
      .from("village_news")
      .select("*")
      .eq("village_id", villageId)
      .eq("status", "published")
      .order("published_date", { ascending: false })

    if (limit) {
      query = query.limit(limit)
    }

    const { data, error } = await query

    if (error) {
      console.error("Error fetching public village news:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error getting public village news:", error)
    return []
  }
}

export async function getPublicVillageServices(villageId: number): Promise<VillageService[]> {
  try {
    const { data, error } = await supabase
      .from("village_services")
      .select("*")
      .eq("village_id", villageId)
      .eq("is_active", true)
      .order("service_name", { ascending: true })

    if (error) {
      console.error("Error fetching public village services:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error getting public village services:", error)
    return []
  }
}

export async function getPublicWebsiteSettings(villageId: number): Promise<WebsiteSettings | null> {
  try {
    const { data, error } = await supabase.from("website_settings").select("*").eq("village_id", villageId).single()

    if (error) {
      console.error("Error fetching public website settings:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Error getting public website settings:", error)
    return null
  }
}
