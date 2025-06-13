# 🏘️ Sistem Administrasi Desa

Sistem web administrasi desa yang komprehensif dengan multi-role access dan fitur lengkap untuk pengelolaan data desa.

## 🌟 Features

### 👑 Super Admin
- **Dashboard Analytics** - Overview statistik sistem
- **Village Management** - Kelola data desa dan admin
- **Account Management** - Kelola semua akun pengguna
- **System Settings** - Konfigurasi sistem global

### 🏛️ Admin Desa
- **Dashboard** - Statistik dan aktivitas desa
- **Data Warga** - Kelola data penduduk dengan import/export CSV
- **Surat Menyurat** - Kelola permohonan dan penerbitan surat
- **Arsip** - Sistem arsip dokumen (Peraturan & Keputusan)
- **Website Desa** - Kelola konten website publik dengan preview
- **Laporan** - Generate laporan dalam berbagai format
- **Export Multi-Format** - Excel, PDF, Word, Print

### 🌐 Website Publik
- **Homepage** - Informasi umum desa
- **Layanan** - Daftar layanan yang tersedia
- **Berita** - Berita dan pengumuman desa
- **Kontak** - Informasi kontak dan lokasi
- **Permohonan Surat** - Form online untuk warga

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Custom auth with localStorage
- **Export Libraries**: XLSX, jsPDF, docx
- **Responsive**: Mobile-first design

## 📱 Responsive Design

- ✅ **Mobile** (< 640px) - Optimized touch interface
- ✅ **Tablet** (640px - 1024px) - Adaptive layout
- ✅ **Desktop** (> 1024px) - Full feature set

## 🚀 Quick Start

### 1. Environment Setup

Create `.env.local` file:

\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
\`\`\`

### 2. Database Setup

Run SQL scripts in order:
1. `scripts/00-create-all-tables.sql`
2. `scripts/01-disable-rls-and-create-tables.sql`
3. `scripts/02-insert-initial-data.sql`
4. `scripts/05-add-admin-desa-tables.sql`
5. `scripts/06-update-archive-tables.sql`

### 3. Default Login Credentials

**Super Admin:**
- Username: `superadmin`
- Password: `admin123`

**Admin Desa:**
- Username: `admin_desa1`
- Password: `admin123`

## 📁 Project Structure

\`\`\`
├── app/
│   ├── admin-desa/          # Admin Desa pages
│   ├── super-admin/         # Super Admin pages
│   ├── public/              # Public website pages
│   └── page.tsx             # Login page
├── components/
│   ├── ui/                  # shadcn/ui components
│   ├── *-layout.tsx         # Layout components
│   ├── *-management.tsx     # Feature components
│   └── *.tsx                # Other components
├── lib/
│   ├── supabase.ts          # Supabase client
│   ├── database.ts          # Database utilities
│   ├── *-data.ts            # Data layer
│   └── *.ts                 # Utilities
└── scripts/
    └── *.sql                # Database scripts
\`\`\`

## 🔧 Key Features Implementation

### Import/Export Data
- **CSV Import** - Bulk import data warga
- **Multi-format Export** - Excel, PDF, Word, Print
- **Template Download** - CSV templates for import

### Website Management
- **Content Management** - Kelola konten website
- **Multi-device Preview** - Desktop, tablet, mobile preview
- **Real-time Updates** - Preview langsung perubahan

### Responsive Design
- **Mobile-first** - Optimized for mobile devices
- **Touch-friendly** - 44px minimum touch targets
- **Adaptive Navigation** - Hamburger menu on mobile
- **Flexible Layouts** - Auto-adjusting grids

## 🔐 Security Features

- **Role-based Access** - Multi-level user permissions
- **Input Validation** - Comprehensive data validation
- **SQL Injection Protection** - Parameterized queries
- **XSS Protection** - Input sanitization

## 📊 Database Schema

### Core Tables
- `users` - User accounts and roles
- `villages` - Village information
- `citizens` - Citizen data
- `letter_requests` - Letter applications
- `activity_logs` - System activity tracking

### Archive Tables
- `village_regulations` - Peraturan Desa
- `head_decisions` - Keputusan Kepala Desa

### Website Tables
- `website_content` - Website content management
- `news` - News and announcements

## 🎯 Development Status

- ✅ **Core System** - Complete
- ✅ **Multi-role Auth** - Complete
- ✅ **Data Management** - Complete
- ✅ **Import/Export** - Complete
- ✅ **Website CMS** - Complete
- ✅ **Responsive Design** - Complete
- ✅ **Database Integration** - Complete

## 🚀 Deployment

### Vercel Deployment
1. Connect GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push

### Supabase Setup
1. Create new Supabase project
2. Run database scripts
3. Configure Row Level Security (optional)
4. Get connection credentials

## 📝 Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create GitHub issue
- Contact: admin@desawebsistem.com

---

**Built with ❤️ for Indonesian Villages**
\`\`\`

Sekarang buat file package.json yang lengkap:
