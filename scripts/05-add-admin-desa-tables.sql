-- Add new tables for Admin Desa features

-- Village regulations table (Peraturan Desa)
CREATE TABLE village_regulations (
    id SERIAL PRIMARY KEY,
    village_id INTEGER REFERENCES villages(id) ON DELETE CASCADE,
    nomor_peraturan VARCHAR(50) NOT NULL,
    tentang TEXT NOT NULL,
    tanggal_penetapan DATE NOT NULL,
    file_path VARCHAR(255),
    status VARCHAR(20) DEFAULT 'aktif' CHECK (status IN ('aktif', 'tidak_aktif')),
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Village head decisions table (Keputusan Kepala Desa)
CREATE TABLE village_decisions (
    id SERIAL PRIMARY KEY,
    village_id INTEGER REFERENCES villages(id) ON DELETE CASCADE,
    nomor_keputusan VARCHAR(50) NOT NULL,
    tentang TEXT NOT NULL,
    tanggal_keputusan DATE NOT NULL,
    file_path VARCHAR(255),
    status VARCHAR(20) DEFAULT 'aktif' CHECK (status IN ('aktif', 'tidak_aktif')),
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Village website content table
CREATE TABLE village_website (
    id SERIAL PRIMARY KEY,
    village_id INTEGER REFERENCES villages(id) ON DELETE CASCADE,
    section VARCHAR(50) NOT NULL, -- 'hero', 'about', 'news', 'services', 'contact', etc.
    title VARCHAR(255),
    content TEXT,
    image_url VARCHAR(255),
    is_published BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Village news table
CREATE TABLE village_news (
    id SERIAL PRIMARY KEY,
    village_id INTEGER REFERENCES villages(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    featured_image VARCHAR(255),
    is_published BOOLEAN DEFAULT true,
    published_at TIMESTAMP,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Village services table
CREATE TABLE village_services (
    id SERIAL PRIMARY KEY,
    village_id INTEGER REFERENCES villages(id) ON DELETE CASCADE,
    nama_layanan VARCHAR(255) NOT NULL,
    deskripsi TEXT,
    persyaratan TEXT,
    waktu_pelayanan VARCHAR(100),
    biaya VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Village settings table
CREATE TABLE village_settings (
    id SERIAL PRIMARY KEY,
    village_id INTEGER REFERENCES villages(id) ON DELETE CASCADE,
    setting_key VARCHAR(100) NOT NULL,
    setting_value TEXT,
    setting_type VARCHAR(20) DEFAULT 'string',
    description TEXT,
    updated_by INTEGER REFERENCES users(id),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(village_id, setting_key)
);

-- Disable RLS for new tables
ALTER TABLE village_regulations DISABLE ROW LEVEL SECURITY;
ALTER TABLE village_decisions DISABLE ROW LEVEL SECURITY;
ALTER TABLE village_website DISABLE ROW LEVEL SECURITY;
ALTER TABLE village_news DISABLE ROW LEVEL SECURITY;
ALTER TABLE village_services DISABLE ROW LEVEL SECURITY;
ALTER TABLE village_settings DISABLE ROW LEVEL SECURITY;

-- Insert sample data for village regulations
INSERT INTO village_regulations (village_id, nomor_peraturan, tentang, tanggal_penetapan, created_by) VALUES 
((SELECT id FROM villages WHERE nama = 'Sukamaju'), 'PERDES NO. 01/2024', 'Anggaran Pendapatan dan Belanja Desa Tahun 2024', '2024-01-15', (SELECT id FROM users WHERE username = 'admin_sukamaju')),
((SELECT id FROM villages WHERE nama = 'Sukamaju'), 'PERDES NO. 02/2024', 'Pembentukan Badan Usaha Milik Desa', '2024-02-01', (SELECT id FROM users WHERE username = 'admin_sukamaju'));

-- Insert sample data for village decisions
INSERT INTO village_decisions (village_id, nomor_keputusan, tentang, tanggal_keputusan, created_by) VALUES 
((SELECT id FROM villages WHERE nama = 'Sukamaju'), 'KEPDES NO. 01/2024', 'Penetapan Pengurus Karang Taruna Desa Sukamaju', '2024-01-20', (SELECT id FROM users WHERE username = 'admin_sukamaju')),
((SELECT id FROM villages WHERE nama = 'Sukamaju'), 'KEPDES NO. 02/2024', 'Penetapan Tim Pelaksana Kegiatan Pembangunan Jalan Desa', '2024-02-10', (SELECT id FROM users WHERE username = 'admin_sukamaju'));

-- Insert sample website content
INSERT INTO village_website (village_id, section, title, content, created_by) VALUES 
((SELECT id FROM villages WHERE nama = 'Sukamaju'), 'hero', 'Selamat Datang di Desa Sukamaju', 'Desa yang maju, sejahtera, dan berbudaya. Kami berkomitmen untuk memberikan pelayanan terbaik kepada masyarakat.', (SELECT id FROM users WHERE username = 'admin_sukamaju')),
((SELECT id FROM villages WHERE nama = 'Sukamaju'), 'about', 'Tentang Desa Sukamaju', 'Desa Sukamaju adalah desa yang terletak di Kecamatan Sukamaju, Kabupaten Bogor, Provinsi Jawa Barat. Desa ini memiliki luas wilayah 15 km² dengan jumlah penduduk sekitar 5.000 jiwa.', (SELECT id FROM users WHERE username = 'admin_sukamaju')),
((SELECT id FROM villages WHERE nama = 'Sukamaju'), 'contact', 'Kontak Kami', 'Alamat: Jl. Raya Sukamaju No. 123, Sukamaju, Bogor, Jawa Barat 12345\nTelepon: (021) 12345678\nEmail: info@sukamaju.desa.id', (SELECT id FROM users WHERE username = 'admin_sukamaju'));

-- Insert sample news
INSERT INTO village_news (village_id, title, content, excerpt, is_published, published_at, created_by) VALUES 
((SELECT id FROM villages WHERE nama = 'Sukamaju'), 'Pembangunan Jalan Desa Tahap II Dimulai', 'Pembangunan jalan desa tahap II telah dimulai pada hari ini. Proyek ini diharapkan dapat meningkatkan aksesibilitas dan mobilitas masyarakat desa.', 'Pembangunan jalan desa tahap II telah dimulai untuk meningkatkan aksesibilitas masyarakat.', true, CURRENT_TIMESTAMP, (SELECT id FROM users WHERE username = 'admin_sukamaju')),
((SELECT id FROM villages WHERE nama = 'Sukamaju'), 'Pelatihan Kewirausahaan untuk Pemuda Desa', 'Desa Sukamaju mengadakan pelatihan kewirausahaan untuk pemuda desa dalam rangka meningkatkan ekonomi kreatif dan pemberdayaan masyarakat.', 'Pelatihan kewirausahaan untuk pemuda desa guna meningkatkan ekonomi kreatif.', true, CURRENT_TIMESTAMP, (SELECT id FROM users WHERE username = 'admin_sukamaju'));

-- Insert sample services
INSERT INTO village_services (village_id, nama_layanan, deskripsi, persyaratan, waktu_pelayanan, biaya, created_by) VALUES 
((SELECT id FROM villages WHERE nama = 'Sukamaju'), 'Surat Keterangan Domisili', 'Penerbitan surat keterangan domisili untuk keperluan administrasi', 'KTP, KK, Surat Pengantar RT/RW', '1-2 hari kerja', 'Gratis', (SELECT id FROM users WHERE username = 'admin_sukamaju')),
((SELECT id FROM villages WHERE nama = 'Sukamaju'), 'Surat Keterangan Usaha', 'Penerbitan surat keterangan usaha untuk keperluan perizinan', 'KTP, KK, Surat Pengantar RT/RW, Foto Usaha', '2-3 hari kerja', 'Gratis', (SELECT id FROM users WHERE username = 'admin_sukamaju')),
((SELECT id FROM villages WHERE nama = 'Sukamaju'), 'Surat Keterangan Tidak Mampu', 'Penerbitan surat keterangan tidak mampu untuk keperluan bantuan sosial', 'KTP, KK, Surat Pengantar RT/RW', '1-2 hari kerja', 'Gratis', (SELECT id FROM users WHERE username = 'admin_sukamaju'));

-- Insert sample village settings
INSERT INTO village_settings (village_id, setting_key, setting_value, setting_type, description, updated_by) VALUES 
((SELECT id FROM villages WHERE nama = 'Sukamaju'), 'kepala_desa', 'Budi Santoso', 'string', 'Nama Kepala Desa', (SELECT id FROM users WHERE username = 'admin_sukamaju')),
((SELECT id FROM villages WHERE nama = 'Sukamaju'), 'sekretaris_desa', 'Siti Aminah', 'string', 'Nama Sekretaris Desa', (SELECT id FROM users WHERE username = 'admin_sukamaju')),
((SELECT id FROM villages WHERE nama = 'Sukamaju'), 'jam_pelayanan', '08:00 - 16:00 WIB', 'string', 'Jam Pelayanan Kantor Desa', (SELECT id FROM users WHERE username = 'admin_sukamaju')),
((SELECT id FROM villages WHERE nama = 'Sukamaju'), 'hari_pelayanan', 'Senin - Jumat', 'string', 'Hari Pelayanan Kantor Desa', (SELECT id FROM users WHERE username = 'admin_sukamaju')),
((SELECT id FROM villages WHERE nama = 'Sukamaju'), 'visi', 'Mewujudkan Desa Sukamaju yang Maju, Sejahtera, dan Berbudaya', 'text', 'Visi Desa', (SELECT id FROM users WHERE username = 'admin_sukamaju')),
((SELECT id FROM villages WHERE nama = 'Sukamaju'), 'misi', '1. Meningkatkan kualitas pelayanan publik\n2. Mengembangkan ekonomi masyarakat\n3. Melestarikan budaya lokal', 'text', 'Misi Desa', (SELECT id FROM users WHERE username = 'admin_sukamaju')),
((SELECT id FROM villages WHERE nama = 'Sukamaju'), 'logo_desa', '/images/logo-sukamaju.png', 'string', 'Logo Desa', (SELECT id FROM users WHERE username = 'admin_sukamaju')),
((SELECT id FROM villages WHERE nama = 'Sukamaju'), 'website_theme', 'default', 'string', 'Theme Website Desa', (SELECT id FROM users WHERE username = 'admin_sukamaju'));

-- Verification
SELECT 'village_regulations' as table_name, COUNT(*) as row_count FROM village_regulations
UNION ALL
SELECT 'village_decisions' as table_name, COUNT(*) as row_count FROM village_decisions
UNION ALL
SELECT 'village_website' as table_name, COUNT(*) as row_count FROM village_website
UNION ALL
SELECT 'village_news' as table_name, COUNT(*) as row_count FROM village_news
UNION ALL
SELECT 'village_services' as table_name, COUNT(*) as row_count FROM village_services
UNION ALL
SELECT 'village_settings' as table_name, COUNT(*) as row_count FROM village_settings;
