"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, AlertCircle, Database, Play } from "lucide-react"
import { supabase } from "@/lib/supabase"

interface DatabaseSetupProps {
  onComplete: () => void
}

export default function DatabaseSetup({ onComplete }: DatabaseSetupProps) {
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const setupDatabase = async () => {
    setLoading(true)
    setError("")
    setProgress(0)

    try {
      // Step 1: Create tables
      setCurrentStep("Membuat tabel database...")
      setProgress(20)

      const createTablesSQL = `
        -- Drop existing tables if they exist
        DROP TABLE IF EXISTS activity_logs CASCADE;
        DROP TABLE IF EXISTS letter_requests CASCADE;
        DROP TABLE IF EXISTS village_staff CASCADE;
        DROP TABLE IF EXISTS citizens CASCADE;
        DROP TABLE IF EXISTS villages CASCADE;
        DROP TABLE IF EXISTS users CASCADE;
        DROP TABLE IF EXISTS system_settings CASCADE;

        -- Create users table
        CREATE TABLE users (
            id SERIAL PRIMARY KEY,
            username VARCHAR(50) UNIQUE NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL,
            password_hash VARCHAR(255) NOT NULL,
            role VARCHAR(20) NOT NULL CHECK (role IN ('super_admin', 'admin_desa', 'perangkat_desa', 'masyarakat')),
            status VARCHAR(10) DEFAULT 'aktif' CHECK (status IN ('aktif', 'nonaktif')),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        -- Create villages table
        CREATE TABLE villages (
            id SERIAL PRIMARY KEY,
            nama VARCHAR(100) NOT NULL,
            kode_pos VARCHAR(10) NOT NULL,
            kecamatan VARCHAR(100) NOT NULL,
            kabupaten VARCHAR(100) NOT NULL,
            provinsi VARCHAR(100) NOT NULL,
            admin_id INTEGER REFERENCES users(id),
            status VARCHAR(10) DEFAULT 'aktif' CHECK (status IN ('aktif', 'nonaktif')),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        -- Create citizens table
        CREATE TABLE citizens (
            id SERIAL PRIMARY KEY,
            village_id INTEGER REFERENCES villages(id),
            nik VARCHAR(16) UNIQUE NOT NULL,
            no_kk VARCHAR(16) NOT NULL,
            nama VARCHAR(100) NOT NULL,
            tanggal_lahir DATE NOT NULL,
            alamat TEXT NOT NULL,
            no_telepon VARCHAR(15),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        -- Create letter_requests table
        CREATE TABLE letter_requests (
            id SERIAL PRIMARY KEY,
            village_id INTEGER REFERENCES villages(id),
            citizen_id INTEGER REFERENCES citizens(id),
            jenis_surat VARCHAR(100) NOT NULL,
            no_surat VARCHAR(50),
            tujuan_permohonan TEXT NOT NULL,
            status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
            approved_by INTEGER REFERENCES users(id),
            approved_at TIMESTAMP,
            rejection_reason TEXT,
            file_path VARCHAR(255),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        -- Create activity_logs table
        CREATE TABLE activity_logs (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id),
            action VARCHAR(255) NOT NULL,
            details TEXT,
            ip_address INET,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        -- Create system_settings table
        CREATE TABLE system_settings (
            id SERIAL PRIMARY KEY,
            setting_key VARCHAR(100) UNIQUE NOT NULL,
            setting_value TEXT,
            setting_type VARCHAR(20) DEFAULT 'string',
            description TEXT,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `

      const { error: createError } = await supabase.rpc("exec_sql", { sql: createTablesSQL })
      if (createError) throw createError

      // Step 2: Insert initial data
      setCurrentStep("Menambahkan data awal...")
      setProgress(60)

      const insertDataSQL = `
        -- Insert initial users
        INSERT INTO users (username, email, password_hash, role, status) VALUES 
        ('admin', 'admin@system.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'super_admin', 'aktif'),
        ('admin_sukamaju', 'admin@sukamaju.desa.id', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin_desa', 'aktif'),
        ('admin_makmur', 'admin@makmur.desa.id', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin_desa', 'aktif');

        -- Insert villages
        INSERT INTO villages (nama, kode_pos, kecamatan, kabupaten, provinsi, admin_id) VALUES 
        ('Sukamaju', '12345', 'Sukamaju', 'Bogor', 'Jawa Barat', (SELECT id FROM users WHERE username = 'admin_sukamaju')),
        ('Makmur', '12346', 'Makmur', 'Bandung', 'Jawa Barat', (SELECT id FROM users WHERE username = 'admin_makmur'));

        -- Insert sample citizens
        INSERT INTO citizens (village_id, nik, no_kk, nama, tanggal_lahir, alamat, no_telepon) VALUES 
        ((SELECT id FROM villages WHERE nama = 'Sukamaju'), '1234567890123456', '1234567890123456', 'John Doe', '1990-01-15', 'Jl. Merdeka No. 123, RT 01/RW 02', '081234567890'),
        ((SELECT id FROM villages WHERE nama = 'Makmur'), '1234567890123458', '1234567890123457', 'Jane Smith', '1992-03-10', 'Jl. Sejahtera No. 456, RT 02/RW 03', '081234567892');

        -- Insert system settings
        INSERT INTO system_settings (setting_key, setting_value, setting_type, description) VALUES 
        ('system_name', 'Sistem Administrasi Desa', 'string', 'Nama sistem'),
        ('system_version', 'v1.0.0', 'string', 'Versi sistem');
      `

      const { error: insertError } = await supabase.rpc("exec_sql", { sql: insertDataSQL })
      if (insertError) throw insertError

      setCurrentStep("Setup berhasil!")
      setProgress(100)
      setSuccess(true)

      setTimeout(() => {
        onComplete()
      }, 2000)
    } catch (error: any) {
      console.error("Database setup error:", error)
      setError(`Gagal setup database: ${error.message}`)
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <Database className="h-5 w-5" />
            Setup Database
          </CardTitle>
          <CardDescription>
            Database belum disetup. Klik tombol di bawah untuk membuat tabel dan data awal.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading && (
            <div className="space-y-2">
              <Progress value={progress} className="w-full" />
              <p className="text-sm text-center text-gray-600">{currentStep}</p>
            </div>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">Database berhasil disetup! Redirecting...</AlertDescription>
            </Alert>
          )}

          <Button onClick={setupDatabase} disabled={loading || success} className="w-full">
            <Play className="mr-2 h-4 w-4" />
            {loading ? "Memproses..." : success ? "Berhasil!" : "Setup Database"}
          </Button>

          <div className="text-xs text-gray-500 space-y-1">
            <p>Setup akan membuat:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Tabel users, villages, citizens</li>
              <li>Tabel letter_requests, activity_logs</li>
              <li>Data admin dan warga demo</li>
              <li>Pengaturan sistem dasar</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
