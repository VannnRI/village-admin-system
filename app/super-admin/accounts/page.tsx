import SuperAdminLayout from "@/components/super-admin-layout"
import AccountManagement from "@/components/account-management"

export default function AccountsPage() {
  return (
    <SuperAdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Kelola Akun</h1>
          <p className="text-gray-600 mt-2">Tambah dan kelola akun Admin Desa dan Perangkat Desa</p>
        </div>

        <AccountManagement />
      </div>
    </SuperAdminLayout>
  )
}
