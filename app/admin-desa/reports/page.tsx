import AdminDesaLayout from "@/components/admin-desa-layout"
import ReportsManagement from "@/components/reports-management"

export default function ReportsPage() {
  return (
    <AdminDesaLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Laporan</h1>
          <p className="text-gray-600 mt-2">Laporan pengajuan surat dan statistik desa</p>
        </div>

        <ReportsManagement />
      </div>
    </AdminDesaLayout>
  )
}
