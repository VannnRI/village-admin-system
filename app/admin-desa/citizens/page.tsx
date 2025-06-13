import AdminDesaLayout from "@/components/admin-desa-layout"
import CitizenManagement from "@/components/citizen-management"

export default function CitizensPage() {
  return (
    <AdminDesaLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Data Warga</h1>
          <p className="text-gray-600 mt-2">Kelola data warga desa</p>
        </div>

        <CitizenManagement />
      </div>
    </AdminDesaLayout>
  )
}
