-- Add missing tables for archive functionality
-- Based on your existing database structure

-- Create village_regulations table for archive
CREATE TABLE IF NOT EXISTS village_regulations (
    id SERIAL PRIMARY KEY,
    village_id INTEGER REFERENCES villages(id) ON DELETE CASCADE,
    nomor_peraturan VARCHAR(100) NOT NULL,
    tanggal_peraturan DATE NOT NULL,
    nomor_kesepakatan VARCHAR(100) NOT NULL,
    tanggal_kesepakatan DATE NOT NULL,
    tentang TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'aktif' CHECK (status IN ('aktif', 'nonaktif')),
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create village_decisions table for archive
CREATE TABLE IF NOT EXISTS village_decisions (
    id SERIAL PRIMARY KEY,
    village_id INTEGER REFERENCES villages(id) ON DELETE CASCADE,
    nomor_keputusan VARCHAR(100) NOT NULL,
    tanggal_keputusan DATE NOT NULL,
    nomor_diundangkan VARCHAR(100) NOT NULL,
    tanggal_diundangkan DATE NOT NULL,
    tentang TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'aktif' CHECK (status IN ('aktif', 'nonaktif')),
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create village_news table for website
CREATE TABLE IF NOT EXISTS village_news (
    id SERIAL PRIMARY KEY,
    village_id INTEGER REFERENCES villages(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    image_url VARCHAR(500),
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create village_services table for website
CREATE TABLE IF NOT EXISTS village_services (
    id SERIAL PRIMARY KEY,
    village_id INTEGER REFERENCES villages(id) ON DELETE CASCADE,
    nama_layanan VARCHAR(100) NOT NULL,
    deskripsi TEXT,
    persyaratan TEXT,
    is_active BOOLEAN DEFAULT true,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Disable RLS for new tables
ALTER TABLE village_regulations DISABLE ROW LEVEL SECURITY;
ALTER TABLE village_decisions DISABLE ROW LEVEL SECURITY;
ALTER TABLE village_news DISABLE ROW LEVEL SECURITY;
ALTER TABLE village_services DISABLE ROW LEVEL SECURITY;

-- Insert sample data for Sukamaju village
INSERT INTO village_services (village_id, nama_layanan, deskripsi, persyaratan, created_by) VALUES
((SELECT id FROM villages WHERE nama = 'Sukamaju'), 'Surat Keterangan Tidak Mampu', 'Penerbitan SKTM untuk keperluan bantuan sosial', 'KTP, KK, Surat Pernyataan', (SELECT id FROM users WHERE username = 'admin_sukamaju')),
((SELECT id FROM villages WHERE nama = 'Sukamaju'), 'Surat Keterangan Domisili', 'Penerbitan surat domisili untuk keperluan administrasi', 'KTP, KK, Surat Keterangan RT/RW', (SELECT id FROM users WHERE username = 'admin_sukamaju')),
((SELECT id FROM villages WHERE nama = 'Sukamaju'), 'Surat Keterangan Usaha', 'Penerbitan surat keterangan usaha untuk UMKM', 'KTP, KK, Foto Usaha', (SELECT id FROM users WHERE username = 'admin_sukamaju')),
((SELECT id FROM villages WHERE nama = 'Sukamaju'), 'Surat Pengantar Nikah', 'Penerbitan surat pengantar untuk pernikahan', 'KTP, KK, Akta Kelahiran', (SELECT id FROM users WHERE username = 'admin_sukamaju'));

-- Insert sample news for Sukamaju village
INSERT INTO village_news (village_id, title, content, status, created_by) VALUES
((SELECT id FROM villages WHERE nama = 'Sukamaju'), 'Selamat Datang di Website Desa Sukamaju', 'Website resmi Desa Sukamaju telah diluncurkan untuk memberikan informasi terkini kepada masyarakat.', 'published', (SELECT id FROM users WHERE username = 'admin_sukamaju')),
((SELECT id FROM villages WHERE nama = 'Sukamaju'), 'Pelayanan Surat Online Telah Tersedia', 'Masyarakat kini dapat mengajukan berbagai jenis surat secara online melalui portal masyarakat.', 'published', (SELECT id FROM users WHERE username = 'admin_sukamaju'));

-- Verification
SELECT 'Archive tables created successfully!' as status;
SELECT 'village_regulations: ' || COUNT(*) as count FROM village_regulations;
SELECT 'village_decisions: ' || COUNT(*) as count FROM village_decisions;
SELECT 'village_services: ' || COUNT(*) as count FROM village_services;
SELECT 'village_news: ' || COUNT(*) as count FROM village_news;
