import LoginForm from "@/components/login-form"
import DatabaseSetup from "@/components/database-setup"
import SetupInstructions from "@/components/setup-instructions"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Sistem Administrasi Desa</h1>
          <p className="text-gray-600">Platform digital untuk pengelolaan administrasi desa</p>
        </div>

        <div className="max-w-md mx-auto">
          <LoginForm />
        </div>

        <SetupInstructions />
        <DatabaseSetup />
      </div>
    </div>
  )
}
