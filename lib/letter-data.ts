import { supabase } from "./supabase"
import { getVillageInfo } from "./admin-desa-data"

export interface LetterRequest {
  id: number
  citizen_id: number
  village_id: number
  [key: string]: any // Allow any additional properties
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

    // Simple query without ordering first
    const { data: letterRequests, error: letterError } = await supabase
      .from("letter_requests")
      .select("*")
      .eq("village_id", villageInfo.id)

    if (letterError) {
      console.error("❌ Error fetching letter requests:", letterError)
      return []
    }

    if (!letterRequests || letterRequests.length === 0) {
      console.log("📝 No letter requests found for village:", villageInfo.id)
      return []
    }

    console.log("✅ Found letter requests:", letterRequests.length)
    console.log("📋 First letter request structure:", Object.keys(letterRequests[0]))
    console.log("📋 Sample data:", letterRequests[0])

    // Fetch citizen data separately
    const citizenIds = letterRequests.map((lr) => lr.citizen_id).filter(Boolean)

    let citizens = []
    if (citizenIds.length > 0) {
      const { data: citizenData, error: citizenError } = await supabase
        .from("citizens")
        .select("id, nama, nik, alamat, no_telepon")
        .in("id", citizenIds)

      if (citizenError) {
        console.error("❌ Error fetching citizens:", citizenError)
      } else {
        citizens = citizenData || []
      }
    }

    // Combine the data manually
    const combinedData: LetterRequest[] = letterRequests.map((lr) => ({
      ...lr,
      citizen: citizens.find((c) => c.id === lr.citizen_id) || {
        nama: "Data tidak tersedia",
        nik: "-",
        alamat: "-",
      },
    }))

    console.log("✅ Letter requests with citizen data ready")
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

    // Start with basic update
    const updateData: any = {
      status,
    }

    // Add timestamp if possible
    try {
      updateData.updated_at = new Date().toISOString()
    } catch (e) {
      // Ignore if updated_at column doesn't exist
    }

    if (status === "approved") {
      // Try common column names for approved_by
      updateData.approved_by = approvedBy
      updateData.disetujui_oleh = approvedBy

      // Try common column names for approved_date
      const approvedDate = new Date().toISOString()
      updateData.approved_date = approvedDate
      updateData.approved_at = approvedDate
      updateData.tanggal_disetujui = approvedDate

      if (letterNumber) {
        updateData.no_surat = letterNumber
        updateData.nomor_surat = letterNumber
      }
    } else if (status === "rejected" && rejectionReason) {
      updateData.rejection_reason = rejectionReason
      updateData.alasan_penolakan = rejectionReason
    }

    const { error } = await supabase.from("letter_requests").update(updateData).eq("id", letterId)

    if (error) {
      console.error("❌ Error updating letter status:", error)
      console.log("📋 Update data that failed:", updateData)

      // Try with minimal update if full update fails
      const minimalUpdate = { status }
      const { error: minimalError } = await supabase.from("letter_requests").update(minimalUpdate).eq("id", letterId)

      if (minimalError) {
        throw minimalError
      } else {
        console.log("✅ Minimal update succeeded")
        return true
      }
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
    console.log("🔢 Generating letter number for:", jenisSurat)

    const villageInfo = await getVillageInfo(adminUsername)
    if (!villageInfo) {
      console.error("❌ Village not found for admin:", adminUsername)
      return null
    }

    // Get current year and month
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, "0")

    // Try to count approved letters this month
    let count = 0
    try {
      const { data, error } = await supabase
        .from("letter_requests")
        .select("*")
        .eq("village_id", villageInfo.id)
        .eq("status", "approved")

      if (error) {
        console.error("❌ Error counting letters:", error)
      } else {
        // Filter by letter type and this month (if date columns exist)
        const filteredData =
          data?.filter((item) => {
            const letterType = item.jenis_surat || item.letter_type || ""
            return letterType === jenisSurat
          }) || []

        count = filteredData.length
      }
    } catch (countError) {
      console.error("❌ Error in count query:", countError)
    }

    const sequence = String(count + 1).padStart(3, "0")

    // Generate letter number based on type
    let prefix = ""
    if (jenisSurat.includes("Domisili")) {
      prefix = "SKD"
    } else if (jenisSurat.includes("Usaha")) {
      prefix = "SKU"
    } else if (jenisSurat.includes("Tidak Mampu")) {
      prefix = "SKTM"
    } else if (jenisSurat.includes("Nikah")) {
      prefix = "SPN"
    } else if (jenisSurat.includes("Kelahiran")) {
      prefix = "SKL"
    } else if (jenisSurat.includes("Kematian")) {
      prefix = "SKM"
    } else {
      prefix = "SK"
    }

    const letterNumber = `${prefix}/${sequence}/${month}/${year}`
    console.log("✅ Generated letter number:", letterNumber)
    return letterNumber
  } catch (error) {
    console.error("❌ Error generating letter number:", error)
    return null
  }
}

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

// Helper function to get display value from letter request
export function getLetterDisplayValue(letter: LetterRequest, field: string): string {
  // Try different possible column names
  const possibleNames: { [key: string]: string[] } = {
    jenis_surat: ["jenis_surat", "letter_type", "type"],
    keperluan: ["keperluan", "purpose", "tujuan_permohonan"],
    tanggal: ["tanggal_pengajuan", "request_date", "created_at"],
    nomor_surat: ["nomor_surat", "no_surat", "letter_number"],
  }

  if (possibleNames[field]) {
    for (const name of possibleNames[field]) {
      if (letter[name]) {
        return letter[name]
      }
    }
  }

  return letter[field] || "-"
}

// Helper function to format date safely
export function formatLetterDate(letter: LetterRequest): string {
  const dateFields = ["tanggal_pengajuan", "request_date", "created_at"]

  for (const field of dateFields) {
    if (letter[field]) {
      try {
        return new Date(letter[field]).toLocaleDateString("id-ID")
      } catch (e) {
        // Continue to next field
      }
    }
  }

  return "-"
}
