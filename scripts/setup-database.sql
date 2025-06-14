-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS activity_logs CASCADE;
DROP TABLE IF EXISTS letter_requests CASCADE;
DROP TABLE IF EXISTS village_staff CASCADE;
DROP TABLE IF EXISTS citizens CASCADE;
DROP TABLE IF EXISTS villages CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS system_settings CASCADE;

-- Create users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('super_admin', 'admin_desa', 'perangkat_desa', 'masyarakat')),
    status VARCHAR(10) DEFAULT 'aktif' CHECK (status IN ('aktif', 'nonaktif')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create villages table
CREATE TABLE villages (
    id SERIAL PRIMARY KEY,
    nama VARCHAR(100) NOT NULL,
    kode_pos VARCHAR(10) NOT NULL,
    kecamatan VARCHAR(100) NOT NULL,
    kabupaten VARCHAR(100) NOT NULL,
    provinsi VARCHAR(100) NOT NULL,
    admin_id INTEGER REFERENCES users(id),
    status VARCHAR(10) DEFAULT 'aktif' CHECK (status IN ('aktif', 'nonaktif')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create village_staff table
CREATE TABLE village_staff (
    id SERIAL PRIMARY KEY,
    village_id INTEGER REFERENCES villages(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    position VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(village_id, user_id)
);

-- Create citizens table
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

-- Create letter_requests table
CREATE TABLE letter_requests (
    id SERIAL PRIMARY KEY,
    village_id INTEGER REFERENCES villages(id),
    citizen_id INTEGER REFERENCES citizens(id),
    jenis_surat VARCHAR(100) NOT NULL,
    no_surat VARCHAR(50),
    tujuan_permohonan TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    approved_by INTEGER REFERENCES users(id),
    approved_at TIMESTAMP,
    rejection_reason TEXT,
    file_path VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create activity_logs table
CREATE TABLE activity_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    action VARCHAR(255) NOT NULL,
    details TEXT,
    ip_address INET,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create system_settings table
CREATE TABLE system_settings (
    id SERIAL PRIMARY KEY,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    setting_type VARCHAR(20) DEFAULT 'string',
    description TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert initial users (password hash for 'admin')
INSERT INTO users (username, email, password_hash, role, status) VALUES 
('admin', 'admin@system.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'super_admin', 'aktif'),
('admin_sukamaju', 'admin@sukamaju.desa.id', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin_desa', 'aktif'),
('perangkat_sukamaju', 'perangkat@sukamaju.desa.id', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'perangkat_desa', 'aktif'),
('admin_makmur', 'admin@makmur.desa.id', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin_desa', 'aktif');

-- Insert villages
INSERT INTO villages (nama, kode_pos, kecamatan, kabupaten, provinsi, admin_id) VALUES 
('Sukamaju', '12345', 'Sukamaju', 'Bogor', 'Jawa Barat', (SELECT id FROM users WHERE username = 'admin_sukamaju')),
('Makmur', '12346', 'Makmur', 'Bandung', 'Jawa Barat', (SELECT id FROM users WHERE username = 'admin_makmur')),
('Sejahtera', '12347', 'Sejahtera', 'Jakarta', 'DKI Jakarta', NULL);

-- Insert village staff
INSERT INTO village_staff (village_id, user_id, position) VALUES 
((SELECT id FROM villages WHERE nama = 'Sukamaju'), (SELECT id FROM users WHERE username = 'perangkat_sukamaju'), 'Sekretaris Desa');

-- Insert sample citizens
INSERT INTO citizens (village_id, nik, no_kk, nama, tanggal_lahir, alamat, no_telepon) VALUES 
((SELECT id FROM villages WHERE nama = 'Sukamaju'), '1234567890123456', '1234567890123456', 'John Doe', '1990-01-15', 'Jl. Merdeka No. 123, RT 01/RW 02', '081234567890'),
((SELECT id FROM villages WHERE nama = 'Sukamaju'), '1234567890123457', '1234567890123456', 'Jane Smith', '1985-05-20', 'Jl. Merdeka No. 124, RT 01/RW 02', '081234567891'),
((SELECT id FROM villages WHERE nama = 'Makmur'), '1234567890123458', '1234567890123457', 'Bob Johnson', '1992-03-10', 'Jl. Sejahtera No. 456, RT 02/RW 03', '081234567892');

-- Insert sample letter requests
INSERT INTO letter_requests (village_id, citizen_id, jenis_surat, no_surat, tujuan_permohonan, status) VALUES 
((SELECT id FROM villages WHERE nama = 'Sukamaju'), (SELECT id FROM citizens WHERE nik = '1234567890123456'), 'Surat Keterangan Domisili', 'SKD/001/2024', 'Untuk keperluan administrasi bank', 'approved'),
((SELECT id FROM villages WHERE nama = 'Makmur'), (SELECT id FROM citizens WHERE nik = '1234567890123458'), 'Surat Keterangan Usaha', 'SKU/001/2024', 'Untuk mengajukan kredit usaha', 'pending');

-- Insert system settings
INSERT INTO system_settings (setting_key, setting_value, setting_type, description) VALUES 
('system_name', 'Sistem Administrasi Desa', 'string', 'Nama sistem'),
('system_version', 'v1.0.0', 'string', 'Versi sistem'),
('maintenance_mode', 'false', 'boolean', 'Mode maintenance'),
('email_enabled', 'true', 'boolean', 'Status email'),
('session_timeout', '30', 'number', 'Timeout session dalam menit');

-- Insert initial activity log
INSERT INTO activity_logs (user_id, action, details) VALUES 
((SELECT id FROM users WHERE username = 'admin'), 'System initialized', 'Database tables created and initial data inserted');
