"use client"

import PerangkatDesaLayout from "@/components/perangkat-desa-layout"
import { useEffect, useState } from "react"
import type { AuthUser } from "@/lib/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, FileText, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function PerangkatDesaDashboardPage() {
  const [user, setUser] = useState<AuthUser | null>(null)

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  return (
    <PerangkatDesaLayout>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Dashboard Perangkat Desa</CardTitle>
            <CardDescription>Selamat datang, {user?.username}! Kelola data dan layanan desa dari sini.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Ini adalah halaman placeholder untuk dashboard Perangkat Desa.</p>
            <p>Fitur spesifik untuk Perangkat Desa akan ditambahkan di sini.</p>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-6 w-6 text-blue-500" />
                Manajemen Warga
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Lihat, tambah, atau ubah data kependudukan warga desa.
              </p>
              <Button className="w-full" variant="outline" disabled>
                Kelola Data Warga
              </Button>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-6 w-6 text-green-500" />
                Pelayanan Surat
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Proses permohonan surat yang diajukan oleh masyarakat.
              </p>
              <Button className="w-full" variant="outline" disabled>
                Proses Permohonan
              </Button>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-6 w-6 text-purple-500" />
                Laporan Desa
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Akses laporan terkait kependudukan dan pelayanan surat.
              </p>
              <Button className="w-full" variant="outline" disabled>
                Lihat Laporan
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </PerangkatDesaLayout>
  )
}
