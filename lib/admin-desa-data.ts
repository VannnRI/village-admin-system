import { supabase } from "./supabase"

export async function getVillageInfo(adminUsername: string) {
  try {
    console.log("🔍 Getting village info for admin:", adminUsername)

    // Get admin user with village info
    const { data: admin, error: adminError } = await supabase
      .from("users")
      .select(`
        id,
        username,
        village_id,
        villages (
          id,
          nama,
          kecamatan,
          kabupaten,
          provinsi,
          status
        )
      `)
      .eq("username", adminUsername)
      .single()

    if (adminError) {
      console.error("❌ Admin query error:", adminError)
      throw new Error(`Admin not found: ${adminError.message}`)
    }

    if (!admin) {
      console.error("❌ Admin not found")
      throw new Error("Admin not found")
    }

    if (!admin.village_id) {
      console.error("❌ Admin has no village_id")
      throw new Error("Admin not assigned to any village")
    }

    if (!admin.villages) {
      console.error("❌ Village data not found for village_id:", admin.village_id)
      throw new Error("Village data not found")
    }

    console.log("✅ Village info found:", admin.villages.nama)
    return admin.villages
  } catch (error) {
    console.error("💥 Error getting village info:", error)
    return null
  }
}

export async function getVillageStats(adminUsername: string) {
  try {
    console.log("🔍 Getting village stats for admin:", adminUsername)

    const villageInfo = await getVillageInfo(adminUsername)
    if (!villageInfo) {
      console.error("❌ No village info found")
      return {
        totalCitizens: 0,
        totalLetters: 0,
        pendingLetters: 0,
        approvedLetters: 0,
        rejectedLetters: 0,
        thisMonthLetters: 0,
      }
    }

    console.log("📊 Getting stats for village:", villageInfo.nama, "ID:", villageInfo.id)

    // Get citizens count
    const { count: citizensCount, error: citizensError } = await supabase
      .from("citizens")
      .select("*", { count: "exact", head: true })
      .eq("village_id", villageInfo.id)

    if (citizensError) {
      console.error("❌ Citizens count error:", citizensError)
    }

    // Get letters stats
    const { data: letters, error: lettersError } = await supabase
      .from("letter_requests")
      .select("status, created_at")
      .eq("village_id", villageInfo.id)

    if (lettersError) {
      console.error("❌ Letters query error:", lettersError)
    }

    const totalLetters = letters?.length || 0
    const pendingLetters = letters?.filter((l) => l.status === "pending").length || 0
    const approvedLetters = letters?.filter((l) => l.status === "selesai").length || 0
    const rejectedLetters = letters?.filter((l) => l.status === "ditolak").length || 0

    // This month letters
    const currentMonth = new Date().toISOString().slice(0, 7)
    const thisMonthLetters = letters?.filter((l) => l.created_at.startsWith(currentMonth)).length || 0

    const stats = {
      totalCitizens: citizensCount || 0,
      totalLetters,
      pendingLetters,
      approvedLetters,
      rejectedLetters,
      thisMonthLetters,
    }

    console.log("✅ Village stats:", stats)
    return stats
  } catch (error) {
    console.error("💥 Error getting village stats:", error)
    return {
      totalCitizens: 0,
      totalLetters: 0,
      pendingLetters: 0,
      approvedLetters: 0,
      rejectedLetters: 0,
      thisMonthLetters: 0,
    }
  }
}

export async function getRecentLetterRequests(adminUsername: string, limit = 5) {
  try {
    console.log("🔍 Getting recent letters for admin:", adminUsername)

    const villageInfo = await getVillageInfo(adminUsername)
    if (!villageInfo) {
      console.error("❌ No village info for recent letters")
      return []
    }

    console.log("📋 Getting recent letters for village:", villageInfo.nama)

    const { data: letters, error } = await supabase
      .from("letter_requests")
      .select(`
        *,
        citizens (
          nama,
          nik
        )
      `)
      .eq("village_id", villageInfo.id)
      .order("created_at", { ascending: false })
      .limit(limit)

    if (error) {
      console.error("❌ Recent letters error:", error)
      return []
    }

    console.log("✅ Found recent letters:", letters?.length || 0)
    return letters || []
  } catch (error) {
    console.error("💥 Error getting recent letter requests:", error)
    return []
  }
}

export async function getCitizens(adminUsername: string) {
  try {
    console.log("🔍 Getting citizens for admin:", adminUsername)

    const villageInfo = await getVillageInfo(adminUsername)
    if (!villageInfo) {
      console.error("❌ No village info for citizens")
      return []
    }

    console.log("👥 Getting citizens for village:", villageInfo.nama)

    const { data: citizens, error } = await supabase
      .from("citizens")
      .select("*")
      .eq("village_id", villageInfo.id)
      .order("nama", { ascending: true })

    if (error) {
      console.error("❌ Citizens query error:", error)
      return []
    }

    console.log("✅ Found citizens:", citizens?.length || 0)
    return citizens || []
  } catch (error) {
    console.error("💥 Error getting citizens:", error)
    return []
  }
}

export async function addCitizen(adminUsername: string, citizenData: any) {
  try {
    console.log("🔍 Adding citizen for admin:", adminUsername)

    const villageInfo = await getVillageInfo(adminUsername)
    if (!villageInfo) {
      throw new Error("Village not found")
    }

    console.log("➕ Adding citizen to village:", villageInfo.nama)

    const { data, error } = await supabase
      .from("citizens")
      .insert({
        ...citizenData,
        village_id: villageInfo.id,
      })
      .select()
      .single()

    if (error) {
      console.error("❌ Add citizen error:", error)
      throw new Error(error.message)
    }

    console.log("✅ Citizen added successfully:", data.nama)
    return data
  } catch (error) {
    console.error("💥 Error adding citizen:", error)
    throw error
  }
}

export async function updateCitizen(citizenId: number, updates: any) {
  try {
    console.log("🔄 Updating citizen:", citizenId)

    const { data, error } = await supabase
      .from("citizens")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", citizenId)
      .select()
      .single()

    if (error) {
      console.error("❌ Update citizen error:", error)
      throw new Error(error.message)
    }

    console.log("✅ Citizen updated successfully")
    return data
  } catch (error) {
    console.error("💥 Error updating citizen:", error)
    throw error
  }
}

export async function deleteCitizen(citizenId: number) {
  try {
    console.log("🗑️ Deleting citizen:", citizenId)

    const { error } = await supabase.from("citizens").delete().eq("id", citizenId)

    if (error) {
      console.error("❌ Delete citizen error:", error)
      throw new Error(error.message)
    }

    console.log("✅ Citizen deleted successfully")
    return true
  } catch (error) {
    console.error("💥 Error deleting citizen:", error)
    throw error
  }
}

export async function importCitizensFromCSV(adminUsername: string, file: File) {
  try {
    console.log("📁 Importing citizens from CSV for admin:", adminUsername)

    const villageInfo = await getVillageInfo(adminUsername)
    if (!villageInfo) {
      throw new Error("Village not found")
    }

    const text = await file.text()
    const lines = text.split("\n").filter((line) => line.trim())

    if (lines.length < 2) {
      throw new Error("File CSV harus memiliki header dan minimal 1 data")
    }

    const headers = lines[0].split(",").map((h) => h.trim().toLowerCase())
    const expectedHeaders = ["nik", "no_kk", "nama", "tanggal_lahir", "alamat", "no_telepon"]

    // Validate headers
    const missingHeaders = expectedHeaders.filter((h) => !headers.includes(h))
    if (missingHeaders.length > 0) {
      throw new Error(`Header yang hilang: ${missingHeaders.join(", ")}`)
    }

    const dataToInsert = []
    const errors = []

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(",").map((v) => v.trim().replace(/"/g, ""))

      if (values.length !== headers.length) {
        errors.push(`Baris ${i + 1}: Jumlah kolom tidak sesuai`)
        continue
      }

      const rowData: any = {}
      headers.forEach((header, index) => {
        rowData[header] = values[index]
      })

      // Validate required fields
      if (!rowData.nik || !rowData.no_kk || !rowData.nama || !rowData.tanggal_lahir || !rowData.alamat) {
        errors.push(`Baris ${i + 1}: Field wajib tidak boleh kosong`)
        continue
      }

      // Validate NIK and No KK length
      if (rowData.nik.length !== 16) {
        errors.push(`Baris ${i + 1}: NIK harus 16 digit`)
        continue
      }

      if (rowData.no_kk.length !== 16) {
        errors.push(`Baris ${i + 1}: No KK harus 16 digit`)
        continue
      }

      // Validate date format
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/
      if (!dateRegex.test(rowData.tanggal_lahir)) {
        errors.push(`Baris ${i + 1}: Format tanggal harus YYYY-MM-DD`)
        continue
      }

      dataToInsert.push({
        village_id: villageInfo.id,
        nik: rowData.nik,
        no_kk: rowData.no_kk,
        nama: rowData.nama,
        tanggal_lahir: rowData.tanggal_lahir,
        alamat: rowData.alamat,
        no_telepon: rowData.no_telepon || null,
      })
    }

    if (errors.length > 0) {
      throw new Error(
        `Terdapat ${errors.length} error:\n${errors.slice(0, 5).join("\n")}${errors.length > 5 ? "\n..." : ""}`,
      )
    }

    if (dataToInsert.length === 0) {
      throw new Error("Tidak ada data valid untuk diimport")
    }

    // Insert data in batches
    const batchSize = 100
    let imported = 0

    for (let i = 0; i < dataToInsert.length; i += batchSize) {
      const batch = dataToInsert.slice(i, i + batchSize)
      const { error } = await supabase.from("citizens").insert(batch)

      if (error) {
        console.error("❌ Batch insert error:", error)
        throw new Error(`Gagal mengimport batch data: ${error.message}`)
      }

      imported += batch.length
    }

    console.log("✅ CSV import successful:", imported, "records")
    return { imported, total: dataToInsert.length }
  } catch (error) {
    console.error("💥 Error importing CSV:", error)
    throw error
  }
}
