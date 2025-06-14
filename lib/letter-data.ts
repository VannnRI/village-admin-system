import { supabase } from "./supabase"
import { getVillageInfo } from "./admin-desa-data"

export async function getLetterRequests(adminUsername: string) {
  try {
    console.log("🔍 Getting letter requests for admin:", adminUsername)

    const villageInfo = await getVillageInfo(adminUsername)
    if (!villageInfo) {
      console.error("❌ Village info not found for admin:", adminUsername)
      return []
    }

    console.log("✅ Village info found:", villageInfo.nama, "ID:", villageInfo.id)

    // Query sederhana tanpa JOIN kompleks
    const { data: letters, error } = await supabase
      .from("letter_requests")
      .select("*")
      .eq("village_id", villageInfo.id)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("❌ Error fetching letters:", error)
      return []
    }

    console.log("✅ Letters found:", letters?.length || 0)

    // Ambil data citizens secara terpisah
    if (letters && letters.length > 0) {
      const citizenIds = letters.map((letter) => letter.citizen_id).filter(Boolean)

      if (citizenIds.length > 0) {
        const { data: citizens, error: citizenError } = await supabase
          .from("citizens")
          .select("id, nama, nik, alamat, no_telepon")
          .in("id", citizenIds)

        if (!citizenError && citizens) {
          // Gabungkan data letters dengan citizens
          const lettersWithCitizens = letters.map((letter) => ({
            ...letter,
            citizen: citizens.find((c) => c.id === letter.citizen_id) || null,
          }))

          console.log("✅ Letters with citizen data:", lettersWithCitizens.length)
          return lettersWithCitizens
        }
      }
    }

    return letters || []
  } catch (error) {
    console.error("❌ Error getting letter requests:", error)
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
    console.log("🔄 Updating letter status:", letterId, "to", status)

    const updateData: any = {
      status,
      updated_at: new Date().toISOString(),
    }

    if (status === "diproses" || status === "selesai") {
      updateData.processed_by = approvedBy
      updateData.processed_at = new Date().toISOString()
      if (letterNumber) {
        updateData.no_surat = letterNumber
      }
    } else if (status === "ditolak") {
      updateData.rejection_reason = rejectionReason
    }

    const { data, error } = await supabase.from("letter_requests").update(updateData).eq("id", letterId).select()

    if (error) {
      console.error("❌ Error updating letter:", error)
      throw new Error(error.message)
    }

    console.log("✅ Letter updated successfully:", data)
    return data
  } catch (error) {
    console.error("❌ Error updating letter status:", error)
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

    // Get count of processed letters this month for this type
    const { count } = await supabase
      .from("letter_requests")
      .select("*", { count: "exact", head: true })
      .eq("village_id", villageInfo.id)
      .eq("jenis_surat", jenisSurat)
      .in("status", ["diproses", "selesai"])
      .gte("processed_at", `${year}-${month}-01`)
      .lt("processed_at", `${year}-${month}-32`)

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
