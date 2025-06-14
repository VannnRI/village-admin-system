import { supabase } from "./supabase"
import * as XLSX from "xlsx"

// Get village info based on your database structure
export async function getVillageInfo(adminUsername: string) {
  try {
    console.log("🔍 Getting village info for admin:", adminUsername)

    // Get admin user
    const { data: admin, error: adminError } = await supabase
      .from("users")
      .select("id")
      .eq("username", adminUsername)
      .single()

    if (adminError || !admin) {
      console.error("❌ Admin not found:", adminError)
      throw new Error("Admin not found")
    }

    console.log("✅ Admin found with ID:", admin.id)

    // Get village info using admin_id (based on your database structure)
    const { data: village, error: villageError } = await supabase
      .from("villages")
      .select("*")
      .eq("admin_id", admin.id)
      .single()

    if (villageError) {
      console.error("❌ Village not found for admin:", villageError)
      throw new Error("Village not found")
    }

    console.log("✅ Village found:", village.nama)
    return village
  } catch (error) {
    console.error("Error getting village info:", error)
    return null
  }
}

export async function getVillageRegulations(adminUsername: string) {
  try {
    const villageInfo = await getVillageInfo(adminUsername)
    if (!villageInfo) return []

    const { data, error } = await supabase
      .from("village_regulations")
      .select("*")
      .eq("village_id", villageInfo.id)
      .order("tanggal_peraturan", { ascending: false })

    if (error) {
      console.error("Error fetching regulations:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error getting village regulations:", error)
    return []
  }
}

export async function getVillageDecisions(adminUsername: string) {
  try {
    const villageInfo = await getVillageInfo(adminUsername)
    if (!villageInfo) return []

    const { data, error } = await supabase
      .from("village_decisions")
      .select("*")
      .eq("village_id", villageInfo.id)
      .order("tanggal_keputusan", { ascending: false })

    if (error) {
      console.error("Error fetching decisions:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error getting village decisions:", error)
    return []
  }
}

export async function addVillageRegulation(adminUsername: string, regulationData: any) {
  try {
    const villageInfo = await getVillageInfo(adminUsername)
    if (!villageInfo) throw new Error("Village not found")

    // Get admin user
    const { data: admin, error: adminError } = await supabase
      .from("users")
      .select("id")
      .eq("username", adminUsername)
      .single()

    if (adminError || !admin) {
      throw new Error("Admin user not found")
    }

    const { data, error } = await supabase
      .from("village_regulations")
      .insert({
        village_id: villageInfo.id,
        nomor_peraturan: regulationData.nomor_peraturan,
        tanggal_peraturan: regulationData.tanggal_peraturan,
        nomor_kesepakatan: regulationData.nomor_kesepakatan,
        tanggal_kesepakatan: regulationData.tanggal_kesepakatan,
        tentang: regulationData.tentang,
        created_by: admin.id,
        status: "aktif",
      })
      .select()
      .single()

    if (error) {
      console.error("Database error:", error)
      throw new Error(error.message)
    }

    return data
  } catch (error) {
    console.error("Error adding village regulation:", error)
    throw error
  }
}

export async function addVillageDecision(adminUsername: string, decisionData: any) {
  try {
    const villageInfo = await getVillageInfo(adminUsername)
    if (!villageInfo) throw new Error("Village not found")

    // Get admin user
    const { data: admin, error: adminError } = await supabase
      .from("users")
      .select("id")
      .eq("username", adminUsername)
      .single()

    if (adminError || !admin) {
      throw new Error("Admin user not found")
    }

    const { data, error } = await supabase
      .from("village_decisions")
      .insert({
        village_id: villageInfo.id,
        nomor_keputusan: decisionData.nomor_keputusan,
        tanggal_keputusan: decisionData.tanggal_keputusan,
        nomor_diundangkan: decisionData.nomor_diundangkan,
        tanggal_diundangkan: decisionData.tanggal_diundangkan,
        tentang: decisionData.tentang,
        created_by: admin.id,
        status: "aktif",
      })
      .select()
      .single()

    if (error) {
      console.error("Database error:", error)
      throw new Error(error.message)
    }

    return data
  } catch (error) {
    console.error("Error adding village decision:", error)
    throw error
  }
}

export async function updateVillageRegulation(adminUsername: string, regulationId: number, regulationData: any) {
  try {
    const villageInfo = await getVillageInfo(adminUsername)
    if (!villageInfo) throw new Error("Village not found")

    const { data, error } = await supabase
      .from("village_regulations")
      .update({
        nomor_peraturan: regulationData.nomor_peraturan,
        tanggal_peraturan: regulationData.tanggal_peraturan,
        nomor_kesepakatan: regulationData.nomor_kesepakatan,
        tanggal_kesepakatan: regulationData.tanggal_kesepakatan,
        tentang: regulationData.tentang,
        updated_at: new Date().toISOString(),
      })
      .eq("id", regulationId)
      .eq("village_id", villageInfo.id)
      .select()
      .single()

    if (error) {
      console.error("Database error:", error)
      throw new Error(error.message)
    }

    return data
  } catch (error) {
    console.error("Error updating village regulation:", error)
    throw error
  }
}

export async function updateVillageDecision(adminUsername: string, decisionId: number, decisionData: any) {
  try {
    const villageInfo = await getVillageInfo(adminUsername)
    if (!villageInfo) throw new Error("Village not found")

    const { data, error } = await supabase
      .from("village_decisions")
      .update({
        nomor_keputusan: decisionData.nomor_keputusan,
        tanggal_keputusan: decisionData.tanggal_keputusan,
        nomor_diundangkan: decisionData.nomor_diundangkan,
        tanggal_diundangkan: decisionData.tanggal_diundangkan,
        tentang: decisionData.tentang,
        updated_at: new Date().toISOString(),
      })
      .eq("id", decisionId)
      .eq("village_id", villageInfo.id)
      .select()
      .single()

    if (error) {
      console.error("Database error:", error)
      throw new Error(error.message)
    }

    return data
  } catch (error) {
    console.error("Error updating village decision:", error)
    throw error
  }
}

export async function deleteVillageRegulation(adminUsername: string, regulationId: number) {
  try {
    const villageInfo = await getVillageInfo(adminUsername)
    if (!villageInfo) throw new Error("Village not found")

    const { error } = await supabase
      .from("village_regulations")
      .delete()
      .eq("id", regulationId)
      .eq("village_id", villageInfo.id)

    if (error) {
      console.error("Database error:", error)
      throw new Error(error.message)
    }

    return true
  } catch (error) {
    console.error("Error deleting village regulation:", error)
    throw error
  }
}

export async function deleteVillageDecision(adminUsername: string, decisionId: number) {
  try {
    const villageInfo = await getVillageInfo(adminUsername)
    if (!villageInfo) throw new Error("Village not found")

    const { error } = await supabase
      .from("village_decisions")
      .delete()
      .eq("id", decisionId)
      .eq("village_id", villageInfo.id)

    if (error) {
      console.error("Database error:", error)
      throw new Error(error.message)
    }

    return true
  } catch (error) {
    console.error("Error deleting village decision:", error)
    throw error
  }
}

export async function exportRegulationsToExcel(adminUsername: string) {
  try {
    const regulations = await getVillageRegulations(adminUsername)
    const villageInfo = await getVillageInfo(adminUsername)

    if (!regulations.length) {
      throw new Error("Tidak ada data peraturan untuk diexport")
    }

    // Prepare data for Excel
    const excelData = regulations.map((regulation, index) => ({
      No: index + 1,
      "Nomor Peraturan": regulation.nomor_peraturan,
      "Tanggal Peraturan": new Date(regulation.tanggal_peraturan).toLocaleDateString("id-ID"),
      "Nomor Kesepakatan": regulation.nomor_kesepakatan,
      "Tanggal Kesepakatan": new Date(regulation.tanggal_kesepakatan).toLocaleDateString("id-ID"),
      Tentang: regulation.tentang,
      Status: regulation.status,
      "Dibuat Tanggal": new Date(regulation.created_at).toLocaleDateString("id-ID"),
    }))

    // Create workbook and worksheet
    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.json_to_sheet(excelData)

    // Set column widths
    const colWidths = [
      { wch: 5 }, // No
      { wch: 20 }, // Nomor Peraturan
      { wch: 15 }, // Tanggal Peraturan
      { wch: 20 }, // Nomor Kesepakatan
      { wch: 18 }, // Tanggal Kesepakatan
      { wch: 40 }, // Tentang
      { wch: 10 }, // Status
      { wch: 15 }, // Dibuat Tanggal
    ]
    ws["!cols"] = colWidths

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, "Peraturan Desa")

    // Generate filename with current date
    const currentDate = new Date().toISOString().split("T")[0]
    const filename = `Buku-Peraturan-Desa-${villageInfo?.nama || "Unknown"}-${currentDate}.xlsx`

    // Write file and trigger download
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" })
    const blob = new Blob([wbout], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" })

    // Create download link
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)

    return true
  } catch (error) {
    console.error("Error exporting regulations to Excel:", error)
    throw error
  }
}

export async function exportDecisionsToExcel(adminUsername: string) {
  try {
    const decisions = await getVillageDecisions(adminUsername)
    const villageInfo = await getVillageInfo(adminUsername)

    if (!decisions.length) {
      throw new Error("Tidak ada data keputusan untuk diexport")
    }

    // Prepare data for Excel
    const excelData = decisions.map((decision, index) => ({
      No: index + 1,
      "Nomor Keputusan": decision.nomor_keputusan,
      "Tanggal Keputusan": new Date(decision.tanggal_keputusan).toLocaleDateString("id-ID"),
      "Nomor Diundangkan": decision.nomor_diundangkan,
      "Tanggal Diundangkan": new Date(decision.tanggal_diundangkan).toLocaleDateString("id-ID"),
      Tentang: decision.tentang,
      Status: decision.status,
      "Dibuat Tanggal": new Date(decision.created_at).toLocaleDateString("id-ID"),
    }))

    // Create workbook and worksheet
    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.json_to_sheet(excelData)

    // Set column widths
    const colWidths = [
      { wch: 5 }, // No
      { wch: 20 }, // Nomor Keputusan
      { wch: 15 }, // Tanggal Keputusan
      { wch: 20 }, // Nomor Diundangkan
      { wch: 18 }, // Tanggal Diundangkan
      { wch: 40 }, // Tentang
      { wch: 10 }, // Status
      { wch: 15 }, // Dibuat Tanggal
    ]
    ws["!cols"] = colWidths

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, "Keputusan Kepala Desa")

    // Generate filename with current date
    const currentDate = new Date().toISOString().split("T")[0]
    const filename = `Buku-Keputusan-Kepala-Desa-${villageInfo?.nama || "Unknown"}-${currentDate}.xlsx`

    // Write file and trigger download
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" })
    const blob = new Blob([wbout], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" })

    // Create download link
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)

    return true
  } catch (error) {
    console.error("Error exporting decisions to Excel:", error)
    throw error
  }
}
