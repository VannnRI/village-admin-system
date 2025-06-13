import AdminDesaLayout from "@/components/admin-desa-layout"
import LetterManagement from "@/components/letter-management"

export default function LettersPage() {
  return (
    <AdminDesaLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Surat Menyurat</h1>
          <p className="text-gray-600 mt-2">Kelola permohonan dan penerbitan surat desa</p>
        </div>

        <LetterManagement />
      </div>
    </AdminDesaLayout>
  )
}
