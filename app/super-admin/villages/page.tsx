import SuperAdminLayout from "@/components/super-admin-layout"
import VillageManagement from "@/components/village-management"

export default function VillagesPage() {
  return (
    <SuperAdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Daftar Desa</h1>
          <p className="text-gray-600 mt-2">Kelola desa yang terdaftar dalam sistem</p>
        </div>

        <VillageManagement />
      </div>
    </SuperAdminLayout>
  )
}
