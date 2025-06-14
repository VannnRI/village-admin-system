"use client"

import { useEffect, useState } from "react"
import MasyarakatLayout from "@/components/masyarakat-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, User, Clock } from "lucide-react"
import Link from "next/link"
import type { AuthUser } from "@/lib/auth"

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
        {/* Welcome Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Selamat Datang, {user?.citizen_details?.nama || "Masyarakat"}!</CardTitle>
            <CardDescription>Anda dapat mengajukan berbagai jenis surat keterangan melalui portal ini.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium">NIK:</p>
                <p className="text-gray-600">{user?.username}</p>
              </div>
              <div>
                <p className="font-medium">Alamat:</p>
                <p className="text-gray-600">{user?.citizen_details?.alamat || "-"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-6 w-6 text-blue-500" />
                <span>Pengajuan Surat</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Ajukan berbagai jenis surat keterangan seperti SKTM, Surat Domisili, dan lainnya.
              </p>
              <Link href="/masyarakat/request-letter">
                <Button className="w-full">Ajukan Surat</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-6 w-6 text-green-500" />
                <span>Status Permohonan</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">Lihat status permohonan surat yang telah Anda ajukan.</p>
              <Button variant="outline" className="w-full" disabled>
                Lihat Status (Segera Hadir)
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-6 w-6 text-purple-500" />
                <span>Profil Saya</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">Lihat dan perbarui informasi profil Anda.</p>
              <Button variant="outline" className="w-full" disabled>
                Kelola Profil (Segera Hadir)
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Available Services */}
        <Card>
          <CardHeader>
            <CardTitle>Layanan Tersedia</CardTitle>
            <CardDescription>Jenis surat yang dapat Anda ajukan melalui portal ini</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium">Surat Keterangan:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Surat Keterangan Tidak Mampu (SKTM)</li>
                  <li>• Surat Keterangan Domisili</li>
                  <li>• Surat Keterangan Usaha</li>
                  <li>• Surat Keterangan Kelahiran</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Surat Pengantar:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Surat Pengantar Nikah</li>
                  <li>• Surat Pengantar SKCK</li>
                  <li>• Surat Pengantar Lainnya</li>
                  <li>• Dan masih banyak lagi</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MasyarakatLayout>
  )
}
