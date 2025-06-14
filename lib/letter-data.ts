import { supabase } from "./supabase"
import { getVillageInfo } from "./admin-desa-data"

export interface LetterRequest {
  id: number
  citizen_id: number
  village_id: number
  letter_type: string
  jenis_surat?: string
  purpose: string
  status: "pending" | "approved" | "rejected"
  request_date: string
  created_at?: string
  updated_at?: string
  approved_date?: string
  approved_by?: number
  rejection_reason?: string
  no_surat?: string
  notes?: string
  citizen?: {
    nama: string
    nik: string
    alamat: string
    no_telepon?: string
  }
}

export async function getLetterRequests(adminUsername: string): Promise<LetterRequest[]> {
  try {
    console.log("🔍 Getting village info for admin:", adminUsername)

    const villageInfo = await getVillageInfo(adminUsername)
    if (!villageInfo) {
      console.log("❌ Village not found for admin:", adminUsername)
      return []
    }

    console.log("✅ Village found:", villageInfo.name, "ID:", villageInfo.id)
    console.log("🔍 Fetching letter requests for village:", villageInfo.id)

    // Use a simpler query approach to avoid relation issues
    const { data: letterRequests, error: letterError } = await supabase
      .from("letter_requests")
      .select("*")
      .eq("village_id", villageInfo.id)
      .order("created_at", { ascending: false })

    if (letterError) {
      console.error("❌ Error fetching letter requests:", letterError)
      return []
    }

    if (!letterRequests || letterRequests.length === 0) {
      console.log("📝 No letter requests found for village:", villageInfo.id)
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
    return []
  }
}

export async function updateLetterStatus(
  letterId: number,
  status: "approved" | "rejected",
  approvedBy: number,
  rejectionReason?: string,
  letterNumber?: string,
): Promise<boolean> {
  try {
    console.log("🔄 Updating letter status:", { letterId, status, approvedBy })

    const updateData: any = {
      status,
      updated_at: new Date().toISOString(),
    }

    if (status === "approved") {
      updateData.approved_by = approvedBy
      updateData.approved_date = new Date().toISOString()
      if (letterNumber) {
        updateData.no_surat = letterNumber
      }
    } else if (status === "rejected") {
      updateData.rejection_reason = rejectionReason
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

export async function generateLetterNumber(jenisSurat: string, adminUsername: string): Promise<string | null> {
  try {
    const villageInfo = await getVillageInfo(adminUsername)
    if (!villageInfo) throw new Error("Village not found")

    // Get current year and month
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, "0")

    // Get count of approved letters this month for this type
    const { count } = await supabase
      .from("letter_requests")
      .select("*", { count: "exact", head: true })
      .eq("village_id", villageInfo.id)
      .eq("jenis_surat", jenisSurat)
      .eq("status", "approved")
      .gte("approved_date", `${year}-${month}-01`)
      .lt("approved_date", `${year}-${month}-32`)

    const sequence = String((count || 0) + 1).padStart(3, "0")

    // Generate letter number based on type
    let prefix = ""
    if (jenisSurat.includes("Domisili")) {
      prefix = "SKD"
    } else if (jenisSurat.includes("Usaha")) {
      prefix = "SKU"
    } else if (jenisSurat.includes("Tidak Mampu")) {
      prefix = "SKTM"
    } else {
      prefix = "SK"
    }

    return `${prefix}/${sequence}/${month}/${year}`
  } catch (error) {
    console.error("Error generating letter number:", error)
    return null
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
