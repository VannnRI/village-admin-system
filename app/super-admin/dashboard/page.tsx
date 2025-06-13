import SuperAdminLayout from "@/components/super-admin-layout"
import DashboardStats from "@/components/dashboard-stats"
import RecentActivity from "@/components/recent-activity"

// Update the component to pass dynamic data
export default function SuperAdminDashboard() {
  return (
    <SuperAdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Super Admin</h1>
          <p className="text-gray-600 mt-2">Selamat datang di panel administrasi sistem desa</p>
        </div>

        <DashboardStats />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RecentActivity />
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Informasi Sistem</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Versi Sistem:</span>
                <span className="font-medium">v1.0.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status Server:</span>
                <span className="font-medium text-green-600">Online</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Database:</span>
                <span className="font-medium text-green-600">Connected</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Last Backup:</span>
                <span className="font-medium">2 jam yang lalu</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SuperAdminLayout>
  )
}
