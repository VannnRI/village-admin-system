"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { UserPlus, Edit, Trash2, Eye, EyeOff } from "lucide-react"
import { getUsers, createUser, updateUser, deleteUser, type User } from "@/lib/database"

export default function AccountManagement() {
  const [accounts, setAccounts] = useState<User[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [editingAccount, setEditingAccount] = useState<User | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    role: "",
    status: "aktif" as "aktif" | "nonaktif",
    password: "",
    confirmPassword: "",
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchAccounts()
  }, [])

  const fetchAccounts = async () => {
    const data = await getUsers()
    // Filter out super admin and citizens
    const filteredData = data.filter((user) => user.role !== "super_admin" && user.role !== "masyarakat")
    setAccounts(filteredData)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setError("")
  }

  const resetForm = () => {
    setFormData({
      username: "",
      email: "",
      role: "",
      status: "aktif",
      password: "",
      confirmPassword: "",
    })
    setIsEditMode(false)
    setEditingAccount(null)
    setError("")
    setSuccess("")
  }

  const handleEdit = (account: User) => {
    setEditingAccount(account)
    setIsEditMode(true)
    setFormData({
      username: account.username,
      email: account.email,
      role: account.role,
      status: account.status,
      password: "",
      confirmPassword: "",
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (account: User) => {
    setLoading(true)
    const success = await deleteUser(account.id)
    if (success) {
      await fetchAccounts()
      setSuccess(`Akun ${account.username} berhasil dihapus`)
      setTimeout(() => setSuccess(""), 3000)
    } else {
      setError("Gagal menghapus akun")
    }
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    // Validasi
    if (!formData.username || !formData.email || !formData.role) {
      setError("Username, email, dan role harus diisi")
      setLoading(false)
      return
    }

    if (!isEditMode && (!formData.password || !formData.confirmPassword)) {
      setError("Password harus diisi untuk akun baru")
      setLoading(false)
      return
    }

    if (formData.password && formData.password !== formData.confirmPassword) {
      setError("Password dan konfirmasi password tidak sama")
      setLoading(false)
      return
    }

    if (formData.password && formData.password.length < 6) {
      setError("Password minimal 6 karakter")
      setLoading(false)
      return
    }

    try {
      if (isEditMode && editingAccount) {
        // Update akun
        const updatedAccount = await updateUser(editingAccount.id, {
          username: formData.username,
          email: formData.email,
          role: formData.role as any,
          status: formData.status,
        })

        if (updatedAccount) {
          await fetchAccounts()
          setSuccess("Akun berhasil diperbarui")
        } else {
          setError("Gagal memperbarui akun")
        }
      } else {
        // Tambah akun baru
        const newAccount = await createUser({
          username: formData.username,
          email: formData.email,
          role: formData.role as any,
          status: formData.status,
        })

        if (newAccount) {
          await fetchAccounts()
          setSuccess("Akun berhasil ditambahkan")
        } else {
          setError("Gagal menambahkan akun")
        }
      }

      if (!error) {
        resetForm()
        setTimeout(() => {
          setIsDialogOpen(false)
          setSuccess("")
        }, 2000)
      }
    } catch (error) {
      setError("Terjadi kesalahan")
    }

    setLoading(false)
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin_desa":
        return <Badge className="bg-blue-100 text-blue-800">Admin Desa</Badge>
      case "perangkat_desa":
        return <Badge className="bg-green-100 text-green-800">Perangkat Desa</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "aktif":
        return <Badge className="bg-green-100 text-green-800">Aktif</Badge>
      case "nonaktif":
        return <Badge className="bg-red-100 text-red-800">Nonaktif</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {success && (
        <Alert className="border-green-200 bg-green-50">
          <AlertDescription className="text-green-800">{success}</AlertDescription>
        </Alert>
      )}

      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Daftar Akun</h2>
          <p className="text-gray-600">Kelola akun Admin Desa dan Perangkat Desa</p>
        </div>

        <Dialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            setIsDialogOpen(open)
            if (!open) resetForm()
          }}
        >
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Tambah Akun
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{isEditMode ? "Edit Akun" : "Tambah Akun Baru"}</DialogTitle>
              <DialogDescription>
                {isEditMode ? "Perbarui informasi akun" : "Buat akun baru untuk Admin Desa atau Perangkat Desa"}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="border-green-200 bg-green-50">
                  <AlertDescription className="text-green-800">{success}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) => handleInputChange("username", e.target.value)}
                  placeholder="Masukkan username"
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="Masukkan email"
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) => handleInputChange("role", value)}
                  disabled={loading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin_desa">Admin Desa</SelectItem>
                    <SelectItem value="perangkat_desa">Perangkat Desa</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {isEditMode && (
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => handleInputChange("status", value)}
                    disabled={loading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="aktif">Aktif</SelectItem>
                      <SelectItem value="nonaktif">Nonaktif</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="password">Password {isEditMode && "(Kosongkan jika tidak ingin mengubah)"}</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    placeholder={isEditMode ? "Masukkan password baru" : "Masukkan password"}
                    disabled={loading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Ulangi Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    placeholder="Ulangi password"
                    disabled={loading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={loading}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} disabled={loading}>
                  Batal
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Memproses..." : isEditMode ? "Perbarui" : "Tambah"} Akun
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Akun Terdaftar</CardTitle>
          <CardDescription>Total {accounts.length} akun terdaftar</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Username</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Tanggal Dibuat</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {accounts.map((account) => (
                <TableRow key={account.id}>
                  <TableCell className="font-medium">{account.username}</TableCell>
                  <TableCell>{account.email}</TableCell>
                  <TableCell>{getRoleBadge(account.role)}</TableCell>
                  <TableCell>{getStatusBadge(account.status)}</TableCell>
                  <TableCell>{new Date(account.created_at).toLocaleDateString("id-ID")}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(account)} disabled={loading}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                            disabled={loading}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Hapus Akun</AlertDialogTitle>
                            <AlertDialogDescription>
                              Apakah Anda yakin ingin menghapus akun <strong>{account.username}</strong>? Tindakan ini
                              tidak dapat dibatalkan.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Batal</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(account)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Hapus
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
