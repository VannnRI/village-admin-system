import AdminDesaLayout from "@/components/admin-desa-layout"
import ArchiveManagement from "@/components/archive-management"

export default function ArchivesPage() {
  return (
    <AdminDesaLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Arsip Desa</h1>
          <p className="text-gray-600 mt-2">Kelola arsip dan dokumen desa</p>
        </div>

        <ArchiveManagement />
      </div>
    </AdminDesaLayout>
  )
}
