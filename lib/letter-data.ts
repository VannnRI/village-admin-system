import { supabase } from "./supabase"
import { getVillageInfo } from "./admin-desa-data"

export interface LetterRequest {
  id: number
  citizen_id: number
  village_id: number
  jenis_surat?: string
  letter_type?: string
  keperluan?: string
  purpose?: string
  tujuan_permohonan?: string
  status: "pending" | "approved" | "rejected"
  tanggal_pengajuan?: string
  request_date?: string
  created_at?: string
  tanggal_disetujui?: string
  approved_date?: string
  approved_at?: string
  disetujui_oleh?: number
  approved_by?: number
  nomor_surat?: string
  no_surat?: string
  alasan_penolakan?: string
  rejection_reason?: string
  catatan?: string
  notes?: string
  updated_at?: string
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

    // First, let's try to fetch without ordering to see what we get
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
    console.log("📋 Sample letter request structure:", letterRequests[0])

    // Try to order by available date columns
    let orderedRequests = letterRequests
    try {
      // Try different possible date column names
      if (letterRequests[0].tanggal_pengajuan) {
        orderedRequests = letterRequests.sort(
          (a, b) => new Date(b.tanggal_pengajuan).getTime() - new Date(a.tanggal_pengajuan).getTime(),
        )
      } else if (letterRequests[0].request_date) {
        orderedRequests = letterRequests.sort(
          (a, b) => new Date(b.request_date).getTime() - new Date(a.request_date).getTime(),
        )
      } else if (letterRequests[0].created_at) {
        orderedRequests = letterRequests.sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        )
      }
    } catch (sortError) {
      console.log("⚠️ Could not sort by date, using original order")
    }

    // Fetch citizen data separately
    const citizenIds = orderedRequests.map((lr) => lr.citizen_id)
    const { data: citizens, error: citizenError } = await supabase
      .from("citizens")
      .select("id, nama, nik, alamat, no_telepon")
      .in("id", citizenIds)

    if (citizenError) {
      console.error("❌ Error fetching citizens:", citizenError)
    }

    // Combine the data manually
    const combinedData: LetterRequest[] = orderedRequests.map((lr) => ({
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
      // Try different possible column names for approved_by
      updateData.disetujui_oleh = approvedBy
      updateData.approved_by = approvedBy

      // Try different possible column names for approved_date
      updateData.tanggal_disetujui = new Date().toISOString()
      updateData.approved_date = new Date().toISOString()
      updateData.approved_at = new Date().toISOString()

      if (letterNumber) {
        updateData.nomor_surat = letterNumber
        updateData.no_surat = letterNumber
      }
    } else if (status === "rejected") {
      updateData.alasan_penolakan = rejectionReason
      updateData.rejection_reason = rejectionReason
    }

    const { error } = await supabase.from("letter_requests").update(updateData).eq("id", letterId)

    if (error) {
      console.error("❌ Error updating letter status:", error)
      console.log("📋 Update data that failed:", updateData)
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

    // Try to count approved letters with different possible column names
    let count = 0
    try {
      const { count: countResult } = await supabase
        .from("letter_requests")
        .select("*", { count: "exact", head: true })
        .eq("village_id", villageInfo.id)
        .eq("status", "approved")
        .or(`jenis_surat.eq.${jenisSurat},letter_type.eq.${jenisSurat}`)

      count = countResult || 0
    } catch (countError) {
      console.log("⚠️ Could not get exact count, using fallback")
      const { data } = await supabase
        .from("letter_requests")
        .select("*")
        .eq("village_id", villageInfo.id)
        .eq("status", "approved")

      count = data?.filter((item) => item.jenis_surat === jenisSurat || item.letter_type === jenisSurat).length || 0
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
    } else {
      prefix = "SK"
    }

    return `${prefix}/${sequence}/${month}/${year}`
  } catch (error) {
    console.error("Error generating letter number:", error)
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
