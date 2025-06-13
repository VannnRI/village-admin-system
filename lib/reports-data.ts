import { supabase } from "./supabase"
import { getVillageInfo } from "./admin-desa-data"

export async function getLetterReports(adminUsername: string) {
  try {
    const villageInfo = await getVillageInfo(adminUsername)
    if (!villageInfo) return []

    const { data: reports, error } = await supabase
      .from("letter_requests")
      .select(`
        *,
        citizen:citizens(nama, nik)
      `)
      .eq("village_id", villageInfo.id)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching letter reports:", error)
      return []
    }

    return reports || []
  } catch (error) {
    console.error("Error getting letter reports:", error)
    return []
  }
}

export async function getMonthlyStats(adminUsername: string) {
  try {
    const villageInfo = await getVillageInfo(adminUsername)
    if (!villageInfo) return []

    // Get stats for the last 12 months
    const stats = []
    const now = new Date()

    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, "0")
      const monthStart = `${year}-${month}-01`
      const monthEnd = `${year}-${month}-31`

      const { data: monthData } = await supabase
        .from("letter_requests")
        .select("status")
        .eq("village_id", villageInfo.id)
        .gte("created_at", monthStart)
        .lte("created_at", monthEnd)

      const total = monthData?.length || 0
      const approved = monthData?.filter((item) => item.status === "approved").length || 0
      const pending = monthData?.filter((item) => item.status === "pending").length || 0
      const rejected = monthData?.filter((item) => item.status === "rejected").length || 0

      stats.push({
        month: `${year}-${month}`,
        monthName: date.toLocaleDateString("id-ID", { month: "long", year: "numeric" }),
        total,
        approved,
        pending,
        rejected,
      })
    }

    return stats
  } catch (error) {
    console.error("Error getting monthly stats:", error)
    return []
  }
}
