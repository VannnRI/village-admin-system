import { supabase } from "./supabase"

export interface LetterRequest {
  id: number
  citizen_id: number
  village_id: number
  letter_type: string
  purpose: string
  status: "pending" | "approved" | "rejected"
  request_date: string
  approved_date?: string
  approved_by?: number
  notes?: string
  citizen?: {
    nama: string
    nik: string
    alamat: string
    no_telepon?: string
  }
}

export async function getLetterRequests(villageId: number): Promise<LetterRequest[]> {
  try {
    console.log("🔍 Fetching letter requests for village:", villageId)

    // Use a simpler query approach to avoid relation issues
    const { data: letterRequests, error: letterError } = await supabase
      .from("letter_requests")
      .select("*")
      .eq("village_id", villageId)
      .order("request_date", { ascending: false })

    if (letterError) {
      console.error("❌ Error fetching letter requests:", letterError)
      throw letterError
    }

    if (!letterRequests || letterRequests.length === 0) {
      console.log("📝 No letter requests found for village:", villageId)
      return []
    }

    console.log("✅ Found letter requests:", letterRequests.length)

    // Fetch citizen data separately to avoid relation issues
    const citizenIds = letterRequests.map((lr) => lr.citizen_id)
    const { data: citizens, error: citizenError } = await supabase
      .from("citizens")
      .select("id, nama, nik, alamat, no_telepon")
      .in("id", citizenIds)

    if (citizenError) {
      console.error("❌ Error fetching citizens:", citizenError)
      // Continue without citizen data rather than failing completely
    }

    // Combine the data manually
    const combinedData: LetterRequest[] = letterRequests.map((lr) => ({
      ...lr,
      citizen: citizens?.find((c) => c.id === lr.citizen_id) || {
        nama: "Data tidak tersedia",
        nik: "-",
        alamat: "-",
      },
    }))

    console.log("✅ Letter requests with citizen data:", combinedData)
    return combinedData
  } catch (error) {
    console.error("❌ Error in getLetterRequests:", error)
    // Return empty array instead of throwing to prevent UI crashes
    return []
  }
}

export async function updateLetterStatus(
  letterId: number,
  status: "approved" | "rejected",
  approvedBy: number,
  notes?: string,
): Promise<boolean> {
  try {
    console.log("🔄 Updating letter status:", { letterId, status, approvedBy })

    const updateData: any = {
      status,
      approved_by: approvedBy,
      approved_date: new Date().toISOString(),
    }

    if (notes) {
      updateData.notes = notes
    }

    const { error } = await supabase.from("letter_requests").update(updateData).eq("id", letterId)

    if (error) {
      console.error("❌ Error updating letter status:", error)
      throw error
    }

    console.log("✅ Letter status updated successfully")
    return true
  } catch (error) {
    console.error("❌ Error in updateLetterStatus:", error)
    return false
  }
}

// Get letter statistics for dashboard
export async function getLetterStats(villageId: number) {
  try {
    console.log("📊 Fetching letter statistics for village:", villageId)

    const { data, error } = await supabase.from("letter_requests").select("status").eq("village_id", villageId)

    if (error) {
      console.error("❌ Error fetching letter stats:", error)
      return {
        total: 0,
        pending: 0,
        approved: 0,
        rejected: 0,
      }
    }

    const stats = {
      total: data?.length || 0,
      pending: data?.filter((item) => item.status === "pending").length || 0,
      approved: data?.filter((item) => item.status === "approved").length || 0,
      rejected: data?.filter((item) => item.status === "rejected").length || 0,
    }

    console.log("✅ Letter statistics:", stats)
    return stats
  } catch (error) {
    console.error("❌ Error in getLetterStats:", error)
    return {
      total: 0,
      pending: 0,
      approved: 0,
      rejected: 0,
    }
  }
}
