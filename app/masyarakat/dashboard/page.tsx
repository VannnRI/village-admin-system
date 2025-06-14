"use client"

import MasyarakatLayout from "@/components/masyarakat-layout"
import { useEffect, useState } from "react"
import type { AuthUser } from "@/lib/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { FileText, UserCircle, Bell } from "lucide-react"

export default function MasyarakatDashboardPage() {
  const [user, setUser] = useState<AuthUser | null>(null)

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  return (
    <MasyarakatLayout>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Selamat Datang, {user?.citizen_details?.nama || user?.username}!</CardTitle>
            <CardDescription>
              Ini adalah halaman dashboard Anda. Anda dapat mengajukan surat dan melihat informasi lainnya di sini.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 dark:text-gray-300">
              NIK: {user?.username} <br />
              {user?.citizen_details?.alamat && `Alamat: ${user.citizen_details.alamat}`}
            </p>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-6 w-6 text-blue-500" />
                Pengajuan Surat
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Ajukan berbagai jenis surat keterangan secara online dengan mudah dan cepat.
              </p>
              <Link href="/masyarakat/request-letter" passHref>
                <Button className="w-full">Ajukan Surat Sekarang</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCircle className="h-6 w-6 text-green-500" />
                Profil Saya
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Lihat dan perbarui data pribadi Anda (Fitur akan datang).
              </p>
              <Button className="w-full" variant="outline" disabled>
                Lihat Profil
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-6 w-6 text-yellow-500" />
                Notifikasi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Informasi terbaru mengenai status permohonan Anda (Fitur akan datang).
              </p>
              <Button className="w-full" variant="outline" disabled>
                Lihat Notifikasi
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </MasyarakatLayout>
  )
}
