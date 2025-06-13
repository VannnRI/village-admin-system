import { createClient } from "@supabase/supabase-js"

// Test connection function
export async function testSupabaseConnection() {
  try {
    console.log("Testing Supabase connection...")
    console.log("URL:", process.env.NEXT_PUBLIC_SUPABASE_URL)
    console.log("Key:", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "Key exists" : "Key missing")

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      throw new Error("Missing Supabase environment variables")
    }

    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

    // Test basic connection
    const { data, error } = await supabase.from("users").select("count").limit(1)

    if (error) {
      console.error("Supabase connection error:", error)
      return { success: false, error: error.message }
    }

    console.log("Supabase connection successful!")
    return { success: true, data }
  } catch (error) {
    console.error("Connection test failed:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}
