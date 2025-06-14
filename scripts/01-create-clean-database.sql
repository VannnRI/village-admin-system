-- Script untuk membuat database bersih dengan struktur minimal
-- Hanya tabel yang benar-benar diperlukan

-- 1. Tabel Villages (Desa)
CREATE TABLE villages (
    id SERIAL PRIMARY KEY,
    nama VARCHAR(100) NOT NULL UNIQUE,
    kode_pos VARCHAR(10),
    kecamatan VARCHAR(100),
    kabupaten VARCHAR(100),
    provinsi VARCHAR(100),
    status VARCHAR(20) DEFAULT 'aktif' CHECK (status IN ('aktif', 'nonaktif')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabel Users (Admin dan Perangkat)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('super_admin', 'admin_desa', 'perangkat_desa')),
    status VARCHAR(20) DEFAULT 'aktif' CHECK (status IN ('aktif', 'nonaktif')),
    village_id INTEGER REFERENCES villages(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Tabel Citizens (Masyarakat)
CREATE TABLE citizens (
    id SERIAL PRIMARY KEY,
    village_id INTEGER NOT NULL REFERENCES villages(id),
    nik VARCHAR(16) NOT NULL UNIQUE,
    no_kk VARCHAR(16),
    nama VARCHAR(100) NOT NULL,
    tanggal_lahir DATE NOT NULL,
    alamat TEXT,
    no_telepon VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Tabel Letter Requests (Permohonan Surat)
CREATE TABLE letter_requests (
    id SERIAL PRIMARY KEY,
    village_id INTEGER NOT NULL REFERENCES villages(id),
    citizen_id INTEGER NOT NULL REFERENCES citizens(id),
    jenis_surat VARCHAR(100) NOT NULL,
    tujuan_permohonan TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'diproses', 'selesai', 'ditolak')),
    catatan TEXT,
    processed_by INTEGER REFERENCES users(id),
    processed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Tabel Village News (Berita Desa) - untuk website
CREATE TABLE village_news (
    id SERIAL PRIMARY KEY,
    village_id INTEGER NOT NULL REFERENCES villages(id),
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    image_url VARCHAR(500),
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Tabel Village Services (Layanan Desa) - untuk website
CREATE TABLE village_services (
    id SERIAL PRIMARY KEY,
    village_id INTEGER NOT NULL REFERENCES villages(id),
    nama_layanan VARCHAR(100) NOT NULL,
    deskripsi TEXT,
    persyaratan TEXT,
    is_active BOOLEAN DEFAULT true,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. Tabel Activity Logs (Log Aktivitas)
CREATE TABLE activity_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    action VARCHAR(200) NOT NULL,
    details TEXT,
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert data awal
-- Desa contoh
INSERT INTO villages (nama, kode_pos, kecamatan, kabupaten, provinsi) VALUES
('Sukamaju', '16710', 'Sukamaju', 'Bogor', 'Jawa Barat');

-- Users admin
INSERT INTO users (username, email, password, role, village_id) VALUES
('super_admin', 'super@admin.com', 'admin', 'super_admin', NULL),
('admin_sukamaju', 'admin@sukamaju.desa.id', 'admin', 'admin_desa', 1),
('perangkat_sukamaju', 'perangkat@sukamaju.desa.id', 'admin', 'perangkat_desa', 1);

-- Citizens contoh
INSERT INTO citizens (village_id, nik, no_kk, nama, tanggal_lahir, alamat, no_telepon) VALUES
(1, '1234567890123456', '1234567890123456', 'Budi Santoso', '1990-01-15', 'Jl. Merdeka No. 1, RT 01/RW 01', '081234567890'),
(1, '1234567890123457', '1234567890123457', 'Siti Aminah', '1985-05-20', 'Jl. Kemerdekaan No. 2, RT 02/RW 01', '081234567891'),
(1, '1234567890123458', '1234567890123458', 'Ahmad Rahman', '1992-12-10', 'Jl. Pancasila No. 3, RT 01/RW 02', '081234567892');

-- Sample services
INSERT INTO village_services (village_id, nama_layanan, deskripsi, persyaratan, created_by) VALUES
(1, 'Surat Keterangan Tidak Mampu', 'Penerbitan SKTM untuk keperluan bantuan sosial', 'KTP, KK, Surat Pernyataan', 2),
(1, 'Surat Keterangan Domisili', 'Penerbitan surat domisili untuk keperluan administrasi', 'KTP, KK, Surat Keterangan RT/RW', 2),
(1, 'Surat Keterangan Usaha', 'Penerbitan surat keterangan usaha untuk UMKM', 'KTP, KK, Foto Usaha', 2),
(1, 'Surat Pengantar Nikah', 'Penerbitan surat pengantar untuk pernikahan', 'KTP, KK, Akta Kelahiran', 2);

-- Sample news
INSERT INTO village_news (village_id, title, content, status, created_by) VALUES
(1, 'Selamat Datang di Website Desa Sukamaju', 'Website resmi Desa Sukamaju telah diluncurkan untuk memberikan informasi terkini kepada masyarakat.', 'published', 2),
(1, 'Pelayanan Surat Online Telah Tersedia', 'Masyarakat kini dapat mengajukan berbagai jenis surat secara online melalui portal masyarakat.', 'published', 2);

SELECT 'Clean database created successfully' AS status;
SELECT 'Villages: ' || COUNT(*) FROM villages;
SELECT 'Users: ' || COUNT(*) FROM users;
SELECT 'Citizens: ' || COUNT(*) FROM citizens;
SELECT 'Services: ' || COUNT(*) FROM village_services;
SELECT 'News: ' || COUNT(*) FROM village_news;
