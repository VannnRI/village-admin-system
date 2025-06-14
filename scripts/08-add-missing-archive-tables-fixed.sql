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

-- Create website_content table
CREATE TABLE IF NOT EXISTS website_content (
    id SERIAL PRIMARY KEY,
    village_id INTEGER REFERENCES villages(id) ON DELETE CASCADE,
    section_name VARCHAR(50) NOT NULL,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
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
    published_date DATE DEFAULT CURRENT_DATE,
    author VARCHAR(100) DEFAULT 'Admin Desa',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create village_services table for website (with correct column names)
CREATE TABLE IF NOT EXISTS village_services (
    id SERIAL PRIMARY KEY,
    village_id INTEGER REFERENCES villages(id) ON DELETE CASCADE,
    service_name VARCHAR(100) NOT NULL,
    description TEXT,
    requirements TEXT,
    procedure TEXT,
    duration VARCHAR(50) DEFAULT '1-3 hari',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create website_settings table
CREATE TABLE IF NOT EXISTS website_settings (
    id SERIAL PRIMARY KEY,
    village_id INTEGER REFERENCES villages(id) ON DELETE CASCADE,
    village_name VARCHAR(100) NOT NULL,
    village_tagline VARCHAR(200),
    village_description TEXT,
    village_address TEXT,
    village_phone VARCHAR(20),
    village_email VARCHAR(100),
    social_facebook VARCHAR(200),
    social_twitter VARCHAR(200),
    social_instagram VARCHAR(200),
    logo_url VARCHAR(500),
    theme_color VARCHAR(7) DEFAULT '#4CAF50',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(village_id)
);

-- Disable RLS for new tables
ALTER TABLE village_regulations DISABLE ROW LEVEL SECURITY;
ALTER TABLE village_decisions DISABLE ROW LEVEL SECURITY;
ALTER TABLE website_content DISABLE ROW LEVEL SECURITY;
ALTER TABLE village_news DISABLE ROW LEVEL SECURITY;
ALTER TABLE village_services DISABLE ROW LEVEL SECURITY;
ALTER TABLE website_settings DISABLE ROW LEVEL SECURITY;

-- Insert sample data for Sukamaju village (using correct column names)
INSERT INTO village_services (village_id, service_name, description, requirements, procedure, duration) VALUES
((SELECT id FROM villages WHERE nama = 'Sukamaju'), 'Surat Keterangan Tidak Mampu', 'Penerbitan SKTM untuk keperluan bantuan sosial', 'KTP, KK, Surat Pernyataan', 'Datang ke kantor desa dengan membawa persyaratan', '1-2 hari'),
((SELECT id FROM villages WHERE nama = 'Sukamaju'), 'Surat Keterangan Domisili', 'Penerbitan surat domisili untuk keperluan administrasi', 'KTP, KK, Surat Keterangan RT/RW', 'Datang ke kantor desa dengan membawa persyaratan', '1 hari'),
((SELECT id FROM villages WHERE nama = 'Sukamaju'), 'Surat Keterangan Usaha', 'Penerbitan surat keterangan usaha untuk UMKM', 'KTP, KK, Foto Usaha', 'Datang ke kantor desa dengan membawa persyaratan', '2-3 hari'),
((SELECT id FROM villages WHERE nama = 'Sukamaju'), 'Surat Pengantar Nikah', 'Penerbitan surat pengantar untuk pernikahan', 'KTP, KK, Akta Kelahiran', 'Datang ke kantor desa dengan membawa persyaratan', '1 hari');

-- Insert sample data for Makmur village
INSERT INTO village_services (village_id, service_name, description, requirements, procedure, duration) VALUES
((SELECT id FROM villages WHERE nama = 'Makmur'), 'Surat Keterangan Tidak Mampu', 'Penerbitan SKTM untuk keperluan bantuan sosial', 'KTP, KK, Surat Pernyataan', 'Datang ke kantor desa dengan membawa persyaratan', '1-2 hari'),
((SELECT id FROM villages WHERE nama = 'Makmur'), 'Surat Keterangan Domisili', 'Penerbitan surat domisili untuk keperluan administrasi', 'KTP, KK, Surat Keterangan RT/RW', 'Datang ke kantor desa dengan membawa persyaratan', '1 hari');

-- Insert sample news for villages
INSERT INTO village_news (village_id, title, content, status, published_date, author) VALUES
((SELECT id FROM villages WHERE nama = 'Sukamaju'), 'Selamat Datang di Website Desa Sukamaju', 'Website resmi Desa Sukamaju telah diluncurkan untuk memberikan informasi terkini kepada masyarakat.', 'published', CURRENT_DATE, 'Admin Desa'),
((SELECT id FROM villages WHERE nama = 'Sukamaju'), 'Pelayanan Surat Online Telah Tersedia', 'Masyarakat kini dapat mengajukan berbagai jenis surat secara online melalui portal masyarakat.', 'published', CURRENT_DATE, 'Admin Desa'),
((SELECT id FROM villages WHERE nama = 'Makmur'), 'Selamat Datang di Website Desa Makmur', 'Website resmi Desa Makmur telah diluncurkan untuk memberikan informasi terkini kepada masyarakat.', 'published', CURRENT_DATE, 'Admin Desa');

-- Insert website content
INSERT INTO website_content (village_id, section_name, title, content) VALUES
((SELECT id FROM villages WHERE nama = 'Sukamaju'), 'hero', 'Selamat Datang di Desa Sukamaju', 'Desa Sukamaju adalah desa yang maju dan sejahtera dengan pelayanan terbaik untuk masyarakat.'),
((SELECT id FROM villages WHERE nama = 'Sukamaju'), 'about', 'Tentang Desa Sukamaju', 'Desa Sukamaju terletak di Kecamatan Sukamaju, Kabupaten Bogor, Jawa Barat. Desa ini memiliki visi untuk menjadi desa yang maju dan sejahtera.'),
((SELECT id FROM villages WHERE nama = 'Makmur'), 'hero', 'Selamat Datang di Desa Makmur', 'Desa Makmur adalah desa yang makmur dan sejahtera dengan pelayanan terbaik untuk masyarakat.'),
((SELECT id FROM villages WHERE nama = 'Makmur'), 'about', 'Tentang Desa Makmur', 'Desa Makmur terletak di Kecamatan Makmur, Kabupaten Bandung, Jawa Barat. Desa ini memiliki visi untuk menjadi desa yang makmur dan sejahtera.');

-- Insert website settings
INSERT INTO website_settings (village_id, village_name, village_tagline, village_description, village_address, village_phone, village_email) VALUES
((SELECT id FROM villages WHERE nama = 'Sukamaju'), 'Desa Sukamaju', 'Maju Bersama Membangun Desa', 'Desa Sukamaju adalah desa yang maju dan sejahtera dengan pelayanan terbaik untuk masyarakat.', 'Jl. Raya Sukamaju No. 1, Kec. Sukamaju, Kab. Bogor, Jawa Barat 12345', '021-12345678', 'info@sukamaju.desa.id'),
((SELECT id FROM villages WHERE nama = 'Makmur'), 'Desa Makmur', 'Makmur Bersama Rakyat', 'Desa Makmur adalah desa yang makmur dan sejahtera dengan pelayanan terbaik untuk masyarakat.', 'Jl. Raya Makmur No. 1, Kec. Makmur, Kab. Bandung, Jawa Barat 12346', '022-12345678', 'info@makmur.desa.id');

-- Insert sample archive data
INSERT INTO village_regulations (village_id, nomor_peraturan, tanggal_peraturan, nomor_kesepakatan, tanggal_kesepakatan, tentang) VALUES
((SELECT id FROM villages WHERE nama = 'Sukamaju'), 'PERDES/001/2024', '2024-01-15', 'KESP/001/2024', '2024-01-10', 'Peraturan Desa tentang Anggaran Pendapatan dan Belanja Desa Tahun 2024'),
((SELECT id FROM villages WHERE nama = 'Sukamaju'), 'PERDES/002/2024', '2024-02-20', 'KESP/002/2024', '2024-02-15', 'Peraturan Desa tentang Retribusi Pelayanan Administrasi');

INSERT INTO village_decisions (village_id, nomor_keputusan, tanggal_keputusan, nomor_diundangkan, tanggal_diundangkan, tentang) VALUES
((SELECT id FROM villages WHERE nama = 'Sukamaju'), 'KEPDES/001/2024', '2024-01-20', 'UND/001/2024', '2024-01-25', 'Keputusan Kepala Desa tentang Penetapan Perangkat Desa'),
((SELECT id FROM villages WHERE nama = 'Sukamaju'), 'KEPDES/002/2024', '2024-03-10', 'UND/002/2024', '2024-03-15', 'Keputusan Kepala Desa tentang Pembentukan Tim Pelaksana Program Desa');

-- Verification
SELECT 'Archive tables created successfully!' as status;
SELECT 'village_regulations: ' || COUNT(*) as count FROM village_regulations;
SELECT 'village_decisions: ' || COUNT(*) as count FROM village_decisions;
SELECT 'village_services: ' || COUNT(*) as count FROM village_services;
SELECT 'village_news: ' || COUNT(*) as count FROM village_news;
SELECT 'website_content: ' || COUNT(*) as count FROM website_content;
SELECT 'website_settings: ' || COUNT(*) as count FROM website_settings;

-- Show sample data
SELECT 'Sample Services:' as info;
SELECT service_name, description FROM village_services LIMIT 3;

SELECT 'Sample News:' as info;
SELECT title, status FROM village_news LIMIT 3;

SELECT 'Sample Archive:' as info;
SELECT nomor_peraturan, tentang FROM village_regulations LIMIT 2;
