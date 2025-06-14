-- SIMPLE DATABASE SETUP
-- Just run this one script

-- Create tables
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL,
    village_id INTEGER,
    status VARCHAR(10) DEFAULT 'aktif',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS villages (
    id SERIAL PRIMARY KEY,
    nama VARCHAR(100) NOT NULL,
    kode_pos VARCHAR(10) NOT NULL,
    kecamatan VARCHAR(100) NOT NULL,
    kabupaten VARCHAR(100) NOT NULL,
    provinsi VARCHAR(100) NOT NULL,
    status VARCHAR(10) DEFAULT 'aktif',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS citizens (
    id SERIAL PRIMARY KEY,
    village_id INTEGER REFERENCES villages(id),
    nik VARCHAR(16) UNIQUE NOT NULL,
    no_kk VARCHAR(16) NOT NULL,
    nama VARCHAR(100) NOT NULL,
    tanggal_lahir DATE NOT NULL,
    alamat TEXT NOT NULL,
    no_telepon VARCHAR(15),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS letter_requests (
    id SERIAL PRIMARY KEY,
    village_id INTEGER REFERENCES villages(id),
    citizen_id INTEGER REFERENCES citizens(id),
    jenis_surat VARCHAR(100) NOT NULL,
    no_surat VARCHAR(50),
    tujuan_permohonan TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    tanggal_pengajuan DATE DEFAULT CURRENT_DATE,
    approved_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Disable RLS
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE villages DISABLE ROW LEVEL SECURITY;
ALTER TABLE citizens DISABLE ROW LEVEL SECURITY;
ALTER TABLE letter_requests DISABLE ROW LEVEL SECURITY;

-- Insert basic data
INSERT INTO villages (nama, kode_pos, kecamatan, kabupaten, provinsi) VALUES 
('Sukamaju', '12345', 'Sukamaju', 'Bogor', 'Jawa Barat') ON CONFLICT DO NOTHING;

INSERT INTO users (username, email, password, role, village_id, status) VALUES 
('super_admin', 'admin@system.com', 'admin', 'super_admin', NULL, 'aktif'),
('admin_sukamaju', 'admin@sukamaju.desa.id', 'admin', 'admin_desa', 1, 'aktif')
ON CONFLICT (username) DO NOTHING;

INSERT INTO citizens (village_id, nik, no_kk, nama, tanggal_lahir, alamat, no_telepon) VALUES 
(1, '1234567890123456', '1234567890123456', 'John Doe', '1990-01-15', 'Jl. Merdeka No. 123', '081234567890')
ON CONFLICT (nik) DO NOTHING;

SELECT 'Setup complete!' as status;
