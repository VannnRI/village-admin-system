-- =====================================================
-- VILLAGE ADMINISTRATION SYSTEM - V24 DATABASE
-- =====================================================
-- Simple and clean database structure
-- =====================================================

-- Drop existing tables if they exist
DROP TABLE IF EXISTS activity_logs CASCADE;
DROP TABLE IF EXISTS letter_requests CASCADE;
DROP TABLE IF EXISTS citizens CASCADE;
DROP TABLE IF EXISTS villages CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- =====================================================
-- CREATE CORE TABLES
-- =====================================================

-- 1. Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('super_admin', 'admin_desa', 'perangkat_desa', 'masyarakat')),
    village_id INTEGER,
    status VARCHAR(10) DEFAULT 'aktif' CHECK (status IN ('aktif', 'nonaktif')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Villages table
CREATE TABLE villages (
    id SERIAL PRIMARY KEY,
    nama VARCHAR(100) NOT NULL,
    kode_pos VARCHAR(10) NOT NULL,
    kecamatan VARCHAR(100) NOT NULL,
    kabupaten VARCHAR(100) NOT NULL,
    provinsi VARCHAR(100) NOT NULL,
    status VARCHAR(10) DEFAULT 'aktif' CHECK (status IN ('aktif', 'nonaktif')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Citizens table
CREATE TABLE citizens (
    id SERIAL PRIMARY KEY,
    village_id INTEGER REFERENCES villages(id),
    nik VARCHAR(16) UNIQUE NOT NULL,
    no_kk VARCHAR(16) NOT NULL,
    nama VARCHAR(100) NOT NULL,
    tanggal_lahir DATE NOT NULL,
    alamat TEXT NOT NULL,
    no_telepon VARCHAR(15),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Letter requests table
CREATE TABLE letter_requests (
    id SERIAL PRIMARY KEY,
    village_id INTEGER REFERENCES villages(id),
    citizen_id INTEGER REFERENCES citizens(id),
    jenis_surat VARCHAR(100) NOT NULL,
    no_surat VARCHAR(50),
    tujuan_permohonan TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    tanggal_pengajuan DATE DEFAULT CURRENT_DATE,
    approved_by INTEGER REFERENCES users(id),
    approved_at TIMESTAMP,
    rejection_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Activity logs table
CREATE TABLE activity_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    action VARCHAR(255) NOT NULL,
    details TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- DISABLE ROW LEVEL SECURITY
-- =====================================================
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE villages DISABLE ROW LEVEL SECURITY;
ALTER TABLE citizens DISABLE ROW LEVEL SECURITY;
ALTER TABLE letter_requests DISABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs DISABLE ROW LEVEL SECURITY;

-- =====================================================
-- INSERT SAMPLE DATA
-- =====================================================

-- Insert villages first
INSERT INTO villages (nama, kode_pos, kecamatan, kabupaten, provinsi) VALUES 
('Sukamaju', '12345', 'Sukamaju', 'Bogor', 'Jawa Barat'),
('Makmur', '12346', 'Makmur', 'Bandung', 'Jawa Barat');

-- Insert users
INSERT INTO users (username, email, password, role, village_id, status) VALUES 
('super_admin', 'admin@system.com', 'admin', 'super_admin', NULL, 'aktif'),
('admin_sukamaju', 'admin@sukamaju.desa.id', 'admin', 'admin_desa', 1, 'aktif'),
('perangkat_sukamaju', 'perangkat@sukamaju.desa.id', 'admin', 'perangkat_desa', 1, 'aktif'),
('admin_makmur', 'admin@makmur.desa.id', 'admin', 'admin_desa', 2, 'aktif');

-- Insert sample citizens
INSERT INTO citizens (village_id, nik, no_kk, nama, tanggal_lahir, alamat, no_telepon) VALUES 
(1, '1234567890123456', '1234567890123456', 'John Doe', '1990-01-15', 'Jl. Merdeka No. 123, RT 01/RW 02', '081234567890'),
(1, '1234567890123457', '1234567890123456', 'Jane Smith', '1985-05-20', 'Jl. Merdeka No. 124, RT 01/RW 02', '081234567891'),
(2, '1234567890123458', '1234567890123457', 'Bob Johnson', '1992-03-10', 'Jl. Sejahtera No. 456, RT 02/RW 03', '081234567892');

-- Insert sample letter requests
INSERT INTO letter_requests (village_id, citizen_id, jenis_surat, no_surat, tujuan_permohonan, status, approved_by) VALUES 
(1, 1, 'Surat Keterangan Domisili', 'SKD/001/2024', 'Untuk keperluan administrasi bank', 'approved', 2),
(2, 3, 'Surat Keterangan Usaha', 'SKU/001/2024', 'Untuk mengajukan kredit usaha', 'pending', NULL);

-- Insert activity log
INSERT INTO activity_logs (user_id, action, details) VALUES 
(1, 'System initialized', 'Database V24 created successfully');

-- =====================================================
-- VERIFICATION
-- =====================================================
SELECT 'V24 Database Setup Complete!' as status, now() as timestamp;

-- Show sample data
SELECT 'Users:' as info, username, role FROM users;
SELECT 'Villages:' as info, nama FROM villages;
SELECT 'Citizens:' as info, nama, nik FROM citizens;
