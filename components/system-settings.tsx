"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Save, Mail, Shield, Database, Globe, Bell } from "lucide-react"

export default function SystemSettings() {
  const [success, setSuccess] = useState("")
  const [settings, setSettings] = useState({
    // General Settings
    systemName: "Sistem Administrasi Desa",
    systemVersion: "v1.0.0",
    maintenanceMode: false,

    // Email Settings
    emailEnabled: true,
    smtpHost: "smtp.gmail.com",
    smtpPort: "587",
    smtpUsername: "",
    smtpPassword: "",
    emailFrom: "noreply@desaadmin.id",

    // Security Settings
    sessionTimeout: "30",
    passwordMinLength: "6",
    maxLoginAttempts: "5",
    twoFactorAuth: false,

    // Database Settings
    backupEnabled: true,
    backupFrequency: "daily",
    backupRetention: "30",

    // Notification Settings
    emailNotifications: true,
    systemAlerts: true,
    userRegistrationNotif: true,

    // Website Settings
    allowPublicAccess: true,
    defaultLanguage: "id",
    timezone: "Asia/Jakarta",
  })

  const handleSettingChange = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const handleSave = (section: string) => {
    // Simulate saving settings
    setSuccess(`Pengaturan ${section} berhasil disimpan`)
    setTimeout(() => setSuccess(""), 3000)
  }

  return (
    <div className="space-y-6">
      {success && (
        <Alert className="border-green-200 bg-green-50">
          <AlertDescription className="text-green-800">{success}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general">Umum</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="security">Keamanan</TabsTrigger>
          <TabsTrigger value="database">Database</TabsTrigger>
          <TabsTrigger value="notifications">Notifikasi</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="mr-2 h-5 w-5" />
                Pengaturan Umum
              </CardTitle>
              <CardDescription>Konfigurasi dasar sistem administrasi desa</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="systemName">Nama Sistem</Label>
                  <Input
                    id="systemName"
                    value={settings.systemName}
                    onChange={(e) => handleSettingChange("systemName", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="systemVersion">Versi Sistem</Label>
                  <Input id="systemVersion" value={settings.systemVersion} disabled />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="defaultLanguage">Bahasa Default</Label>
                  <Select
                    value={settings.defaultLanguage}
                    onValueChange={(value) => handleSettingChange("defaultLanguage", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="id">Bahasa Indonesia</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Zona Waktu</Label>
                  <Select value={settings.timezone} onValueChange={(value) => handleSettingChange("timezone", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Asia/Jakarta">WIB (Asia/Jakarta)</SelectItem>
                      <SelectItem value="Asia/Makassar">WITA (Asia/Makassar)</SelectItem>
                      <SelectItem value="Asia/Jayapura">WIT (Asia/Jayapura)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="maintenanceMode"
                  checked={settings.maintenanceMode}
                  onCheckedChange={(checked) => handleSettingChange("maintenanceMode", checked)}
                />
                <Label htmlFor="maintenanceMode">Mode Maintenance</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="allowPublicAccess"
                  checked={settings.allowPublicAccess}
                  onCheckedChange={(checked) => handleSettingChange("allowPublicAccess", checked)}
                />
                <Label htmlFor="allowPublicAccess">Izinkan Akses Publik</Label>
              </div>

              <Button onClick={() => handleSave("umum")}>
                <Save className="mr-2 h-4 w-4" />
                Simpan Pengaturan Umum
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Mail className="mr-2 h-5 w-5" />
                Pengaturan Email
              </CardTitle>
              <CardDescription>Konfigurasi server email untuk notifikasi sistem</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="emailEnabled"
                  checked={settings.emailEnabled}
                  onCheckedChange={(checked) => handleSettingChange("emailEnabled", checked)}
                />
                <Label htmlFor="emailEnabled">Aktifkan Email</Label>
              </div>

              {settings.emailEnabled && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="smtpHost">SMTP Host</Label>
                      <Input
                        id="smtpHost"
                        value={settings.smtpHost}
                        onChange={(e) => handleSettingChange("smtpHost", e.target.value)}
                        placeholder="smtp.gmail.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="smtpPort">SMTP Port</Label>
                      <Input
                        id="smtpPort"
                        value={settings.smtpPort}
                        onChange={(e) => handleSettingChange("smtpPort", e.target.value)}
                        placeholder="587"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="smtpUsername">SMTP Username</Label>
                      <Input
                        id="smtpUsername"
                        value={settings.smtpUsername}
                        onChange={(e) => handleSettingChange("smtpUsername", e.target.value)}
                        placeholder="username@gmail.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="smtpPassword">SMTP Password</Label>
                      <Input
                        id="smtpPassword"
                        type="password"
                        value={settings.smtpPassword}
                        onChange={(e) => handleSettingChange("smtpPassword", e.target.value)}
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="emailFrom">Email Pengirim</Label>
                    <Input
                      id="emailFrom"
                      value={settings.emailFrom}
                      onChange={(e) => handleSettingChange("emailFrom", e.target.value)}
                      placeholder="noreply@desaadmin.id"
                    />
                  </div>
                </>
              )}

              <Button onClick={() => handleSave("email")}>
                <Save className="mr-2 h-4 w-4" />
                Simpan Pengaturan Email
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="mr-2 h-5 w-5" />
                Pengaturan Keamanan
              </CardTitle>
              <CardDescription>Konfigurasi keamanan dan autentikasi sistem</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">Session Timeout (menit)</Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    value={settings.sessionTimeout}
                    onChange={(e) => handleSettingChange("sessionTimeout", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="passwordMinLength">Panjang Password Minimal</Label>
                  <Input
                    id="passwordMinLength"
                    type="number"
                    value={settings.passwordMinLength}
                    onChange={(e) => handleSettingChange("passwordMinLength", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxLoginAttempts">Maksimal Percobaan Login</Label>
                  <Input
                    id="maxLoginAttempts"
                    type="number"
                    value={settings.maxLoginAttempts}
                    onChange={(e) => handleSettingChange("maxLoginAttempts", e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="twoFactorAuth"
                  checked={settings.twoFactorAuth}
                  onCheckedChange={(checked) => handleSettingChange("twoFactorAuth", checked)}
                />
                <Label htmlFor="twoFactorAuth">Autentikasi Dua Faktor</Label>
              </div>

              <Button onClick={() => handleSave("keamanan")}>
                <Save className="mr-2 h-4 w-4" />
                Simpan Pengaturan Keamanan
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="database">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="mr-2 h-5 w-5" />
                Pengaturan Database
              </CardTitle>
              <CardDescription>Konfigurasi backup dan maintenance database</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="backupEnabled"
                  checked={settings.backupEnabled}
                  onCheckedChange={(checked) => handleSettingChange("backupEnabled", checked)}
                />
                <Label htmlFor="backupEnabled">Aktifkan Backup Otomatis</Label>
              </div>

              {settings.backupEnabled && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="backupFrequency">Frekuensi Backup</Label>
                      <Select
                        value={settings.backupFrequency}
                        onValueChange={(value) => handleSettingChange("backupFrequency", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hourly">Setiap Jam</SelectItem>
                          <SelectItem value="daily">Harian</SelectItem>
                          <SelectItem value="weekly">Mingguan</SelectItem>
                          <SelectItem value="monthly">Bulanan</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="backupRetention">Retensi Backup (hari)</Label>
                      <Input
                        id="backupRetention"
                        type="number"
                        value={settings.backupRetention}
                        onChange={(e) => handleSettingChange("backupRetention", e.target.value)}
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="space-y-4 pt-4 border-t">
                <h4 className="font-medium">Aksi Database</h4>
                <div className="flex space-x-2">
                  <Button variant="outline">Backup Manual</Button>
                  <Button variant="outline">Restore Database</Button>
                  <Button variant="outline">Optimize Database</Button>
                </div>
              </div>

              <Button onClick={() => handleSave("database")}>
                <Save className="mr-2 h-4 w-4" />
                Simpan Pengaturan Database
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="mr-2 h-5 w-5" />
                Pengaturan Notifikasi
              </CardTitle>
              <CardDescription>Konfigurasi notifikasi dan alert sistem</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="emailNotifications"
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => handleSettingChange("emailNotifications", checked)}
                  />
                  <Label htmlFor="emailNotifications">Notifikasi Email</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="systemAlerts"
                    checked={settings.systemAlerts}
                    onCheckedChange={(checked) => handleSettingChange("systemAlerts", checked)}
                  />
                  <Label htmlFor="systemAlerts">Alert Sistem</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="userRegistrationNotif"
                    checked={settings.userRegistrationNotif}
                    onCheckedChange={(checked) => handleSettingChange("userRegistrationNotif", checked)}
                  />
                  <Label htmlFor="userRegistrationNotif">Notifikasi Registrasi User</Label>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notificationTemplate">Template Notifikasi</Label>
                <Textarea id="notificationTemplate" placeholder="Template default untuk notifikasi email..." rows={4} />
              </div>

              <Button onClick={() => handleSave("notifikasi")}>
                <Save className="mr-2 h-4 w-4" />
                Simpan Pengaturan Notifikasi
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
