"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Phone, Mail, Clock, Facebook, Twitter, Instagram, Navigation } from "lucide-react"

export default function PublicContact() {
  const contactInfo = {
    address: "Jl. Raya Sukamaju No. 123, Kecamatan Cianjur, Jawa Barat 43211",
    phone: "0812-3456-7890",
    email: "info@desasukamaju.desa.id",
    workingHours: "Senin - Jumat: 08:00 - 16:00 WIB",
    socialMedia: {
      facebook: "https://facebook.com/desasukamaju",
      twitter: "https://twitter.com/desasukamaju",
      instagram: "https://instagram.com/desasukamaju",
    },
  }

  const officeHours = [
    { day: "Senin", hours: "08:00 - 16:00" },
    { day: "Selasa", hours: "08:00 - 16:00" },
    { day: "Rabu", hours: "08:00 - 16:00" },
    { day: "Kamis", hours: "08:00 - 16:00" },
    { day: "Jumat", hours: "08:00 - 16:00" },
    { day: "Sabtu", hours: "Tutup" },
    { day: "Minggu", hours: "Tutup" },
  ]

  const emergencyContacts = [
    { name: "Polsek Cianjur", number: "110", description: "Kepolisian" },
    { name: "Pemadam Kebakaran", number: "113", description: "Damkar" },
    { name: "Ambulans", number: "118", description: "Medis" },
    { name: "SAR", number: "115", description: "Search & Rescue" },
  ]

  const handleCallPhone = () => {
    window.location.href = `tel:${contactInfo.phone}`
  }

  const handleSendEmail = () => {
    window.location.href = `mailto:${contactInfo.email}`
  }

  const handleOpenMaps = () => {
    const encodedAddress = encodeURIComponent(contactInfo.address)
    window.open(`https://maps.google.com/maps?q=${encodedAddress}`, "_blank")
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white px-4 py-6 border-b">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Hubungi Kami</h1>
        <p className="text-gray-600">Informasi kontak dan lokasi kantor desa</p>
      </div>

      {/* Main Contact Info */}
      <div className="px-4">
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MapPin className="h-5 w-5 text-green-600" />
              <span>Kantor Desa Sukamaju</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Alamat</p>
                  <p className="text-sm text-gray-600">{contactInfo.address}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Telepon</p>
                  <p className="text-sm text-gray-600">{contactInfo.phone}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Email</p>
                  <p className="text-sm text-gray-600">{contactInfo.email}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Jam Pelayanan</p>
                  <p className="text-sm text-gray-600">{contactInfo.workingHours}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-4 border-t">
              <Button onClick={handleCallPhone} className="flex items-center justify-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>Telepon</span>
              </Button>
              <Button
                onClick={handleSendEmail}
                variant="outline"
                className="flex items-center justify-center space-x-2"
              >
                <Mail className="h-4 w-4" />
                <span>Email</span>
              </Button>
              <Button onClick={handleOpenMaps} variant="outline" className="flex items-center justify-center space-x-2">
                <Navigation className="h-4 w-4" />
                <span>Petunjuk Arah</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Office Hours */}
      <div className="px-4">
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-blue-600" />
              <span>Jam Pelayanan</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {officeHours.map((schedule, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0"
                >
                  <span className="text-sm font-medium text-gray-900">{schedule.day}</span>
                  <span className={`text-sm ${schedule.hours === "Tutup" ? "text-red-600" : "text-gray-600"}`}>
                    {schedule.hours}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Social Media */}
      <div className="px-4">
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Media Sosial</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3">
              <Button
                variant="outline"
                className="flex flex-col items-center space-y-2 h-auto py-4"
                onClick={() => window.open(contactInfo.socialMedia.facebook, "_blank")}
              >
                <Facebook className="h-6 w-6 text-blue-600" />
                <span className="text-xs">Facebook</span>
              </Button>
              <Button
                variant="outline"
                className="flex flex-col items-center space-y-2 h-auto py-4"
                onClick={() => window.open(contactInfo.socialMedia.twitter, "_blank")}
              >
                <Twitter className="h-6 w-6 text-blue-400" />
                <span className="text-xs">Twitter</span>
              </Button>
              <Button
                variant="outline"
                className="flex flex-col items-center space-y-2 h-auto py-4"
                onClick={() => window.open(contactInfo.socialMedia.instagram, "_blank")}
              >
                <Instagram className="h-6 w-6 text-pink-600" />
                <span className="text-xs">Instagram</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Emergency Contacts */}
      <div className="px-4">
        <Card className="border-0 shadow-sm bg-red-50 border-red-200">
          <CardHeader>
            <CardTitle className="text-red-900">Kontak Darurat</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {emergencyContacts.map((contact, index) => (
                <div key={index} className="bg-white rounded-lg p-3 border border-red-200">
                  <div className="text-center">
                    <p className="text-lg font-bold text-red-900">{contact.number}</p>
                    <p className="text-sm font-medium text-red-800">{contact.name}</p>
                    <p className="text-xs text-red-600">{contact.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Map Placeholder */}
      <div className="px-4">
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Lokasi Kantor Desa</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-200 rounded-lg h-48 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <MapPin className="h-12 w-12 mx-auto mb-2" />
                <p className="text-sm">Peta Lokasi</p>
                <p className="text-xs">Klik "Petunjuk Arah" untuk membuka Google Maps</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
