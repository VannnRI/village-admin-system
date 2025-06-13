-- Insert initial data

-- Insert super admin (password: admin)
INSERT INTO users (username, email, password_hash, role) VALUES 
('admin', 'admin@system.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'super_admin');

-- Insert villages
INSERT INTO villages (nama, kode_pos, kecamatan, kabupaten, provinsi) VALUES 
('Sukamaju', '12345', 'Sukamaju', 'Bogor', 'Jawa Barat'),
('Makmur', '12346', 'Makmur', 'Bandung', 'Jawa Barat'),
('Sejahtera', '12347', 'Sejahtera', 'Jakarta', 'DKI Jakarta');

-- Insert admin desa and perangkat desa
INSERT INTO users (username, email, password_hash, role) VALUES 
('admin_sukamaju', 'admin@sukamaju.desa.id', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin_desa'),
('perangkat_sukamaju', 'perangkat@sukamaju.desa.id', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'perangkat_desa'),
('admin_makmur', 'admin@makmur.desa.id', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin_desa'),
('perangkat_makmur1', 'perangkat1@makmur.desa.id', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'perangkat_desa'),
('perangkat_makmur2', 'perangkat2@makmur.desa.id', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'perangkat_desa');

-- Update villages with admin_id
UPDATE villages SET admin_id = (SELECT id FROM users WHERE username = 'admin_sukamaju') WHERE nama = 'Sukamaju';
UPDATE villages SET admin_id = (SELECT id FROM users WHERE username = 'admin_makmur') WHERE nama = 'Makmur';

-- Insert village staff relationships
INSERT INTO village_staff (village_id, user_id, position) VALUES 
((SELECT id FROM villages WHERE nama = 'Sukamaju'), (SELECT id FROM users WHERE username = 'perangkat_sukamaju'), 'Sekretaris Desa'),
((SELECT id FROM villages WHERE nama = 'Makmur'), (SELECT id FROM users WHERE username = 'perangkat_makmur1'), 'Sekretaris Desa'),
((SELECT id FROM villages WHERE nama = 'Makmur'), (SELECT id FROM users WHERE username = 'perangkat_makmur2'), 'Bendahara Desa');

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
