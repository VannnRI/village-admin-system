"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Copy, ExternalLink, Database } from "lucide-react"

export default function SetupInstructions() {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    try {
      // In a real app, you'd copy the actual SQL content
      await navigator.clipboard.writeText("SQL script copied! Please paste in Supabase SQL Editor")
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  return (
    <Card className="mt-4 border-blue-200 bg-blue-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-900">
          <Database className="h-5 w-5" />🚀 Setup Database - Langkah Mudah
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert className="border-blue-200 bg-blue-100">
          <Database className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            <strong>Database belum disetup!</strong> Ikuti langkah-langkah di bawah untuk setup database.
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          <div className="flex items-start gap-3 p-3 bg-white rounded-lg border">
            <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
              1
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-gray-900">Buka Supabase Dashboard</h4>
              <p className="text-sm text-gray-600 mt-1">Klik tombol di bawah untuk membuka Supabase Dashboard</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => window.open("https://supabase.com/dashboard", "_blank")}
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Buka Supabase Dashboard
              </Button>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-white rounded-lg border">
            <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
              2
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-gray-900">Pilih Project & Buka SQL Editor</h4>
              <p className="text-sm text-gray-600 mt-1">
                Pilih project Anda → Klik <strong>"SQL Editor"</strong> di sidebar kiri
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-white rounded-lg border">
            <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
              3
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-gray-900">Buat Query Baru</h4>
              <p className="text-sm text-gray-600 mt-1">
                Klik <strong>"New Query"</strong> atau <strong>"+"</strong> untuk membuat query baru
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-white rounded-lg border">
            <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
              4
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-gray-900">Copy & Paste Script</h4>
              <p className="text-sm text-gray-600 mt-1">
                Copy script dari file <code className="bg-gray-100 px-1 rounded">setup-database.sql</code> dan paste ke
                SQL Editor
              </p>
              <Button variant="outline" size="sm" className="mt-2" onClick={copyToClipboard}>
                <Copy className="mr-2 h-4 w-4" />
                {copied ? "Copied!" : "Copy Script Path"}
              </Button>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-white rounded-lg border">
            <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
              5
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-gray-900">Jalankan Script</h4>
              <p className="text-sm text-gray-600 mt-1">
                Klik tombol <strong>"Run"</strong> atau tekan <strong>Ctrl+Enter</strong>
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-white rounded-lg border">
            <div className="flex-shrink-0 w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
              6
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-gray-900">Verifikasi & Login</h4>
              <p className="text-sm text-gray-600 mt-1">Setelah script berhasil, refresh halaman ini dan coba login</p>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
          <h4 className="font-medium text-green-900 mb-2">📋 Akun untuk Testing:</h4>
          <div className="text-sm text-green-800 space-y-1">
            <p>
              <strong>Super Admin:</strong> username: <code>admin</code>, password: <code>admin</code>
            </p>
            <p>
              <strong>Admin Desa:</strong> username: <code>admin_sukamaju</code>, password: <code>admin</code>
            </p>
            <p>
              <strong>Perangkat Desa:</strong> username: <code>perangkat_sukamaju</code>, password: <code>admin</code>
            </p>
            <p>
              <strong>Masyarakat:</strong> NIK: <code>1234567890123456</code>, tanggal lahir: <code>1990-01-15</code>
            </p>
          </div>
        </div>

        <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <h4 className="font-medium text-yellow-900 mb-2">⚠️ Troubleshooting:</h4>
          <div className="text-sm text-yellow-800 space-y-1">
            <p>• Jika ada error "permission denied", pastikan Anda owner/admin project</p>
            <p>• Jika ada error "RLS", script akan otomatis disable RLS</p>
            <p>• Jika masih error, coba refresh browser dan ulangi</p>
            <p>• Pastikan project Supabase dalam status aktif (tidak paused)</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
