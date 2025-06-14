-- Script untuk membuat sistem autentikasi sederhana
-- Menggunakan password plain text untuk kemudahan (tidak untuk produksi)

-- Update tabel users untuk menambah kolom password sederhana
ALTER TABLE users ADD COLUMN IF NOT EXISTS password VARCHAR(255);

-- Update constraint role untuk menambah perangkat_desa dan masyarakat
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;
ALTER TABLE users ADD CONSTRAINT users_role_check 
CHECK (role IN ('super_admin', 'admin_desa', 'perangkat_desa', 'masyarakat'));

-- Pastikan ada desa untuk testing
INSERT INTO villages (nama, kode_pos, kecamatan, kabupaten, provinsi, status) 
VALUES ('Sukamaju', '12345', 'Sukamaju', 'Bogor', 'Jawa Barat', 'aktif')
ON CONFLICT (nama) DO NOTHING;

-- Insert/Update user super_admin
INSERT INTO users (username, email, password, role, status) 
VALUES ('super_admin', 'super@admin.com', 'admin', 'super_admin', 'aktif')
ON CONFLICT (username) DO UPDATE SET 
    password = 'admin',
    role = 'super_admin',
    status = 'aktif';

-- Insert/Update user admin_desa
INSERT INTO users (username, email, password, role, status, village_id) 
VALUES ('admin_sukamaju', 'admin@sukamaju.desa.id', 'admin', 'admin_desa', 'aktif', 
        (SELECT id FROM villages WHERE nama = 'Sukamaju' LIMIT 1))
ON CONFLICT (username) DO UPDATE SET 
    password = 'admin',
    role = 'admin_desa',
    status = 'aktif',
    village_id = (SELECT id FROM villages WHERE nama = 'Sukamaju' LIMIT 1);

-- Insert/Update user perangkat_desa
INSERT INTO users (username, email, password, role, status, village_id) 
VALUES ('perangkat_sukamaju', 'perangkat@sukamaju.desa.id', 'admin', 'perangkat_desa', 'aktif',
        (SELECT id FROM villages WHERE nama = 'Sukamaju' LIMIT 1))
ON CONFLICT (username) DO UPDATE SET 
    password = 'admin',
    role = 'perangkat_desa',
    status = 'aktif',
    village_id = (SELECT id FROM villages WHERE nama = 'Sukamaju' LIMIT 1);

-- Insert sample citizens untuk testing login masyarakat
INSERT INTO citizens (village_id, nik, no_kk, nama, tanggal_lahir, alamat, no_telepon) 
VALUES 
    ((SELECT id FROM villages WHERE nama = 'Sukamaju' LIMIT 1), '1234567890123456', '1234567890123456', 'Budi Santoso', '1990-01-15', 'Jl. Merdeka No. 1', '081234567890'),
    ((SELECT id FROM villages WHERE nama = 'Sukamaju' LIMIT 1), '1234567890123457', '1234567890123457', 'Siti Aminah', '1985-05-20', 'Jl. Kemerdekaan No. 2', '081234567891'),
    ((SELECT id FROM villages WHERE nama = 'Sukamaju' LIMIT 1), '1234567890123458', '1234567890123458', 'Ahmad Rahman', '1992-12-10', 'Jl. Pancasila No. 3', '081234567892')
ON CONFLICT (nik) DO NOTHING;

-- Verifikasi data
SELECT 'Users created:' as info;
SELECT username, role, status, village_id FROM users ORDER BY role;

SELECT 'Citizens created:' as info;
SELECT nik, nama, tanggal_lahir FROM citizens LIMIT 5;

SELECT 'Script 11-create-simple-auth-system.sql completed successfully' AS status;
