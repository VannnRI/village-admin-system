import SuperAdminLayout from "@/components/super-admin-layout"
import SystemSettings from "@/components/system-settings"

export default function SettingsPage() {
  return (
    <SuperAdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pengaturan Sistem</h1>
          <p className="text-gray-600 mt-2">Kelola konfigurasi dan pengaturan sistem administrasi desa</p>
        </div>

        <SystemSettings />
      </div>
    </SuperAdminLayout>
  )
}
