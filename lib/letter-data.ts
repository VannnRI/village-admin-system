import { supabase } from "./supabase"
import { getVillageInfo } from "./admin-desa-data"

export async function getLetterRequests(adminUsername: string) {
  try {
    const villageInfo = await getVillageInfo(adminUsername)
    if (!villageInfo) return []

    const { data: letters, error } = await supabase
      .from("letter_requests")
      .select(`
        *,
        citizen:citizens(nama, nik, alamat, no_telepon),
        approved_by_user:users!letter_requests_approved_by_fkey(username)
      `)
      .eq("village_id", villageInfo.id)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching letters:", error)
      return []
    }

    return letters || []
  } catch (error) {
    console.error("Error getting letter requests:", error)
    return []
  }
}

export async function updateLetterStatus(
  letterId: number,
  status: string,
  approvedBy: number,
  rejectionReason?: string,
  letterNumber?: string,
) {
  try {
    const updateData: any = {
      status,
      updated_at: new Date().toISOString(),
    }

    if (status === "approved") {
      updateData.approved_by = approvedBy
      updateData.approved_at = new Date().toISOString()
      if (letterNumber) {
        updateData.no_surat = letterNumber
      }
    } else if (status === "rejected") {
      updateData.rejection_reason = rejectionReason
    }

    const { data, error } = await supabase.from("letter_requests").update(updateData).eq("id", letterId).select()

    if (error) {
      throw new Error(error.message)
    }

    return data
  } catch (error) {
    console.error("Error updating letter status:", error)
    throw error
  }
}

export async function generateLetterNumber(jenisSurat: string, adminUsername: string) {
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
      .gte("approved_at", `${year}-${month}-01`)
      .lt("approved_at", `${year}-${month}-32`)

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
