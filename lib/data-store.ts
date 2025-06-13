// Global data store untuk simulasi database
export interface Account {
  id: number
  username: string
  email: string
  namaDesa: string
  role: "admin_desa" | "perangkat_desa"
  status: "aktif" | "nonaktif"
  createdAt: string
}

export interface Village {
  id: number
  nama: string
  kodePos: string
  kecamatan: string
  kabupaten: string
  provinsi: string
  adminId?: number
  perangkatIds: number[]
  status: "aktif" | "nonaktif"
  createdAt: string
}

export interface Activity {
  id: number
  action: string
  user: string
  time: string
  type: "create" | "update" | "delete"
  details?: string
}

export interface LetterRequest {
  id: number
  jenisSurat: string
  pemohon: string
  nik: string
  status: "pending" | "approved" | "rejected"
  createdAt: string
  village: string
}

// Initial data
const accounts: Account[] = [
  {
    id: 1,
    username: "admin_sukamaju",
    email: "admin@sukamaju.desa.id",
    namaDesa: "Sukamaju",
    role: "admin_desa",
    status: "aktif",
    createdAt: "2024-01-15",
  },
  {
    id: 2,
    username: "perangkat_sukamaju",
    email: "perangkat@sukamaju.desa.id",
    namaDesa: "Sukamaju",
    role: "perangkat_desa",
    status: "aktif",
    createdAt: "2024-01-15",
  },
  {
    id: 3,
    username: "admin_makmur",
    email: "admin@makmur.desa.id",
    namaDesa: "Makmur",
    role: "admin_desa",
    status: "aktif",
    createdAt: "2024-01-20",
  },
  {
    id: 4,
    username: "perangkat_makmur1",
    email: "perangkat1@makmur.desa.id",
    namaDesa: "Makmur",
    role: "perangkat_desa",
    status: "aktif",
    createdAt: "2024-01-20",
  },
  {
    id: 5,
    username: "perangkat_makmur2",
    email: "perangkat2@makmur.desa.id",
    namaDesa: "Makmur",
    role: "perangkat_desa",
    status: "nonaktif",
    createdAt: "2024-01-20",
  },
]

const villages: Village[] = [
  {
    id: 1,
    nama: "Sukamaju",
    kodePos: "12345",
    kecamatan: "Sukamaju",
    kabupaten: "Bogor",
    provinsi: "Jawa Barat",
    adminId: 1,
    perangkatIds: [2],
    status: "aktif",
    createdAt: "2024-01-15",
  },
  {
    id: 2,
    nama: "Makmur",
    kodePos: "12346",
    kecamatan: "Makmur",
    kabupaten: "Bandung",
    provinsi: "Jawa Barat",
    adminId: 3,
    perangkatIds: [4, 5],
    status: "aktif",
    createdAt: "2024-01-20",
  },
  {
    id: 3,
    nama: "Sejahtera",
    kodePos: "12347",
    kecamatan: "Sejahtera",
    kabupaten: "Jakarta",
    provinsi: "DKI Jakarta",
    status: "nonaktif",
    createdAt: "2024-02-01",
  },
]

const activities: Activity[] = [
  {
    id: 1,
    action: "Admin Desa Makmur ditambahkan",
    user: "Super Admin",
    time: "2 jam yang lalu",
    type: "create",
    details: "Akun admin_makmur berhasil dibuat",
  },
  {
    id: 2,
    action: "Perangkat Desa Makmur dinonaktifkan",
    user: "Super Admin",
    time: "4 jam yang lalu",
    type: "update",
    details: "Status perangkat_makmur2 diubah menjadi nonaktif",
  },
  {
    id: 3,
    action: "Desa Sejahtera terdaftar",
    user: "Super Admin",
    time: "1 hari yang lalu",
    type: "create",
    details: "Desa baru ditambahkan ke sistem",
  },
  {
    id: 4,
    action: "Pengaturan sistem diperbarui",
    user: "Super Admin",
    time: "2 hari yang lalu",
    type: "update",
    details: "Konfigurasi email notification diaktifkan",
  },
]

const letterRequests: LetterRequest[] = [
  {
    id: 1,
    jenisSurat: "Surat Keterangan Domisili",
    pemohon: "John Doe",
    nik: "1234567890123456",
    status: "approved",
    createdAt: "2024-02-15",
    village: "Sukamaju",
  },
  {
    id: 2,
    jenisSurat: "Surat Keterangan Usaha",
    pemohon: "Jane Smith",
    nik: "1234567890123457",
    status: "pending",
    createdAt: "2024-02-16",
    village: "Makmur",
  },
  {
    id: 3,
    jenisSurat: "Surat Keterangan Tidak Mampu",
    pemohon: "Bob Johnson",
    nik: "1234567890123458",
    status: "approved",
    createdAt: "2024-02-17",
    village: "Sukamaju",
  },
]

// Data access functions
export const getAccounts = (): Account[] => accounts
export const getVillages = (): Village[] => villages
export const getActivities = (): Activity[] => activities
export const getLetterRequests = (): LetterRequest[] => letterRequests

export const addAccount = (account: Omit<Account, "id">): Account => {
  const newAccount = { ...account, id: Math.max(...accounts.map((a) => a.id)) + 1 }
  accounts.push(newAccount)

  // Add activity
  activities.unshift({
    id: Math.max(...activities.map((a) => a.id)) + 1,
    action: `${account.role === "admin_desa" ? "Admin" : "Perangkat"} Desa ${account.namaDesa} ditambahkan`,
    user: "Super Admin",
    time: "Baru saja",
    type: "create",
    details: `Akun ${account.username} berhasil dibuat`,
  })

  return newAccount
}

export const updateAccount = (id: number, updates: Partial<Account>): Account | null => {
  const index = accounts.findIndex((a) => a.id === id)
  if (index === -1) return null

  const oldAccount = accounts[index]
  accounts[index] = { ...oldAccount, ...updates }

  // Add activity
  activities.unshift({
    id: Math.max(...activities.map((a) => a.id)) + 1,
    action: `Akun ${oldAccount.username} diperbarui`,
    user: "Super Admin",
    time: "Baru saja",
    type: "update",
    details: `Status atau data akun telah diubah`,
  })

  return accounts[index]
}

export const deleteAccount = (id: number): boolean => {
  const index = accounts.findIndex((a) => a.id === id)
  if (index === -1) return false

  const deletedAccount = accounts[index]
  accounts.splice(index, 1)

  // Add activity
  activities.unshift({
    id: Math.max(...activities.map((a) => a.id)) + 1,
    action: `Akun ${deletedAccount.username} dihapus`,
    user: "Super Admin",
    time: "Baru saja",
    type: "delete",
    details: `Akun telah dihapus dari sistem`,
  })

  return true
}

export const addVillage = (village: Omit<Village, "id">): Village => {
  const newVillage = { ...village, id: Math.max(...villages.map((v) => v.id)) + 1 }
  villages.push(newVillage)

  // Add activity
  activities.unshift({
    id: Math.max(...activities.map((a) => a.id)) + 1,
    action: `Desa ${village.nama} terdaftar`,
    user: "Super Admin",
    time: "Baru saja",
    type: "create",
    details: `Desa baru ditambahkan ke sistem`,
  })

  return newVillage
}

export const updateVillage = (id: number, updates: Partial<Village>): Village | null => {
  const index = villages.findIndex((v) => v.id === id)
  if (index === -1) return null

  const oldVillage = villages[index]
  villages[index] = { ...oldVillage, ...updates }

  // Add activity
  activities.unshift({
    id: Math.max(...activities.map((a) => a.id)) + 1,
    action: `Desa ${oldVillage.nama} diperbarui`,
    user: "Super Admin",
    time: "Baru saja",
    type: "update",
    details: `Data desa telah diubah`,
  })

  return villages[index]
}

export const deleteVillage = (id: number): boolean => {
  const index = villages.findIndex((v) => v.id === id)
  if (index === -1) return false

  const deletedVillage = villages[index]
  villages.splice(index, 1)

  // Add activity
  activities.unshift({
    id: Math.max(...activities.map((a) => a.id)) + 1,
    action: `Desa ${deletedVillage.nama} dihapus`,
    user: "Super Admin",
    time: "Baru saja",
    type: "delete",
    details: `Desa telah dihapus dari sistem`,
  })

  return true
}

// Statistics functions
export const getStats = () => {
  const totalVillages = villages.filter((v) => v.status === "aktif").length
  const totalAdmins = accounts.filter((a) => a.role === "admin_desa" && a.status === "aktif").length
  const totalPerangkat = accounts.filter((a) => a.role === "perangkat_desa" && a.status === "aktif").length
  const totalLettersThisMonth = letterRequests.filter((l) => {
    const requestDate = new Date(l.createdAt)
    const now = new Date()
    return requestDate.getMonth() === now.getMonth() && requestDate.getFullYear() === now.getFullYear()
  }).length

  return {
    totalVillages,
    totalAdmins,
    totalPerangkat,
    totalLettersThisMonth,
  }
}
